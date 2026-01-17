import type { AccountType, BankFormat } from '@prisma/client';
import type { PDFStatementMetadata, PDFExtractedTransaction } from './pdf-transaction-extractor';
import type { DetectedAccount } from './account-detector';

/**
 * PDF Account Detector
 *
 * Extracts account information from PDF bank statement metadata
 */

/**
 * Map bank name to BankFormat enum
 */
function mapBankNameToFormat(bankName?: string): BankFormat {
  if (!bankName) return 'GENERIC';

  const nameLower = bankName.toLowerCase();

  if (nameLower.includes('bancolombia')) return 'BANCOLOMBIA';
  if (nameLower.includes('nequi')) return 'NEQUI';
  if (nameLower.includes('davivienda')) return 'DAVIVIENDA';
  if (nameLower.includes('bbva')) return 'BBVA';
  if (nameLower.includes('bogotá') || nameLower.includes('bogota')) return 'BANCO_BOGOTA';

  return 'GENERIC';
}

/**
 * Map AccountType string to actual type
 */
function mapAccountType(accountType?: string): AccountType {
  if (!accountType) return 'CHECKING';

  const typeUpper = accountType.toUpperCase();

  if (typeUpper === 'SAVINGS') return 'SAVINGS';
  if (typeUpper === 'CHECKING') return 'CHECKING';
  if (typeUpper === 'CREDIT_CARD') return 'CREDIT_CARD';

  return 'CHECKING'; // Default
}

/**
 * Get suggested color by bank
 */
const BANK_COLORS: Record<BankFormat, string> = {
  BANCOLOMBIA: '#FFDD00', // Yellow
  NEQUI: '#6C1D8D', // Purple
  DAVIVIENDA: '#EE2E24', // Red
  BBVA: '#004481', // Blue
  BANCO_BOGOTA: '#005EB8', // Blue
  GENERIC: '#6366f1', // Indigo
};

/**
 * Get suggested icon by account type
 */
const ACCOUNT_TYPE_ICONS: Record<AccountType, string> = {
  SAVINGS: 'PiggyBank',
  CHECKING: 'Building',
  CREDIT_CARD: 'CreditCard',
  LOAN: 'TrendingUp',
  CASH: 'DollarSign',
  INVESTMENT: 'Wallet',
  OTHER: 'Wallet',
};

/**
 * Generate account name from metadata
 */
function generateAccountName(
  bankName?: string,
  accountType?: AccountType,
  accountNumber?: string
): string {
  const bank = bankName || 'Cuenta';

  const typeNames: Record<AccountType, string> = {
    SAVINGS: 'Ahorros',
    CHECKING: 'Corriente',
    CREDIT_CARD: 'Tarjeta',
    LOAN: 'Préstamo',
    CASH: 'Efectivo',
    INVESTMENT: 'Inversión',
    OTHER: 'Cuenta',
  };

  const typeName = accountType ? typeNames[accountType] : 'Cuenta';

  if (accountNumber) {
    // Use last 4 digits
    const last4 = accountNumber.slice(-4);
    return `${bank} ${typeName} ****${last4}`;
  }

  return `${bank} ${typeName}`;
}

/**
 * Detect account from PDF metadata and transactions
 */
export function detectPDFAccount(
  metadata: PDFStatementMetadata,
  transactions: PDFExtractedTransaction[]
): DetectedAccount {
  const bankFormat = mapBankNameToFormat(metadata.bankName);
  const bankName = metadata.bankName || 'Banco Desconocido';
  const accountType = mapAccountType(metadata.accountType);
  const accountNumber = metadata.accountNumber?.slice(-4);

  // Use previous balance as initial balance
  // If not available, calculate from current balance and transaction totals
  let initialBalance = metadata.previousBalance || 0;

  if (!metadata.previousBalance && metadata.currentBalance !== undefined) {
    // Calculate initial balance: current - credits + debits
    const totalCredits = metadata.totalCredits || 0;
    const totalDebits = metadata.totalDebits || 0;
    initialBalance = metadata.currentBalance - totalCredits + totalDebits;
  }

  const name = generateAccountName(bankName, accountType, metadata.accountNumber);

  const suggestedColor = BANK_COLORS[bankFormat];
  const suggestedIcon = ACCOUNT_TYPE_ICONS[accountType];

  return {
    name,
    bankName,
    accountNumber,
    accountType,
    initialBalance,
    transactionCount: transactions.length,
    suggestedColor,
    suggestedIcon,
  };
}

/**
 * Detect bank format from PDF metadata
 */
export function detectPDFBankFormat(metadata: PDFStatementMetadata): {
  format: BankFormat;
  confidence: number;
} {
  const format = mapBankNameToFormat(metadata.bankName);

  // High confidence if bank name was found
  const confidence = metadata.bankName ? 0.9 : 0.3;

  return { format, confidence };
}
