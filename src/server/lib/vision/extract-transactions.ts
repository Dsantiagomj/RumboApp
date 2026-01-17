/**
 * Vision API Service for Transaction Extraction
 *
 * Uses GPT-4 Vision to extract transactions from bank statement images
 * Handles Colombian bank formats and date/currency conventions
 */

import OpenAI from 'openai';
import type { ChatCompletionContentPart } from 'openai/resources/chat/completions';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ExtractedAccount {
  name: string;
  bankName?: string;
  accountNumber?: string;
  accountType: 'SAVINGS' | 'CHECKING' | 'CREDIT_CARD' | 'LOAN' | 'CASH' | 'INVESTMENT' | 'OTHER';
  initialBalance: number;
  currency: string;
}

export interface ExtractedTransaction {
  date: string; // ISO 8601 format
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  merchant?: string;
  category?: string;
  rawData?: Record<string, unknown>;
}

export interface VisionExtractionResult {
  accounts: ExtractedAccount[];
  transactions: ExtractedTransaction[];
  confidence: number; // 0-100
  warnings?: string[];
}

/**
 * System prompt for vision API
 * Instructs the model on how to extract data from Colombian bank statements
 */
const VISION_SYSTEM_PROMPT = `You are an expert at extracting transaction data from Colombian bank statements.

IMPORTANT RULES:
1. Dates: Colombian format is DD/MM/YYYY or DD-MM-YYYY. Convert to ISO 8601 (YYYY-MM-DD).
2. Currency: Colombian Peso (COP). Format: $1.234.567 or $1,234,567
   - Thousands separator: . (dot) or , (comma)
   - Decimal separator: , (comma) or . (dot)
3. Transaction types:
   - INCOME: deposits, transfers in, salary, refunds
   - EXPENSE: withdrawals, purchases, payments, transfers out
4. Account types:
   - SAVINGS: Cuenta de Ahorros
   - CHECKING: Cuenta Corriente
   - CREDIT_CARD: Tarjeta de Crédito
   - LOAN: Préstamo, Crédito de Libranza

OUTPUT FORMAT (JSON only, no markdown):
{
  "accounts": [{
    "name": "Account name from statement",
    "bankName": "Bank name (Bancolombia, Nequi, Davivienda, etc.)",
    "accountNumber": "Last 4 digits if visible",
    "accountType": "SAVINGS|CHECKING|CREDIT_CARD|LOAN|etc",
    "initialBalance": 0,
    "currency": "COP"
  }],
  "transactions": [{
    "date": "YYYY-MM-DD",
    "description": "Original description from statement",
    "amount": 150000,
    "type": "INCOME|EXPENSE",
    "merchant": "Extracted merchant name if identifiable",
    "rawData": { "originalText": "..." }
  }],
  "confidence": 85,
  "warnings": ["Warning messages if any data is unclear"]
}

EXAMPLES:
- "31/12/2023 COMPRA EXITO $-150.000" → date: "2023-12-31", amount: 150000, type: "EXPENSE", merchant: "EXITO"
- "01-01-2024 CONSIGNACION $500.000" → date: "2024-01-01", amount: 500000, type: "INCOME"
- "15/06/2023 RETIRO CAJERO ATM $-200.000,50" → date: "2023-06-23", amount: 200000.5, type: "EXPENSE"

If the image is unclear or not a bank statement, return:
{
  "accounts": [],
  "transactions": [],
  "confidence": 0,
  "warnings": ["Image does not appear to be a bank statement"]
}`;

/**
 * Extract transactions from bank statement image
 */
export async function extractTransactionsFromImage(
  imageBuffer: Buffer,
  mimeType: string
): Promise<VisionExtractionResult> {
  try {
    // Convert buffer to base64
    const base64Image = imageBuffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Image}`;

    // Call GPT-4 Vision
    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // gpt-4o has vision capabilities
      messages: [
        {
          role: 'system',
          content: VISION_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Extract all accounts and transactions from this Colombian bank statement image. Return valid JSON only.',
            },
            {
              type: 'image_url',
              image_url: {
                url: dataUrl,
                detail: 'high', // High detail for better OCR
              },
            },
          ],
        },
      ],
      max_tokens: 4096,
      temperature: 0.1, // Low temperature for consistent extraction
      response_format: { type: 'json_object' }, // Ensure JSON response
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from vision API');
    }

    // Parse JSON response
    const result = JSON.parse(content) as VisionExtractionResult;

    // Validate result structure
    if (!result.accounts || !result.transactions) {
      throw new Error('Invalid response format from vision API');
    }

    // Add confidence based on token usage (heuristic)
    if (result.confidence === undefined) {
      result.confidence = result.transactions.length > 0 ? 75 : 0;
    }

    return result;
  } catch (error) {
    console.error('Vision API extraction error:', error);

    // Return empty result with error
    return {
      accounts: [],
      transactions: [],
      confidence: 0,
      warnings: [error instanceof Error ? error.message : 'Unknown error during extraction'],
    };
  }
}

/**
 * Extract transactions from multiple bank statement images (multi-page PDF)
 * Processes all images in a single Vision API call for better context and efficiency
 */
export async function extractTransactionsFromImages(
  base64Images: string[]
): Promise<VisionExtractionResult> {
  try {
    if (base64Images.length === 0) {
      throw new Error('No images provided');
    }

    // Build content array with prompt + all images
    const content: ChatCompletionContentPart[] = [
      {
        type: 'text',
        text: `Extract all accounts and transactions from this Colombian bank statement.

IMPORTANT: This statement has ${base64Images.length} page(s). Analyze ALL pages and extract ALL transactions from every page.
DO NOT omit any transactions - include everything you see across all pages in a single combined list.

Return valid JSON only.`,
      },
    ];

    // Add all images
    for (const base64Image of base64Images) {
      content.push({
        type: 'image_url',
        image_url: {
          url: `data:image/png;base64,${base64Image}`,
          detail: 'high', // High detail for better OCR
        },
      });
    }

    // Call GPT-4 Vision with all images
    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // gpt-4o has vision capabilities
      messages: [
        {
          role: 'system',
          content: VISION_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content,
        },
      ],
      max_tokens: 16384, // Increased for multi-page PDFs with many transactions
      temperature: 0.1, // Low temperature for consistent extraction
      response_format: { type: 'json_object' }, // Ensure JSON response
    });

    const responseContent = response.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No response from vision API');
    }

    // Parse JSON response
    const result = JSON.parse(responseContent) as VisionExtractionResult;

    // Validate result structure
    if (!result.accounts || !result.transactions) {
      throw new Error('Invalid response format from vision API');
    }

    // Add confidence based on token usage (heuristic)
    if (result.confidence === undefined) {
      result.confidence = result.transactions.length > 0 ? 75 : 0;
    }

    // Log extraction result (intentional production log for monitoring)
    console.error(
      `[Vision API] Extracted ${result.transactions.length} transactions from ${base64Images.length} page(s)`
    );

    return result;
  } catch (error) {
    console.error('Vision API extraction error:', error);

    // Return empty result with error
    return {
      accounts: [],
      transactions: [],
      confidence: 0,
      warnings: [error instanceof Error ? error.message : 'Unknown error during extraction'],
    };
  }
}

/**
 * Validate extracted data quality
 */
export function validateExtractionQuality(result: VisionExtractionResult): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check confidence
  if (result.confidence < 50) {
    errors.push('Low confidence extraction (< 50%)');
  }

  // Check if any data was extracted
  if (result.accounts.length === 0 && result.transactions.length === 0) {
    errors.push('No accounts or transactions extracted');
  }

  // Validate account data
  for (const account of result.accounts) {
    if (!account.name || account.name.trim().length === 0) {
      errors.push('Account missing name');
    }
    if (!account.accountType) {
      errors.push('Account missing type');
    }
  }

  // Validate transaction data
  for (const [index, transaction] of result.transactions.entries()) {
    if (!transaction.date) {
      errors.push(`Transaction ${index + 1}: missing date`);
    }
    if (!transaction.description || transaction.description.trim().length === 0) {
      errors.push(`Transaction ${index + 1}: missing description`);
    }
    if (transaction.amount === undefined || transaction.amount === null) {
      errors.push(`Transaction ${index + 1}: missing amount`);
    }
    if (!transaction.type || !['INCOME', 'EXPENSE'].includes(transaction.type)) {
      errors.push(`Transaction ${index + 1}: invalid type`);
    }

    // Validate date format (should be ISO 8601)
    if (transaction.date && !/^\d{4}-\d{2}-\d{2}/.test(transaction.date)) {
      errors.push(`Transaction ${index + 1}: invalid date format (expected YYYY-MM-DD)`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
