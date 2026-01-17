/**
 * PDF Test Script
 *
 * Tests PDF password protection and text extraction
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testPDF() {
  const pdfPath = path.join(__dirname, 'sample-files', 'Extracto_981858018_202512_CTA_AHORROS_4199.pdf');
  const password = '1140890261';

  console.log('📄 Testing PDF extraction...\n');
  console.log(`File: ${pdfPath}`);
  console.log(`Password: ${password}\n`);

  try {
    // Dynamic import for pdf-parse v2
    const { PDFParse } = await import('pdf-parse');

    // Read PDF buffer
    const buffer = fs.readFileSync(pdfPath);
    console.log(`✓ File loaded: ${buffer.length} bytes\n`);

    // Try to parse with password
    console.log('Attempting to parse PDF with password...');
    const parser = new PDFParse({ data: buffer, password });
    const data = await parser.getText();

    console.log('\n✅ PDF parsed successfully!\n');
    console.log('PDF Info:');
    console.log('- Pages:', data.numpages);
    console.log('- Text length:', data.text.length, 'characters');
    console.log('\nFirst 1500 characters of extracted text:');
    console.log('─'.repeat(80));
    console.log(data.text.substring(0, 1500));
    console.log('─'.repeat(80));

    // Check if text contains transaction-like data (case-insensitive)
    const textUpper = data.text.toUpperCase();
    const hasTransactions = textUpper.includes('FECHA') ||
                           textUpper.includes('DESCRIPCIÓN') ||
                           textUpper.includes('DESCRIPCION') ||
                           textUpper.includes('VALOR') ||
                           textUpper.includes('SALDO') ||
                           textUpper.includes('ABONO') ||
                           textUpper.includes('CARGO');

    if (hasTransactions) {
      console.log('\n✓ PDF appears to contain transaction data');

      // Try to identify structure
      const lines = data.text.split('\n');
      console.log(`\n📊 Total lines: ${lines.length}`);
      console.log('\nFirst 20 non-empty lines:');
      console.log('─'.repeat(80));
      lines.filter(l => l.trim()).slice(0, 20).forEach((line, i) => {
        console.log(`${i + 1}: ${line.substring(0, 100)}`);
      });
    } else {
      console.log('\n⚠️  PDF may not contain structured transaction data');
      console.log('   This might be a scanned image PDF requiring OCR');
    }

  } catch (error) {
    console.error('\n❌ Error parsing PDF:', error.message);

    if (error.message.includes('password')) {
      console.error('   Password protection detected but incorrect password');
    } else if (error.message.includes('encrypted')) {
      console.error('   PDF is encrypted, password required');
    }
  }
}

testPDF().catch(console.error);
