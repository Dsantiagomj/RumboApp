# Import Feature - Phase 1 Infrastructure

## Overview

Phase 1 implements the foundation for importing financial data from CSV/PDF files exported from Colombian banks. This includes password-protected file handling, file storage, and asynchronous job processing.

## Architecture

```
User → Upload API → R2 Storage → BullMQ Queue → Import Worker → Database
                                                      ↓
                                        Password Detection & Decryption
```

## Components

### 1. File Upload API (`/api/import/upload`)

**Endpoint:** `POST /api/import/upload`

**Request:**

- `multipart/form-data`
- Fields:
  - `file`: CSV or PDF file (max 10MB)
  - `password` (optional): Manual password if not using Colombian ID

**Response:**

```json
{
  "jobId": "clxxx...",
  "status": "success",
  "message": "Archivo subido exitosamente. Procesando..."
}
```

**Error Responses:**

- `401`: Not authenticated
- `400`: Invalid file (size/type)
- `403`: Password required
- `500`: Server error

**Password Handling:**

1. Detects if file is password-protected
2. If protected and user has no `colombianId`: Requires onboarding or manual password
3. If protected and user has `colombianId`: Auto-tries cédula as password
4. Encrypts password using AES-256-CBC before storing in database
5. Worker decrypts and clears password after processing

### 2. Cloudflare R2 Storage

**Location:** `src/server/lib/r2.ts`

**Functions:**

- `uploadToR2(buffer, key, contentType)` - Upload file to R2
- `generateImportKey(userId, fileName)` - Generate unique storage key
- `getSignedDownloadUrl(key, expiresIn)` - Get temporary download URL
- `deleteFromR2(key)` - Delete file from R2

**File Structure:**

```
imports/
  └── {userId}/
      └── {timestamp}-{sanitized-filename}
```

### 3. Password Detection & Encryption

**Password Detection** (`src/server/lib/parsers/password-detector.ts`):

- `isPasswordProtected(buffer, fileType)` - Detects encrypted files
- `decryptFile(buffer, password, fileType)` - Decrypts files

**Password Encryption** (`src/server/lib/crypto.ts`):

- `encryptPassword(password)` - AES-256-CBC encryption with random IV
- `decryptPassword(encryptedPassword)` - Decrypts stored passwords

**Format:** `{iv}:{encryptedData}` (IV prepended for decryption)

### 4. BullMQ Job Queue

**Location:** `src/server/queue/`

**Queues:**

- `import` - File import processing
- `categorization` - AI transaction categorization

**Worker:** `src/server/queue/workers/import-worker.ts`

**Job Flow:**

1. `PENDING` → Job created, queued for processing
2. `PROCESSING` (10%) → Downloading file from R2
3. `PROCESSING` (20%) → Decrypting if password-protected
4. `PARSING` (40%) → Parsing CSV/PDF
5. `PARSING` (60%) → Creating ImportedAccount records
6. `PARSING` (80%) → Creating ImportedTransaction records
7. `CATEGORIZING` (90%) → Queuing AI categorization
8. `REVIEW` (100%) → Ready for user review

**Error Handling:**

- 3 retry attempts with exponential backoff
- Failed jobs stored for 7 days
- Error message saved to `ImportJob.error`

### 5. Password Prompt Modal

**Location:** `src/features/import/components/password-prompt-modal/`

**Props:**

```typescript
interface PasswordPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => Promise<void>;
  userHasColombianId: boolean;
  fileName: string;
}
```

**Behavior:**

- If user has no `colombianId`: Shows "Complete Profile" CTA
- If user has `colombianId`: Shows "We'll try your cédula first" message
- Allows manual password input as fallback
- Shows error messages from API

## Database Schema

### ImportJob

```prisma
model ImportJob {
  id               String            @id @default(cuid())
  userId           String
  fileName         String
  fileSize         Int
  fileUrl          String
  fileType         FileType          // CSV | PDF
  status           ImportJobStatus   // PENDING | PROCESSING | PARSING | ...
  progress         Int               @default(0)

  // Password handling
  passwordHash     String?           // AES-256-CBC encrypted (cleared after use)
  requiresPassword Boolean           @default(false)
  passwordAttempts Int               @default(0)

  bankFormat       BankFormat?       // BANCOLOMBIA | NEQUI | ...
  error            String?
  accountsCount    Int               @default(0)
  transactionsCount Int              @default(0)

  user             User              @relation(...)
  importedAccounts ImportedAccount[]
  importedTransactions ImportedTransaction[]

  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt
  completedAt      DateTime?
}
```

### ImportedAccount

```prisma
model ImportedAccount {
  id                 String    @id @default(cuid())
  importJobId        String
  name               String
  bankName           String?
  accountNumber      String?
  accountType        AccountType
  initialBalance     Decimal   @db.Decimal(12, 2)
  transactionCount   Int       @default(0)

  // AI suggestions
  suggestedColor     String?
  suggestedIcon      String?
  confidence         Float?

  // User confirmation
  isConfirmed        Boolean   @default(false)
  confirmedAccountId String?   // Links to FinancialAccount

  importJob          ImportJob @relation(...)
  transactions       ImportedTransaction[]

  createdAt          DateTime  @default(now())
}
```

### ImportedTransaction

```prisma
model ImportedTransaction {
  id                     String          @id @default(cuid())
  importJobId            String
  importedAccountId      String
  date                   DateTime
  description            String
  amount                 Decimal         @db.Decimal(12, 2)
  type                   TransactionType // INCOME | EXPENSE | TRANSFER
  merchant               String?
  rawData                Json?

  // AI suggestions
  suggestedCategoryId    String?
  confidence             Float?

  // User confirmation
  isConfirmed            Boolean         @default(false)
  confirmedTransactionId String?         // Links to Transaction

  importJob              ImportJob       @relation(...)
  importedAccount        ImportedAccount @relation(...)

  createdAt              DateTime        @default(now())
}
```

## Environment Variables

```env
# Cloudflare R2
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=rumboapp-imports
R2_PUBLIC_URL=https://your-bucket.r2.cloudflarestorage.com

# Redis (for BullMQ)
REDIS_URL=redis://localhost:6379

# Encryption
ENCRYPTION_KEY=your-32-char-encryption-key-change-in-production
```

## Security Considerations

1. **Password Storage:**
   - Passwords are AES-256-CBC encrypted before storing in database
   - Passwords are cleared from database after successful processing
   - Each encryption uses a unique random IV

2. **File Storage:**
   - Files stored in private R2 bucket
   - Access via signed URLs with expiration
   - File keys include userId to prevent unauthorized access

3. **Colombian ID:**
   - User's `colombianId` is never logged or exposed in responses
   - Only used as password attempt, never stored in ImportJob

4. **Job Processing:**
   - Worker runs in separate process
   - Failed jobs retain error messages but not passwords
   - File buffers cleared from memory after processing

## Next Steps (Phase 2-5)

- **Phase 2:** CSV parsing for Colombian bank formats
- **Phase 3:** Import wizard UI with file dropzone
- **Phase 4:** AI categorization integration
- **Phase 5:** PDF OCR support

## Testing

### Manual Testing

1. **Upload Protected File:**

   ```bash
   curl -X POST http://localhost:3000/api/import/upload \
     -H "Authorization: Bearer {token}" \
     -F "file=@bancolombia-statement.csv"
   ```

2. **Upload with Manual Password:**

   ```bash
   curl -X POST http://localhost:3000/api/import/upload \
     -H "Authorization: Bearer {token}" \
     -F "file=@statement.pdf" \
     -F "password=12345678"
   ```

3. **Check Job Status:**
   - Query `ImportJob` table for status updates
   - Check `progress` field for completion percentage

### Integration Tests Needed

- [ ] File upload with password detection
- [ ] Colombian ID auto-decryption
- [ ] Manual password flow
- [ ] R2 storage and retrieval
- [ ] BullMQ job processing
- [ ] Password encryption/decryption
- [ ] Error handling and retries

## Troubleshooting

### "ENCRYPTION_KEY environment variable not set"

- Add `ENCRYPTION_KEY` to `.env` file
- Key should be at least 32 characters

### "Failed to upload file to R2"

- Check R2 credentials in `.env`
- Verify bucket name and permissions
- Check R2_PUBLIC_URL is correct

### "Redis connection failed"

- Ensure Redis is running: `redis-cli ping`
- Check REDIS_URL in `.env`
- Verify Redis port is not blocked

### Jobs stuck in PENDING

- Check if worker is running
- Verify Redis connection
- Check worker logs for errors

## File Structure

```
src/features/import/
├── components/
│   └── password-prompt-modal/
│       ├── index.tsx
│       └── index.stories.tsx
└── README.md (this file)

src/server/
├── lib/
│   ├── r2.ts
│   ├── redis.ts
│   ├── crypto.ts
│   └── parsers/
│       └── password-detector.ts
└── queue/
    ├── types.ts
    ├── queues.ts
    ├── index.ts
    └── workers/
        └── import-worker.ts

app/api/import/
└── upload/
    └── route.ts
```
