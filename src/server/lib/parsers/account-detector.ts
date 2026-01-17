import type { AccountType, BankFormat } from '@prisma/client';
import type { CSVParseResult } from './csv-parser';
import type { ExtractedTransaction } from './transaction-extractor';

/**
 * Account Detector
 *
 * Extracts account information from CSV metadata and transactions:
 * - Account name
 * - Bank name
 * - Account number (last 4 digits)
 * - Account type (savings, checking, credit card)
 * - Initial balance
 */

export interface DetectedAccount {
  name: string;
  bankName: string;
  accountNumber?: string;
  accountType: AccountType;
  initialBalance: number;
  transactionCount: number;
  suggestedColor?: string;
  suggestedIcon?: string;
}

/**
 * Bank name mapping from BankFormat
 */
const BANK_NAME_MAP: Record<BankFormat, string> = {
  BANCOLOMBIA: 'Bancolombia',
  NEQUI: 'Nequi',
  DAVIVIENDA: 'Davivienda',
  BBVA: 'BBVA',
  BANCO_BOGOTA: 'Banco de Bogotá',
  GENERIC: 'Otro',
};

/**
 * Suggested colors by bank
 */
const BANK_COLORS: Record<BankFormat, string> = {
  BANCOLOMBIA: '#FFDD00', // Yellow
  NEQUI: '#6C1D8D', // Purple
  DAVIVIENDA: '#EE2E24', // Red
  BBVA: '#004481', // Blue
  BANCO_BOGOTA: '#005EB8', // Blue
  GENERIC: '#6366f1', // Indigo (default)
};

/**
 * Extract account number from CSV
 *
 * Looks for account number in:
 * 1. Metadata rows (before transactions)
 * 2. CSV filename
 * 3. Headers
 */
function extractAccountNumber(csvResult: CSVParseResult, fileName?: string): string | undefined {
  // Check first few rows for metadata (Colombian banks often include account info)
  const metadataRows = csvResult.data.slice(0, 5);

  for (const row of metadataRows) {
    for (const cell of row) {
      // Look for account number patterns
      // Colombian account numbers: 10-20 digits
      const accountMatch = cell.match(/\b(\d{10,20})\b/);
      if (accountMatch) {
        const accountNumber = accountMatch[1];
        // Return last 4 digits
        return accountNumber.slice(-4);
      }
    }
  }

  // Check filename
  if (fileName) {
    const filenameMatch = fileName.match(/\b(\d{10,20})\b/);
    if (filenameMatch) {
      return filenameMatch[1].slice(-4);
    }
  }

  return undefined;
}

/**
 * Detect account type from transactions
 *
 * Heuristics:
 * - Credit card: Many negative balances, payment keywords
 * - Savings: Mostly deposits, interest payments
 * - Checking: Mix of deposits and payments
 */
function detectAccountType(transactions: ExtractedTransaction[]): AccountType {
  if (transactions.length === 0) {
    return 'CHECKING'; // Default
  }

  // Count transaction types
  const incomeCount = transactions.filter((t) => t.type === 'INCOME').length;
  const expenseCount = transactions.filter((t) => t.type === 'EXPENSE').length;

  // Check for credit card keywords
  const creditCardKeywords = ['pago.*tarjeta', 'cuota', 'interés.*mora', 'avance'];
  const hasCreditCardKeywords = transactions.some((t) =>
    creditCardKeywords.some((keyword) => new RegExp(keyword, 'i').test(t.description))
  );

  if (hasCreditCardKeywords) {
    return 'CREDIT_CARD';
  }

  // Check for savings account keywords
  const savingsKeywords = ['interés.*ahorro', 'rendimiento', 'gmf.*exento'];
  const hasSavingsKeywords = transactions.some((t) =>
    savingsKeywords.some((keyword) => new RegExp(keyword, 'i').test(t.description))
  );

  // If mostly deposits and has savings keywords, it's a savings account
  if (hasSavingsKeywords || incomeCount > expenseCount * 2) {
    return 'SAVINGS';
  }

  // Default to checking
  return 'CHECKING';
}

/**
 * Calculate initial balance from transactions
 *
 * If last balance is available, work backwards
 * Otherwise, assume 0 and work forwards
 */
function calculateInitialBalance(transactions: ExtractedTransaction[]): number {
  if (transactions.length === 0) {
    return 0;
  }

  // Sort by date (oldest first)
  const sorted = [...transactions].sort((a, b) => a.date.getTime() - b.date.getTime());

  // Check if we have balance information
  const lastTransaction = sorted[sorted.length - 1];
  if (lastTransaction.balance !== undefined) {
    // Work backwards from last balance
    let balance = lastTransaction.balance;

    for (let i = sorted.length - 1; i >= 0; i--) {
      const t = sorted[i];
      if (t.type === 'INCOME') {
        balance -= t.amount;
      } else {
        balance += t.amount;
      }
    }

    return balance;
  }

  // Otherwise, assume starting balance is 0
  // This isn't ideal, but we can let user correct it
  return 0;
}

/**
 * Generate account name
 */
function generateAccountName(
  bankFormat: BankFormat,
  accountType: AccountType,
  accountNumber?: string
): string {
  const bankName = BANK_NAME_MAP[bankFormat];

  const typeNames: Record<AccountType, string> = {
    SAVINGS: 'Ahorros',
    CHECKING: 'Corriente',
    CREDIT_CARD: 'Tarjeta',
    LOAN: 'Préstamo',
    CASH: 'Efectivo',
    INVESTMENT: 'Inversión',
    OTHER: 'Cuenta',
  };

  const typeName = typeNames[accountType];

  if (accountNumber) {
    return `${bankName} ${typeName} ****${accountNumber}`;
  }

  return `${bankName} ${typeName}`;
}

/**
 * Detect account from CSV and transactions
 */
export function detectAccount(
  csvResult: CSVParseResult,
  transactions: ExtractedTransaction[],
  bankFormat: BankFormat,
  fileName?: string
): DetectedAccount {
  const bankName = BANK_NAME_MAP[bankFormat];
  const accountNumber = extractAccountNumber(csvResult, fileName);
  const accountType = detectAccountType(transactions);
  const initialBalance = calculateInitialBalance(transactions);
  const name = generateAccountName(bankFormat, accountType, accountNumber);

  // Get suggested color
  const suggestedColor = BANK_COLORS[bankFormat];

  // Get suggested icon based on account type
  const iconMap: Record<AccountType, string> = {
    SAVINGS: 'PiggyBank',
    CHECKING: 'Building',
    CREDIT_CARD: 'CreditCard',
    LOAN: 'TrendingUp',
    CASH: 'DollarSign',
    INVESTMENT: 'Wallet',
    OTHER: 'Wallet',
  };

  const suggestedIcon = iconMap[accountType];

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
 * Detect multiple accounts from CSV
 *
 * Some CSVs might contain multiple accounts
 * (rare, but Nequi sometimes exports this way)
 */
export function detectAccounts(
  csvResult: CSVParseResult,
  transactions: ExtractedTransaction[],
  bankFormat: BankFormat,
  fileName?: string
): DetectedAccount[] {
  // For now, assume single account per CSV
  // In Phase 4, we can enhance to detect multiple accounts

  const account = detectAccount(csvResult, transactions, bankFormat, fileName);

  return [account];
}
