/**
 * Type declarations for pdf-parse v1.x
 *
 * pdf-parse v1 doesn't have official TypeScript types,
 * so we declare them here for type safety.
 */

declare module 'pdf-parse' {
  interface PDFData {
    numpages: number;
    numrender: number;
    info: Record<string, unknown>;
    metadata: Record<string, unknown> | null;
    text: string;
    version: string;
  }

  interface PDFParseOptions {
    password?: string;
    pagerender?: (pageData: unknown) => string;
    max?: number;
  }

  // CommonJS module export
  function pdfParse(dataBuffer: Buffer, options?: PDFParseOptions): Promise<PDFData>;

  namespace pdfParse {
    export type { PDFData, PDFParseOptions };
  }

  export = pdfParse;
}
