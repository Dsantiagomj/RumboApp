-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('CSV', 'PDF');

-- CreateEnum
CREATE TYPE "ImportJobStatus" AS ENUM ('PENDING', 'PROCESSING', 'PARSING', 'CATEGORIZING', 'REVIEW', 'CONFIRMED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BankFormat" AS ENUM ('BANCOLOMBIA', 'NEQUI', 'DAVIVIENDA', 'BBVA', 'BANCO_BOGOTA', 'GENERIC');

-- CreateTable
CREATE TABLE "ImportJob" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" "FileType" NOT NULL,
    "status" "ImportJobStatus" NOT NULL DEFAULT 'PENDING',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "passwordHash" TEXT,
    "requiresPassword" BOOLEAN NOT NULL DEFAULT false,
    "passwordAttempts" INTEGER NOT NULL DEFAULT 0,
    "bankFormat" "BankFormat",
    "error" TEXT,
    "accountsCount" INTEGER NOT NULL DEFAULT 0,
    "transactionsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "ImportJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportedAccount" (
    "id" TEXT NOT NULL,
    "importJobId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bankName" TEXT,
    "accountNumber" TEXT,
    "accountType" "AccountType" NOT NULL,
    "initialBalance" DECIMAL(12,2) NOT NULL,
    "transactionCount" INTEGER NOT NULL DEFAULT 0,
    "suggestedColor" TEXT,
    "suggestedIcon" TEXT,
    "confidence" DOUBLE PRECISION,
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "confirmedAccountId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImportedAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportedTransaction" (
    "id" TEXT NOT NULL,
    "importJobId" TEXT NOT NULL,
    "importedAccountId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "type" "TransactionType" NOT NULL,
    "merchant" TEXT,
    "rawData" JSONB,
    "suggestedCategoryId" TEXT,
    "confidence" DOUBLE PRECISION,
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "confirmedTransactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImportedTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ImportJob_userId_idx" ON "ImportJob"("userId");

-- CreateIndex
CREATE INDEX "ImportJob_status_idx" ON "ImportJob"("status");

-- CreateIndex
CREATE INDEX "ImportedAccount_importJobId_idx" ON "ImportedAccount"("importJobId");

-- CreateIndex
CREATE INDEX "ImportedTransaction_importJobId_idx" ON "ImportedTransaction"("importJobId");

-- CreateIndex
CREATE INDEX "ImportedTransaction_importedAccountId_idx" ON "ImportedTransaction"("importedAccountId");

-- CreateIndex
CREATE INDEX "ImportedTransaction_date_idx" ON "ImportedTransaction"("date");

-- AddForeignKey
ALTER TABLE "ImportJob" ADD CONSTRAINT "ImportJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportedAccount" ADD CONSTRAINT "ImportedAccount_importJobId_fkey" FOREIGN KEY ("importJobId") REFERENCES "ImportJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportedTransaction" ADD CONSTRAINT "ImportedTransaction_importJobId_fkey" FOREIGN KEY ("importJobId") REFERENCES "ImportJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportedTransaction" ADD CONSTRAINT "ImportedTransaction_importedAccountId_fkey" FOREIGN KEY ("importedAccountId") REFERENCES "ImportedAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
