#!/usr/bin/env bash

# Rumbo Code Standards Validator
# Enforces zero-exception rules from CODE_STANDARDS.md
# Exit code 0: All checks pass
# Exit code 1: Violations found

set -e

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

VIOLATIONS=0

echo "🔍 Validating code standards..."

# Check 1: No 'any' types (strict TypeScript)
# Excludes: .d.ts files, test files with mocks, and legitimate usage in type definitions
echo ""
echo "Checking for prohibited 'any' types..."

# Search for 'as any' or ': any' in TypeScript files
# Exclude:
# - .d.ts files (type declarations)
# - test files using vitest's any matchers
# - node_modules, .next, dist
ANY_VIOLATIONS=$(git diff --cached --name-only --diff-filter=ACM | \
  grep -E '\.(ts|tsx)$' | \
  grep -v '\.d\.ts$' | \
  grep -v 'node_modules' | \
  grep -v '.next' | \
  xargs -I {} sh -c 'grep -n -E "(as any|: any[^a-zA-Z]|<any>|Array<any>|Promise<any>)" "{}" 2>/dev/null && echo "File: {}" || true' || true)

if [ -n "$ANY_VIOLATIONS" ]; then
  echo -e "${RED}✗ Found prohibited 'any' types:${NC}"
  echo "$ANY_VIOLATIONS"
  echo ""
  echo -e "${YELLOW}📖 CODE_STANDARDS.md line 863: TypeScript strict mode (no any types)${NC}"
  echo -e "${YELLOW}   Fix: Use proper TypeScript types instead of 'any'${NC}"
  VIOLATIONS=$((VIOLATIONS + 1))
else
  echo -e "${GREEN}✓ No 'any' types found${NC}"
fi

# Check 2: No @typescript-eslint/no-explicit-any disable comments
echo ""
echo "Checking for eslint disable comments..."

ESLINT_DISABLE=$(git diff --cached --name-only --diff-filter=ACM | \
  grep -E '\.(ts|tsx|js|jsx)$' | \
  grep -v 'node_modules' | \
  xargs -I {} sh -c 'grep -n "eslint-disable.*@typescript-eslint/no-explicit-any" "{}" 2>/dev/null && echo "File: {}" || true' || true)

if [ -n "$ESLINT_DISABLE" ]; then
  echo -e "${RED}✗ Found @typescript-eslint/no-explicit-any disable comments:${NC}"
  echo "$ESLINT_DISABLE"
  echo ""
  echo -e "${YELLOW}   These comments indicate 'any' type usage${NC}"
  VIOLATIONS=$((VIOLATIONS + 1))
else
  echo -e "${GREEN}✓ No eslint disable comments for 'any' types${NC}"
fi

# Check 3: No default exports (CODE_STANDARDS.md rule)
echo ""
echo "Checking for prohibited default exports..."

DEFAULT_EXPORTS=$(git diff --cached --name-only --diff-filter=ACM | \
  grep -E '\.(ts|tsx|js|jsx)$' | \
  grep -v 'node_modules' | \
  grep -v '.next' | \
  grep -v 'next.config' | \
  grep -v 'tailwind.config' | \
  grep -v 'postcss.config' | \
  grep -v 'vitest.config' | \
  grep -v 'playwright.config' | \
  xargs -I {} sh -c 'grep -n "export default" "{}" 2>/dev/null && echo "File: {}" || true' || true)

if [ -n "$DEFAULT_EXPORTS" ]; then
  echo -e "${YELLOW}⚠ Found default exports (prefer named exports):${NC}"
  echo "$DEFAULT_EXPORTS"
  echo ""
  echo -e "${YELLOW}📖 CODE_STANDARDS.md: Named Exports Only${NC}"
  echo -e "${YELLOW}   Note: Config files (next.config.ts, etc.) are allowed${NC}"
  # Don't count as violation, just warning
fi

# Check 4: No console.log in source code (except console.error/warn)
echo ""
echo "Checking for console.log statements..."

CONSOLE_LOGS=$(git diff --cached --name-only --diff-filter=ACM | \
  grep -E '\.(ts|tsx)$' | \
  grep -v 'node_modules' | \
  grep -v '.next' | \
  grep -v '\.test\.' | \
  grep -v '\.spec\.' | \
  xargs -I {} sh -c 'grep -n "console\.log\|console\.info\|console\.debug" "{}" 2>/dev/null && echo "File: {}" || true' || true)

if [ -n "$CONSOLE_LOGS" ]; then
  echo -e "${YELLOW}⚠ Found console.log statements (use console.error/warn for intentional logs):${NC}"
  echo "$CONSOLE_LOGS"
  # Don't count as violation, just warning
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $VIOLATIONS -eq 0 ]; then
  echo -e "${GREEN}✓ All code standards checks passed!${NC}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 0
else
  echo -e "${RED}✗ Found $VIOLATIONS violation(s)${NC}"
  echo -e "${YELLOW}📖 See .rumbo/CODE_STANDARDS.md for complete rules${NC}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 1
fi
