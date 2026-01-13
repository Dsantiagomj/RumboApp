# Rumbo - Gap Analysis & Implementation Checklist

> **Purpose:** Complete list of ALL gaps found in documentation and what needs to be implemented
> **Status:** Comprehensive analysis complete
> **Use:** Checklist for 10-day setup - ensure nothing is missing

---

## 📊 Summary

**Total Gaps Found:** 60+ implementation pieces missing
**Categories:** 11 major areas

**Status:**

- ✅ **Documentation:** Complete (RULEBOOK, CODE_STANDARDS, TECH_STACK, etc.)
- ⚠️ **Implementation Details:** Missing (this document fills the gaps)

---

## 1️⃣ Dependencies & Package Management

### ✅ Complete (in SETUP_GUIDE.md)

- Full `package.json` with all dependencies
- Exact versions for production deps (locked)
- Flexible versions (^) for dev deps

### Missing Packages Added:

- ✅ `@node-rs/argon2` (Argon2 password hashing)
- ✅ `ioredis` (Redis client for BullMQ)
- ✅ `bullmq` (background jobs)
- ✅ `jose` (JWT handling for NextAuth)

### Package Strategy:

- **Production:** Exact versions (no ^ or ~)
- **DevDependencies:** Flexible (^ prefix)
- **Engines:** Node 20+, pnpm 9+

---

## 2️⃣ Configuration Files

### ✅ Complete (in SETUP_GUIDE.md)

- [x] `next.config.ts` - Security headers, CSP, image optimization
- [x] `tailwind.config.ts` - Theme extension, colors, oklch support
- [x] `tsconfig.json` - Strict mode, path aliases (@/\*)
- [x] `.prettierrc` - Formatting rules
- [x] `.prettierignore` - Ignore patterns

### Still Need to Create:

- [ ] `eslint.config.mjs` - ESLint 9 flat config (Section 10)
- [ ] `vitest.config.ts` - Vitest setup (Section 9)
- [ ] `playwright.config.ts` - Playwright setup (Section 9)
- [ ] `.storybook/main.ts` - Storybook config (Section 9)
- [ ] `.storybook/preview.ts` - Storybook preview (Section 9)
- [ ] `.husky/pre-commit` - Git hooks (Section 10)
- [ ] `.husky/pre-push` - Git hooks (Section 10)
- [ ] `.lintstagedrc.json` - Lint-staged config (Section 10)

---

## 3️⃣ Database Schema (Prisma)

### ✅ Complete (in SETUP_GUIDE.md)

- [x] Full Prisma schema with ALL tables:
  - User, Account, Session, VerificationToken (NextAuth)
  - FinancialAccount
  - Transaction
  - Category
  - Budget
  - Bill, BillInstance
  - AIChatSession, AIChatMessage

- [x] Enums defined:
  - UserRole, ColombianIdType
  - AccountType
  - TransactionType, TransactionStatus
  - BudgetPeriod
  - BillFrequency, BillStatus
  - MessageRole

- [x] Indexes for performance:
  - userId, email, date, categoryId, etc.

- [x] Default values & constraints:
  - @default(), @unique, @@index

- [x] Soft delete pattern (deletedAt)

- [x] Multi-currency support (currency + exchangeRate fields)

- [x] Seed file (Colombian categories)

### Implementation Notes:

- Run `pnpm prisma generate` after schema changes
- Run `pnpm prisma migrate dev --name init` for initial migration
- Run `pnpm prisma db seed` to add Colombian categories

---

## 4️⃣ Authentication Setup (NextAuth + Argon2)

### 🚧 Need to Create (Full Implementation):

#### Files to Create:

```
src/server/auth/
├── config.ts          # NextAuth v5 configuration
├── argon2.ts          # Argon2 hashing utilities
└── middleware.ts      # Auth middleware for tRPC
```

#### Implementation Checklist:

**src/server/auth/config.ts:**

- [ ] NextAuth v5 setup with App Router
- [ ] Credentials provider (email + password)
- [ ] Google OAuth provider
- [ ] Prisma adapter configuration
- [ ] JWT session strategy (7 days)
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
    memoryCost: 65536, // 64 MiB (OWASP 2024 minimum - UPDATED)
    timeCost: 3, // 3 iterations (OWASP 2024 minimum)
    outputLen: 32, // 32 bytes
    parallelism: 4, // 4 threads (production servers - UPDATED)
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
    maxAge: 24 * 60 * 60, // 24 hours (financial app security - UPDATED from 7 days)
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

### 🚧 Need to Create (Full Implementation):

#### Files to Create:

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

#### Implementation Checklist:

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

### 🚧 Need to Create:

#### Files to Create:

```
app/globals.css        # CSS custom properties (oklch colors)
```

#### Exact Color Values (oklch):

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

#### Font Configuration:

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

### 🚧 Need to Create:

#### Files to Create:

```
docker/
├── docker-compose.yml     # Postgres + PgBouncer + Redis + App
├── Dockerfile             # Production-optimized app image
├── pgbouncer.ini          # PgBouncer configuration
└── .env.docker            # Docker environment template

.env.example               # Complete environment variables template
```

#### docker-compose.yml:

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

#### .env.example (Complete):

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

### 🚧 Need to Create:

#### Files to Create:

```
.github/workflows/
├── ci.yml             # Main CI/CD pipeline
├── security.yml       # Security audits
└── deploy.yml         # Vercel deployment

lighthouserc.json      # Lighthouse CI configuration
```

#### .github/workflows/ci.yml:

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

#### lighthouserc.json:

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

### 🚧 Need to Create:

#### vitest.config.ts:

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

#### tests/setup.ts:

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

#### playwright.config.ts:

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

#### .storybook/main.ts:

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

#### .storybook/preview.ts:

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

### 9.5 Test Fixtures & Mocking Patterns

**Critical for:** Reliable, fast, isolated tests

**Files to Create:**

```
tests/
├── fixtures/
│   ├── user.fixture.ts
│   ├── account.fixture.ts
│   ├── transaction.fixture.ts
│   ├── bill.fixture.ts
│   └── index.ts
├── mocks/
│   ├── trpc.mock.ts
│   ├── openai.mock.ts
│   ├── r2.mock.ts
│   ├── redis.mock.ts
│   ├── nextauth.mock.ts
│   └── index.ts
└── utils/
    ├── db.test-utils.ts
    └── cleanup.test-utils.ts
```

---

#### 9.5.1 Test Fixtures (Factory Pattern)

**tests/fixtures/user.fixture.ts:**

```typescript
import type { Prisma } from '@prisma/client';
import { hashPassword } from '@/server/lib/auth';

let userCounter = 0;

export const createUserFixture = async (
  overrides?: Partial<Prisma.UserCreateInput>
): Promise<Prisma.UserCreateInput> => {
  userCounter++;
  const hashedPassword = await hashPassword('Test1234!');

  return {
    email: `test${userCounter}@example.com`,
    password: hashedPassword,
    name: `Test User ${userCounter}`,
    role: 'USER',
    colombianIdType: 'CC',
    colombianIdNumber: `${1000000000 + userCounter}`,
    phone: `+57300${1000000 + userCounter}`,
    dateOfBirth: new Date('1990-01-01'),
    ...overrides,
  };
};

// Pre-hashed test password for faster tests
export const TEST_PASSWORD_PLAIN = 'Test1234!';
export const TEST_PASSWORD_HASH = '$argon2id$v=19$m=47104,t=3,p=1$...'; // Pre-computed hash
```

**tests/fixtures/account.fixture.ts:**

```typescript
import type { Prisma } from '@prisma/client';

let accountCounter = 0;

export const createAccountFixture = (
  userId: string,
  overrides?: Partial<Prisma.FinancialAccountCreateInput>
): Prisma.FinancialAccountCreateInput => {
  accountCounter++;

  return {
    name: `Test Account ${accountCounter}`,
    type: 'SAVINGS',
    balance: 1000000, // 1M COP
    currency: 'COP',
    isActive: true,
    user: {
      connect: { id: userId },
    },
    ...overrides,
  };
};
```

**tests/fixtures/transaction.fixture.ts:**

```typescript
import type { Prisma } from '@prisma/client';

let transactionCounter = 0;

export const createTransactionFixture = (
  userId: string,
  accountId: string,
  overrides?: Partial<Prisma.TransactionCreateInput>
): Prisma.TransactionCreateInput => {
  transactionCounter++;

  return {
    description: `Test Transaction ${transactionCounter}`,
    amount: 50000, // 50k COP
    currency: 'COP',
    type: 'EXPENSE',
    date: new Date(),
    user: {
      connect: { id: userId },
    },
    account: {
      connect: { id: accountId },
    },
    category: {
      connect: { id: 'food-category-id' }, // Assumes seeded categories
    },
    ...overrides,
  };
};
```

**tests/fixtures/bill.fixture.ts:**

```typescript
import type { Prisma } from '@prisma/client';

let billCounter = 0;

export const createBillFixture = (
  userId: string,
  overrides?: Partial<Prisma.BillCreateInput>
): Prisma.BillCreateInput => {
  billCounter++;

  return {
    name: `Test Bill ${billCounter}`,
    amount: 100000, // 100k COP
    currency: 'COP',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    recurrence: 'MONTHLY',
    isPaid: false,
    user: {
      connect: { id: userId },
    },
    category: {
      connect: { id: 'bills-category-id' },
    },
    ...overrides,
  };
};
```

**tests/fixtures/index.ts:**

```typescript
export * from './user.fixture';
export * from './account.fixture';
export * from './transaction.fixture';
export * from './bill.fixture';
```

---

#### 9.5.2 Mock Patterns

**tests/mocks/trpc.mock.ts:**

```typescript
import { vi } from 'vitest';

export const mockTRPCContext = {
  session: {
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      role: 'USER',
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  },
  prisma: {} as any, // Use actual test DB or mock Prisma
  ip: '127.0.0.1',
};

export const createMockTRPCCaller = (procedures: Record<string, any>) => {
  return vi.fn((input) => {
    const [procedureName] = Object.keys(input);
    return procedures[procedureName]?.(input[procedureName]);
  });
};
```

**tests/mocks/openai.mock.ts:**

```typescript
import { vi } from 'vitest';

export const mockOpenAI = {
  chat: {
    completions: {
      create: vi.fn().mockResolvedValue({
        id: 'chatcmpl-test',
        object: 'chat.completion',
        created: Date.now(),
        model: 'gpt-4o-mini',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: 'This is a test response from the AI assistant.',
            },
            finish_reason: 'stop',
          },
        ],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30,
        },
      }),
    },
  },
};

// Mock streaming responses
export const mockOpenAIStream = vi.fn().mockImplementation(async function* () {
  yield { choices: [{ delta: { content: 'Test ' } }] };
  yield { choices: [{ delta: { content: 'streaming ' } }] };
  yield { choices: [{ delta: { content: 'response' } }] };
});
```

**tests/mocks/r2.mock.ts:**

```typescript
import { vi } from 'vitest';

export const mockR2Client = {
  putObject: vi.fn().mockResolvedValue({
    ETag: '"mock-etag"',
    VersionId: 'mock-version',
  }),
  getObject: vi.fn().mockResolvedValue({
    Body: Buffer.from('mock file content'),
    ContentType: 'image/jpeg',
    ContentLength: 1024,
  }),
  deleteObject: vi.fn().mockResolvedValue({}),
};
```

**tests/mocks/redis.mock.ts:**

```typescript
import { vi } from 'vitest';

export const mockRedisClient = {
  get: vi.fn().mockResolvedValue(null),
  set: vi.fn().mockResolvedValue('OK'),
  del: vi.fn().mockResolvedValue(1),
  incr: vi.fn().mockResolvedValue(1),
  expire: vi.fn().mockResolvedValue(1),
  flushall: vi.fn().mockResolvedValue('OK'),
};

// Mock rate limiter
export const mockRateLimiter = {
  limit: vi.fn().mockResolvedValue({
    success: true,
    limit: 100,
    remaining: 99,
    reset: Date.now() + 60000,
  }),
};
```

**tests/mocks/nextauth.mock.ts:**

```typescript
import { vi } from 'vitest';

export const mockSession = {
  user: {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    role: 'USER',
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

export const mockGetServerSession = vi.fn().mockResolvedValue(mockSession);

export const mockUseSession = vi.fn().mockReturnValue({
  data: mockSession,
  status: 'authenticated',
  update: vi.fn(),
});
```

**tests/mocks/index.ts:**

```typescript
export * from './trpc.mock';
export * from './openai.mock';
export * from './r2.mock';
export * from './redis.mock';
export * from './nextauth.mock';
```

---

#### 9.5.3 Database Test Utilities

**tests/utils/db.test-utils.ts:**

```typescript
import { PrismaClient } from '@prisma/client';
import {
  createUserFixture,
  createAccountFixture,
  createTransactionFixture,
  createBillFixture,
} from '../fixtures';

const prisma = new PrismaClient();

/**
 * Seed test database with minimal required data
 */
export async function seedTestDatabase() {
  // Seed Colombian categories (required for transactions/bills)
  const categories = [
    { id: 'food-category-id', name: 'Alimentación', type: 'EXPENSE' },
    { id: 'transport-category-id', name: 'Transporte', type: 'EXPENSE' },
    { id: 'bills-category-id', name: 'Servicios', type: 'EXPENSE' },
    { id: 'income-category-id', name: 'Ingresos', type: 'INCOME' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {},
      create: category,
    });
  }
}

/**
 * Create a complete test user with account and transactions
 */
export async function createTestUserWithData() {
  const userData = await createUserFixture();
  const user = await prisma.user.create({ data: userData });

  const accountData = createAccountFixture(user.id);
  const account = await prisma.financialAccount.create({ data: accountData });

  const transactionData = createTransactionFixture(user.id, account.id);
  const transaction = await prisma.transaction.create({ data: transactionData });

  const billData = createBillFixture(user.id);
  const bill = await prisma.bill.create({ data: billData });

  return { user, account, transaction, bill };
}

/**
 * Clean up test data after tests
 */
export async function cleanupTestDatabase() {
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== '_prisma_migrations')
    .map((name) => `"public"."${name}"`)
    .join(', ');

  try {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
  } catch (error) {
    console.log({ error });
  }
}

export { prisma };
```

**tests/utils/cleanup.test-utils.ts:**

```typescript
import { afterEach, afterAll } from 'vitest';
import { cleanupTestDatabase, prisma } from './db.test-utils';

/**
 * Register global cleanup hooks for tests
 */
export function setupTestCleanup() {
  afterEach(async () => {
    // Clean database after each test
    await cleanupTestDatabase();
  });

  afterAll(async () => {
    // Disconnect Prisma after all tests
    await prisma.$disconnect();
  });
}
```

---

#### 9.5.4 Example Usage in Tests

**Example test using fixtures:**

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { createTestUserWithData, seedTestDatabase, prisma } from '@/tests/utils/db.test-utils';
import { setupTestCleanup } from '@/tests/utils/cleanup.test-utils';

setupTestCleanup();

describe('Transaction API', () => {
  beforeEach(async () => {
    await seedTestDatabase();
  });

  it('should create a transaction', async () => {
    const { user, account } = await createTestUserWithData();

    const transaction = await prisma.transaction.create({
      data: {
        description: 'Coffee',
        amount: 5000,
        currency: 'COP',
        type: 'EXPENSE',
        date: new Date(),
        userId: user.id,
        accountId: account.id,
        categoryId: 'food-category-id',
      },
    });

    expect(transaction.amount).toBe(5000);
    expect(transaction.type).toBe('EXPENSE');
  });
});
```

**Example test using mocks:**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { mockOpenAI, mockSession } from '@/tests/mocks';

vi.mock('openai', () => ({
  default: vi.fn(() => mockOpenAI),
}));

describe('AI Chat', () => {
  it('should get AI response', async () => {
    const response = await mockOpenAI.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Hello' }],
    });

    expect(response.choices[0].message.content).toContain('test response');
  });
});
```

---

## 🔟 Code Quality (ESLint, Prettier, Husky)

### 🚧 Need to Create:

#### eslint.config.mjs (ESLint 9 Flat Config):

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

#### Husky Setup:

```bash
# Initialize Husky
pnpm exec husky init

# Create pre-commit hook
echo "pnpm run lint-staged" > .husky/pre-commit

# Create pre-push hook
echo "pnpm run type-check && pnpm run test run" > .husky/pre-push
```

#### .lintstagedrc.json:

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

// Example: Auth-specific rate limiting
export const loginProcedure = t.procedure.use(async (opts) => {
  const { ctx } = opts;
  const identifier = ctx.ip || 'anonymous';

  const { success, remaining, reset } = await checkRateLimit(authRateLimiter, identifier);

  if (!success) {
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: `Too many login attempts. Try again in ${Math.ceil((reset - Date.now()) / 1000 / 60)} minutes`,
    });
  }

  return opts.next({
    ctx: {
      ...ctx,
      rateLimitRemaining: remaining,
    },
  });
});
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

## ✅ Summary & Next Steps

### All Gaps Identified & Documented:

1. ✅ **Dependencies** - Complete package.json with locked versions
2. ✅ **Config Files** - All configs defined (Next, Tailwind, TS, Prettier)
3. ✅ **Database Schema** - Complete Prisma schema with all tables, enums, indexes
4. 🚧 **Authentication** - Need to implement NextAuth + Argon2
5. 🚧 **tRPC** - Need to implement initialization, routers, client
6. ✅ **Design System** - Complete oklch colors, globals.css, Tailwind theme
7. ✅ **Infrastructure** - Docker Compose, Dockerfile, PgBouncer, .env.example
8. ✅ **CI/CD** - Complete GitHub Actions workflows, Lighthouse CI
9. ✅ **Testing** - Vitest, Playwright, Storybook configs complete
10. ✅ **Code Quality** - ESLint flat config, Husky, lint-staged
11. ✅ **Additional** - Rate limiting, R2 upload, Sentry monitoring

### Implementation Priority (10-Day Setup):

**Days 1-2:** Infrastructure & Configuration

- [ ] Initialize project with Next.js 16
- [ ] Set up package.json with all dependencies
- [ ] Configure all config files (Next, Tailwind, TS, ESLint, Prettier)
- [ ] Set up Docker Compose (Postgres + PgBouncer + Redis)
- [ ] Set up Git hooks (Husky + lint-staged)

**Days 3-4:** Database & Authentication

- [ ] Set up Prisma schema
- [ ] Run initial migration
- [ ] Seed Colombian categories
- [ ] Implement NextAuth v5 with Argon2
- [ ] Create login/register pages

**Days 5-6:** tRPC & API Layer

- [ ] Set up tRPC initialization
- [ ] Create root router
- [ ] Implement first feature router (health check)
- [ ] Set up tRPC client & provider
- [ ] Test end-to-end type safety

**Days 7-8:** Testing & Quality

- [ ] Set up Vitest with first tests
- [ ] Set up Playwright E2E
- [ ] Set up Storybook
- [ ] Create first Storybook stories
- [ ] Run all quality checks

**Days 9-10:** CI/CD & Monitoring

- [ ] Set up GitHub Actions workflows
- [ ] Set up Lighthouse CI
- [ ] Set up Sentry monitoring
- [ ] Deploy to Vercel
- [ ] Verify all checks pass

---

**Document Status:** ✅ Complete Gap Analysis
**Total Gaps:** 60+ implementation pieces identified and documented
**Ready for:** 10-day production-grade setup

**Next Action:** Start Day 1 implementation following this guide
