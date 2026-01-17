/**
 * JSON Extraction Utility
 * Robustly extracts JSON from AI responses that may contain markdown or other text
 */

/**
 * Extract JSON object from text
 * Handles markdown code blocks, extra text, and nested braces
 */
export function extractJSON(text: string): string | null {
  // Remove markdown code blocks if present
  const cleanText = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');

  // Try to find JSON object or array
  // Look for first { or [ and matching closing brace
  const jsonObjectMatch = findMatchingBraces(cleanText, '{', '}');
  if (jsonObjectMatch) {
    return jsonObjectMatch;
  }

  const jsonArrayMatch = findMatchingBraces(cleanText, '[', ']');
  if (jsonArrayMatch) {
    return jsonArrayMatch;
  }

  return null;
}

/**
 * Find matching opening and closing braces in text
 * Handles nested braces correctly
 */
function findMatchingBraces(text: string, openChar: string, closeChar: string): string | null {
  const startIndex = text.indexOf(openChar);
  if (startIndex === -1) return null;

  let depth = 0;
  let inString = false;
  let escapeNext = false;

  for (let i = startIndex; i < text.length; i++) {
    const char = text[i];

    // Handle escape sequences in strings
    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === '\\') {
      escapeNext = true;
      continue;
    }

    // Track if we're inside a string
    if (char === '"') {
      inString = !inString;
      continue;
    }

    // Only count braces outside of strings
    if (!inString) {
      if (char === openChar) {
        depth++;
      } else if (char === closeChar) {
        depth--;
        if (depth === 0) {
          // Found matching closing brace
          return text.substring(startIndex, i + 1);
        }
      }
    }
  }

  // No matching closing brace found
  return null;
}
