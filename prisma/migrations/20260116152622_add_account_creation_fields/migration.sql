-- AlterEnum
ALTER TYPE "AccountType" ADD VALUE 'LOAN';

-- AlterTable
ALTER TABLE "FinancialAccount" ADD COLUMN     "availableCredit" DECIMAL(12,2),
ADD COLUMN     "creditLimit" DECIMAL(12,2),
ADD COLUMN     "isManual" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastSyncedAt" TIMESTAMP(3),
ADD COLUMN     "loanAmount" DECIMAL(12,2),
ADD COLUMN     "monthlyPayment" DECIMAL(12,2),
ADD COLUMN     "remainingBalance" DECIMAL(12,2);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "onboardingCompletedAt" TIMESTAMP(3),
ADD COLUMN     "phoneNumber" TEXT;
