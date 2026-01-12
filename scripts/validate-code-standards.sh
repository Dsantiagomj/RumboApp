#!/usr/bin/env bash

# Rumbo Code Standards Validator
# Enforces ALL rules from CODE_STANDARDS.md
# Exit code 0: All checks pass
# Exit code 1: Violations found

set -e

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

VIOLATIONS=0
WARNINGS=0

echo "🔍 Validating code standards..."

# Get list of staged TypeScript/JavaScript files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | \
  grep -E '\.(ts|tsx|js|jsx)$' | \
  grep -v 'node_modules' | \
  grep -v '.next' || true)

if [ -z "$STAGED_FILES" ]; then
  echo -e "${GREEN}✓ No TypeScript/JavaScript files to validate${NC}"
  exit 0
fi

# ============================================================================
# Rule 1: No 'any' types (CODE_STANDARDS.md line 863)
# ============================================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  Checking for prohibited 'any' types..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

ANY_VIOLATIONS=$(echo "$STAGED_FILES" | \
  grep -E '\.(ts|tsx)$' | \
  grep -v '\.d\.ts$' | \
  xargs -I {} sh -c 'grep -n -E "(as any|: any[^a-zA-Z]|<any>|Array<any>|Promise<any>|Record<[^,]+, any)" "{}" 2>/dev/null && echo "File: {}" || true' || true)

if [ -n "$ANY_VIOLATIONS" ]; then
  echo -e "${RED}✗ VIOLATION: Found prohibited 'any' types${NC}"
  echo "$ANY_VIOLATIONS"
  echo ""
  echo -e "${YELLOW}📖 CODE_STANDARDS.md line 863: TypeScript strict mode (no any types)${NC}"
  echo -e "${YELLOW}   Fix: Use proper TypeScript types instead of 'any'${NC}"
  VIOLATIONS=$((VIOLATIONS + 1))
else
  echo -e "${GREEN}✓ No 'any' types found${NC}"
fi

# Check for eslint-disable comments (indicates any usage)
ESLINT_DISABLE=$(echo "$STAGED_FILES" | \
  xargs -I {} sh -c 'grep -n "eslint-disable.*@typescript-eslint/no-explicit-any" "{}" 2>/dev/null && echo "File: {}" || true' || true)

if [ -n "$ESLINT_DISABLE" ]; then
  echo -e "${RED}✗ VIOLATION: Found @typescript-eslint/no-explicit-any disable comments${NC}"
  echo "$ESLINT_DISABLE"
  VIOLATIONS=$((VIOLATIONS + 1))
fi

# ============================================================================
# Rule 2: Named exports only - NO default exports (CODE_STANDARDS.md line 859)
# ============================================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  Checking for default exports (named exports only)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Allowed files for default exports (config files only)
ALLOWED_DEFAULT_EXPORTS="next\.config|tailwind\.config|postcss\.config|vitest\.config|playwright\.config|\.storybook"

DEFAULT_EXPORTS=$(echo "$STAGED_FILES" | \
  grep -v -E "$ALLOWED_DEFAULT_EXPORTS" | \
  xargs -I {} sh -c 'grep -n "export default" "{}" 2>/dev/null && echo "File: {}" || true' || true)

if [ -n "$DEFAULT_EXPORTS" ]; then
  echo -e "${RED}✗ VIOLATION: Found default exports (use named exports)${NC}"
  echo "$DEFAULT_EXPORTS"
  echo ""
  echo -e "${YELLOW}📖 CODE_STANDARDS.md line 859: Named exports only${NC}"
  echo -e "${YELLOW}   Fix: Change 'export default' to 'export const/function/class'${NC}"
  VIOLATIONS=$((VIOLATIONS + 1))
else
  echo -e "${GREEN}✓ No default exports found${NC}"
fi

# ============================================================================
# Rule 3: Explicit type imports (CODE_STANDARDS.md line 860)
# ============================================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣  Checking for mixed imports (must use 'import type')..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

MIXED_IMPORTS=$(echo "$STAGED_FILES" | \
  grep -E '\.(ts|tsx)$' | \
  xargs -I {} sh -c 'grep -n "import.*{.*type [A-Z]" "{}" 2>/dev/null && echo "File: {}" || true' || true)

if [ -n "$MIXED_IMPORTS" ]; then
  echo -e "${YELLOW}⚠ WARNING: Found mixed imports (prefer separate 'import type')${NC}"
  echo "$MIXED_IMPORTS"
  echo ""
  echo -e "${YELLOW}📖 CODE_STANDARDS.md line 860: Explicit type imports${NC}"
  echo -e "${YELLOW}   Prefer: import type { User } from './types'${NC}"
  WARNINGS=$((WARNINGS + 1))
else
  echo -e "${GREEN}✓ No mixed imports found${NC}"
fi

# ============================================================================
# Rule 4: All components must be folders (CODE_STANDARDS.md line 858)
# ============================================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4️⃣  Checking for single-file components (must be folders)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check for .tsx files directly in components/ or features/ (not in subfolders)
SINGLE_FILE_COMPONENTS=$(echo "$STAGED_FILES" | \
  grep -E '(src/components/[^/]+\.tsx|src/features/[^/]+/components/[^/]+\.tsx)$' | \
  grep -v 'index\.tsx$' || true)

if [ -n "$SINGLE_FILE_COMPONENTS" ]; then
  echo -e "${RED}✗ VIOLATION: Found single-file components${NC}"
  echo "$SINGLE_FILE_COMPONENTS"
  echo ""
  echo -e "${YELLOW}📖 CODE_STANDARDS.md line 858: All components are folders${NC}"
  echo -e "${YELLOW}   Fix: Move to folder structure (component-name/index.tsx)${NC}"
  VIOLATIONS=$((VIOLATIONS + 1))
else
  echo -e "${GREEN}✓ All components in folder structure${NC}"
fi

# ============================================================================
# Rule 5: Kebab-case file naming (CODE_STANDARDS.md line 857)
# ============================================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5️⃣  Checking file naming convention (kebab-case)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Allowed patterns: index.tsx, types.ts, constants.ts, utils.ts, *.test.tsx, *.stories.tsx, *.config.ts
NON_KEBAB_FILES=$(echo "$STAGED_FILES" | \
  grep -v -E '(index|types|constants|utils|hooks)\.tsx?$' | \
  grep -v -E '\.(test|spec|stories|config|d)\.tsx?$' | \
  grep -E '[A-Z]' || true)

if [ -n "$NON_KEBAB_FILES" ]; then
  echo -e "${YELLOW}⚠ WARNING: Found non-kebab-case files${NC}"
  echo "$NON_KEBAB_FILES"
  echo ""
  echo -e "${YELLOW}📖 CODE_STANDARDS.md line 857: All files follow kebab-case naming${NC}"
  WARNINGS=$((WARNINGS + 1))
else
  echo -e "${GREEN}✓ All files use kebab-case naming${NC}"
fi

# ============================================================================
# Rule 6: No console.log in source code (CODE_STANDARDS.md line 869)
# ============================================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6️⃣  Checking for console.log statements..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

CONSOLE_LOGS=$(echo "$STAGED_FILES" | \
  grep -E '(src|app)/.*\.(ts|tsx)$' | \
  grep -v '\.test\.' | \
  grep -v '\.spec\.' | \
  xargs -I {} sh -c 'grep -n "console\.log\|console\.info\|console\.debug" "{}" 2>/dev/null && echo "File: {}" || true' || true)

if [ -n "$CONSOLE_LOGS" ]; then
  echo -e "${YELLOW}⚠ WARNING: Found console.log statements${NC}"
  echo "$CONSOLE_LOGS"
  echo ""
  echo -e "${YELLOW}📖 CODE_STANDARDS.md line 869: No console.log in production code${NC}"
  echo -e "${YELLOW}   Use console.error or console.warn for intentional logs${NC}"
  WARNINGS=$((WARNINGS + 1))
else
  echo -e "${GREEN}✓ No console.log statements found${NC}"
fi

# ============================================================================
# Rule 7: Consistent path aliases (@/* only) (CODE_STANDARDS.md line 862)
# ============================================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "7️⃣  Checking for inconsistent path aliases (use @/* only)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

WRONG_ALIASES=$(echo "$STAGED_FILES" | \
  xargs -I {} sh -c 'grep -n "from ['\''\"]\(~\|\$\)/" "{}" 2>/dev/null && echo "File: {}" || true' || true)

if [ -n "$WRONG_ALIASES" ]; then
  echo -e "${RED}✗ VIOLATION: Found non-standard path aliases${NC}"
  echo "$WRONG_ALIASES"
  echo ""
  echo -e "${YELLOW}📖 CODE_STANDARDS.md line 862: Path aliases use @/* consistently${NC}"
  echo -e "${YELLOW}   Fix: Use @/* instead of ~/* or \$/*${NC}"
  VIOLATIONS=$((VIOLATIONS + 1))
else
  echo -e "${GREEN}✓ All imports use @/* path alias${NC}"
fi

# ============================================================================
# Rule 8: No barrel exports in features/ (CODE_STANDARDS.md)
# ============================================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "8️⃣  Checking for barrel exports in features/..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

FEATURE_BARRELS=$(echo "$STAGED_FILES" | \
  grep -E 'src/features/[^/]+/index\.tsx?$' || true)

if [ -n "$FEATURE_BARRELS" ]; then
  echo -e "${RED}✗ VIOLATION: Found barrel exports in features/#{NC}"
  echo "$FEATURE_BARRELS"
  echo ""
  echo -e "${YELLOW}📖 CODE_STANDARDS.md: Features do NOT use barrel exports${NC}"
  echo -e "${YELLOW}   Fix: Remove index.ts and import directly from feature subfolders${NC}"
  VIOLATIONS=$((VIOLATIONS + 1))
else
  echo -e "${GREEN}✓ No barrel exports in features/${NC}"
fi

# ============================================================================
# Summary
# ============================================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $VIOLATIONS -eq 0 ]; then
  if [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ ALL CODE STANDARDS CHECKS PASSED!${NC}"
  else
    echo -e "${YELLOW}✅ Passed with $WARNINGS warning(s)${NC}"
    echo -e "${YELLOW}   (Warnings don't block commits but should be fixed)${NC}"
  fi
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 0
else
  echo -e "${RED}❌ FOUND $VIOLATIONS VIOLATION(S)${NC}"
  if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}   Plus $WARNINGS warning(s)${NC}"
  fi
  echo ""
  echo -e "${YELLOW}📖 See .rumbo/CODE_STANDARDS.md for complete rules${NC}"
  echo -e "${YELLOW}🚫 Zero Exceptions: These rules apply to 100% of code${NC}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 1
fi
