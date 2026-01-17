/**
 * PDF Parser
 *
 * Extracts text from PDF files with password support
 * Uses pdf-parse v2 for text extraction
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
    // Dynamic import for pdf-parse v2
    const { PDFParse } = await import('pdf-parse');

    // Create parser with buffer and optional password
    const parser = new PDFParse({
      data: buffer,
      password: options.password,
    });

    // Extract text
    const result = await parser.getText();

    return {
      text: result.text,
      pages: (result as { numPages?: number }).numPages,
      metadata: (result as { metadata?: Record<string, unknown> }).metadata,
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
