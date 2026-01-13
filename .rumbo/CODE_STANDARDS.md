# Rumbo - Code Standards & Best Practices

> **Last Updated:** January 11, 2026
> **Purpose:** Strict code structure, naming conventions, and patterns
> **Philosophy:** Zero Ambiguity - Every file, every import, every pattern is consistent

---

## 🎯 Core Principles

1. **100% Consistency** - Zero exceptions, zero special cases
2. **Feature-Based Organization** - Code organized by business feature, not technical layer
3. **Strict Folder Structure** - Every component is a folder (no single-file components)
4. **Named Exports Only** - Better IDE support, easier refactoring
5. **Explicit Type Imports** - Clear separation of types and runtime code
6. **Self-Documenting Code** - Code should explain itself, comments explain WHY

---

## 📁 Folder Architecture

### Root Structure

```
rumbo/
├── .claude/                       # Claude Code configuration
├── .rumbo/                        # Project documentation
├── .storybook/                    # Storybook configuration
├── app/                           # Next.js 16 App Router (routes only)
├── docker/                        # Docker configurations
├── public/                        # Static assets
├── src/                           # ⭐ All application code
├── tests/                         # E2E tests only
└── [config files]                 # Root config files
```

### App Router Structure (Routes Only)

```
app/
├── (auth)/                        # Auth routes (login, register)
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   └── layout.tsx                 # Auth layout (centered, no nav)
├── (authenticated)/               # Main app routes
│   ├── dashboard/
│   │   └── page.tsx
│   ├── transactions/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── budgets/
│   │   └── page.tsx
│   ├── bills/
│   │   └── page.tsx
│   ├── settings/
│   │   └── page.tsx
│   └── layout.tsx                 # Authenticated layout (nav, tabs)
├── api/                           # API routes
│   ├── trpc/
│   │   └── [trpc]/
│   │       └── route.ts           # tRPC handler
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts           # NextAuth handler
├── layout.tsx                     # Root layout
├── providers.tsx                  # Client providers wrapper
└── globals.css                    # Global styles
```

**Rules:**

- ✅ App directory is for **routes only** (pages, layouts, route handlers)
- ✅ NO business logic in app/ (move to src/)
- ✅ Use route groups `(name)` for layout sharing
- ✅ Keep page.tsx files minimal (import from src/features/)

### Src Structure (Feature-Based)

```
src/
├── features/                      # ⭐ FEATURE-BASED ORGANIZATION
│   ├── transactions/
│   │   ├── components/            # Feature-specific components
│   │   │   ├── transaction-list/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── types.ts
│   │   │   │   ├── constants.ts
│   │   │   │   ├── transaction-list.stories.tsx
│   │   │   │   └── transaction-list.test.tsx
│   │   │   ├── transaction-form/
│   │   │   └── transaction-card/
│   │   ├── hooks/                 # Feature-specific hooks
│   │   │   ├── use-transactions/
│   │   │   │   ├── index.ts
│   │   │   │   ├── types.ts
│   │   │   │   └── use-transactions.test.ts
│   │   │   └── use-create-transaction/
│   │   ├── types/                 # Feature-specific types
│   │   │   └── index.ts
│   │   └── utils/                 # Feature-specific utilities
│   │       └── format-amount/
│   │           ├── index.ts
│   │           ├── types.ts
│   │           └── format-amount.test.ts
│   ├── budgets/
│   ├── bills/
│   ├── accounts/
│   ├── ai-chat/
│   ├── auth/
│   └── dashboard/
├── components/                    # Shared components
│   ├── ui/                        # Shadcn/ui components (ALL in folders)
│   │   ├── button/
│   │   │   ├── index.tsx
│   │   │   ├── types.ts
│   │   │   ├── button.stories.tsx
│   │   │   └── button.test.tsx
│   │   ├── input/
│   │   └── card/
│   ├── layout/                    # Layout components
│   │   ├── header/
│   │   ├── bottom-nav/
│   │   └── sidebar/
│   └── common/                    # Shared business components
│       ├── currency-input/
│       ├── date-picker/
│       └── empty-state/
├── server/                        # Backend code
│   ├── api/                       # tRPC routers
│   │   ├── root.ts
│   │   └── routers/
│   │       ├── auth/
│   │       │   ├── index.ts       # Router definition
│   │       │   ├── schemas.ts     # Zod validation schemas
│   │       │   └── procedures/    # Individual procedures
│   │       │       ├── login.ts
│   │       │       └── register.ts
│   │       ├── transactions/
│   │       ├── budgets/
│   │       ├── bills/
│   │       └── ai/
│   ├── db/
│   │   ├── schema.prisma
│   │   ├── client.ts
│   │   └── seed.ts
│   ├── services/                  # Business logic services
│   │   ├── ai/
│   │   │   ├── index.ts
│   │   │   ├── types.ts
│   │   │   └── ai.service.test.ts
│   │   ├── email/
│   │   ├── storage/
│   │   └── exchange-rate/
│   ├── auth/
│   │   └── config.ts
│   └── jobs/                      # BullMQ background jobs
│       ├── queue.ts
│       └── bill-reminder/
│           ├── index.ts
│           └── bill-reminder.test.ts
├── lib/                           # Shared libraries & utilities
│   ├── utils/
│   │   ├── index.ts               # General utilities (cn, etc.)
│   │   └── cn.test.ts
│   ├── validations/               # Shared Zod schemas
│   │   └── common.ts
│   ├── constants/                 # App-wide constants
│   │   ├── categories.ts
│   │   ├── currencies.ts
│   │   └── config.ts
│   ├── errors/                    # Custom error classes
│   │   └── app-error/
│   │       ├── index.ts
│   │       └── types.ts
│   └── trpc/                      # tRPC client setup
│       ├── client.ts
│       └── react.tsx
├── hooks/                         # Shared React hooks
│   ├── use-media-query/
│   │   ├── index.ts
│   │   ├── types.ts
│   │   └── use-media-query.test.ts
│   ├── use-debounce/
│   └── use-local-storage/
├── types/                         # Shared TypeScript types
│   ├── index.ts
│   └── global.d.ts
└── styles/
    └── animations.css
```

**Rules:**

- ✅ **EVERY component/hook/util is a folder** (zero exceptions)
- ✅ Feature code stays in `features/` (self-contained modules)
- ✅ Shared code in `components/`, `hooks/`, `lib/`
- ✅ Backend code in `server/` (tRPC, services, jobs)
- ✅ Each folder has `index.ts` + `types.ts` at minimum

---

## 📄 File Naming Conventions

### Universal Rule: **kebab-case for all files**

```
✅ CORRECT:
- transaction-list/index.tsx
- use-transactions/index.ts
- format-currency.ts
- ai.service.ts
- button.stories.tsx
- transaction.test.tsx

❌ WRONG:
- TransactionList.tsx
- useTransactions.ts
- formatCurrency.ts
- AIService.ts
```

### File Type Suffixes

| File Type         | Suffix                 | Example                                         |
| ----------------- | ---------------------- | ----------------------------------------------- |
| React Component   | `index.tsx`            | `button/index.tsx`                              |
| TypeScript Types  | `types.ts`             | `button/types.ts`                               |
| Constants         | `constants.ts`         | `button/constants.ts`                           |
| Utilities         | `utils.ts` or specific | `button/utils.ts` or `format-currency/index.ts` |
| React Hook        | `index.ts`             | `use-transactions/index.ts`                     |
| Service           | `.service.ts`          | `ai/ai.service.ts`                              |
| tRPC Router       | `index.ts`             | `routers/transactions/index.ts`                 |
| Zod Schemas       | `schemas.ts`           | `routers/auth/schemas.ts`                       |
| Unit Tests        | `.test.ts(x)`          | `button.test.tsx`                               |
| Storybook Stories | `.stories.tsx`         | `button.stories.tsx`                            |
| E2E Tests         | `.spec.ts`             | `auth.spec.ts`                                  |

---

## 📦 Import/Export Patterns

### Named Exports Only (NO Default Exports)

```typescript
// ✅ CORRECT: Named export
export function TransactionList({ transactions }: TransactionListProps) {
  // ...
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  // ...
}

// ❌ WRONG: Default export
export default function TransactionList() {}
```

**Why:**

- ✅ Better IDE autocomplete
- ✅ Easier refactoring
- ✅ Prevents naming conflicts
- ✅ Consistent across codebase

### Strategic Barrel Exports (index.ts)

**Use barrel exports (index.ts) ONLY for:**

1. `src/components/ui/` (Shadcn components)
2. `src/lib/` (utilities)
3. `src/types/` (shared types)

```typescript
// ✅ CORRECT: Strategic barrel
// src/components/ui/index.ts
export { Button } from './button';
export { Input } from './input';
export { Card } from './card';

// ✅ CORRECT: Import from barrel
import { Button, Input } from '@/components/ui';

// ❌ WRONG: Barrel exports in features/
// src/features/transactions/index.ts - DON'T DO THIS
// Kills tree-shaking and causes circular dependencies
```

**Features do NOT use barrel exports:**

```typescript
// ✅ CORRECT: Import directly from feature
import { TransactionList } from '@/features/transactions/components/transaction-list';
import { useTransactions } from '@/features/transactions/hooks/use-transactions';

// ❌ WRONG: Feature barrel export
import { TransactionList } from '@/features/transactions';
```

### Explicit Type Imports

```typescript
// ✅ CORRECT: Explicit type import
import type { User } from '@/types';
import type { TransactionListProps } from './types';

// ❌ WRONG: Mixed import
import { User, type Transaction } from '@/types';
```

### Import Order (Auto-sorted by ESLint)

```typescript
// 1. React/Next.js
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 2. External libraries
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

// 3. Internal (@/ imports)
import { Button } from '@/components/ui/button';
import { useTransactions } from '@/features/transactions/hooks/use-transactions';
import type { Transaction } from '@/features/transactions/types';

// 4. Relative imports (./)
import { formatCurrency } from './utils';
import type { TransactionListProps } from './types';

// 5. Styles (always last)
import './styles.css';
```

**ESLint auto-sorts these, no manual effort required.**

### Path Aliases

**Single alias for everything:** `@/*` → `src/*`

```typescript
// ✅ CORRECT:
import { Button } from '@/components/ui/button';
import { useTransactions } from '@/features/transactions/hooks/use-transactions';
import { formatCurrency } from '@/lib/utils';
import type { User } from '@/types';

// ❌ WRONG: Multiple aliases
import { Button } from '@components/ui/button';
import { useTransactions } from '~/features/transactions/hooks/use-transactions';
import { formatCurrency } from '$lib/utils';
```

---

## 🧩 Component Structure

### Strict Folder-Based Components

**EVERY component is a folder** (zero exceptions, even simple ones):

```
button/
├── index.tsx              # Component logic only
├── types.ts               # TypeScript interfaces/types
├── constants.ts           # Component-specific constants (optional)
├── hooks.ts               # Component-specific hooks (optional)
├── utils.ts               # Component-specific utilities (optional)
├── button.stories.tsx     # Storybook stories
└── button.test.tsx        # Vitest tests
```

### Component File Structure (index.tsx)

```typescript
// 1. Imports (auto-sorted by ESLint)
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { TransactionListProps } from './types'
import { DEFAULT_PAGE_SIZE } from './constants'

// 2. Component function
export function TransactionList({
  transactions,
  onSelect,
  isLoading = false
}: TransactionListProps) {
  // Component logic
  const [page, setPage] = useState(1)

  return (
    <div>
      {/* JSX */}
    </div>
  )
}

// 3. Additional exports (if needed)
export function TransactionListSkeleton() {
  // Loading skeleton
}
```

### Types File (types.ts)

```typescript
import type { Transaction } from '@/features/transactions/types';

// Use 'interface' for object shapes
export interface TransactionListProps {
  transactions: Transaction[];
  onSelect?: (transaction: Transaction) => void;
  isLoading?: boolean;
}

// Use 'type' for unions/intersections/primitives
export type TransactionStatus = 'pending' | 'cleared' | 'reconciled';
export type TransactionListVariant = 'default' | 'compact' | 'detailed';
```

---

## 🔷 TypeScript Patterns

### Interface vs Type

```typescript
// ✅ Use INTERFACE for object shapes
export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

// ✅ Use TYPE for unions/intersections/primitives
export type Status = 'pending' | 'cleared' | 'reconciled';
export type Currency = 'COP' | 'USD' | 'EUR';
export type ID = string | number;

export type UserWithProfile = User & { profile: UserProfile };
```

### Type Organization

**Feature-scoped types:**

```typescript
// src/features/transactions/types/index.ts
export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  // ...
}

export type TransactionStatus = 'pending' | 'cleared' | 'reconciled';
```

**Shared types:**

```typescript
// src/types/index.ts
export interface PaginationParams {
  page: number;
  limit: number;
}

export type SortOrder = 'asc' | 'desc';
```

### TypeScript Config Strictness

```json
{
  "compilerOptions": {
    "strict": true, // ✅ Enable all strict checks
    "noUncheckedIndexedAccess": false, // ❌ Not enabled (too strict)
    "noImplicitOverride": false, // ❌ Not enabled (rarely needed)
    "exactOptionalPropertyTypes": false, // ❌ Not enabled (too annoying)
    "verbatimModuleSyntax": false // ❌ Use explicit 'import type' instead
  }
}
```

---

## 🔌 tRPC & API Patterns

### Router Organization (Feature-Based)

```
src/server/api/routers/
├── auth/
│   ├── index.ts           # Router definition
│   ├── schemas.ts         # Zod validation schemas
│   └── procedures/        # Individual procedures (optional for complex routers)
│       ├── login.ts
│       └── register.ts
├── transactions/
│   ├── index.ts
│   └── schemas.ts
├── budgets/
├── bills/
└── ai/
```

### Router File Structure (index.ts)

```typescript
// src/server/api/routers/transactions/index.ts
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { createTransactionSchema, updateTransactionSchema } from './schemas';

export const transactionsRouter = createTRPCRouter({
  // Query: getAll
  getAll: protectedProcedure
    .input(
      z.object({
        accountId: z.string().optional(),
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Implementation
    }),

  // Query: getById
  getById: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    // Implementation
  }),

  // Mutation: create
  create: protectedProcedure.input(createTransactionSchema).mutation(async ({ ctx, input }) => {
    // Implementation
  }),

  // Mutation: update
  update: protectedProcedure.input(updateTransactionSchema).mutation(async ({ ctx, input }) => {
    // Implementation
  }),

  // Mutation: delete
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Implementation
    }),
});
```

### Procedure Naming (RESTful Style)

| Operation | Procedure Name | Type     | Example                                           |
| --------- | -------------- | -------- | ------------------------------------------------- |
| Get all   | `getAll`       | Query    | `transactions.getAll()`                           |
| Get by ID | `getById`      | Query    | `transactions.getById({ id: '123' })`             |
| Create    | `create`       | Mutation | `transactions.create({ amount: 100 })`            |
| Update    | `update`       | Mutation | `transactions.update({ id: '123', amount: 200 })` |
| Delete    | `delete`       | Mutation | `transactions.delete({ id: '123' })`              |

**Domain-specific procedures:**

```typescript
// ✅ Domain-specific names are OK when RESTful doesn't fit
categorize: protectedProcedure.mutation(...)    // transactions.categorize()
reconcile: protectedProcedure.mutation(...)     // transactions.reconcile()
import: protectedProcedure.mutation(...)        // transactions.import()
```

### Validation Schemas (schemas.ts)

```typescript
// src/server/api/routers/transactions/schemas.ts
import { z } from 'zod';

export const createTransactionSchema = z.object({
  accountId: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.enum(['COP', 'USD', 'EUR']),
  description: z.string().min(1).max(255),
  categoryId: z.string().uuid().optional(),
  date: z.date(),
});

export const updateTransactionSchema = z.object({
  id: z.string().uuid(),
  amount: z.number().positive().optional(),
  description: z.string().min(1).max(255).optional(),
  categoryId: z.string().uuid().optional(),
});
```

**Schemas live WITH the router** (colocated), not in features/.

### Error Handling

```typescript
import { TRPCError } from '@trpc/server';

// ✅ Use TRPCError with standard codes
throw new TRPCError({
  code: 'NOT_FOUND',
  message: 'Transaction not found',
});

throw new TRPCError({
  code: 'BAD_REQUEST',
  message: 'Invalid transaction amount',
});

throw new TRPCError({
  code: 'UNAUTHORIZED',
  message: 'You must be logged in',
});

// ❌ Don't use custom error classes (unless necessary)
throw new TransactionNotFoundError(); // NO
```

---

## 🧪 Testing Patterns

### Test File Location (Colocated)

```
button/
├── index.tsx
├── types.ts
├── button.test.tsx        ✅ Colocated unit tests
└── button.stories.tsx     ✅ Colocated Storybook stories

tests/
└── e2e/
    ├── auth.spec.ts       ✅ Centralized E2E tests
    └── transactions.spec.ts
```

**Rules:**

- ✅ Unit/integration tests: **Colocated** with code (`.test.ts(x)`)
- ✅ Storybook stories: **Colocated** with components (`.stories.tsx`)
- ✅ E2E tests: **Centralized** in `tests/e2e/` (`.spec.ts`)

### Test Naming

| Test Type        | Suffix         | Location     | Example                     |
| ---------------- | -------------- | ------------ | --------------------------- |
| Unit/Integration | `.test.ts(x)`  | Colocated    | `button/button.test.tsx`    |
| Storybook        | `.stories.tsx` | Colocated    | `button/button.stories.tsx` |
| E2E (Playwright) | `.spec.ts`     | `tests/e2e/` | `tests/e2e/auth.spec.ts`    |

### Test Structure

```typescript
// button/button.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from './index'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    screen.getByText('Click me').click()
    expect(handleClick).toHaveBeenCalledOnce()
  })
})
```

---

## 🎨 Code Style & Formatting

### Prettier Configuration

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "arrowParens": "always",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

**Examples:**

```typescript
// ✅ CORRECT:
import { useState } from 'react';

export function Example({ name }: ExampleProps) {
  const items = ['one', 'two', 'three'];
  const handler = (value) => console.log(value);

  return <div>{name}</div>;
}

// ❌ WRONG:
import { useState } from "react"  // Double quotes

export function Example({ name }: ExampleProps) {  // No semicolon
  const items = ['one', 'two', 'three']  // No trailing comma
  const handler = value => console.log(value)  // Missing parens

  return <div>{name}</div>
}
```

### ESLint Rules (Beyond Defaults)

```json
{
  "rules": {
    // Console logs
    "no-console": ["warn"], // Warn in dev, error in prod (via CI)

    // Import organization (auto-sort)
    "import/order": [
      "error",
      {
        "groups": [["builtin", "external"], "internal", ["parent", "sibling"], "index", "type"],
        "pathGroups": [
          {
            "pattern": "@/**",
            "group": "internal"
          }
        ],
        "alphabetize": {
          "order": "asc"
        }
      }
    ],

    // TypeScript
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        "prefer": "type-imports"
      }
    ],

    // React
    "react-hooks/exhaustive-deps": "error",
    "react/jsx-curly-brace-presence": ["error", { "props": "never", "children": "never" }]
  }
}
```

### Comments & Documentation

**JSDoc for public APIs:**

```typescript
/**
 * Formats a currency amount according to locale
 *
 * @param amount - The numeric amount to format
 * @param currency - ISO currency code (COP, USD, EUR)
 * @returns Formatted currency string (e.g., "$1.234.567,00")
 *
 * @example
 * formatCurrency(1234567, 'COP') // "$1.234.567,00"
 */
export function formatCurrency(amount: number, currency: string): string {
  // Implementation
}
```

**Inline comments for complex logic:**

```typescript
export function calculateBudgetProgress(spent: number, budgeted: number) {
  // Handle edge case: no budget set
  if (budgeted === 0) return 0;

  // Calculate percentage, capped at 100%
  const progress = Math.min((spent / budgeted) * 100, 100);

  return Math.round(progress);
}
```

**Self-documenting code preferred:**

```typescript
// ✅ GOOD: Self-explanatory
const isOverBudget = spent > budgeted;
const hasPendingTransactions = transactions.some((t) => t.status === 'pending');

// ❌ BAD: Unnecessary comments
const x = spent > budgeted; // Check if over budget
const y = transactions.some((t) => t.status === 'pending'); // Has pending
```

---

## 📋 Constants & Configuration

### Constants Organization

```
src/lib/constants/
├── categories.ts          # Colombian expense categories
├── currencies.ts          # Supported currencies
├── config.ts              # App configuration
└── index.ts               # Barrel export
```

**Example:**

```typescript
// src/lib/constants/categories.ts
export const EXPENSE_CATEGORIES = [
  { id: 'food', name: 'Alimentación', icon: '🍔' },
  { id: 'transport', name: 'Transporte', icon: '🚗' },
  { id: 'utilities', name: 'Servicios', icon: '💡' },
  // ...
] as const;

export type CategoryId = (typeof EXPENSE_CATEGORIES)[number]['id'];
```

```typescript
// src/lib/constants/index.ts
export * from './categories';
export * from './currencies';
export * from './config';
```

---

## ✅ Code Quality Checklist

Before committing code, ensure:

- [ ] **All files follow kebab-case naming**
- [ ] **All components are folders with index.tsx + types.ts**
- [ ] **Named exports only (no default exports)**
- [ ] **Explicit type imports (`import type`)**
- [ ] **Imports auto-sorted by ESLint**
- [ ] **Path aliases use `@/*` consistently**
- [ ] **TypeScript strict mode (no `any` types)**
- [ ] **JSDoc on public APIs (exported functions/components)**
- [ ] **Tests colocated (`.test.ts(x)` next to code)**
- [ ] **Storybook stories colocated (`.stories.tsx`)**
- [ ] **Prettier formatted (run `npm run format`)**
- [ ] **ESLint passes (run `npm run lint`)**
- [ ] **No console.log in production code**

---

## 🚫 Anti-Patterns (NEVER DO THIS)

```typescript
// ❌ Default exports
export default function Button() {}

// ❌ Single-file components (should be folders)
// src/components/ui/button.tsx

// ❌ Barrel exports in features/
// src/features/transactions/index.ts

// ❌ Mixed imports (types + values)
import { User, type Transaction } from '@/types';

// ❌ any type
function process(data: any) {}

// ❌ console.log in production
console.log('Debug info');

// ❌ Non-kebab-case files
// TransactionList.tsx
// useTransactions.ts

// ❌ Multiple path alias styles
import { A } from '@/lib';
import { B } from '~/lib';
import { C } from '$lib';

// ❌ Relative imports for shared code
import { Button } from '../../../components/ui/button'; // Use @/components/ui/button

// ❌ Type in interface name
export interface IUser {} // Just: interface User
export type UserType = {}; // Just: interface User or type User
```

---

## 📖 Quick Reference

### Component Creation Checklist

When creating a new component:

1. Create folder: `components/ui/button/`
2. Create `index.tsx` (component logic)
3. Create `types.ts` (interfaces/types)
4. Create `button.stories.tsx` (Storybook)
5. Create `button.test.tsx` (Vitest)
6. Add `constants.ts` if needed
7. Use named export: `export function Button()`
8. Import types explicitly: `import type { ButtonProps } from './types'`

### tRPC Router Creation Checklist

When creating a new tRPC router:

1. Create folder: `server/api/routers/feature-name/`
2. Create `index.ts` (router definition)
3. Create `schemas.ts` (Zod validation)
4. Use RESTful names: `getAll`, `getById`, `create`, `update`, `delete`
5. Export router: `export const featureRouter = createTRPCRouter({ ... })`
6. Add to root router: `src/server/api/root.ts`

---

## 🧪 Testing Patterns

### Test Organization

**Structure:**

```
tests/
├── fixtures/              # Test data factories
│   ├── user.fixture.ts
│   ├── account.fixture.ts
│   ├── transaction.fixture.ts
│   └── index.ts
├── mocks/                 # Mocked dependencies
│   ├── trpc.mock.ts
│   ├── openai.mock.ts
│   ├── r2.mock.ts
│   ├── redis.mock.ts
│   └── index.ts
├── utils/                 # Test utilities
│   ├── db.test-utils.ts
│   └── cleanup.test-utils.ts
└── e2e/                   # Playwright E2E tests
    ├── auth.spec.ts
    ├── transactions.spec.ts
    └── dashboard.spec.ts
```

### Test Fixtures (Factory Pattern)

**Always use factory pattern for test data:**

```typescript
// tests/fixtures/user.fixture.ts
import type { Prisma } from '@prisma/client';

let userCounter = 0;

export const createUserFixture = async (
  overrides?: Partial<Prisma.UserCreateInput>
): Promise<Prisma.UserCreateInput> => {
  userCounter++;

  return {
    email: `test${userCounter}@example.com`,
    password: await hashPassword('Test1234!'),
    name: `Test User ${userCounter}`,
    role: 'USER',
    ...overrides,
  };
};
```

**Why fixtures?**

- ✅ Consistent test data
- ✅ Unique data per test (no collisions)
- ✅ Easy to customize with overrides
- ✅ Type-safe

### Mocking Patterns

**Mock external dependencies, not internal code:**

```typescript
// tests/mocks/openai.mock.ts
import { vi } from 'vitest';

export const mockOpenAI = {
  chat: {
    completions: {
      create: vi.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: 'Mocked AI response',
            },
          },
        ],
      }),
    },
  },
};
```

**What to mock:**

- ✅ External APIs (OpenAI, Cloudflare R2, payment gateways)
- ✅ Infrastructure (Redis, BullMQ queues)
- ✅ Third-party services (NextAuth sessions, file uploads)

**What NOT to mock:**

- ❌ Internal business logic
- ❌ Utility functions
- ❌ Database (use test database instead)

### Test Database Strategy

**Use real test database, not mocked Prisma:**

```typescript
// tests/utils/db.test-utils.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function cleanupTestDatabase() {
  // Truncate all tables between tests
  const tables = await prisma.$queryRaw`
    SELECT tablename FROM pg_tables
    WHERE schemaname='public'
  `;

  for (const { tablename } of tables) {
    if (tablename !== '_prisma_migrations') {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`);
    }
  }
}

export { prisma };
```

**Test cleanup:**

```typescript
// tests/setup.ts
import { afterEach, afterAll } from 'vitest';
import { cleanupTestDatabase, prisma } from './utils/db.test-utils';

afterEach(async () => {
  await cleanupTestDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});
```

### Test Naming Convention

**Pattern:** `describe` → feature, `it` → specific behavior

```typescript
// ✅ GOOD
describe('Transaction creation', () => {
  it('should create expense transaction with valid data', async () => {
    // ...
  });

  it('should reject transaction with negative amount', async () => {
    // ...
  });
});

// ❌ BAD
describe('Transactions', () => {
  it('test 1', async () => {
    // ...
  });
});
```

### E2E Test Patterns

**Use Page Object Model:**

```typescript
// tests/e2e/pages/login.page.ts
import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.fill('[name="email"]', email);
    await this.page.fill('[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }

  async expectLoginSuccess() {
    await this.page.waitForURL('/dashboard');
  }
}
```

**Usage:**

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page';

test('user can login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('test@example.com', 'Test1234!');
  await loginPage.expectLoginSuccess();
});
```

---

**Document Status:** ✅ Complete
**Enforcement:** All rules enforced via ESLint, Prettier, and TypeScript
**Zero Exceptions:** These rules apply to 100% of code, no special cases
