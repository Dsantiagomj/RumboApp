# Phase 2: Vision API Testing Guide

## Prerequisites

1. ✅ Phase 1 completed and merged
2. ✅ Phase 2 branch checked out: `feature/epic-2-phase-2-csv-parsing`
3. ✅ OpenAI API key configured in `.env`:
   ```env
   OPENAI_API_KEY=sk-...
   ```
4. ✅ R2 storage configured (from Phase 1)
5. ✅ Redis running for BullMQ
6. ✅ Database migrated

## Quick Start

```bash
# Ensure you're on the right branch
git checkout feature/epic-2-phase-2-csv-parsing

# Install dependencies (if needed)
pnpm install

# Run database migration
npx prisma migrate dev

# Start dev server
pnpm dev

# In another terminal, start the worker
pnpm worker
```

## Test Scenarios

### Scenario 1: Upload Bank Statement Photo ✅

**Goal**: Test end-to-end image upload and vision extraction

**Steps**:

1. **Prepare a test image**:
   - Option A: Take photo of a real Colombian bank statement
   - Option B: Create a mock statement image with text
   - Option C: Use a screenshot of online banking

2. **Get auth session token**:

   ```bash
   # Login via browser at http://localhost:3000/login
   # Open DevTools → Application → Cookies
   # Copy the value of "next-auth.session-token"
   ```

3. **Upload image via API**:

   ```bash
   curl -X POST http://localhost:3000/api/import/upload \
     -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
     -F "file=@path/to/bank_statement.jpg"
   ```

4. **Expected response**:

   ```json
   {
     "jobId": "clu...",
     "status": "success",
     "message": "Archivo subido exitosamente. Procesando..."
   }
   ```

5. **Check worker logs**:

   ```bash
   # You should see in the worker terminal:
   [ImportWorker] Processing job clu... for user cls...
   [ImportWorker] Downloading file from https://...
   [ImportWorker] Parsing IMAGE file
   Vision API extraction...
   [ImportWorker] Creating 1 imported accounts
   [ImportWorker] Creating 15 imported transactions
   [ImportWorker] Job clu... completed: 1 accounts, 15 transactions
   ```

6. **Verify in database**:

   ```sql
   -- Check job status
   SELECT id, "fileName", status, progress, "accountsCount", "transactionsCount"
   FROM "ImportJob"
   WHERE status = 'REVIEW'
   ORDER BY "createdAt" DESC
   LIMIT 1;

   -- Check extracted accounts
   SELECT id, name, "bankName", "accountType", "initialBalance"
   FROM "ImportedAccount"
   WHERE "importJobId" = 'YOUR_JOB_ID';

   -- Check extracted transactions
   SELECT date, description, amount, type, merchant
   FROM "ImportedTransaction"
   WHERE "importJobId" = 'YOUR_JOB_ID'
   ORDER BY date DESC
   LIMIT 10;
   ```

**Success Criteria**:

- ✅ Job status is `REVIEW`
- ✅ Account created with bank name extracted
- ✅ Transactions parsed with correct dates (ISO format)
- ✅ Amounts are positive numbers
- ✅ Transaction types are INCOME or EXPENSE

---

### Scenario 2: Invalid Image (Not a Bank Statement) ⚠️

**Goal**: Test error handling for non-statement images

**Steps**:

1. **Upload a random image** (cat photo, landscape, etc.):

   ```bash
   curl -X POST http://localhost:3000/api/import/upload \
     -H "Cookie: next-auth.session-token=YOUR_TOKEN" \
     -F "file=@random_image.jpg"
   ```

2. **Expected behavior**:
   - Job created but should fail during processing
   - Vision API returns low confidence (0%)
   - Worker catches validation error

3. **Check database**:

   ```sql
   SELECT id, status, error, progress
   FROM "ImportJob"
   WHERE status = 'FAILED'
   ORDER BY "createdAt" DESC
   LIMIT 1;
   ```

4. **Expected error message**:
   ```
   "Vision extraction failed validation: Low confidence extraction (< 50%)"
   ```

**Success Criteria**:

- ✅ Job status is `FAILED`
- ✅ Error message explains the issue
- ✅ No accounts or transactions created
- ✅ Worker doesn't crash

---

### Scenario 3: Multiple Accounts in One Statement 📊

**Goal**: Test extraction of statements with multiple accounts

**Steps**:

1. **Create/find a statement image** showing multiple accounts
   (e.g., savings + checking on one page)

2. **Upload the image**

3. **Verify accounts created**:

   ```sql
   SELECT id, name, "bankName", "accountType"
   FROM "ImportedAccount"
   WHERE "importJobId" = 'YOUR_JOB_ID';
   ```

4. **Verify transactions mapped correctly**:
   ```sql
   SELECT
     ia.name AS account_name,
     COUNT(it.id) AS transaction_count
   FROM "ImportedAccount" ia
   LEFT JOIN "ImportedTransaction" it ON it."importedAccountId" = ia.id
   WHERE ia."importJobId" = 'YOUR_JOB_ID'
   GROUP BY ia.id, ia.name;
   ```

**Success Criteria**:

- ✅ Multiple accounts created
- ✅ Transactions distributed across accounts
- ✅ No orphan transactions (all have valid importedAccountId)

---

### Scenario 4: Colombian Date/Currency Parsing 🇨🇴

**Goal**: Verify Colombian format handling

**Test Cases**:

Create a mock statement image with these patterns:

| Original Text                        | Expected Parse                                    |
| ------------------------------------ | ------------------------------------------------- |
| `31/12/2023 COMPRA EXITO $-150.000`  | date: 2023-12-31, amount: 150000, type: EXPENSE   |
| `01-01-2024 CONSIGNACION $500.000`   | date: 2024-01-01, amount: 500000, type: INCOME    |
| `15/06/2023 RETIRO ATM $-200.000,50` | date: 2023-06-15, amount: 200000.5, type: EXPENSE |

**Verification**:

```sql
SELECT
  date,
  description,
  amount,
  type,
  "rawData"::text
FROM "ImportedTransaction"
WHERE "importJobId" = 'YOUR_JOB_ID'
ORDER BY date;
```

**Success Criteria**:

- ✅ Dates in ISO format (YYYY-MM-DD)
- ✅ Amounts as positive decimals
- ✅ Correct transaction type (INCOME/EXPENSE)
- ✅ Original text preserved in rawData

---

### Scenario 5: Large File (10MB Limit) 📏

**Goal**: Test file size validation

**Steps**:

1. **Create a large image** (> 10MB):

   ```bash
   # Create a 15MB image
   convert -size 5000x5000 xc:white large_image.jpg
   ```

2. **Attempt upload**:

   ```bash
   curl -X POST http://localhost:3000/api/import/upload \
     -H "Cookie: next-auth.session-token=YOUR_TOKEN" \
     -F "file=@large_image.jpg"
   ```

3. **Expected response**:
   ```json
   {
     "error": "Archivo demasiado grande (máximo 10MB)"
   }
   ```

**Success Criteria**:

- ✅ Upload rejected before processing
- ✅ No job created in database
- ✅ Clear error message returned

---

### Scenario 6: Unsupported File Type 🚫

**Goal**: Test file type validation

**Steps**:

1. **Upload a PDF or CSV**:

   ```bash
   curl -X POST http://localhost:3000/api/import/upload \
     -H "Cookie: next-auth.session-token=YOUR_TOKEN" \
     -F "file=@statement.pdf"
   ```

2. **Expected behavior**:
   - Upload succeeds (PDFs are allowed)
   - Worker tries to process as PDF
   - Fails with "PDF parsing not implemented yet"

3. **Check database**:
   ```sql
   SELECT id, "fileType", status, error
   FROM "ImportJob"
   WHERE "fileType" = 'PDF'
   ORDER BY "createdAt" DESC
   LIMIT 1;
   ```

**Success Criteria**:

- ✅ Job created with fileType = 'PDF' or 'CSV'
- ✅ Status is FAILED
- ✅ Error: "PDF parsing not implemented yet"

---

## Database Inspection Queries

### Check Recent Import Jobs

```sql
SELECT
  id,
  "fileName",
  "fileType",
  status,
  progress,
  "accountsCount",
  "transactionsCount",
  "createdAt"
FROM "ImportJob"
ORDER BY "createdAt" DESC
LIMIT 5;
```

### View Imported Accounts with Transactions

```sql
SELECT
  ia.name,
  ia."bankName",
  ia."accountType",
  ia."transactionCount",
  COUNT(it.id) AS actual_transaction_count
FROM "ImportedAccount" ia
LEFT JOIN "ImportedTransaction" it ON it."importedAccountId" = ia.id
GROUP BY ia.id
ORDER BY ia."createdAt" DESC;
```

### Analyze Transaction Types

```sql
SELECT
  type,
  COUNT(*) AS count,
  SUM(amount) AS total_amount,
  AVG(amount) AS avg_amount
FROM "ImportedTransaction"
WHERE "importJobId" = 'YOUR_JOB_ID'
GROUP BY type;
```

### Check Vision API Confidence

```sql
SELECT
  ij.id,
  ij."fileName",
  ia.confidence,
  ia."transactionCount"
FROM "ImportJob" ij
JOIN "ImportedAccount" ia ON ia."importJobId" = ij.id
WHERE ij."fileType" = 'IMAGE'
ORDER BY ij."createdAt" DESC;
```

## Troubleshooting

### Issue: Worker not processing jobs

**Symptoms**: Job stuck in PENDING status

**Solutions**:

1. Check worker is running: `pnpm worker`
2. Check Redis connection: `redis-cli ping`
3. Check BullMQ dashboard: http://localhost:3000/admin/queues
4. Restart worker

### Issue: Vision API errors

**Symptoms**: Job fails with "Vision API extraction error"

**Solutions**:

1. Check `OPENAI_API_KEY` is set correctly
2. Check API quota: https://platform.openai.com/usage
3. Check worker logs for detailed error
4. Verify image is valid (not corrupted)

### Issue: Low confidence extraction

**Symptoms**: Job fails with validation error, confidence < 50%

**Solutions**:

1. Use clearer bank statement image
2. Ensure text is readable (not blurry)
3. Try different bank/statement format
4. Check vision API prompt (may need tuning)

### Issue: Dates not parsing correctly

**Symptoms**: Transactions have invalid dates or wrong format

**Solutions**:

1. Check vision API prompt includes Colombian date formats
2. Verify vision API response in worker logs
3. Add more date format examples to prompt
4. Consider manual date parsing fallback

### Issue: R2 download fails

**Symptoms**: "Failed to download file" error

**Solutions**:

1. Check R2_PUBLIC_URL is correct
2. Verify file was uploaded successfully
3. Check file permissions (should be public-read)
4. Test URL directly in browser

## Performance Testing

### Load Test: Multiple Concurrent Uploads

```bash
# Upload 5 images concurrently
for i in {1..5}; do
  (curl -X POST http://localhost:3000/api/import/upload \
    -H "Cookie: next-auth.session-token=YOUR_TOKEN" \
    -F "file=@statement_${i}.jpg" &)
done
wait
```

**Expected**:

- Worker processes jobs concurrently (max 5)
- All jobs complete within ~30 seconds
- No database conflicts

### Monitor Worker Performance

```sql
-- Average processing time
SELECT
  AVG(EXTRACT(EPOCH FROM ("completedAt" - "createdAt"))) AS avg_seconds,
  MIN(EXTRACT(EPOCH FROM ("completedAt" - "createdAt"))) AS min_seconds,
  MAX(EXTRACT(EPOCH FROM ("completedAt" - "createdAt"))) AS max_seconds
FROM "ImportJob"
WHERE status = 'REVIEW';
```

## Next Steps

After testing Phase 2, you're ready to:

1. **Merge to develop**: If all tests pass
2. **Start Phase 3**: Review/validation UI
3. **Gather real data**: Test with actual Colombian bank statements
4. **Iterate on prompt**: Improve vision API accuracy based on results

## Test Checklist

- [ ] Image upload works for JPG, PNG, HEIC
- [ ] Vision API extracts accounts and transactions
- [ ] Colombian dates converted to ISO format
- [ ] Currency parsing handles . and , separators
- [ ] Transaction types detected correctly (INCOME/EXPENSE)
- [ ] Merchant names extracted when available
- [ ] Account-transaction mapping works (no orphans)
- [ ] Invalid images fail gracefully
- [ ] File size limit enforced (10MB)
- [ ] R2 download implemented and working
- [ ] Worker processes jobs in background
- [ ] Database foreign keys valid
- [ ] Job status updates correctly (PENDING → PROCESSING → REVIEW)
- [ ] Error handling for low confidence extractions
- [ ] Multiple accounts per statement supported

---

**Ready for production?** After all tests pass ✅
