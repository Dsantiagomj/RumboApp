# Rumbo - Complete Setup Guide

> **Purpose:** Fill ALL gaps from documentation - complete configurations, schemas, and implementation details
> **Use:** Reference this when implementing the 10-day production-grade setup
> **Status:** Complete implementation guide

---

## 📋 Table of Contents

1. [Dependencies (package.json)](#1-dependencies-packagejson)
2. [Configuration Files](#2-configuration-files)
3. [Database Schema (Prisma)](#3-database-schema-prisma)
4. [Authentication Setup (NextAuth)](#4-authentication-setup-nextauth)
5. [tRPC Setup](#5-trpc-setup)
6. [Design System (Colors & Tokens)](#6-design-system-colors--tokens)
7. [Infrastructure (Docker)](#7-infrastructure-docker)
8. [CI/CD (GitHub Actions)](#8-cicd-github-actions)
9. [Testing Setup](#9-testing-setup)
10. [Code Quality (ESLint, Prettier, Husky)](#10-code-quality-eslint-prettier-husky)
11. [Additional Implementations](#11-additional-implementations)

---

## 1. Dependencies (package.json)

### Complete package.json

```json
{
  "name": "rumbo",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md,css}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,md,css}\"",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:migrate:deploy": "prisma migrate deploy",
    "db:seed": "prisma db seed",
    "db:studio": "prisma studio",
    "db:reset": "prisma migrate reset",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "analyze": "ANALYZE=true next build",
    "check": "pnpm run format:check && pnpm run lint && pnpm run type-check && pnpm run test run",
    "prepare": "husky"
  },
  "dependencies": {
    "@hookform/resolvers": "3.9.1",
    "@node-rs/argon2": "2.0.0",
    "@prisma/client": "7.2.0",
    "@radix-ui/react-accordion": "1.2.2",
    "@radix-ui/react-avatar": "1.1.2",
    "@radix-ui/react-checkbox": "1.1.3",
    "@radix-ui/react-dialog": "1.1.3",
    "@radix-ui/react-dropdown-menu": "2.1.3",
    "@radix-ui/react-label": "2.1.1",
    "@radix-ui/react-popover": "1.1.3",
    "@radix-ui/react-select": "2.1.3",
    "@radix-ui/react-separator": "1.1.1",
    "@radix-ui/react-slot": "1.1.1",
    "@radix-ui/react-tabs": "1.1.2",
    "@radix-ui/react-toast": "1.2.3",
    "@t3-oss/env-nextjs": "0.11.1",
    "@tanstack/react-query": "5.62.11",
    "@trpc/client": "11.0.0",
    "@trpc/react-query": "11.0.0",
    "@trpc/server": "11.0.0",
    "ai": "4.1.19",
    "bullmq": "5.31.5",
    "class-variance-authority": "0.7.1",
    "clsx": "2.1.1",
    "date-fns": "4.1.0",
    "framer-motion": "11.15.0",
    "ioredis": "5.4.2",
    "@upstash/ratelimit": "2.0.4",
    "@upstash/redis": "1.34.3",
    "jose": "5.9.6",
    "lucide-react": "0.468.0",
    "next": "16.1.2",
    "next-auth": "5.0.0-beta.25",
    "next-themes": "0.4.4",
    "openai": "4.77.3",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-hook-form": "7.54.2",
    "resend": "4.0.2",
    "sonner": "1.7.2",
    "superjson": "2.2.2",
    "tailwind-merge": "2.6.0",
    "tailwindcss-animate": "1.0.7",
    "zod": "3.24.1",
    "zustand": "5.0.2"
  },
  "devDependencies": {
    "@chromatic-com/storybook": "^3.2.2",
    "@next/bundle-analyzer": "^16.1.2",
    "@playwright/test": "^1.49.1",
    "@storybook/addon-a11y": "^8.5.3",
    "@storybook/addon-essentials": "^8.5.3",
    "@storybook/addon-interactions": "^8.5.3",
    "@storybook/addon-links": "^8.5.3",
    "@storybook/blocks": "^8.5.3",
    "@storybook/nextjs": "^8.5.3",
    "@storybook/react": "^8.5.3",
    "@storybook/test": "^8.5.3",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/node": "^22.10.5",
    "@types/react": "^19.0.6",
    "@types/react-dom": "^19.0.2",
    "@typescript-eslint/eslint-plugin": "^8.19.1",
    "@typescript-eslint/parser": "^8.19.1",
    "@vitejs/plugin-react": "^4.3.4",
    "@vitest/coverage-v8": "^2.1.8",
    "@vitest/ui": "^2.1.8",
    "autoprefixer": "^10.4.20",
    "dompurify": "^3.2.3",
    "eslint": "^9.18.0",
    "eslint-config-next": "^16.1.2",
    "eslint-config-prettier": "^10.0.1",
    "eslint-plugin-import": "^2.31.0",
    "eslint-plugin-jsx-a11y": "^6.10.2",
    "eslint-plugin-react": "^7.37.3",
    "eslint-plugin-react-hooks": "^5.1.0",
    "eslint-plugin-storybook": "^0.11.1",
    "happy-dom": "^15.11.7",
    "husky": "^9.1.7",
    "lint-staged": "^15.2.11",
    "postcss": "^8.4.49",
    "prettier": "^3.4.2",
    "prettier-plugin-tailwindcss": "^0.6.9",
    "prisma": "^7.2.0",
    "storybook": "^8.5.3",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.7.2",
    "vite-tsconfig-paths": "^5.1.4",
    "vitest": "^2.1.8"
  },
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=9.0.0"
  },
  "packageManager": "pnpm@9.15.4",
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

**Key Notes:**

- **Production dependencies** use exact versions (no ^ or ~)
- **Dev dependencies** use flexible versions (^)
- **Missing packages added:** @node-rs/argon2, ioredis, bullmq, jose
- **Engines:** Enforces Node 20+ and pnpm 9+

---

## 2. Configuration Files

### 2.1 next.config.ts

```typescript
import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // Enable experimental features
  experimental: {
    // Enable Partial Prerendering
    ppr: 'incremental',
    // TypedRoutes for type-safe routing
    typedRoutes: true,
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' ${
                process.env.NODE_ENV === 'development'
                  ? "'unsafe-eval' 'unsafe-inline'"
                  : "'nonce-{NONCE}'"
              } https://vercel.live;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https: blob:;
              font-src 'self' data:;
              connect-src 'self' https://api.openai.com https://*.r2.cloudflarestorage.com https://vercel.live;
              frame-src 'self' https://vercel.live;
              frame-ancestors 'none';
              base-uri 'self';
              form-action 'self';
            `
              .replace(/\s{2,}/g, ' ')
              .trim(),
          },
        ],
      },
    ];
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
        pathname: '/**',
      },
    ],
  },

  // Disable powered-by header
  poweredByHeader: false,

  // Compiler options
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
  },

  // Logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default withBundleAnalyzer(nextConfig);
```

### 2.2 tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}', './app/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'oklch(var(--border) / <alpha-value>)',
        input: 'oklch(var(--input) / <alpha-value>)',
        ring: 'oklch(var(--ring) / <alpha-value>)',
        background: 'oklch(var(--background) / <alpha-value>)',
        foreground: 'oklch(var(--foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
          foreground: 'oklch(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
          foreground: 'oklch(var(--secondary-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'oklch(var(--destructive) / <alpha-value>)',
          foreground: 'oklch(var(--destructive-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
          foreground: 'oklch(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
          foreground: 'oklch(var(--accent-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'oklch(var(--popover) / <alpha-value>)',
          foreground: 'oklch(var(--popover-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'oklch(var(--card) / <alpha-value>)',
          foreground: 'oklch(var(--card-foreground) / <alpha-value>)',
        },
        // Financial semantic colors
        positive: 'oklch(var(--positive) / <alpha-value>)',
        negative: 'oklch(var(--negative) / <alpha-value>)',
        neutral: 'oklch(var(--neutral) / <alpha-value>)',
        warning: 'oklch(var(--warning) / <alpha-value>)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

### 2.3 tsconfig.json

```json
{
  "compilerOptions": {
    /* Language and Environment */
    "target": "ES2022",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "jsx": "preserve",

    /* Modules */
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,

    /* JavaScript Support */
    "allowJs": true,
    "checkJs": false,

    /* Emit */
    "noEmit": true,
    "incremental": true,

    /* Interop Constraints */
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,

    /* Type Checking - STRICT MODE */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "noUncheckedIndexedAccess": false,
    "exactOptionalPropertyTypes": false,
    "noImplicitOverride": false,

    /* Completeness */
    "skipLibCheck": true,

    /* Path Aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },

    /* Next.js */
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", ".next", "out", "dist"]
}
```

### 2.4 .prettierrc

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always",
  "endOfLine": "lf",
  "bracketSpacing": true,
  "jsxSingleQuote": false,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### 2.5 .prettierignore

```
.next
node_modules
out
dist
build
.turbo
.vercel
.storybook-static
coverage
pnpm-lock.yaml
package-lock.json
*.min.js
*.min.css
```

---

## 3. Database Schema (Prisma)

### Complete prisma/schema.prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================================================
// USER & AUTHENTICATION
// ============================================================================

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?
  password      String? // Hashed with Argon2
  name          String?
  image         String?
  colombianId   String? // CC, CE, Pasaporte number
  colombianIdType ColombianIdType? @default(CC)
  nickname      String? // For AI personalization
  role          UserRole  @default(USER)

  // Preferences
  currency      String    @default("COP")
  locale        String    @default("es-CO")
  timezone      String    @default("America/Bogota")
  theme         String    @default("light") // light | dark | system

  // Relations
  accounts      Account[]
  sessions      Session[]
  transactions  Transaction[]
  categories    Category[]
  budgets       Budget[]
  bills         Bill[]
  aiChatSessions AIChatSession[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime? // Soft delete

  @@index([email])
  @@index([deletedAt])
}

enum UserRole {
  USER
  ADMIN
}

enum ColombianIdType {
  CC        // Cédula de Ciudadanía
  CE        // Cédula de Extranjería
  PASAPORTE // Pasaporte
}

// NextAuth models
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ============================================================================
// FINANCIAL ACCOUNTS
// ============================================================================

model FinancialAccount {
  id            String   @id @default(cuid())
  userId        String

  name          String // "Bancolombia Ahorros", "Nequi"
  bankName      String? // "Bancolombia", "Nequi"
  accountNumber String? // Masked: "****1234"
  accountType   AccountType
  currency      String   @default("COP")

  // Appearance
  color         String   @default("#6366f1") // Hex color for UI
  icon          String? // Icon name (lucide-react)

  // Balance
  initialBalance Decimal  @default(0) @db.Decimal(12, 2)
  currentBalance Decimal  @default(0) @db.Decimal(12, 2)

  // Relations
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions  Transaction[]

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  deletedAt     DateTime? // Soft delete

  @@index([userId])
  @@index([deletedAt])
}

enum AccountType {
  SAVINGS      // Cuenta de ahorros
  CHECKING     // Cuenta corriente
  CREDIT_CARD  // Tarjeta de crédito
  CASH         // Efectivo
  INVESTMENT   // Inversión
  OTHER        // Otro
}

// ============================================================================
// TRANSACTIONS
// ============================================================================

model Transaction {
  id            String   @id @default(cuid())
  userId        String
  accountId     String

  amount        Decimal  @db.Decimal(12, 2)
  currency      String   @default("COP")
  exchangeRate  Decimal? @db.Decimal(10, 4) // For multi-currency support

  description   String
  merchant      String? // Store/merchant name

  categoryId    String?

  type          TransactionType
  status        TransactionStatus @default(CLEARED)

  date          DateTime

  // For transfers between accounts
  transferToAccountId String?
  linkedTransactionId String? // Link to opposite side of transfer

  // Additional metadata
  notes         String?
  tags          String[] // Flexible tagging
  receiptUrl    String? // URL to receipt image (Cloudflare R2)

  // Relations
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  account       FinancialAccount @relation(fields: [accountId], references: [id], onDelete: Cascade)
  category      Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  deletedAt     DateTime? // Soft delete

  @@index([userId])
  @@index([accountId])
  @@index([categoryId])
  @@index([date])
  @@index([type])
  @@index([deletedAt])
}

enum TransactionType {
  INCOME    // Income
  EXPENSE   // Expense
  TRANSFER  // Transfer between accounts
}

enum TransactionStatus {
  PENDING     // Pending (not yet cleared)
  CLEARED     // Cleared
  RECONCILED  // Reconciled (matched with bank statement)
}

// ============================================================================
// CATEGORIES
// ============================================================================

model Category {
  id            String   @id @default(cuid())
  userId        String?  // null = system category (default Colombian categories)

  name          String
  nameEs        String? // Spanish name
  icon          String   @default("📌") // Emoji or lucide icon name
  color         String   @default("#6366f1") // Hex color

  type          TransactionType @default(EXPENSE)

  // Parent category for subcategories (future)
  parentId      String?

  // Relations
  user          User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions  Transaction[]
  budgets       Budget[]

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  deletedAt     DateTime? // Soft delete

  @@index([userId])
  @@index([type])
  @@index([deletedAt])
}

// ============================================================================
// BUDGETS
// ============================================================================

model Budget {
  id            String   @id @default(cuid())
  userId        String
  categoryId    String

  name          String
  amount        Decimal  @db.Decimal(12, 2)
  currency      String   @default("COP")

  period        BudgetPeriod @default(MONTHLY)

  // Period dates
  startDate     DateTime
  endDate       DateTime

  // Rollover unused budget to next period
  rollover      Boolean  @default(false)

  // Alert thresholds (percentage)
  alertAt       Int?     @default(80) // Alert at 80% spent

  // Relations
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  category      Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  deletedAt     DateTime? // Soft delete

  @@index([userId])
  @@index([categoryId])
  @@index([startDate, endDate])
  @@index([deletedAt])
}

enum BudgetPeriod {
  WEEKLY
  MONTHLY
  YEARLY
  CUSTOM
}

// ============================================================================
// BILLS (Recurring)
// ============================================================================

model Bill {
  id            String   @id @default(cuid())
  userId        String

  name          String // "Codensa (Electricidad)", "Claro (Internet)"
  description   String?

  amount        Decimal  @db.Decimal(12, 2)
  currency      String   @default("COP")

  categoryId    String? // Link to Servicios category

  frequency     BillFrequency @default(MONTHLY)

  // Billing dates
  dueDay        Int // Day of month (1-31)

  // Reminders
  reminderDays  Int      @default(3) // Remind 3 days before

  // Auto-pay
  autoPay       Boolean  @default(false)
  accountId     String? // Account to auto-pay from

  // Status
  isActive      Boolean  @default(true)

  // Relations
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  instances     BillInstance[]

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  deletedAt     DateTime? // Soft delete

  @@index([userId])
  @@index([isActive])
  @@index([deletedAt])
}

enum BillFrequency {
  WEEKLY
  BIWEEKLY
  MONTHLY
  QUARTERLY
  YEARLY
}

// Bill instances (generated monthly)
model BillInstance {
  id            String   @id @default(cuid())
  billId        String

  dueDate       DateTime
  amount        Decimal  @db.Decimal(12, 2)

  status        BillStatus @default(PENDING)

  paidDate      DateTime?
  paidAmount    Decimal? @db.Decimal(12, 2)

  // Link to transaction when paid
  transactionId String?

  // Relations
  bill          Bill     @relation(fields: [billId], references: [id], onDelete: Cascade)

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([billId])
  @@index([dueDate])
  @@index([status])
}

enum BillStatus {
  PENDING
  PAID
  OVERDUE
  SKIPPED
}

// ============================================================================
// AI CHAT
// ============================================================================

model AIChatSession {
  id            String   @id @default(cuid())
  userId        String

  title         String? // Auto-generated or user-set

  // Relations
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  messages      AIChatMessage[]

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  deletedAt     DateTime? // Soft delete

  @@index([userId])
  @@index([deletedAt])
}

model AIChatMessage {
  id            String   @id @default(cuid())
  sessionId     String

  role          MessageRole
  content       String   @db.Text

  // Function calling metadata
  functionName  String?
  functionArgs  Json?
  functionResult Json?

  // Relations
  session       AIChatSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)

  createdAt     DateTime @default(now())

  @@index([sessionId])
  @@index([createdAt])
}

enum MessageRole {
  USER
  ASSISTANT
  SYSTEM
  FUNCTION
}
```

### prisma/seed.ts (Colombian Categories)

```typescript
import { PrismaClient, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Colombian categories...');

  // Default Colombian categories (system-wide, userId = null)
  const categories = [
    // Expense categories
    {
      name: 'Food',
      nameEs: 'Alimentación',
      icon: '🍔',
      color: '#f97316',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Transport',
      nameEs: 'Transporte',
      icon: '🚗',
      color: '#3b82f6',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Bills',
      nameEs: 'Servicios',
      icon: '💡',
      color: '#eab308',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Entertainment',
      nameEs: 'Entretenimiento',
      icon: '🎬',
      color: '#a855f7',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Health',
      nameEs: 'Salud',
      icon: '⚕️',
      color: '#ef4444',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Education',
      nameEs: 'Educación',
      icon: '📚',
      color: '#22c55e',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Personal',
      nameEs: 'Personal',
      icon: '👤',
      color: '#ec4899',
      type: TransactionType.EXPENSE,
    },
    { name: 'Debt', nameEs: 'Deudas', icon: '💳', color: '#374151', type: TransactionType.EXPENSE },
    { name: 'Other', nameEs: 'Otros', icon: '📌', color: '#6b7280', type: TransactionType.EXPENSE },

    // Income categories
    {
      name: 'Salary',
      nameEs: 'Salario',
      icon: '💰',
      color: '#10b981',
      type: TransactionType.INCOME,
    },
    {
      name: 'Freelance',
      nameEs: 'Freelance',
      icon: '💼',
      color: '#14b8a6',
      type: TransactionType.INCOME,
    },
    {
      name: 'Investment',
      nameEs: 'Inversión',
      icon: '📈',
      color: '#06b6d4',
      type: TransactionType.INCOME,
    },
    {
      name: 'Other Income',
      nameEs: 'Otros Ingresos',
      icon: '💸',
      color: '#0891b2',
      type: TransactionType.INCOME,
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.name.toLowerCase().replace(/\s/g, '-') },
      update: {},
      create: {
        id: category.name.toLowerCase().replace(/\s/g, '-'),
        ...category,
        userId: null, // System category
      },
    });
  }

  console.log('✅ Colombian categories seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## 4️⃣ Authentication Setup (NextAuth + Argon2)

### Files to Create:

```
src/server/auth/
├── config.ts          # NextAuth v5 configuration
├── argon2.ts          # Argon2 hashing utilities
└── middleware.ts      # Auth middleware for tRPC
```

### Implementation Checklist:

**src/server/auth/config.ts:**

- [ ] NextAuth v5 setup with App Router
- [ ] Credentials provider (email + password)
- [ ] Google OAuth provider
- [ ] Prisma adapter configuration
- [ ] JWT session strategy (24 hours)
- [ ] Session callbacks (add user role, id)
- [ ] SignIn callback (verify email if needed)
- [ ] Pages configuration (custom login/register)

**src/server/auth/argon2.ts:**

- [ ] `hashPassword(password: string)` - Hash with Argon2
- [ ] `verifyPassword(password: string, hash: string)` - Verify
- [ ] Argon2 configuration (memory cost, time cost, parallelism)

**Argon2 Config (OWASP 2024 Compliant):**

```typescript
import { hash, verify } from '@node-rs/argon2';

export async function hashPassword(password: string): Promise<string> {
  return hash(password, {
    memoryCost: 65536, // 64 MiB (OWASP 2024 minimum)
    timeCost: 3, // 3 iterations (OWASP 2024 minimum)
    outputLen: 32, // 32 bytes
    parallelism: 4, // 4 threads (production servers)
  });
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return verify(hash, password);
}
```

**Password Complexity Requirements:**

```typescript
// src/lib/validation/auth.schema.ts
import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(12, 'La contraseña debe tener al menos 12 caracteres')
  .max(128, 'Contraseña demasiado larga')
  .regex(/[a-z]/, 'Debe contener al menos una minúscula')
  .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número')
  .regex(/[^a-zA-Z0-9]/, 'Debe contener al menos un carácter especial (!@#$%^&*...)');

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: passwordSchema,
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
});
```

**JWT Session Configuration (24h for financial app):**

```typescript
// src/server/auth/config.ts
export const authConfig = {
  session: {
    strategy: 'jwt' as const,
    maxAge: 24 * 60 * 60, // 24 hours (financial app security)
    updateAge: 60 * 60, // Refresh token every 1 hour
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
```

**app/api/auth/[...nextauth]/route.ts:**

- [ ] Export GET and POST handlers from NextAuth config

**Middleware (app/middleware.ts):**

- [ ] Protect `/dashboard/*` routes
- [ ] Redirect unauthenticated users to `/login`
- [ ] Allow public routes (`/`, `/login`, `/register`)

---

## 5️⃣ tRPC Setup

### Files to Create:

```
src/server/api/
├── trpc.ts            # tRPC initialization (createTRPCContext, procedures)
├── root.ts            # Root router (combines all routers)
└── routers/
    └── health/
        └── index.ts   # Example health check router

src/lib/trpc/
├── client.ts          # tRPC client setup
└── react.tsx          # TRPCProvider wrapper

app/api/trpc/[trpc]/
└── route.ts           # tRPC API endpoint
```

### Implementation Checklist:

**src/server/api/trpc.ts:**

- [ ] `createTRPCContext` - Get session, headers
- [ ] `initTRPC` - Initialize tRPC with Superjson
- [ ] `publicProcedure` - Public endpoints
- [ ] `protectedProcedure` - Requires auth (middleware)
- [ ] Auth middleware - Check session, throw UNAUTHORIZED
- [ ] Error formatter - Format TRPCError responses

**src/server/api/root.ts:**

- [ ] Root router combining all feature routers
- [ ] Export `AppRouter` type for client

**src/lib/trpc/client.ts:**

- [ ] Create tRPC client with httpBatchLink
- [ ] Configure headers (auth token)
- [ ] Superjson transformer

**src/lib/trpc/react.tsx:**

- [ ] `TRPCProvider` component
- [ ] QueryClient setup
- [ ] TRPCReactProvider wrapper

**app/api/trpc/[trpc]/route.ts:**

- [ ] Fetch request handler for tRPC
- [ ] Export GET and POST handlers

**Error Handling Pattern:**

```typescript
import { TRPCError } from '@trpc/server';

// In procedures:
if (!input.id) {
  throw new TRPCError({
    code: 'BAD_REQUEST',
    message: 'ID is required',
  });
}

if (data.userId !== ctx.session.user.id) {
  throw new TRPCError({
    code: 'UNAUTHORIZED',
    message: 'Not authorized to access this resource',
  });
}

if (!found) {
  throw new TRPCError({
    code: 'NOT_FOUND',
    message: 'Resource not found',
  });
}
```

---

## 6️⃣ Design System (Colors & Tokens)

### Files to Create:

```
app/globals.css        # CSS custom properties (oklch colors)
```

### Exact Color Values (oklch):

**app/globals.css:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Purple theme colors */
    --background: 0.99 0 0;
    --foreground: 0.15 0.01 260;

    --primary: 0.62 0.2 270; /* Purple 500 */
    --primary-foreground: 1 0 0;

    --secondary: 0.96 0.01 270; /* Purple 50 */
    --secondary-foreground: 0.2 0.01 270;

    --accent: 0.96 0.01 270;
    --accent-foreground: 0.2 0.01 270;

    --destructive: 0.63 0.24 27; /* Red */
    --destructive-foreground: 1 0 0;

    --muted: 0.96 0.01 260;
    --muted-foreground: 0.5 0.01 260;

    --card: 1 0 0;
    --card-foreground: 0.15 0.01 260;

    --popover: 1 0 0;
    --popover-foreground: 0.15 0.01 260;

    --border: 0.92 0.01 260;
    --input: 0.92 0.01 260;
    --ring: 0.62 0.2 270;

    /* Financial semantic colors */
    --positive: 0.65 0.18 145; /* Green */
    --negative: 0.63 0.24 27; /* Red */
    --neutral: 0.55 0.02 240; /* Gray-blue */
    --warning: 0.78 0.16 70; /* Amber */

    --radius: 0.625rem; /* 10px */
  }

  .dark {
    --background: 0.12 0.01 260;
    --foreground: 0.98 0 0;

    --primary: 0.68 0.22 270;
    --primary-foreground: 0.12 0.01 260;

    --secondary: 0.2 0.02 270;
    --secondary-foreground: 0.98 0 0;

    --accent: 0.2 0.02 270;
    --accent-foreground: 0.98 0 0;

    --destructive: 0.55 0.28 27;
    --destructive-foreground: 0.98 0 0;

    --muted: 0.2 0.02 260;
    --muted-foreground: 0.7 0.01 260;

    --card: 0.15 0.01 260;
    --card-foreground: 0.98 0 0;

    --popover: 0.15 0.01 260;
    --popover-foreground: 0.98 0 0;

    --border: 0.25 0.02 260;
    --input: 0.25 0.02 260;
    --ring: 0.68 0.22 270;

    /* Financial colors (same in dark) */
    --positive: 0.65 0.18 145;
    --negative: 0.63 0.24 27;
    --neutral: 0.55 0.02 240;
    --warning: 0.78 0.16 70;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
    font-feature-settings:
      'rlig' 1,
      'calt' 1;
  }

  /* Tabular numbers for financial data */
  .tabular-nums {
    font-variant-numeric: tabular-nums;
  }
}
```

### Font Configuration:

**app/layout.tsx:**

```typescript
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

---

## 7️⃣ Infrastructure (Docker & Environment)

### Files to Create:

```
docker/
├── docker-compose.yml     # Postgres + PgBouncer + Redis + App
├── Dockerfile             # Production-optimized app image
├── pgbouncer.ini          # PgBouncer configuration
└── .env.docker            # Docker environment template

.env.example               # Complete environment variables template
```

### docker-compose.yml:

```yaml
version: '3.9'

services:
  postgres:
    image: postgres:16-alpine
    container_name: rumbo-postgres
    environment:
      POSTGRES_USER: rumbo
      POSTGRES_PASSWORD: rumbo_password
      POSTGRES_DB: rumbo
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U rumbo']
      interval: 10s
      timeout: 5s
      retries: 5

  pgbouncer:
    image: edoburu/pgbouncer:latest
    container_name: rumbo-pgbouncer
    environment:
      DATABASE_URL: postgres://rumbo:rumbo_password@postgres:5432/rumbo
      POOL_MODE: transaction
      MAX_CLIENT_CONN: 100
      DEFAULT_POOL_SIZE: 20
    ports:
      - '6432:5432'
    depends_on:
      postgres:
        condition: service_healthy

  redis:
    image: redis:7-alpine
    container_name: rumbo-redis
    command: redis-server --requirepass rumbo_redis_password --appendonly yes
    environment:
      REDIS_PASSWORD: rumbo_redis_password
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    healthcheck:
      test: ['CMD', 'redis-cli', '-a', 'rumbo_redis_password', 'ping']
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
  redis_data:
```

### .env.example (Complete):

```env
# ============================================================================
# DATABASE
# ============================================================================
DATABASE_URL="postgresql://rumbo:rumbo_password@localhost:5432/rumbo"
# For Docker: postgresql://rumbo:rumbo_password@pgbouncer:5432/rumbo

# ============================================================================
# NEXTAUTH
# ============================================================================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
# Generate with: openssl rand -base64 32

# ============================================================================
# OAUTH PROVIDERS
# ============================================================================
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# ============================================================================
# OPENAI
# ============================================================================
OPENAI_API_KEY="sk-..."

# ============================================================================
# CLOUDFLARE R2 (File Storage)
# ============================================================================
R2_ACCOUNT_ID=""
R2_ACCESS_KEY_ID=""
R2_SECRET_ACCESS_KEY=""
R2_BUCKET_NAME="rumbo-receipts"
R2_PUBLIC_URL="https://your-bucket.r2.cloudflarestorage.com"

# ============================================================================
# REDIS (BullMQ + Rate Limiting)
# ============================================================================
REDIS_URL="redis://:rumbo_redis_password@localhost:6379"
# For Docker: redis://:rumbo_redis_password@redis:6379
REDIS_TOKEN="" # Only required for Upstash, leave empty for self-hosted

# ============================================================================
# EMAIL (Resend)
# ============================================================================
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@rumbo.app"

# ============================================================================
# MONITORING
# ============================================================================
# Sentry
SENTRY_DSN=""
SENTRY_ORG=""
SENTRY_PROJECT=""
SENTRY_AUTH_TOKEN=""

# Plausible Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN="rumbo.app"

# Axiom Logging
AXIOM_TOKEN=""
AXIOM_DATASET="rumbo-logs"

# ============================================================================
# RATE LIMITING (IP API)
# ============================================================================
IPAPI_KEY=""  # ipapi.co for geolocation

# ============================================================================
# FEATURE FLAGS
# ============================================================================
NEXT_PUBLIC_ENABLE_AI_CHAT="true"
NEXT_PUBLIC_ENABLE_RECEIPT_SCAN="false"  # v2 feature
```

---

## 8️⃣ CI/CD (GitHub Actions)

### Files to Create:

```
.github/workflows/
├── ci.yml             # Main CI/CD pipeline
├── security.yml       # Security audits
└── deploy.yml         # Vercel deployment

lighthouserc.json      # Lighthouse CI configuration
```

### .github/workflows/ci.yml:

```yaml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '20'
  PNPM_VERSION: '9'

jobs:
  # ============================================================================
  # QUALITY CHECKS
  # ============================================================================
  quality:
    name: Code Quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm run lint

      - name: Format check
        run: pnpm run format:check

      - name: Type check
        run: pnpm run type-check

  # ============================================================================
  # TESTS
  # ============================================================================
  test:
    name: Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run unit tests
        run: pnpm run test run --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/coverage-final.json
          flags: unittests
          fail_ci_if_error: true

  # ============================================================================
  # E2E TESTS
  # ============================================================================
  e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps

      - name: Run E2E tests
        run: pnpm run test:e2e

      - name: Upload Playwright report
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  # ============================================================================
  # LIGHTHOUSE CI
  # ============================================================================
  lighthouse:
    name: Lighthouse CI
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm run build

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.13.x
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

### lighthouserc.json:

```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./.next",
      "url": ["http://localhost:3000/", "http://localhost:3000/dashboard"]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

---

## 9️⃣ Testing Setup

### Files to Create:

**vitest.config.ts:**

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.config.*',
        '**/*.d.ts',
        '**/index.ts',
        '**/*.stories.tsx',
        '.next/',
        'coverage/',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**tests/setup.ts:**

```typescript
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});
```

**playwright.config.ts:**

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

**.storybook/main.ts:**

```typescript
import type { StorybookConfig } from '@storybook/nextjs';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@chromatic-com/storybook',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  staticDirs: ['../public'],
  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '../src'),
      };
    }
    return config;
  },
};

export default config;
```

**.storybook/preview.ts:**

```typescript
import type { Preview } from '@storybook/react';
import '../app/globals.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0a0a0a' },
      ],
    },
  },
};

export default preview;
```

---

## 🔟 Code Quality (ESLint, Prettier, Husky)

### Files to Create:

**eslint.config.mjs (ESLint 9 Flat Config):**

```javascript
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default [
  js.configs.recommended,
  ...compat.extends('next/core-web-vitals'),
  ...compat.extends('prettier'),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@typescript-eslint': typescriptEslint,
      react: react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
      storybook: storybook,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // TypeScript
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

      // React
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],

      // Import organization
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external'], 'internal', ['parent', 'sibling'], 'index', 'type'],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
            },
          ],
          alphabetize: {
            order: 'asc',
          },
          'newlines-between': 'always',
        },
      ],

      // General
      'prefer-const': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    ignores: [
      '.next',
      'node_modules',
      'out',
      'dist',
      'build',
      '.turbo',
      'coverage',
      'storybook-static',
    ],
  },
];
```

**Husky Setup:**

```bash
# Initialize Husky
pnpm exec husky init

# Create pre-commit hook
echo "pnpm run lint-staged" > .husky/pre-commit

# Create pre-push hook
echo "pnpm run type-check && pnpm run test run" > .husky/pre-push
```

**.lintstagedrc.json:**

```json
{
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md,css}": ["prettier --write"]
}
```

---

## 1️⃣1️⃣ Additional Implementations

### 11.1 Rate Limiting (@upstash/ratelimit)

**Files to Create:**

```
src/server/lib/rate-limit.ts
```

**Why @upstash/ratelimit?**

- Distributed rate limiting (works across multiple server instances)
- Built-in algorithms (sliding window, fixed window, token bucket)
- Automatic rate limit headers (X-RateLimit-Remaining)
- Better handling of edge cases (race conditions, clock drift)

**Implementation:**

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Redis client (Upstash-compatible)
const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_TOKEN!, // Required for Upstash
});

// Define rate limiters with different limits
export const authRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'), // 5 attempts per 15 minutes
  analytics: true,
  prefix: 'ratelimit:auth',
});

export const apiRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
  analytics: true,
  prefix: 'ratelimit:api',
});

export const aiRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 AI requests per minute
  analytics: true,
  prefix: 'ratelimit:ai',
});

// Helper function for consistent error handling
export async function checkRateLimit(
  limiter: Ratelimit,
  identifier: string
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const { success, limit, remaining, reset } = await limiter.limit(identifier);

  return {
    success,
    limit,
    remaining,
    reset,
  };
}

// Usage in tRPC middleware:
export const rateLimitMiddleware = t.middleware(async (opts) => {
  const { ctx } = opts;
  const identifier = ctx.session?.user?.id || ctx.ip || 'anonymous';

  const { success, remaining, reset } = await checkRateLimit(apiRateLimiter, identifier);

  if (!success) {
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: `Rate limit exceeded. Try again in ${Math.ceil((reset - Date.now()) / 1000)}s`,
    });
  }

  return opts.next({
    ctx: {
      ...ctx,
      rateLimitRemaining: remaining,
    },
  });
});

// Use in procedures:
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed).use(rateLimitMiddleware);
```

**Environment Variables (.env):**

```env
# Redis (Upstash or self-hosted with authentication)
REDIS_URL="redis://:rumbo_redis_password@localhost:6379"
# For Docker: redis://:rumbo_redis_password@redis:6379
REDIS_TOKEN="" # Only required for Upstash, leave empty for self-hosted
```

**Note:** If using self-hosted Redis (Docker), the token is not required. The @upstash/redis client is compatible with standard Redis when token is empty.

### 11.2 Cloudflare R2 File Upload

**Files to Create:**

```
src/server/lib/r2.ts
```

**Implementation:**

```typescript
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadReceipt(
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const key = `receipts/${Date.now()}-${fileName}`;

  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: file,
      ContentType: contentType,
    })
  );

  return `${process.env.R2_PUBLIC_URL}/${key}`;
}

export async function getPresignedUploadUrl(fileName: string): Promise<string> {
  const key = `receipts/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
  });

  const url = await getSignedUrl(r2, command, { expiresIn: 3600 }); // 1 hour

  return url;
}
```

### 11.3 Sentry Monitoring

**Files to Create:**

```
sentry.client.config.ts
sentry.server.config.ts
sentry.edge.config.ts
instrumentation.ts
```

**sentry.client.config.ts:**

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,

  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
```

**sentry.server.config.ts:**

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

**instrumentation.ts:**

```typescript
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}
```

---

## 🎯 Implementation Order (10-Day Plan)

**Days 1-2: Foundation** (Sections 1-3 above)

- Install dependencies
- Configure all tools (Next.js, TypeScript, Tailwind, ESLint, Prettier)
- Set up Prisma schema and migrations

**Days 3-4: Authentication & Infrastructure** (GAP_ANALYSIS Sections 4, 7)

- Set up Docker (Postgres + PgBouncer + Redis)
- Implement NextAuth v5 with Argon2
- Configure rate limiting with @upstash/ratelimit

**Days 5-6: API Layer & Design** (GAP_ANALYSIS Sections 5, 6)

- Set up tRPC initialization and routers
- Implement design system (globals.css, theme)
- Create first components in Storybook

**Days 7-8: Testing** (GAP_ANALYSIS Section 9)

- Set up Vitest with test fixtures and mocks
- Set up Playwright E2E tests
- Configure Storybook interaction tests
- Achieve 80%+ coverage baseline

**Days 9-10: CI/CD & Production Readiness** (GAP_ANALYSIS Sections 8, 10, 11)

- Set up GitHub Actions workflows
- Configure Lighthouse CI (90+ enforcement)
- Set up Sentry monitoring
- Deploy to Vercel
- Verify all checks pass

---

**Document Status:** ✅ Complete (all sections covered across SETUP_GUIDE.md + GAP_ANALYSIS.md)
**Total Implementation Files:** 60+ files with full code examples
**Ready for:** Day 1 implementation kickoff 🚀
