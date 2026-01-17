# Phase 1: Testing Guide

## Prerequisites

### 1. Environment Variables

Ensure your `.env` has these required variables:

```env
# Database
DATABASE_URL="postgresql://rumbo:CHANGE_ME_IN_PRODUCTION@localhost:5432/rumbo"

# Redis (required for BullMQ)
REDIS_URL="redis://:CHANGE_ME_IN_PRODUCTION@localhost:6379"

# Cloudflare R2 (required for file storage)
R2_ACCOUNT_ID="your_account_id"
R2_ACCESS_KEY_ID="your_access_key"
R2_SECRET_ACCESS_KEY="your_secret_key"
R2_BUCKET_NAME="rumbo-imports"  # or your bucket name
R2_PUBLIC_URL="https://your-bucket.r2.cloudflarestorage.com"

# Encryption (required for password handling)
ENCRYPTION_KEY="generate-with-openssl-rand-base64-32"

# NextAuth (for authentication)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"
```

### 2. Generate Encryption Key

```bash
openssl rand -base64 32
```

Add the output to `.env` as `ENCRYPTION_KEY`.

### 3. Start Required Services

**Start PostgreSQL and Redis (Docker):**

```bash
docker-compose up -d
```

**Verify services are running:**

```bash
# Check Postgres
psql $DATABASE_URL -c "SELECT 1"

# Check Redis
redis-cli -u $REDIS_URL ping
# Should return: PONG
```

### 4. Apply Migrations

```bash
npx prisma migrate dev
npx prisma generate
```

## Testing Scenarios

### Scenario 1: File Upload API (Without Password)

**What this tests:**

- File upload endpoint
- File type validation
- R2 storage upload
- ImportJob creation
- BullMQ job queuing

**Steps:**

1. **Start the dev server:**

```bash
pnpm dev
```

2. **Create a test CSV file:**

```bash
cat > /tmp/test-statement.csv << 'EOF'
Date,Description,Amount,Type
2024-01-01,Salary,5000000,Income
2024-01-05,Grocery Store,-150000,Expense
2024-01-10,Utility Bill,-200000,Expense
EOF
```

3. **Get authentication token:**

First, create a user account at `http://localhost:3000/register` or login at `http://localhost:3000/login`.

Then, get your session token from browser DevTools:

- Open Application tab > Cookies
- Copy the `next-auth.session-token` value

4. **Upload file via API:**

```bash
# Replace YOUR_SESSION_TOKEN with actual token
curl -X POST http://localhost:3000/api/import/upload \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -F "file=@/tmp/test-statement.csv"
```

**Expected Response:**

```json
{
  "jobId": "clxxx...",
  "status": "success",
  "message": "Archivo subido exitosamente. Procesando..."
}
```

5. **Verify in Database:**

```bash
psql $DATABASE_URL -c "SELECT id, status, fileName, fileType, progress FROM \"ImportJob\" ORDER BY \"createdAt\" DESC LIMIT 1;"
```

**Expected:**

```
        id        | status  |      fileName      | fileType | progress
------------------+---------+--------------------+----------+----------
 clxxx...         | PENDING | test-statement.csv | CSV      |        0
```

6. **Check R2 Storage:**

The file should be uploaded to R2 at: `imports/{userId}/{timestamp}-test-statement.csv`

You can verify by checking your R2 dashboard or using AWS CLI:

```bash
aws s3 ls s3://$R2_BUCKET_NAME/imports/ \
  --endpoint-url https://$R2_ACCOUNT_ID.r2.cloudflarestorage.com
```

### Scenario 2: Password-Protected File Upload

**What this tests:**

- Password detection
- Password encryption
- Colombian ID auto-unlock

**Steps:**

1. **First, ensure user has Colombian ID:**

```bash
# Update your user with a Colombian ID
psql $DATABASE_URL -c "UPDATE \"User\" SET \"colombianId\" = '123456789', \"colombianIdType\" = 'CC' WHERE email = 'your-email@example.com';"
```

2. **Create a password-protected PDF:**

You'll need a real password-protected PDF from a Colombian bank. For testing, you can:

- Use a real bank statement PDF (recommended)
- Or create a mock encrypted PDF using online tools

3. **Upload password-protected file:**

```bash
curl -X POST http://localhost:3000/api/import/upload \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -F "file=@/path/to/protected.pdf"
```

**If password is detected:**

```json
{
  "error": "PASSWORD_REQUIRED",
  "message": "Este archivo está protegido. Completa tu perfil o ingresa la contraseña.",
  "requiresPassword": true,
  "requiresOnboarding": false
}
```

4. **Upload with manual password:**

```bash
curl -X POST http://localhost:3000/api/import/upload \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -F "file=@/path/to/protected.pdf" \
  -F "password=123456789"
```

5. **Verify password is encrypted in DB:**

```bash
psql $DATABASE_URL -c "SELECT id, \"requiresPassword\", \"passwordHash\", \"passwordAttempts\" FROM \"ImportJob\" ORDER BY \"createdAt\" DESC LIMIT 1;"
```

**Expected:**

```
        id        | requiresPassword |           passwordHash           | passwordAttempts
------------------+------------------+----------------------------------+------------------
 clxxx...         | t                | a1b2c3d4e5f6:encrypted_data_here |                0
```

The `passwordHash` should be in format `{iv}:{encrypted_data}`.

### Scenario 3: BullMQ Worker Processing

**What this tests:**

- Worker picks up jobs
- Job status updates
- Error handling

**Note:** The worker will **fail** at the parsing step because Phase 2 (CSV parsing) isn't implemented yet. This is expected!

**Steps:**

1. **Start the worker in a separate terminal:**

Create a worker start script:

```bash
# Create worker starter
cat > /tmp/start-worker.ts << 'EOF'
import '@/server/queue/workers/import-worker';

console.log('Worker started. Press Ctrl+C to stop.');

// Keep process alive
process.on('SIGINT', () => {
  console.log('\nShutting down worker...');
  process.exit(0);
});
EOF
```

Then run it:

```bash
npx tsx /tmp/start-worker.ts
```

**Expected output:**

```
[Redis] Connected successfully
[Redis] Ready to accept commands
[ImportWorker] Worker started and listening for jobs
```

2. **Upload a file** (use Scenario 1 steps above)

3. **Watch worker logs:**

You should see:

```
[ImportWorker] Processing job clxxx... for user clusr...
[ImportWorker] File download not implemented yet
[ImportWorker] Job clxxx... failed: Error: File download not implemented yet
```

4. **Verify job status in DB:**

```bash
psql $DATABASE_URL -c "SELECT id, status, progress, error FROM \"ImportJob\" ORDER BY \"createdAt\" DESC LIMIT 1;"
```

**Expected:**

```
        id        | status | progress |                    error
------------------+--------+----------+--------------------------------------------
 clxxx...         | FAILED |       20 | File download not implemented yet
```

This is **correct behavior** for Phase 1! The worker is working, but Phase 2 (file parsing) isn't implemented.

### Scenario 4: File Type Validation

**What this tests:**

- File size limits (10MB max)
- File type restrictions (CSV/PDF only)

**Test 1: Oversized file**

```bash
# Create 11MB file
dd if=/dev/zero of=/tmp/large.csv bs=1M count=11

curl -X POST http://localhost:3000/api/import/upload \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -F "file=@/tmp/large.csv"
```

**Expected:**

```json
{
  "error": "Archivo demasiado grande (máximo 10MB)"
}
```

**Test 2: Invalid file type**

```bash
curl -X POST http://localhost:3000/api/import/upload \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -F "file=@/tmp/test.txt"
```

**Expected:**

```json
{
  "error": "Tipo de archivo no válido. Solo se permiten CSV y PDF"
}
```

### Scenario 5: Password Encryption/Decryption

**What this tests:**

- AES-256-CBC encryption
- Random IV generation
- Decryption round-trip

**Test script:**

```typescript
import { encryptPassword, decryptPassword } from '@/server/lib/crypto';

const testPassword = '123456789';

// Encrypt
const encrypted = encryptPassword(testPassword);
console.log('Encrypted:', encrypted);
console.log('Format check:', encrypted.includes(':') ? '✅' : '❌');

// Decrypt
const decrypted = decryptPassword(encrypted);
console.log('Decrypted:', decrypted);
console.log('Match:', decrypted === testPassword ? '✅' : '❌');

// Test multiple encryptions produce different results (random IV)
const encrypted2 = encryptPassword(testPassword);
console.log('Different ciphertext:', encrypted !== encrypted2 ? '✅' : '❌');
console.log('Same plaintext:', decryptPassword(encrypted2) === testPassword ? '✅' : '❌');
```

**Run test:**

```bash
npx tsx -e "$(cat << 'EOF'
import { encryptPassword, decryptPassword } from './src/server/lib/crypto';
const pass = '123456789';
const enc = encryptPassword(pass);
console.log('Encrypted:', enc);
console.log('Decrypted:', decryptPassword(enc));
console.log('Match:', decryptPassword(enc) === pass ? '✅' : '❌');
EOF
)"
```

## Manual UI Testing

### Test PasswordPromptModal (In Your App)

1. **Create a test page** (`app/(app)/test-import/page.tsx`):

```typescript
'use client';

import { useState } from 'react';
import { PasswordPromptModal } from '@/features/import/components/password-prompt-modal';

export default function TestImportPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [userHasId, setUserHasId] = useState(false);

  const handleSubmit = async (password: string) => {
    console.log('Password submitted:', password);
    alert(`Password: ${password}`);
  };

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <h1 className="mb-8 text-3xl font-bold">Test Password Prompt</h1>

      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={userHasId}
              onChange={(e) => setUserHasId(e.target.checked)}
            />
            User has Colombian ID
          </label>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          Show Password Modal
        </button>
      </div>

      <PasswordPromptModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
        userHasColombianId={userHasId}
        fileName="extracto_bancolombia_2024.pdf"
      />
    </div>
  );
}
```

2. **Visit:** `http://localhost:3000/test-import`

3. **Test cases:**

- ✅ With Colombian ID: Should show hint about auto-trying cédula
- ✅ Without Colombian ID: Should show "Complete Profile" banner
- ✅ Submit with password: Should log password
- ✅ Close modal: Should close without submitting

## Database Verification Queries

**Check all import jobs:**

```sql
SELECT
  id,
  "fileName",
  "fileType",
  status,
  progress,
  "requiresPassword",
  "accountsCount",
  "transactionsCount",
  error,
  "createdAt"
FROM "ImportJob"
ORDER BY "createdAt" DESC;
```

**Check if password was cleared after processing:**

```sql
SELECT
  id,
  status,
  "passwordHash",
  "requiresPassword"
FROM "ImportJob"
WHERE status IN ('FAILED', 'CONFIRMED')
ORDER BY "createdAt" DESC;
```

**Expected:** `passwordHash` should be `NULL` after worker processes the job.

## Expected Behavior Summary

### ✅ What SHOULD Work in Phase 1

1. **File Upload:**
   - Upload CSV/PDF files ✅
   - File type validation ✅
   - File size validation (10MB max) ✅
   - R2 storage upload ✅
   - ImportJob creation in database ✅

2. **Password Handling:**
   - Detect password-protected files ✅
   - Request password if needed ✅
   - Encrypt passwords before storage ✅
   - Auto-try Colombian ID as password ✅

3. **BullMQ:**
   - Queue job creation ✅
   - Worker picks up jobs ✅
   - Job status updates (PENDING → PROCESSING) ✅
   - Error handling and retries ✅

### ❌ What WON'T Work Yet (Phase 2+)

1. **File Parsing:**
   - CSV parsing ❌ (throws "File parsing not implemented yet")
   - PDF text extraction ❌
   - Account detection ❌
   - Transaction extraction ❌

2. **Database Population:**
   - ImportedAccount creation ❌
   - ImportedTransaction creation ❌
   - AI categorization ❌

3. **Review UI:**
   - Import review page ❌
   - Account confirmation ❌
   - Transaction categorization ❌

**All jobs will fail at the parsing step** - this is expected and correct!

## Troubleshooting

### "Redis connection failed"

```bash
# Check Redis is running
docker-compose ps | grep redis

# Check Redis connection
redis-cli -u $REDIS_URL ping
```

### "R2 upload failed"

```bash
# Verify R2 credentials
echo $R2_ACCOUNT_ID
echo $R2_ACCESS_KEY_ID
echo $R2_BUCKET_NAME
```

### "ENCRYPTION_KEY not set"

```bash
# Generate and add to .env
openssl rand -base64 32 >> .env.local
# Then manually add ENCRYPTION_KEY= prefix
```

### "Unauthorized" error

```bash
# Make sure you're logged in
# Check session cookie exists in browser DevTools
```

### Worker not processing jobs

```bash
# Check worker is running
ps aux | grep import-worker

# Check Redis connection in worker logs
# Should see: "[Redis] Connected successfully"
```

## Next Steps

After Phase 1 testing:

1. ✅ Verify file uploads work
2. ✅ Verify password handling works
3. ✅ Verify BullMQ infrastructure works
4. ⏳ Wait for Phase 2 (CSV parsing) to test end-to-end flow

## Quick Test Checklist

- [ ] Environment variables set
- [ ] PostgreSQL running
- [ ] Redis running
- [ ] Migrations applied
- [ ] Dev server started (`pnpm dev`)
- [ ] User account created
- [ ] Test CSV file uploaded successfully
- [ ] ImportJob record created in database
- [ ] File uploaded to R2
- [ ] BullMQ worker started
- [ ] Worker processes job (fails at parsing - expected!)
- [ ] Password encryption/decryption works
- [ ] File validation works (size, type)

---

**All Phase 1 infrastructure is working if:**
✅ Files upload successfully
✅ Jobs are created in database
✅ Worker picks up and processes jobs (until parsing step)
✅ Errors are handled gracefully
