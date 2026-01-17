/**
 * PDF Parser
 *
 * Extracts text from PDF files with password support
 * Uses pdf-parse v1 for text extraction (stable in Node.js)
 */

export interface PDFParseResult {
  text: string;
  pages?: number;
  metadata?: Record<string, unknown>;
}

export interface PDFParseOptions {
  password?: string;
}

/**
 * Parse PDF file and extract text
 */
export async function parsePDF(
  buffer: Buffer,
  options: PDFParseOptions = {}
): Promise<PDFParseResult> {
  try {
    // Dynamic import for pdf-parse v1
    const pdfParse = (await import('pdf-parse')).default;

    // Parse PDF with optional password
    const parseOptions = options.password ? { password: options.password } : {};
    const result = await pdfParse(buffer, parseOptions);

    return {
      text: result.text,
      pages: result.numpages,
      metadata: result.info,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('password') || error.message.includes('encrypted')) {
        throw new Error('PDF is password-protected. Please provide the correct password.');
      }
      throw new Error(`Failed to parse PDF: ${error.message}`);
    }
    throw new Error('Failed to parse PDF: Unknown error');
  }
}

/**
 * Validate PDF structure
 */
export function validatePDF(result: PDFParseResult): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check if text was extracted
  if (!result.text || result.text.trim().length === 0) {
    errors.push('No text content found in PDF');
  }

  // Check minimum text length (bank statements should have substantial text)
  if (result.text && result.text.length < 100) {
    errors.push('PDF text content is too short (may be a scanned image requiring OCR)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Extract lines from PDF text
 */
export function extractLines(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/**
 * Check if PDF contains transaction data
 */
export function hasTransactionData(text: string): boolean {
  const textUpper = text.toUpperCase();

  // Check for common Colombian bank statement keywords
  const keywords = [
    'FECHA',
    'DESCRIPCIÓN',
    'DESCRIPCION',
    'VALOR',
    'SALDO',
    'ABONO',
    'CARGO',
    'TRANSACCIÓN',
    'TRANSACCION',
    'EXTRACTO',
    'ESTADO DE CUENTA',
  ];

  return keywords.some((keyword) => textUpper.includes(keyword));
}
