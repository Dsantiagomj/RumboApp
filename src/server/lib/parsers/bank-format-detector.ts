import type { BankFormat } from '@prisma/client';
import type { CSVParseResult } from './csv-parser';

/**
 * Bank Format Detection
 *
 * Identifies Colombian bank CSV format by analyzing:
 * 1. Header patterns (column names)
 * 2. Column count and order
 * 3. Date format patterns
 * 4. Currency symbols
 */

export interface BankFormatPattern {
  format: BankFormat;
  headerPatterns: string[]; // Regex patterns to match headers
  columnCount: number | { min: number; max: number };
  dateColumnIndex?: number;
  amountColumnIndex?: number;
  descriptionColumnIndex?: number;
  confidence: number; // 0-1
}

/**
 * Colombian Bank Format Patterns
 */
const BANK_PATTERNS: BankFormatPattern[] = [
  // Bancolombia
  {
    format: 'BANCOLOMBIA',
    headerPatterns: ['fecha.*transacción', 'descripción', 'valor', 'saldo', 'sucursal'],
    columnCount: { min: 5, max: 8 },
    dateColumnIndex: 0,
    amountColumnIndex: 2,
    descriptionColumnIndex: 1,
    confidence: 0,
  },
  // Nequi
  {
    format: 'NEQUI',
    headerPatterns: ['fecha', 'hora', 'concepto', 'monto', 'tipo.*movimiento'],
    columnCount: { min: 5, max: 7 },
    dateColumnIndex: 0,
    amountColumnIndex: 3,
    descriptionColumnIndex: 2,
    confidence: 0,
  },
  // Davivienda
  {
    format: 'DAVIVIENDA',
    headerPatterns: ['fecha', 'descripción.*transacción', 'débito', 'crédito', 'saldo'],
    columnCount: { min: 5, max: 8 },
    dateColumnIndex: 0,
    amountColumnIndex: 2,
    descriptionColumnIndex: 1,
    confidence: 0,
  },
  // BBVA
  {
    format: 'BBVA',
    headerPatterns: ['fecha.*operación', 'fecha.*valor', 'concepto', 'cargo', 'abono', 'saldo'],
    columnCount: { min: 6, max: 9 },
    dateColumnIndex: 0,
    amountColumnIndex: 3,
    descriptionColumnIndex: 2,
    confidence: 0,
  },
  // Banco de Bogotá
  {
    format: 'BANCO_BOGOTA',
    headerPatterns: ['fecha', 'detalle', 'débitos', 'créditos', 'saldo'],
    columnCount: { min: 5, max: 7 },
    dateColumnIndex: 0,
    amountColumnIndex: 2,
    descriptionColumnIndex: 1,
    confidence: 0,
  },
];

/**
 * Normalize header for comparison
 */
function normalizeHeader(header: string): string {
  return header
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]/g, '') // Remove special chars
    .trim();
}

/**
 * Check if header matches pattern
 */
function matchesPattern(header: string, pattern: string): boolean {
  const normalizedHeader = normalizeHeader(header);
  const normalizedPattern = normalizeHeader(pattern);

  // Convert pattern wildcards to regex
  const regexPattern = normalizedPattern
    .replace(/\.\*/g, '.*') // Keep .* as regex wildcard
    .replace(/\*/g, '.*'); // Convert * to .*

  const regex = new RegExp(regexPattern, 'i');
  return regex.test(normalizedHeader);
}

/**
 * Calculate confidence score for a bank format
 */
function calculateConfidence(csvResult: CSVParseResult, pattern: BankFormatPattern): number {
  if (!csvResult.headers) {
    return 0;
  }

  let matchedPatterns = 0;
  const headers = csvResult.headers;

  // Check header pattern matches
  for (const patternStr of pattern.headerPatterns) {
    const matches = headers.some((header) => matchesPattern(header, patternStr));
    if (matches) {
      matchedPatterns++;
    }
  }

  const headerScore = matchedPatterns / pattern.headerPatterns.length;

  // Check column count
  let columnScore = 0;
  if (typeof pattern.columnCount === 'number') {
    columnScore = csvResult.columnCount === pattern.columnCount ? 1 : 0;
  } else {
    const { min, max } = pattern.columnCount;
    columnScore = csvResult.columnCount >= min && csvResult.columnCount <= max ? 1 : 0;
  }

  // Weighted average (headers are more important)
  return headerScore * 0.7 + columnScore * 0.3;
}

/**
 * Detect bank format from CSV
 */
export function detectBankFormat(csvResult: CSVParseResult): {
  format: BankFormat;
  confidence: number;
  detectedPattern?: BankFormatPattern;
} {
  // Calculate confidence for each pattern
  const scores = BANK_PATTERNS.map((pattern) => ({
    pattern,
    confidence: calculateConfidence(csvResult, pattern),
  }));

  // Sort by confidence (highest first)
  scores.sort((a, b) => b.confidence - a.confidence);

  const best = scores[0];

  // If confidence is too low, return GENERIC
  if (best.confidence < 0.4) {
    return {
      format: 'GENERIC',
      confidence: 0.3,
    };
  }

  return {
    format: best.pattern.format,
    confidence: best.confidence,
    detectedPattern: best.pattern,
  };
}

/**
 * Get column indices for a detected bank format
 */
export function getColumnIndices(
  pattern: BankFormatPattern | undefined,
  headers: string[]
): {
  dateColumn: number;
  descriptionColumn: number;
  amountColumn: number;
  balanceColumn?: number;
} {
  if (!pattern) {
    // Generic fallback: assume first columns are date, description, amount
    return {
      dateColumn: 0,
      descriptionColumn: 1,
      amountColumn: 2,
    };
  }

  // Use pattern's indices as hints, verify with headers
  const dateColumn = pattern.dateColumnIndex ?? 0;
  const descriptionColumn = pattern.descriptionColumnIndex ?? 1;
  const amountColumn = pattern.amountColumnIndex ?? 2;

  // Try to find balance column
  let balanceColumn: number | undefined;
  const balanceHeaderPatterns = ['saldo', 'balance'];

  for (let i = 0; i < headers.length; i++) {
    const normalized = normalizeHeader(headers[i]);
    if (balanceHeaderPatterns.some((p) => normalized.includes(p))) {
      balanceColumn = i;
      break;
    }
  }

  return {
    dateColumn,
    descriptionColumn,
    amountColumn,
    balanceColumn,
  };
}

/**
 * Validate detected format
 */
export function validateBankFormat(
  csvResult: CSVParseResult,
  format: BankFormat
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check if we have headers
  if (!csvResult.headers) {
    errors.push('CSV file must have headers');
  }

  // Check minimum data rows
  if (csvResult.rowCount < 1) {
    errors.push('CSV file must have at least one transaction row');
  }

  // Format-specific validations
  if (format !== 'GENERIC') {
    const pattern = BANK_PATTERNS.find((p) => p.format === format);
    if (pattern) {
      // Validate column count
      if (typeof pattern.columnCount === 'number') {
        if (csvResult.columnCount !== pattern.columnCount) {
          errors.push(
            `Expected ${pattern.columnCount} columns for ${format}, found ${csvResult.columnCount}`
          );
        }
      } else {
        const { min, max } = pattern.columnCount;
        if (csvResult.columnCount < min || csvResult.columnCount > max) {
          errors.push(
            `Expected ${min}-${max} columns for ${format}, found ${csvResult.columnCount}`
          );
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
