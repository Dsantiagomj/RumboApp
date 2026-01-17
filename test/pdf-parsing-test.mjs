/**
 * PDF Parsing Integration Test
 *
 * Tests the complete PDF parsing pipeline with a real Colombian bank statement
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testPDFParsing() {
  const pdfPath = path.join(
    __dirname,
    'sample-files',
    'Extracto_981858018_202512_CTA_AHORROS_4199.pdf'
  );
  const password = '1140890261';

  console.log('🧪 Testing PDF Parsing Pipeline\n');
  console.log('═'.repeat(80));
  console.log(`PDF File: ${path.basename(pdfPath)}`);
  console.log(`Password: ${password}`);
  console.log('═'.repeat(80));

  try {
    // Import parsing utilities
    const { parsePDF, validatePDF, hasTransactionData } = await import(
      '../src/server/lib/parsers/pdf-parser.ts'
    );
    const { extractPDFTransactions, validatePDFTransactions } = await import(
      '../src/server/lib/parsers/pdf-transaction-extractor.ts'
    );
    const { detectPDFAccount, detectPDFBankFormat } = await import(
      '../src/server/lib/parsers/pdf-account-detector.ts'
    );

    // Step 1: Parse PDF
    console.log('\n📄 Step 1: Parsing PDF with password...');
    const buffer = fs.readFileSync(pdfPath);
    const pdfResult = await parsePDF(buffer, { password });

    console.log(`   ✓ Text extracted: ${pdfResult.text.length} characters`);
    console.log(`   ✓ Pages: ${pdfResult.pages || 'unknown'}`);

    // Step 2: Validate PDF structure
    console.log('\n🔍 Step 2: Validating PDF structure...');
    const pdfValidation = validatePDF(pdfResult);

    if (pdfValidation.isValid) {
      console.log('   ✓ PDF structure is valid');
    } else {
      console.log('   ✗ PDF validation failed:');
      pdfValidation.errors.forEach((err) => console.log(`      - ${err}`));
      return;
    }

    // Step 3: Check for transaction data
    console.log('\n🔍 Step 3: Checking for transaction data...');
    const hasTxData = hasTransactionData(pdfResult.text);

    if (hasTxData) {
      console.log('   ✓ Transaction data detected in PDF');
    } else {
      console.log('   ✗ No transaction data found');
      return;
    }

    // Step 4: Extract transactions and metadata
    console.log('\n📊 Step 4: Extracting transactions and metadata...');
    const { transactions, metadata } = extractPDFTransactions(pdfResult.text);

    console.log(`   ✓ Extracted ${transactions.length} transactions`);
    console.log('\n   Account Metadata:');
    console.log(`      Account Number: ${metadata.accountNumber || 'N/A'}`);
    console.log(`      Account Type: ${metadata.accountType || 'N/A'}`);
    console.log(`      Bank Name: ${metadata.bankName || 'N/A'}`);
    console.log(
      `      Period: ${metadata.startDate?.toLocaleDateString('es-CO') || 'N/A'} - ${metadata.endDate?.toLocaleDateString('es-CO') || 'N/A'}`
    );
    console.log(
      `      Previous Balance: $${metadata.previousBalance?.toLocaleString('es-CO') || 'N/A'}`
    );
    console.log(
      `      Current Balance: $${metadata.currentBalance?.toLocaleString('es-CO') || 'N/A'}`
    );
    console.log(
      `      Total Credits: $${metadata.totalCredits?.toLocaleString('es-CO') || 'N/A'}`
    );
    console.log(
      `      Total Debits: $${metadata.totalDebits?.toLocaleString('es-CO') || 'N/A'}`
    );

    // Step 5: Validate transactions
    console.log('\n✅ Step 5: Validating extracted transactions...');
    const txValidation = validatePDFTransactions(transactions);

    if (txValidation.isValid) {
      console.log(`   ✓ All ${transactions.length} transactions are valid`);
    } else {
      console.log('   ⚠️  Transaction validation warnings:');
      txValidation.errors.forEach((err) => console.log(`      - ${err}`));
    }

    // Step 6: Detect bank format
    console.log('\n🏦 Step 6: Detecting bank format...');
    const formatDetection = detectPDFBankFormat(metadata);

    console.log(`   ✓ Bank Format: ${formatDetection.format}`);
    console.log(`   ✓ Confidence: ${(formatDetection.confidence * 100).toFixed(0)}%`);

    // Step 7: Detect account details
    console.log('\n💳 Step 7: Detecting account details...');
    const account = detectPDFAccount(metadata, transactions);

    console.log(`   ✓ Account Name: ${account.name}`);
    console.log(`   ✓ Bank: ${account.bankName}`);
    console.log(`   ✓ Account Type: ${account.accountType}`);
    console.log(`   ✓ Initial Balance: $${account.initialBalance.toLocaleString('es-CO')}`);
    console.log(`   ✓ Transaction Count: ${account.transactionCount}`);
    console.log(`   ✓ Suggested Color: ${account.suggestedColor}`);
    console.log(`   ✓ Suggested Icon: ${account.suggestedIcon}`);

    // Step 8: Display sample transactions
    console.log('\n📝 Step 8: Sample Transactions (first 10)');
    console.log('─'.repeat(80));

    transactions.slice(0, 10).forEach((tx, i) => {
      const sign = tx.type === 'EXPENSE' ? '-' : '+';
      const amountFormatted = `${sign}$${tx.amount.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      console.log(
        `${i + 1}. ${tx.date.toLocaleDateString('es-CO')} | ${tx.description.substring(0, 40).padEnd(40)} | ${amountFormatted.padStart(15)} | Balance: $${tx.balance?.toLocaleString('es-CO') || 'N/A'}`
      );
    });

    // Summary
    console.log('\n' + '═'.repeat(80));
    console.log('✅ PDF PARSING TEST COMPLETED SUCCESSFULLY');
    console.log('═'.repeat(80));
    console.log(`Total Transactions: ${transactions.length}`);
    console.log(
      `Date Range: ${transactions[transactions.length - 1]?.date.toLocaleDateString('es-CO')} - ${transactions[0]?.date.toLocaleDateString('es-CO')}`
    );
    console.log(
      `Income Transactions: ${transactions.filter((t) => t.type === 'INCOME').length}`
    );
    console.log(
      `Expense Transactions: ${transactions.filter((t) => t.type === 'EXPENSE').length}`
    );
    console.log(
      `Transfer Transactions: ${transactions.filter((t) => t.type === 'TRANSFER').length}`
    );
    console.log('═'.repeat(80));
  } catch (error) {
    console.error('\n❌ PDF PARSING TEST FAILED');
    console.error('═'.repeat(80));
    console.error(error);
    process.exit(1);
  }
}

testPDFParsing().catch(console.error);
