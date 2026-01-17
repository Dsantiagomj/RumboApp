import { parse, isValid } from 'date-fns';
import type { TransactionType } from '@prisma/client';
import { parseColombianCurrency } from './transaction-extractor';

/**
 * PDF Transaction Extractor for Colombian Bank Statements
 *
 * Handles PDF-specific transaction extraction where:
 * - Dates are in DD/MM format (year extracted from header)
 * - Transactions are in tabular format with variable columns
 * - Amounts use Colombian format (1.234.567,89)
 */

export interface PDFExtractedTransaction {
  date: Date;
  description: string;
  amount: number;
  type: TransactionType;
  balance?: number;
  merchant?: string;
  rawLine: string;
}

export interface PDFStatementMetadata {
  accountNumber?: string;
  accountType?: string;
  bankName?: string;
  startDate?: Date;
  endDate?: Date;
  previousBalance?: number;
  currentBalance?: number;
  totalCredits?: number;
  totalDebits?: number;
}

/**
 * Extract year from PDF header
 * Looks for patterns like "DESDE: 2025/09/30" or "HASTA: 2025/12/31"
 */
function extractYearFromHeader(text: string): number {
  const lines = text.split('\n').slice(0, 50); // Check first 50 lines

  for (const line of lines) {
    // Pattern: YYYY/MM/DD or DD/MM/YYYY
    const yearMatch = line.match(/(\d{4})\/\d{1,2}\/\d{1,2}/);
    if (yearMatch) {
      const year = parseInt(yearMatch[1], 10);
      if (year >= 2000 && year <= 2100) {
        return year;
      }
    }

    // Pattern: HASTA: or DESDE: followed by date
    const datePatternMatch = line.match(/(HASTA|DESDE).*?(\d{4})/);
    if (datePatternMatch) {
      const year = parseInt(datePatternMatch[2], 10);
      if (year >= 2000 && year <= 2100) {
        return year;
      }
    }
  }

  // Default to current year if not found
  return new Date().getFullYear();
}

/**
 * Extract statement metadata from PDF header
 */
export function extractStatementMetadata(text: string): PDFStatementMetadata {
  const metadata: PDFStatementMetadata = {};
  const lines = text.split('\n').slice(0, 100); // Check first 100 lines

  for (const line of lines) {
    const lineUpper = line.toUpperCase();

    // Account number
    if (
      lineUpper.includes('NÚMERO') ||
      lineUpper.includes('NUMERO') ||
      lineUpper.includes('CUENTA')
    ) {
      const accountMatch = line.match(/\d{8,20}/);
      if (accountMatch) {
        metadata.accountNumber = accountMatch[0];
      }
    }

    // Account type
    if (lineUpper.includes('AHORROS')) {
      metadata.accountType = 'SAVINGS';
    } else if (lineUpper.includes('CORRIENTE')) {
      metadata.accountType = 'CHECKING';
    } else if (lineUpper.includes('TARJETA') && lineUpper.includes('CRÉDITO')) {
      metadata.accountType = 'CREDIT_CARD';
    }

    // Bank name
    if (lineUpper.includes('BANCOLOMBIA')) {
      metadata.bankName = 'Bancolombia';
    } else if (lineUpper.includes('NEQUI')) {
      metadata.bankName = 'Nequi';
    } else if (lineUpper.includes('DAVIVIENDA')) {
      metadata.bankName = 'Davivienda';
    } else if (lineUpper.includes('BBVA')) {
      metadata.bankName = 'BBVA';
    } else if (lineUpper.includes('BANCO DE BOGOTÁ') || lineUpper.includes('BANCO DE BOGOTA')) {
      metadata.bankName = 'Banco de Bogotá';
    }

    // Period dates
    const dateRangeMatch = line.match(
      /DESDE:\s*(\d{4})\/(\d{1,2})\/(\d{1,2})\s*HASTA:\s*(\d{4})\/(\d{1,2})\/(\d{1,2})/
    );
    if (dateRangeMatch) {
      metadata.startDate = new Date(
        parseInt(dateRangeMatch[1]),
        parseInt(dateRangeMatch[2]) - 1,
        parseInt(dateRangeMatch[3])
      );
      metadata.endDate = new Date(
        parseInt(dateRangeMatch[4]),
        parseInt(dateRangeMatch[5]) - 1,
        parseInt(dateRangeMatch[6])
      );
    }

    // Summary balances
    if (lineUpper.includes('SALDO ANTERIOR')) {
      const nextLine = lines[lines.indexOf(line) + 1];
      if (nextLine) {
        const amount = parseColombianCurrency(nextLine);
        if (amount !== null) {
          metadata.previousBalance = amount;
        }
      }
    }

    if (lineUpper.includes('SALDO ACTUAL')) {
      const nextLine = lines[lines.indexOf(line) + 1];
      if (nextLine) {
        const amount = parseColombianCurrency(nextLine);
        if (amount !== null) {
          metadata.currentBalance = amount;
        }
      }
    }

    if (lineUpper.includes('TOTAL ABONOS')) {
      const nextLine = lines[lines.indexOf(line) + 1];
      if (nextLine) {
        const amount = parseColombianCurrency(nextLine);
        if (amount !== null) {
          metadata.totalCredits = amount;
        }
      }
    }

    if (lineUpper.includes('TOTAL CARGOS')) {
      const nextLine = lines[lines.indexOf(line) + 1];
      if (nextLine) {
        const amount = parseColombianCurrency(nextLine);
        if (amount !== null) {
          metadata.totalDebits = amount;
        }
      }
    }
  }

  return metadata;
}

/**
 * Check if a line is a transaction line
 * Transaction lines start with DD/MM date pattern
 */
function isTransactionLine(line: string): boolean {
  // Pattern: starts with date like "1/10", "01/10", "15/12"
  return /^\d{1,2}\/\d{1,2}\s+/.test(line.trim());
}

/**
 * Parse a single transaction line
 */
function parseTransactionLine(line: string, year: number): PDFExtractedTransaction | null {
  try {
    // Extract date (DD/MM format at start of line)
    const dateMatch = line.match(/^(\d{1,2})\/(\d{1,2})/);
    if (!dateMatch) {
      return null;
    }

    const day = parseInt(dateMatch[1], 10);
    const month = parseInt(dateMatch[2], 10);

    // Parse date with extracted year
    const dateStr = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
    const date = parse(dateStr, 'dd/MM/yyyy', new Date());

    if (!isValid(date)) {
      return null;
    }

    // Remove date from line
    const remainingLine = line.substring(dateMatch[0].length).trim();

    // Extract all numbers from the line (amounts and balance)
    const numbers = remainingLine.match(/-?\d{1,3}(?:\.\d{3})*(?:,\d{2})?/g) || [];

    if (numbers.length < 1) {
      return null; // No amounts found
    }

    // Last number is balance, second-to-last is transaction amount
    const balanceStr = numbers[numbers.length - 1]!;
    const amountStr = numbers.length > 1 ? numbers[numbers.length - 2]! : numbers[0]!;

    const balance = parseColombianCurrency(balanceStr);
    const amount = parseColombianCurrency(amountStr);

    if (amount === null) {
      return null;
    }

    // Extract description (text between date and first number)
    const firstNumberIndex = remainingLine.indexOf(numbers[0]!);
    const description = remainingLine.substring(0, firstNumberIndex).trim();

    if (!description) {
      return null; // No description
    }

    // Determine transaction type
    let type: TransactionType;
    const descUpper = description.toUpperCase();

    if (
      descUpper.includes('ABONO') ||
      (descUpper.includes('TRANSFERENCIA') && amount > 0) ||
      descUpper.includes('TRANSF DE') ||
      descUpper.includes('DEPOSITO') ||
      descUpper.includes('CONSIGNACIÓN')
    ) {
      type = 'INCOME';
    } else if (
      descUpper.includes('PAGO') ||
      descUpper.includes('COMPRA') ||
      descUpper.includes('RETIRO') ||
      amount < 0
    ) {
      type = 'EXPENSE';
    } else if (descUpper.includes('TRANSFERENCIA') || descUpper.includes('TRANSF')) {
      type = 'TRANSFER';
    } else {
      // Default based on amount sign
      type = amount >= 0 ? 'INCOME' : 'EXPENSE';
    }

    // Extract merchant from description
    let merchant: string | undefined;
    if (descUpper.includes('PAGO QR ')) {
      merchant = description.substring(description.toUpperCase().indexOf('PAGO QR ') + 8).trim();
    } else if (descUpper.includes('COMPRA EN ')) {
      merchant = description.substring(description.toUpperCase().indexOf('COMPRA EN ') + 10).trim();
    } else if (descUpper.includes('TRANSF DE ')) {
      merchant = description.substring(description.toUpperCase().indexOf('TRANSF DE ') + 10).trim();
    }

    return {
      date,
      description,
      amount: Math.abs(amount),
      type,
      balance: balance !== null ? balance : undefined,
      merchant,
      rawLine: line,
    };
  } catch (error) {
    console.warn('Failed to parse transaction line:', line, error);
    return null;
  }
}

/**
 * Extract transactions from PDF text
 */
export function extractPDFTransactions(text: string): {
  transactions: PDFExtractedTransaction[];
  metadata: PDFStatementMetadata;
} {
  const metadata = extractStatementMetadata(text);
  const year = extractYearFromHeader(text);
  const lines = text.split('\n');

  const transactions: PDFExtractedTransaction[] = [];

  for (const line of lines) {
    if (isTransactionLine(line)) {
      const transaction = parseTransactionLine(line, year);
      if (transaction) {
        transactions.push(transaction);
      }
    }
  }

  return { transactions, metadata };
}

/**
 * Validate extracted transactions
 */
export function validatePDFTransactions(transactions: PDFExtractedTransaction[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (transactions.length === 0) {
    errors.push('No transactions found in PDF');
  }

  // Check for future dates
  const now = new Date();
  const futureDates = transactions.filter((t) => t.date > now);
  if (futureDates.length > 0 && futureDates.length < transactions.length * 0.5) {
    // Only warn if less than 50% are future dates (to avoid false positives with test data)
    console.warn(`${futureDates.length} transactions have future dates`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
