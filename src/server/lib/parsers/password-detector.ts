import Papa from 'papaparse';

// Type for pdf-parse function (CommonJS module)
type PdfParseFunction = (
  buffer: Buffer,
  options?: { password?: string }
) => Promise<{ text: string; [key: string]: unknown }>;

// Lazy-load pdf-parse (CommonJS module without proper ESM support)
let pdfParseModule: PdfParseFunction | null = null;
async function getPdfParse(): Promise<PdfParseFunction> {
  if (!pdfParseModule) {
    // Use dynamic import to load CommonJS module
    const module = await import('pdf-parse');
    // pdf-parse is a CommonJS module, handle both default and module exports
    pdfParseModule =
      typeof module === 'function'
        ? (module as unknown as PdfParseFunction)
        : ((module as Record<string, unknown>).default as unknown as PdfParseFunction) ||
          (module as unknown as PdfParseFunction);
  }
  return pdfParseModule;
}

/**
 * Detects if a CSV or PDF file is password-protected.
 *
 * @param buffer - The file buffer to check
 * @param fileType - The type of file ('CSV' or 'PDF')
 * @returns Promise<boolean> - True if password-protected, false otherwise
 * @throws Error if file is corrupted or invalid format
 */
export async function isPasswordProtected(
  buffer: Buffer,
  fileType: 'CSV' | 'PDF'
): Promise<boolean> {
  try {
    if (fileType === 'CSV') {
      return await isCSVPasswordProtected(buffer);
    } else if (fileType === 'PDF') {
      return await isPDFPasswordProtected(buffer);
    } else {
      throw new Error(`Tipo de archivo no soportado: ${fileType}`);
    }
  } catch (error) {
    // Re-throw password detection errors with descriptive messages
    if (error instanceof Error) {
      if (error.message.includes('password') || error.message.includes('encrypted')) {
        return true;
      }
      throw new Error(`Error al detectar protección de contraseña: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Checks if a CSV file is password-protected or encrypted.
 * Colombian banks may use various encryption methods, so we try to parse and detect encoding errors.
 */
async function isCSVPasswordProtected(buffer: Buffer): Promise<boolean> {
  try {
    const content = buffer.toString('utf-8');

    // Check if the content looks like binary/encrypted data
    // Encrypted files often contain non-printable characters
    const printableChars = content.match(/[\x20-\x7E\n\r\t]/g);
    const totalChars = content.length;

    if (printableChars) {
      const printableRatio = printableChars.length / totalChars;

      // If less than 80% of characters are printable, likely encrypted
      if (printableRatio < 0.8) {
        return true;
      }
    }

    // Try parsing with papaparse
    return new Promise((resolve) => {
      Papa.parse(content, {
        preview: 10, // Only parse first 10 rows to check validity
        error: (error: Error) => {
          // If we get a parsing error, check if it's encoding-related
          if (
            error.message.includes('encoding') ||
            error.message.includes('invalid') ||
            error.message.includes('malformed')
          ) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        complete: (results) => {
          // Successfully parsed - not password protected
          // But check if the data looks valid
          if (results.errors && results.errors.length > 0) {
            const hasEncodingError = results.errors.some(
              (err) => err.message.includes('encoding') || err.message.includes('invalid')
            );
            resolve(hasEncodingError);
          } else {
            resolve(false);
          }
        },
      });
    });
  } catch (error) {
    if (error instanceof Error) {
      // Encoding errors usually indicate encryption
      if (error.message.includes('encoding') || error.message.includes('invalid character')) {
        return true;
      }
      throw new Error(`Error al leer archivo CSV: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Checks if a PDF file is password-protected/encrypted.
 */
async function isPDFPasswordProtected(buffer: Buffer): Promise<boolean> {
  try {
    // Attempt to parse the PDF without a password
    await (
      await getPdfParse()
    )(buffer);
    // If successful, the PDF is not password-protected
    return false;
  } catch (error) {
    if (error instanceof Error) {
      // Check for common encryption/password error messages from pdf-parse
      const errorMsg = error.message.toLowerCase();
      if (
        errorMsg.includes('password') ||
        errorMsg.includes('encrypted') ||
        errorMsg.includes('encryption') ||
        errorMsg.includes('decrypt') ||
        errorMsg.includes('authentication')
      ) {
        return true;
      }

      // Check for invalid PDF errors (corrupted files)
      if (
        errorMsg.includes('invalid pdf') ||
        errorMsg.includes('corrupted') ||
        errorMsg.includes('malformed')
      ) {
        throw new Error('El archivo PDF está corrupto o tiene un formato inválido');
      }

      throw new Error(`Error al leer archivo PDF: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Decrypts a password-protected file.
 *
 * @param buffer - The encrypted file buffer
 * @param password - The password to decrypt the file
 * @param fileType - The type of file ('CSV' or 'PDF')
 * @returns Promise<Buffer> - Decrypted file content as a Buffer
 * @throws Error if password is incorrect or decryption fails
 */
export async function decryptFile(
  buffer: Buffer,
  password: string,
  fileType: 'CSV' | 'PDF'
): Promise<Buffer> {
  try {
    if (fileType === 'PDF') {
      return await decryptPDF(buffer, password);
    } else if (fileType === 'CSV') {
      return await decryptCSV(buffer, password);
    } else {
      throw new Error(`Tipo de archivo no soportado: ${fileType}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      // Re-throw with more descriptive error messages
      const errorMsg = error.message.toLowerCase();

      if (
        errorMsg.includes('password') ||
        errorMsg.includes('incorrect') ||
        errorMsg.includes('authentication failed')
      ) {
        throw new Error('Contraseña incorrecta. Por favor, verifica e intenta nuevamente.');
      }

      if (errorMsg.includes('corrupted') || errorMsg.includes('invalid')) {
        throw new Error('El archivo está corrupto o tiene un formato inválido');
      }

      throw error;
    }
    throw error;
  }
}

/**
 * Decrypts a password-protected PDF file.
 */
async function decryptPDF(buffer: Buffer, password: string): Promise<Buffer> {
  try {
    // Parse the PDF with the provided password
    const data = await (await getPdfParse())(buffer, { password });

    if (!data.text) {
      throw new Error('No se pudo extraer el contenido del PDF');
    }

    // Return the extracted text as a Buffer
    // Note: This returns the text content, not a decrypted PDF buffer
    // If you need the actual PDF structure, additional processing would be required
    return Buffer.from(data.text, 'utf-8');
  } catch (error) {
    if (error instanceof Error) {
      const errorMsg = error.message.toLowerCase();

      if (
        errorMsg.includes('password') ||
        errorMsg.includes('decrypt') ||
        errorMsg.includes('authentication')
      ) {
        throw new Error('Contraseña incorrecta para el archivo PDF');
      }

      throw new Error(`Error al desencriptar archivo PDF: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Placeholder implementation for decrypting CSV files.
 * Colombian banks use various encryption methods, so this would need to be
 * implemented based on the specific bank's encryption method.
 *
 * Common methods might include:
 * - ZIP encryption (password-protected ZIP files containing CSV)
 * - Custom encryption algorithms
 * - Excel password-protected files exported as CSV
 *
 * @throws Error indicating that CSV decryption is not yet implemented
 */
async function decryptCSV(_buffer: Buffer, _password: string): Promise<Buffer> {
  // Placeholder implementation
  // This would need to be implemented based on the specific encryption method
  // used by Colombian banks

  throw new Error(
    'La desencriptación de archivos CSV aún no está implementada. ' +
      'Los bancos colombianos utilizan varios métodos de encriptación que requieren ' +
      'implementaciones específicas. Por favor, contacta al soporte técnico.'
  );
}
