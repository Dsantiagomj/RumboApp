/**
 * CSV Parser Index
 *
 * Central export point for all CSV parsing utilities
 */

// CSV Parser
export { parseCSV, validateCSV, detectEncoding, decodeBuffer, getCSVSample } from './csv-parser';
export type { CSVParseResult, CSVParseOptions } from './csv-parser';

// Bank Format Detector
export { detectBankFormat, getColumnIndices, validateBankFormat } from './bank-format-detector';
export type { BankFormatPattern } from './bank-format-detector';

// Transaction Extractor
export {
  extractTransactions,
  validateTransactions,
  parseColombianCurrency,
} from './transaction-extractor';
export type { ExtractedTransaction } from './transaction-extractor';

// Account Detector
export { detectAccount, detectAccounts } from './account-detector';
export type { DetectedAccount } from './account-detector';

// TEMPORARILY DISABLED: PDF parsing moved to client-side
// // Password Detector
// export { isPasswordProtected, decryptFile } from './password-detector';
//
// // PDF Parser
// export { parsePDF, validatePDF, extractLines, hasTransactionData } from './pdf-parser';
// export type { PDFParseResult, PDFParseOptions } from './pdf-parser';
//
// // PDF Transaction Extractor
// export {
//   extractPDFTransactions,
//   validatePDFTransactions,
//   extractStatementMetadata,
// } from './pdf-transaction-extractor';
// export type { PDFExtractedTransaction, PDFStatementMetadata } from './pdf-transaction-extractor';
//
// // PDF Account Detector
// export { detectPDFAccount, detectPDFBankFormat } from './pdf-account-detector';
