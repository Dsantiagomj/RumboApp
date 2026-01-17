import Papa from 'papaparse';
import jschardet from 'jschardet';
import iconv from 'iconv-lite';

/**
 * CSV Parser with Encoding Detection
 *
 * Colombian banks use various encodings:
 * - Windows-1252 (Bancolombia, BBVA)
 * - UTF-8 (Nequi, digital banks)
 * - ISO-8859-1 (Banco de Bogotá, older systems)
 */

export interface CSVParseResult {
  data: string[][];
  encoding: string;
  rowCount: number;
  columnCount: number;
  headers?: string[];
}

export interface CSVParseOptions {
  hasHeaders?: boolean;
  skipEmptyLines?: boolean;
  trimValues?: boolean;
}

/**
 * Detect CSV file encoding using jschardet
 */
export function detectEncoding(buffer: Buffer): string {
  const detection = jschardet.detect(buffer);

  // Map detected encoding to iconv-lite compatible name
  const encoding = detection.encoding?.toLowerCase();

  if (!encoding) {
    return 'utf-8'; // Default fallback
  }

  // Handle common encoding aliases
  if (encoding.includes('windows-1252') || encoding.includes('cp1252')) {
    return 'windows-1252';
  }

  if (encoding.includes('iso-8859-1') || encoding.includes('latin1')) {
    return 'iso-8859-1';
  }

  if (encoding.includes('utf-8') || encoding.includes('utf8')) {
    return 'utf-8';
  }

  // Default to UTF-8 if unknown
  return 'utf-8';
}

/**
 * Convert buffer to string with detected encoding
 */
export function decodeBuffer(buffer: Buffer, encoding?: string): string {
  const detectedEncoding = encoding || detectEncoding(buffer);

  try {
    // Use iconv-lite for reliable encoding conversion
    return iconv.decode(buffer, detectedEncoding);
  } catch (error) {
    console.warn(`Failed to decode with ${detectedEncoding}, falling back to UTF-8`, error);
    return buffer.toString('utf-8');
  }
}

/**
 * Parse CSV file with encoding detection
 */
export function parseCSV(buffer: Buffer, options: CSVParseOptions = {}): CSVParseResult {
  const { hasHeaders = true, skipEmptyLines = true, trimValues = true } = options;

  // Detect and decode
  const encoding = detectEncoding(buffer);
  const csvText = decodeBuffer(buffer, encoding);

  // Parse with Papa Parse
  const parseResult = Papa.parse<string[]>(csvText, {
    header: false, // We'll handle headers separately
    skipEmptyLines,
    transform: trimValues ? (value) => value.trim() : undefined,
  });

  if (parseResult.errors.length > 0) {
    const errorMessages = parseResult.errors
      .slice(0, 3)
      .map((e) => `Row ${e.row}: ${e.message}`)
      .join('; ');

    throw new Error(`CSV parsing failed: ${errorMessages}`);
  }

  const data = parseResult.data;

  if (data.length === 0) {
    throw new Error('CSV file is empty');
  }

  // Extract headers if present
  let headers: string[] | undefined;
  let dataRows: string[][];

  if (hasHeaders && data.length > 0) {
    headers = data[0];
    dataRows = data.slice(1);
  } else {
    dataRows = data;
  }

  const columnCount = dataRows.length > 0 ? dataRows[0].length : 0;

  return {
    data: dataRows,
    encoding,
    rowCount: dataRows.length,
    columnCount,
    headers,
  };
}

/**
 * Validate CSV structure
 */
export function validateCSV(result: CSVParseResult): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check minimum rows
  if (result.rowCount === 0) {
    errors.push('CSV file contains no data rows');
  }

  // Check minimum columns (bank statements typically have 3-10 columns)
  if (result.columnCount < 3) {
    errors.push('CSV file has too few columns (minimum 3 expected)');
  }

  // Check for consistent column count
  const inconsistentRows = result.data.filter((row) => row.length !== result.columnCount);

  if (inconsistentRows.length > 0) {
    errors.push(`${inconsistentRows.length} rows have inconsistent column count`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get CSV sample (first N rows) for preview
 */
export function getCSVSample(result: CSVParseResult, sampleSize: number = 5): string[][] {
  return result.data.slice(0, sampleSize);
}
