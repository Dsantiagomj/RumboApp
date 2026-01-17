import { parse, isValid, parseISO } from 'date-fns';
import type { TransactionType } from '@prisma/client';
import type { CSVParseResult } from './csv-parser';
import type { BankFormatPattern } from './bank-format-detector';
import { getColumnIndices } from './bank-format-detector';

/**
 * Transaction Extractor for Colombian Banks
 *
 * Handles:
 * - Colombian date formats (DD/MM/YYYY, DD-MM-YYYY, etc.)
 * - Colombian currency (COP with . as thousands separator, , as decimal)
 * - Debit/Credit detection
 * - Transaction type classification
 */

export interface ExtractedTransaction {
  date: Date;
  description: string;
  amount: number;
  type: TransactionType;
  merchant?: string;
  balance?: number;
  rawData: Record<string, string>;
}

/**
 * Colombian date formats (most common first)
 */
const COLOMBIAN_DATE_FORMATS = [
  'dd/MM/yyyy', // 31/12/2023
  'dd-MM-yyyy', // 31-12-2023
  'dd/MM/yy', // 31/12/23
  'yyyy-MM-dd', // 2023-12-31 (ISO)
  'dd MMM yyyy', // 31 Dic 2023
  'dd.MM.yyyy', // 31.12.2023
];

/**
 * Parse Colombian date string
 */
function parseColombianDate(dateStr: string): Date | null {
  if (!dateStr) return null;

  const cleaned = dateStr.trim();

  // Try ISO format first
  const isoDate = parseISO(cleaned);
  if (isValid(isoDate)) {
    return isoDate;
  }

  // Try Colombian formats
  for (const format of COLOMBIAN_DATE_FORMATS) {
    try {
      const parsed = parse(cleaned, format, new Date());
      if (isValid(parsed)) {
        return parsed;
      }
    } catch {
      continue;
    }
  }

  return null;
}

/**
 * Parse Colombian currency string to number
 *
 * Colombian format:
 * - Thousands separator: . (dot)
 * - Decimal separator: , (comma)
 * - Examples: 1.234.567,89 = 1234567.89
 *
 * Also handles:
 * - $ symbols
 * - Negative amounts with - or ()
 * - No decimal part
 */
export function parseColombianCurrency(currencyStr: string): number | null {
  if (!currencyStr) return null;

  let cleaned = currencyStr.trim();

  // Remove currency symbols
  cleaned = cleaned.replace(/[$COP\s]/gi, '');

  // Handle negative amounts in parentheses: (1.234,56) -> -1.234,56
  const isNegativeParens = /^\(.*\)$/.test(cleaned);
  if (isNegativeParens) {
    cleaned = '-' + cleaned.replace(/[()]/g, '');
  }

  // Handle Colombian format: 1.234.567,89
  // 1. Remove thousand separators (dots)
  // 2. Replace decimal separator (comma) with dot
  const hasComma = cleaned.includes(',');
  const hasDot = cleaned.includes('.');

  if (hasComma && hasDot) {
    // Colombian format: 1.234.567,89
    cleaned = cleaned.replace(/\./g, ''); // Remove dots (thousands)
    cleaned = cleaned.replace(',', '.'); // Replace comma with dot (decimal)
  } else if (hasComma) {
    // Only comma: treat as decimal separator
    cleaned = cleaned.replace(',', '.');
  }
  // If only dots, assume US format (1.234.567 without decimal)

  // Parse as float
  const number = parseFloat(cleaned);

  return isNaN(number) ? null : number;
}

/**
 * Detect transaction type from amount and description
 */
function detectTransactionType(
  amount: number,
  description: string,
  debitColumn?: string,
  creditColumn?: string
): TransactionType {
  // If we have separate debit/credit columns
  if (debitColumn && creditColumn) {
    const debitAmount = parseColombianCurrency(debitColumn);
    const creditAmount = parseColombianCurrency(creditColumn);

    if (debitAmount && debitAmount > 0) return 'EXPENSE';
    if (creditAmount && creditAmount > 0) return 'INCOME';
  }

  // Otherwise, use amount sign
  if (amount < 0) return 'EXPENSE';
  if (amount > 0) return 'INCOME';

  // Check description keywords for transfers
  const lowerDesc = description.toLowerCase();
  if (
    lowerDesc.includes('transferencia') ||
    lowerDesc.includes('envío') ||
    lowerDesc.includes('recibido')
  ) {
    return 'TRANSFER';
  }

  return 'EXPENSE'; // Default
}

/**
 * Extract merchant from description
 *
 * Common patterns:
 * - "COMPRA EN EXITO CHAPINERO"
 * - "Pago a NETFLIX"
 * - "Transferencia a JUAN PEREZ"
 */
function extractMerchant(description: string): string | undefined {
  const lowerDesc = description.toLowerCase();

  // Remove common prefixes
  const prefixes = [
    'compra en ',
    'pago a ',
    'pago en ',
    'transferencia a ',
    'retiro en ',
    'consignación ',
  ];

  for (const prefix of prefixes) {
    if (lowerDesc.startsWith(prefix)) {
      return description.substring(prefix.length).trim();
    }
  }

  // If description has multiple words, take the main part
  const words = description.trim().split(/\s+/);
  if (words.length > 3) {
    // Take the significant words (skip first common word like "PAGO")
    return words.slice(1).join(' ');
  }

  return undefined;
}

/**
 * Extract transactions from CSV
 */
export function extractTransactions(
  csvResult: CSVParseResult,
  pattern?: BankFormatPattern
): ExtractedTransaction[] {
  const { headers, data } = csvResult;

  if (!headers) {
    throw new Error('CSV must have headers to extract transactions');
  }

  // Get column indices
  const indices = getColumnIndices(pattern, headers);

  const transactions: ExtractedTransaction[] = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];

    try {
      // Extract date
      const dateStr = row[indices.dateColumn];
      const date = parseColombianDate(dateStr);

      if (!date) {
        console.warn(`Row ${i + 1}: Invalid date "${dateStr}", skipping`);
        continue;
      }

      // Extract description
      const description = row[indices.descriptionColumn]?.trim() || 'Sin descripción';

      // Extract amount
      // Check if we have separate debit/credit columns
      let amount: number;
      let debitColumn: string | undefined;
      let creditColumn: string | undefined;

      // Look for debit/credit columns
      const debitIdx = headers.findIndex((h) => /d[eé]bito|cargo|retiro/i.test(h));
      const creditIdx = headers.findIndex((h) => /cr[eé]dito|abono|dep[oó]sito/i.test(h));

      if (debitIdx >= 0 && creditIdx >= 0) {
        // Separate columns
        debitColumn = row[debitIdx];
        creditColumn = row[creditIdx];

        const debit = parseColombianCurrency(debitColumn);
        const credit = parseColombianCurrency(creditColumn);

        // Debit is negative, credit is positive
        amount = (credit || 0) - (debit || 0);
      } else {
        // Single amount column
        const amountStr = row[indices.amountColumn];
        const parsedAmount = parseColombianCurrency(amountStr);

        if (parsedAmount === null) {
          console.warn(`Row ${i + 1}: Invalid amount "${amountStr}", skipping`);
          continue;
        }

        amount = parsedAmount;
      }

      // Extract balance if available
      let balance: number | undefined;
      if (indices.balanceColumn !== undefined) {
        const balanceStr = row[indices.balanceColumn];
        balance = parseColombianCurrency(balanceStr) || undefined;
      }

      // Detect type
      const type = detectTransactionType(amount, description, debitColumn, creditColumn);

      // Extract merchant
      const merchant = extractMerchant(description);

      // Build raw data object
      const rawData: Record<string, string> = {};
      headers.forEach((header, idx) => {
        rawData[header] = row[idx] || '';
      });

      transactions.push({
        date,
        description,
        amount: Math.abs(amount), // Always store as positive
        type,
        merchant,
        balance,
        rawData,
      });
    } catch (error) {
      console.error(`Row ${i + 1}: Error extracting transaction`, error);
      continue;
    }
  }

  return transactions;
}

/**
 * Validate extracted transactions
 */
export function validateTransactions(transactions: ExtractedTransaction[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (transactions.length === 0) {
    errors.push('No valid transactions found in CSV');
  }

  // Check for future dates
  const now = new Date();
  const futureDates = transactions.filter((t) => t.date > now);
  if (futureDates.length > 0) {
    errors.push(`${futureDates.length} transactions have future dates`);
  }

  // Check for zero amounts
  const zeroAmounts = transactions.filter((t) => t.amount === 0);
  if (zeroAmounts.length > 0) {
    console.warn(`${zeroAmounts.length} transactions have zero amounts`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
