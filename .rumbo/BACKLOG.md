# Rumbo - Development Backlog (GitHub Issues Format)

> **Purpose:** Comprehensive, reusable backlog with stories/tickets ready for GitHub Issues or Jira
> **Format:** Each story is a self-contained unit with acceptance criteria, tasks, and technical notes
> **Status:** Ready to create issues
> **Last Updated:** January 12, 2026

---

## 📋 How to Use This Backlog

### Creating GitHub Issues

Each story below can be copied directly into a GitHub Issue:

```markdown
**Title:** [Story ID] Story Title
**Labels:** epic-name, priority-level, story-type
**Milestone:** v1-skateboard
**Assignees:** @dsantiagomj

[Copy story content from below]
```

### Story Format

```markdown
## Story Description

[What are we building and why?]

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Tasks

- [ ] Task 1
- [ ] Task 2

## Technical Notes

[Implementation guidance, patterns, RULEBOOK references]

## Definition of Done

[What "done" means for this story]
```

---

## 🏗️ Epic 0: Project Initialization

**Description:** Set up the project infrastructure before feature development

### Epic 0 Stories

---

### **[INIT-001] Initialize Next.js Project with Core Dependencies** ✅ COMPLETED

**Epic:** Project Initialization
**Priority:** P0 (Critical - Blocker)
**Type:** Setup
**Estimate:** 2-3 hours
**Actual Time:** ~35 minutes
**Completed:** January 12, 2026
**Labels:** `setup`, `p0-critical`, `epic-initialization`

#### Story Description

Initialize the Next.js 16 project with TypeScript, Tailwind CSS, and install all required production and development dependencies. This is the foundation for all future development.

#### Acceptance Criteria

- [x] Next.js 16.1+ project created with TypeScript, Tailwind, App Router, src directory
- [x] All production dependencies installed (58 packages)
- [x] All development dependencies installed (43 packages)
- [x] `package.json` includes all required scripts (dev, build, test, lint, format, etc.)
- [x] Project builds successfully (`pnpm run build`)
- [x] Development server starts without errors (`pnpm run dev`)
- [x] No critical dependency conflicts or warnings (security patches applied)

#### Tasks

- [x] Run `pnpm create next-app@latest` with correct flags (created manually due to naming constraints)
- [x] Install all production dependencies from SETUP_GUIDE.md Section 1
- [x] Install all development dependencies from SETUP_GUIDE.md Section 1
- [x] Add all package.json scripts (20+ scripts)
- [x] Add `prisma.seed` configuration to package.json
- [x] Verify all dependencies installed correctly (`pnpm list`)
- [x] Run `pnpm run build` to verify setup
- [x] Run `pnpm run dev` to verify dev server works
- [x] BONUS: Upgrade dependencies to latest compatible versions
- [x] BONUS: Apply React 19.2.3 security patch

#### Technical Notes

**Dependencies Source:** `.rumbo/SETUP_GUIDE.md` Section 1 (lines 25-174)

**Key Dependencies:**

- `next@16.1.2` (App Router, Turbopack)
- `react@19.2.3` (Server Components)
- `typescript@5.9.3` (strict mode)
- `tailwindcss@4.0.14` (oklch support)
- `@prisma/client@7.2.0`
- `@trpc/server@11.0.0`
- `next-auth@5.0.0-beta.25`

**RULEBOOK Reference:**

- Tech Stack: `.claude/RULEBOOK.md` lines 59-89
- Package strategy: Exact versions for production, flexible (^) for dev

#### Definition of Done

- ✅ All dependencies installed
- ✅ `pnpm run build` succeeds
- ✅ `pnpm run dev` starts server at http://localhost:3000
- ✅ No console errors or warnings
- ✅ TypeScript compiles without errors
- ✅ Committed to git with message: "feat: Initialize Next.js 16 project with dependencies"

---

### **[INIT-002] Configure Project Settings (TypeScript, ESLint, Prettier, Tailwind)**

**Epic:** Project Initialization
**Priority:** P0 (Critical - Blocker)
**Type:** Setup
**Estimate:** 1-2 hours
**Labels:** `setup`, `p0-critical`, `epic-initialization`

#### Story Description

Set up all configuration files for TypeScript (strict mode), ESLint 9 (flat config), Prettier (with Tailwind plugin), and Tailwind CSS 4.0 (with oklch colors). This establishes code quality standards and enforces the RULEBOOK patterns.

#### Acceptance Criteria

- [ ] `tsconfig.json` configured with strict mode and path aliases (@/\*)
- [ ] `eslint.config.mjs` (ESLint 9 flat config) with all required plugins
- [ ] `.prettierrc` and `.prettierignore` configured
- [ ] `tailwind.config.ts` with oklch colors and theme extensions
- [ ] `next.config.ts` with security headers, CSP, image optimization
- [ ] `pnpm run lint` passes with no errors
- [ ] `pnpm run format` formats all files correctly
- [ ] `pnpm run type-check` passes with no errors

#### Tasks

- [ ] Copy `tsconfig.json` from SETUP_GUIDE.md Section 2 (lines 228-268)
- [ ] Copy `next.config.ts` from SETUP_GUIDE.md Section 2 (lines 176-227)
- [ ] Copy `tailwind.config.ts` from SETUP_GUIDE.md Section 2 (lines 269-340)
- [ ] Copy `.prettierrc` from SETUP_GUIDE.md Section 2 (lines 341-359)
- [ ] Copy `.prettierignore` from SETUP_GUIDE.md Section 2 (lines 360-380)
- [ ] Copy `eslint.config.mjs` from SETUP_GUIDE.md Section 10 (lines 1785-1865)
- [ ] Run `pnpm run format` to format all files
- [ ] Run `pnpm run lint` and fix any auto-fixable issues
- [ ] Run `pnpm run type-check` to verify TypeScript config
- [ ] Verify path aliases work (@/\* imports resolve correctly)

#### Technical Notes

**Configuration Source:** `.rumbo/SETUP_GUIDE.md` Section 2 (Configuration Files)

**Key Settings:**

**TypeScript (tsconfig.json):**

- `strict: true` (RULEBOOK requirement)
- `noUncheckedIndexedAccess: true`
- Path aliases: `@/*` → `./src/*`

**ESLint (eslint.config.mjs):**

- ESLint 9 flat config (NOT .eslintrc.json)
- Plugins: TypeScript, React, React Hooks, JSX A11y, Import, Next.js
- Rules: Enforce named exports, explicit type imports, no default exports

**Prettier (.prettierrc):**

- `semi: false` (no semicolons)
- `singleQuote: true`
- `tailwindcss-plugin` for class sorting

**Tailwind (tailwind.config.ts):**

- Tailwind CSS 4.0
- oklch colors for brand (purple theme)
- Dark mode support
- Custom font family (Inter)

**Next.js (next.config.ts):**

- Security headers (CSP, X-Frame-Options, etc.)
- Image optimization (remote patterns)
- Turbopack enabled (16.1+ feature)

**RULEBOOK Reference:**

- Code Standards: `.rumbo/CODE_STANDARDS.md` Section 8 (Code Style & Formatting)
- RULEBOOK: `.claude/RULEBOOK.md` lines 150-217 (Critical Rules)

#### Definition of Done

- ✅ All configuration files in place
- ✅ `pnpm run lint` passes with 0 errors
- ✅ `pnpm run format` runs successfully
- ✅ `pnpm run type-check` passes with 0 errors
- ✅ Path aliases (@/\*) work in imports
- ✅ Committed to git with message: "feat: Configure TypeScript, ESLint, Prettier, and Tailwind"

---

### **[INIT-003] Set Up Docker Infrastructure (PostgreSQL, Redis, PgBouncer)**

**Epic:** Project Initialization
**Priority:** P0 (Critical - Blocker)
**Type:** Setup
**Estimate:** 1-2 hours
**Labels:** `setup`, `p0-critical`, `epic-initialization`, `infrastructure`

#### Story Description

Set up Docker infrastructure for local development with PostgreSQL 16 (primary database), Redis 7 (caching and BullMQ jobs), and PgBouncer (connection pooling). This provides the data layer foundation for all features.

#### Acceptance Criteria

- [ ] `docker-compose.yml` created with PostgreSQL, Redis, and PgBouncer services
- [ ] `docker/Dockerfile` created for production builds
- [ ] `docker/pgbouncer.ini` configured for connection pooling
- [ ] `.env` file created with database connection strings
- [ ] `.env.docker` template created for team reference
- [ ] `docker-compose up -d` starts all services successfully
- [ ] PostgreSQL accessible at `localhost:5432`
- [ ] PgBouncer accessible at `localhost:6432` (pooled connections)
- [ ] Redis accessible at `localhost:6379`
- [ ] All services show "Up" status in `docker-compose ps`

#### Tasks

- [ ] Create `docker/` directory
- [ ] Copy `docker-compose.yml` from SETUP_GUIDE.md Section 7 (lines 1271-1350)
- [ ] Copy `docker/Dockerfile` from SETUP_GUIDE.md Section 7 (lines 1351-1380)
- [ ] Copy `docker/pgbouncer.ini` from SETUP_GUIDE.md Section 7 (lines 1381-1395)
- [ ] Create `.env` file with DATABASE_URL, REDIS_URL, etc.
- [ ] Create `.env.docker` template (with placeholder values)
- [ ] Add `.env` to `.gitignore` (NEVER commit secrets)
- [ ] Run `docker-compose up -d` to start services
- [ ] Verify PostgreSQL: `docker exec -it rumbo-postgres-1 psql -U rumbo -d rumbo_db`
- [ ] Verify Redis: `docker exec -it rumbo-redis-1 redis-cli ping` (expect "PONG")
- [ ] Verify PgBouncer: `psql "postgresql://rumbo:rumbo_password@localhost:6432/rumbo_db"`

#### Technical Notes

**Infrastructure Source:** `.rumbo/SETUP_GUIDE.md` Section 7 (Infrastructure)

**Docker Services:**

1. **PostgreSQL 16:**
   - Port: `5432`
   - Database: `rumbo_db`
   - User: `rumbo`
   - Password: `rumbo_password` (dev only, change for production)
   - Volume: `postgres_data` (persists data)

2. **PgBouncer:**
   - Port: `6432` (pooled connections)
   - Pool mode: `transaction` (efficient for serverless)
   - Max connections: 100
   - Default pool size: 20

3. **Redis 7:**
   - Port: `6379`
   - Use: Caching + BullMQ jobs
   - Volume: `redis_data`

**Environment Variables (.env):**

```env
DATABASE_URL="postgresql://rumbo:rumbo_password@localhost:6432/rumbo_db?pgbouncer=true"
DIRECT_DATABASE_URL="postgresql://rumbo:rumbo_password@localhost:5432/rumbo_db"
REDIS_URL="redis://localhost:6379"
```

**RULEBOOK Reference:**

- Tech Stack: `.claude/RULEBOOK.md` lines 70-76 (Backend)
- Infrastructure: `.rumbo/TECH_STACK.md` Section 4 (Hosting & Infrastructure)

#### Definition of Done

- ✅ All Docker services running (`docker-compose ps` shows "Up")
- ✅ Can connect to PostgreSQL via PgBouncer (port 6432)
- ✅ Can connect to Redis (port 6379)
- ✅ `.env` file created (NOT committed to git)
- ✅ `.env.docker` template committed to git
- ✅ Committed to git with message: "feat: Add Docker infrastructure (PostgreSQL, Redis, PgBouncer)"

---

### **[INIT-004] Create Prisma Schema and Seed Database**

**Epic:** Project Initialization
**Priority:** P0 (Critical - Blocker)
**Type:** Setup
**Estimate:** 2-3 hours
**Labels:** `setup`, `p0-critical`, `epic-initialization`, `database`

#### Story Description

Create the complete Prisma schema with all database tables (User, Account, Session, FinancialAccount, Transaction, Category, Budget, Bill, AIChat, etc.) and seed Colombian categories. This defines the entire data model for v1.

#### Acceptance Criteria

- [ ] `prisma/schema.prisma` created with all tables and relationships
- [ ] `prisma/seed.ts` created with Colombian categories and default data
- [ ] All enums defined (UserRole, AccountType, TransactionType, etc.)
- [ ] All indexes created for performance (userId, date, categoryId, etc.)
- [ ] `pnpm prisma generate` succeeds (Prisma Client generated)
- [ ] `pnpm prisma migrate dev --name init` succeeds (migration created)
- [ ] `pnpm prisma db seed` succeeds (categories seeded)
- [ ] Prisma Studio shows all tables and seeded data (`pnpm prisma studio`)

#### Tasks

- [ ] Create `prisma/` directory
- [ ] Copy `schema.prisma` from SETUP_GUIDE.md Section 3 (lines 480-959)
- [ ] Copy `seed.ts` from SETUP_GUIDE.md Section 3 (seed script)
- [ ] Create `src/server/db/index.ts` (Prisma client singleton)
- [ ] Run `pnpm prisma generate` to generate Prisma Client
- [ ] Run `pnpm prisma migrate dev --name init` to create initial migration
- [ ] Run `pnpm prisma db seed` to seed categories
- [ ] Open Prisma Studio (`pnpm prisma studio`) and verify:
  - All tables exist (12 tables)
  - Categories seeded (10 expense + 4 income categories)
- [ ] Test Prisma Client in Node REPL:
  ```bash
  node
  > const { PrismaClient } = require('@prisma/client')
  > const prisma = new PrismaClient()
  > prisma.category.findMany()
  ```

#### Technical Notes

**Schema Source:** `.rumbo/SETUP_GUIDE.md` Section 3 (Database Schema)

**Tables (12 total):**

1. **User** - User accounts
2. **Account** - OAuth accounts (NextAuth)
3. **Session** - User sessions (NextAuth)
4. **VerificationToken** - Email verification (NextAuth)
5. **FinancialAccount** - Bank accounts, credit cards
6. **Transaction** - Financial transactions
7. **Category** - Income/expense categories
8. **Budget** - Monthly budgets
9. **Bill** - Recurring bills
10. **BillInstance** - Individual bill occurrences
11. **AIChatSession** - AI chat conversations
12. **AIChatMessage** - Individual AI messages

**Enums (9 total):**

1. `UserRole` - USER, ADMIN
2. `ColombianIdType` - CC, CE, PASSPORT
3. `AccountType` - CHECKING, SAVINGS, CREDIT_CARD, CASH, INVESTMENT
4. `TransactionType` - INCOME, EXPENSE, TRANSFER
5. `TransactionStatus` - PENDING, COMPLETED, CANCELLED
6. `BudgetPeriod` - WEEKLY, MONTHLY, YEARLY
7. `BillFrequency` - WEEKLY, BIWEEKLY, MONTHLY, QUARTERLY, YEARLY
8. `BillStatus` - ACTIVE, PAUSED, CANCELLED
9. `MessageRole` - USER, ASSISTANT, SYSTEM

**Indexes:**

- `User`: email, createdAt
- `FinancialAccount`: userId, type, createdAt
- `Transaction`: userId, accountId, categoryId, date, type, status
- `Category`: userId, type
- `Budget`: userId, period, startDate
- `Bill`: userId, status, dueDay
- `AIChatSession`: userId, createdAt
- `AIChatMessage`: sessionId, role, createdAt

**Colombian Categories (seed.ts):**

**Expenses (10):**

1. Alimentación (Food & Groceries)
2. Transporte (Transportation)
3. Vivienda (Housing)
4. Servicios Públicos (Utilities)
5. Salud (Healthcare)
6. Educación (Education)
7. Entretenimiento (Entertainment)
8. Ropa (Clothing)
9. Deudas (Debt Payments)
10. Otros (Other)

**Income (4):**

1. Salario (Salary)
2. Freelance
3. Arriendos (Rental Income)
4. Inversiones (Investments)

**RULEBOOK Reference:**

- Database design: `.claude/RULEBOOK.md` lines 480-959
- Colombian context: `.claude/RULEBOOK.md` lines 300-327

#### Definition of Done

- ✅ Prisma schema complete with all tables
- ✅ `pnpm prisma generate` succeeds
- ✅ Migration applied (`pnpm prisma migrate dev --name init`)
- ✅ Categories seeded (14 categories total)
- ✅ Prisma Studio shows all data
- ✅ Prisma Client works in code
- ✅ Committed to git with message: "feat: Add Prisma schema and seed Colombian categories"

---

### **[INIT-005] Set Up Authentication (NextAuth v5 + Argon2)**

**Epic:** Project Initialization
**Priority:** P0 (Critical - Blocker)
**Type:** Setup
**Estimate:** 2-3 hours
**Labels:** `setup`, `p0-critical`, `epic-initialization`, `authentication`

#### Story Description

Configure NextAuth v5 with Credentials provider (Argon2 password hashing) and optional Google OAuth. This provides the authentication foundation for all user-facing features.

#### Acceptance Criteria

- [ ] `src/server/auth/config.ts` created with complete NextAuth configuration
- [ ] `src/server/auth/index.ts` created with auth helpers
- [ ] Argon2 password hashing configured (OWASP 2024 parameters)
- [ ] Credentials provider working (email/password login)
- [ ] Google OAuth provider configured (optional, can be added later)
- [ ] Session strategy: JWT with secure cookies
- [ ] Auth middleware protects routes
- [ ] Environment variables configured (NEXTAUTH_SECRET, NEXTAUTH_URL)
- [ ] Login/logout flow works end-to-end

#### Tasks

- [ ] Copy `src/server/auth/config.ts` from SETUP_GUIDE.md Section 4 (lines 960-1062)
- [ ] Copy `src/server/auth/index.ts` from SETUP_GUIDE.md Section 4
- [ ] Add NEXTAUTH environment variables to `.env`:
  ```env
  NEXTAUTH_URL="http://localhost:3000"
  NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
  GOOGLE_CLIENT_ID=""  # Optional
  GOOGLE_CLIENT_SECRET=""  # Optional
  ```
- [ ] Generate NEXTAUTH_SECRET: `openssl rand -base64 32`
- [ ] Create `app/api/auth/[...nextauth]/route.ts` (NextAuth API route)
- [ ] Test Argon2 hashing:
  ```typescript
  import { hash, verify } from '@node-rs/argon2';
  const hashed = await hash('password123');
  const valid = await verify(hashed, 'password123');
  console.log(valid); // true
  ```
- [ ] Create basic login page to test authentication
- [ ] Verify session persists across page reloads

#### Technical Notes

**Auth Source:** `.rumbo/SETUP_GUIDE.md` Section 4 (Authentication Setup)

**NextAuth v5 Configuration:**

- **Adapter:** Prisma (connects to User, Account, Session tables)
- **Providers:**
  1. **Credentials** - Email/password (Argon2 hashing)
  2. **Google** - OAuth (optional)
- **Session:** JWT strategy (stateless, Vercel-friendly)
- **Callbacks:**
  - `jwt()` - Add userId to token
  - `session()` - Add userId to session object

**Argon2 Configuration (OWASP 2024 Standards):**

```typescript
import { hash, verify } from '@node-rs/argon2';

// Hash password
const hashedPassword = await hash(password, {
  memoryCost: 19456, // 19 MB (OWASP 2024)
  timeCost: 2, // 2 iterations
  outputLen: 32, // 32 bytes
  parallelism: 1, // 1 thread (CPU-friendly)
});

// Verify password
const isValid = await verify(hashedPassword, inputPassword);
```

**CRITICAL Security Rules:**

1. ✅ NEVER store plaintext passwords (use Argon2)
2. ✅ Use OWASP 2024 Argon2 parameters (19456 memoryCost)
3. ✅ Generate strong NEXTAUTH_SECRET (32+ bytes)
4. ✅ Use HTTPS in production (NEXTAUTH_URL)
5. ✅ Rotate secrets regularly

**RULEBOOK Reference:**

- Security: `.claude/RULEBOOK.md` lines 246-263 (Security Guidelines)
- Auth tech: `.claude/RULEBOOK.md` line 74 (NextAuth.js 5 + Argon2)

#### Definition of Done

- ✅ NextAuth v5 configured
- ✅ Argon2 password hashing works
- ✅ Can hash and verify passwords
- ✅ NEXTAUTH_SECRET generated
- ✅ Environment variables set
- ✅ Auth API route works (`/api/auth/signin`)
- ✅ Committed to git with message: "feat: Configure NextAuth v5 with Argon2 password hashing"

---

### **[INIT-006] Set Up tRPC (Type-Safe API Layer)**

**Epic:** Project Initialization
**Priority:** P0 (Critical - Blocker)
**Type:** Setup
**Estimate:** 2-3 hours
**Labels:** `setup`, `p0-critical`, `epic-initialization`, `api`

#### Story Description

Set up tRPC 11 for end-to-end type-safe API development. Create the tRPC context, routers, React client, and a health check procedure to verify everything works.

#### Acceptance Criteria

- [ ] `src/server/api/trpc.ts` created (tRPC initialization, middleware, protected procedures)
- [ ] `src/server/api/root.ts` created (app router with health check)
- [ ] `src/lib/trpc/client.ts` created (vanilla tRPC client)
- [ ] `src/lib/trpc/react.tsx` created (React hooks integration)
- [ ] `app/api/trpc/[trpc]/route.ts` created (Next.js API route handler)
- [ ] Health check procedure works: `trpc.health.check.useQuery()`
- [ ] Protected procedure middleware enforces authentication
- [ ] TanStack Query devtools accessible in browser
- [ ] Type inference works (no `any` types, full autocomplete)

#### Tasks

- [ ] Copy `src/server/api/trpc.ts` from SETUP_GUIDE.md Section 5 (lines 1063-1138)
- [ ] Copy `src/server/api/root.ts` from SETUP_GUIDE.md Section 5
- [ ] Copy `src/lib/trpc/client.ts` from SETUP_GUIDE.md Section 5
- [ ] Copy `src/lib/trpc/react.tsx` from SETUP_GUIDE.md Section 5
- [ ] Copy `app/api/trpc/[trpc]/route.ts` from SETUP_GUIDE.md Section 5
- [ ] Wrap app with `TRPCReactProvider` in `app/layout.tsx`
- [ ] Create health check procedure in `root.ts`:
  ```typescript
  health: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date() };
  });
  ```
- [ ] Test health check in a page component:
  ```typescript
  const { data } = trpc.health.check.useQuery();
  console.log(data); // { status: 'ok', timestamp: ... }
  ```
- [ ] Verify type safety (change procedure return type, see TypeScript error in component)

#### Technical Notes

**tRPC Source:** `.rumbo/SETUP_GUIDE.md` Section 5 (tRPC Setup)

**tRPC Architecture:**

1. **Context (`createTRPCContext`):**
   - Provides: `session`, `db`, `headers`
   - Available to all procedures

2. **Procedures:**
   - **Public:** `publicProcedure` (no auth required)
   - **Protected:** `protectedProcedure` (requires session)

3. **Routers:**
   - `appRouter` (root router)
   - Feature routers: `userRouter`, `transactionRouter`, etc. (add later)

4. **Client:**
   - `createTRPCClient()` - Vanilla JS client
   - `trpc` hooks - React Query integration

**Example Procedure:**

```typescript
// src/server/api/routers/user.ts
export const userRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
    });
  }),
});
```

**Example Usage in Component:**

```typescript
'use client'
import { trpc } from '@/lib/trpc/react'

export function ProfilePage() {
  const { data, isLoading } = trpc.user.getProfile.useQuery()

  if (isLoading) return <div>Loading...</div>
  return <div>Hello, {data?.name}</div>
}
```

**RULEBOOK Reference:**

- tRPC patterns: `.rumbo/CODE_STANDARDS.md` Section 5 (tRPC & API Patterns)
- Tech stack: `.claude/RULEBOOK.md` line 69 (tRPC 11 + TanStack Query 5)

#### Definition of Done

- ✅ All tRPC files created
- ✅ Health check procedure works
- ✅ Type inference works (autocomplete in IDE)
- ✅ Protected procedures enforce auth
- ✅ TanStack Query devtools visible
- ✅ Committed to git with message: "feat: Set up tRPC with type-safe API layer"

---

### **[INIT-007] Configure Design System (Tailwind, Colors, Shadcn/ui)**

**Epic:** Project Initialization
**Priority:** P0 (Critical - Blocker)
**Type:** Setup
**Estimate:** 2-3 hours
**Labels:** `setup`, `p0-critical`, `epic-initialization`, `design-system`

#### Story Description

Set up the design system with Tailwind CSS 4.0 (oklch colors), global styles, and Shadcn/ui base components. This establishes the visual foundation for all UI components.

#### Acceptance Criteria

- [ ] `app/globals.css` created with complete CSS variables and base styles
- [ ] Tailwind configured with oklch colors (purple brand theme)
- [ ] Dark mode support configured (class-based)
- [ ] Shadcn/ui CLI configured (`components.json`)
- [ ] First Shadcn component installed (Button) to verify setup
- [ ] Typography styles defined (Inter font family)
- [ ] Color palette accessible via Tailwind classes (`bg-primary`, `text-foreground`, etc.)
- [ ] Dark mode toggle works

#### Tasks

- [ ] Copy `app/globals.css` from SETUP_GUIDE.md Section 6 (lines 1139-1270)
- [ ] Verify `tailwind.config.ts` includes theme extensions (from INIT-002)
- [ ] Add Inter font to `app/layout.tsx`:
  ```typescript
  import { Inter } from 'next/font/google';
  const inter = Inter({ subsets: ['latin'] });
  ```
- [ ] Initialize Shadcn/ui:
  ```bash
  pnpm dlx shadcn@latest init
  # Choose: Default style, Zinc color, CSS variables: yes
  ```
- [ ] Install Button component (test):
  ```bash
  pnpm dlx shadcn@latest add button
  ```
- [ ] Create test page with Button to verify styles work
- [ ] Add dark mode toggle component (use Shadcn theme provider)
- [ ] Test color variables in browser DevTools:
  - Light mode: `--primary` = oklch purple
  - Dark mode: `--primary` = adjusted oklch purple

#### Technical Notes

**Design System Source:** `.rumbo/SETUP_GUIDE.md` Section 6 (Design System)

**Color System (oklch):**

**Why oklch?**

- Perceptually uniform (unlike RGB/HSL)
- Better for accessibility (consistent contrast)
- Supports P3 wide gamut colors
- Future-proof

**Brand Colors:**

- **Primary:** Purple (trust, stability)
- **Secondary:** Zinc (neutral, professional)

**Color Variables (globals.css):**

```css
@layer base {
  :root {
    --primary: oklch(0.55 0.25 280); /* Purple */
    --foreground: oklch(0.09 0.005 285.8); /* Almost black */
    --background: oklch(1 0 0); /* White */
    /* ... 20+ more variables */
  }

  .dark {
    --primary: oklch(0.7 0.2 280); /* Lighter purple */
    --foreground: oklch(0.98 0.002 285.8); /* Almost white */
    --background: oklch(0.13 0.006 285.7); /* Dark gray */
    /* ... adjusted for dark mode */
  }
}
```

**Typography:**

- Font: Inter (Google Fonts)
- Sizes: `text-sm`, `text-base`, `text-lg`, `text-xl`, etc.
- Weights: `font-normal`, `font-medium`, `font-semibold`, `font-bold`

**Shadcn/ui Setup:**

Shadcn/ui is NOT an npm package - components are copied to your codebase:

```bash
# Initialize (creates components.json)
pnpm dlx shadcn@latest init

# Add components as needed
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add card
```

Components go to: `src/components/ui/[component-name]/`

**RULEBOOK Reference:**

- Design system: `.claude/RULEBOOK.md` lines 283-298
- Component structure: `.rumbo/CODE_STANDARDS.md` Section 2 (Component Structure)

#### Definition of Done

- ✅ `globals.css` complete with CSS variables
- ✅ Tailwind classes work (`bg-primary`, `text-foreground`, etc.)
- ✅ Dark mode works (toggle between light/dark)
- ✅ Shadcn/ui configured (`components.json` created)
- ✅ Button component installed and works
- ✅ Inter font loads correctly
- ✅ Committed to git with message: "feat: Configure design system with Tailwind and oklch colors"

---

### **[INIT-008] Set Up Testing Infrastructure (Vitest, Playwright, Storybook)**

**Epic:** Project Initialization
**Priority:** P0 (Critical - Blocker)
**Type:** Setup
**Estimate:** 2-3 hours
**Labels:** `setup`, `p0-critical`, `epic-initialization`, `testing`

#### Story Description

Configure complete testing infrastructure with Vitest (unit/integration), Playwright (E2E), and Storybook (component development). This establishes the quality foundation for TDD and production-grade development.

#### Acceptance Criteria

- [x] `vitest.config.ts` created with React + happy-dom environment
- [x] `playwright.config.ts` created with mobile + desktop viewports
- [x] `.storybook/main.ts` and `preview.ts` created
- [x] `tests/setup.ts` created with global test utilities
- [x] `pnpm run test` runs Vitest successfully (0/0 tests pass - no tests yet)
- [x] `pnpm run test:e2e` runs Playwright successfully (15/15 tests pass)
- [x] `pnpm run storybook` starts Storybook at http://localhost:6006
- [x] Coverage reporting configured (v8 provider, 80% threshold)
- [x] Test scripts added to package.json

#### Tasks

- [x] Copy `vitest.config.ts` from SETUP_GUIDE.md Section 9 (lines 1610-1650)
- [x] Copy `playwright.config.ts` from SETUP_GUIDE.md Section 9 (lines 1651-1720)
- [x] Copy `.storybook/main.ts` from SETUP_GUIDE.md Section 9 (lines 1721-1750)
- [x] Copy `.storybook/preview.ts` from SETUP_GUIDE.md Section 9 (lines 1751-1780)
- [x] Create `tests/setup.ts` (test utilities, custom matchers)
- [x] Create `tests/fixtures/` directory (for test data)
- [x] Create `tests/mocks/` directory (for API mocks)
- [x] Create `tests/e2e/` directory (for Playwright tests)
- [x] Install Playwright browsers: `pnpm playwright install`
- [x] Run `pnpm run test` (should pass with 0 tests)
- [x] Run `pnpm run test:e2e` (15/15 tests passed across 5 browsers)
- [x] Run `pnpm run storybook` (should start successfully)
- [x] Create first story (Button.stories.tsx) to verify Storybook works

#### Technical Notes

**Testing Source:** `.rumbo/SETUP_GUIDE.md` Section 9 (Testing Setup)

**Testing Strategy:**

1. **Vitest** (Unit + Integration)
   - Framework: Vitest 2.1+
   - Environment: happy-dom (faster than jsdom)
   - Coverage: v8 provider (80%+ target)
   - Location: Colocated (`.test.tsx` next to components)

2. **Playwright** (E2E)
   - Browsers: Chromium, Firefox, WebKit
   - Viewports: Mobile (iPhone 13), Tablet (iPad), Desktop (1920x1080)
   - Location: Centralized (`tests/e2e/*.spec.ts`)
   - CI: Run on GitHub Actions

3. **Storybook** (Component Development)
   - Version: 8.5+
   - Framework: Next.js 16
   - Addons: a11y, interactions, essentials
   - Location: Colocated (`.stories.tsx` next to components)

**Test File Structure:**

```
src/components/ui/button/
├── index.tsx              # Component
├── types.ts               # Types
├── button.test.tsx        # ✅ Vitest tests (colocated)
└── button.stories.tsx     # ✅ Storybook stories (colocated)

tests/e2e/
└── auth.spec.ts           # ✅ Playwright E2E tests (centralized)
```

**Coverage Requirements (RULEBOOK):**

- General: 80%+
- Critical paths: 100% (auth, transactions, AI, financial calculations)

**Example Vitest Test:**

```typescript
// button/button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from './index'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

**Example Playwright Test:**

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('user can sign up', async ({ page }) => {
  await page.goto('/signup');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'Password123!');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```

**Example Storybook Story:**

```typescript
// button/button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './index';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { children: 'Click me', variant: 'default' },
};
```

**RULEBOOK Reference:**

- Testing strategy: `.claude/RULEBOOK.md` lines 220-244
- Testing tech: `.claude/RULEBOOK.md` lines 77-83

#### Definition of Done

- ✅ All testing configs in place
- ✅ `pnpm run test` works (0 tests pass)
- ✅ `pnpm run test:e2e` works (0 tests pass)
- ✅ `pnpm run storybook` works (starts at localhost:6006)
- ✅ Playwright browsers installed
- ✅ Coverage reporting configured
- ✅ First Storybook story works (Button)
- ✅ Committed to git with message: "feat: Configure testing infrastructure (Vitest, Playwright, Storybook)"

---

### **[INIT-009] Configure CI/CD Pipelines (GitHub Actions)**

**Epic:** Project Initialization
**Priority:** P1 (High)
**Type:** Setup
**Estimate:** 2-3 hours
**Labels:** `setup`, `p1-high`, `epic-initialization`, `ci-cd`

#### Story Description

Set up GitHub Actions CI/CD pipelines for automated testing, linting, type checking, security scanning, and deployment. This enforces code quality and enables continuous deployment to Vercel.

#### Acceptance Criteria

- [ ] `.github/workflows/ci.yml` created (main CI pipeline)
- [ ] `.github/workflows/security.yml` created (security scanning)
- [ ] `.github/workflows/deploy.yml` created (Vercel deployment)
- [ ] `lighthouserc.json` created (Lighthouse CI config)
- [ ] All workflows run on push to `main` and PRs
- [ ] CI pipeline runs: lint, type-check, test, build, Lighthouse
- [ ] Security pipeline runs: npm audit, Snyk scan, OWASP dependency check
- [ ] Deployment pipeline deploys to Vercel on merge to `main`
- [ ] All required secrets configured in GitHub repository

#### Tasks

- [ ] Create `.github/workflows/` directory
- [ ] Copy `ci.yml` from SETUP_GUIDE.md Section 8 (lines 1419-1520)
- [ ] Copy `security.yml` from SETUP_GUIDE.md Section 8 (lines 1521-1580)
- [ ] Copy `deploy.yml` from SETUP_GUIDE.md Section 8 (lines 1581-1609)
- [ ] Copy `lighthouserc.json` from SETUP_GUIDE.md Section 8
- [ ] Configure GitHub repository secrets:
  - `VERCEL_TOKEN` (get from Vercel dashboard)
  - `VERCEL_ORG_ID` (get from Vercel)
  - `VERCEL_PROJECT_ID` (get from Vercel)
  - `SENTRY_AUTH_TOKEN` (optional, for error monitoring)
- [ ] Push workflows to GitHub
- [ ] Verify first CI run passes
- [ ] Check Lighthouse scores (target: 90+)

#### Technical Notes

**CI/CD Source:** `.rumbo/SETUP_GUIDE.md` Section 8 (CI/CD)

**GitHub Actions Workflows:**

**1. Main CI Pipeline (`ci.yml`):**

- **Triggers:** Push to `main`, all PRs
- **Jobs:**
  1. **Lint:** ESLint + Prettier check
  2. **Type Check:** TypeScript compilation
  3. **Test:** Vitest unit/integration tests (80%+ coverage)
  4. **Build:** Next.js production build
  5. **E2E:** Playwright tests (critical paths)
  6. **Lighthouse:** Performance audit (90+ score required)

**2. Security Pipeline (`security.yml`):**

- **Triggers:** Push to `main`, weekly schedule
- **Jobs:**
  1. **Dependency Audit:** `pnpm audit` (detect vulnerable packages)
  2. **Snyk Scan:** Snyk vulnerability scanning
  3. **OWASP Check:** OWASP dependency checker
  4. **Secret Scan:** GitLeaks (detect committed secrets)

**3. Deployment Pipeline (`deploy.yml`):**

- **Triggers:** Push to `main` (after CI passes)
- **Jobs:**
  1. **Deploy to Vercel:** Automatic deployment
  2. **Smoke Test:** Basic health checks after deployment
  3. **Notify:** Slack notification (optional)

**Lighthouse CI Configuration (`lighthouserc.json`):**

```json
{
  "ci": {
    "assert": {
      "assertions": {
        "performance": ["error", { "minScore": 0.9 }],
        "accessibility": ["error", { "minScore": 0.9 }],
        "best-practices": ["error", { "minScore": 0.9 }],
        "seo": ["error", { "minScore": 0.9 }]
      }
    }
  }
}
```

**Required GitHub Secrets:**

1. `VERCEL_TOKEN` - Vercel deployment token
2. `VERCEL_ORG_ID` - Vercel organization ID
3. `VERCEL_PROJECT_ID` - Vercel project ID
4. `SENTRY_AUTH_TOKEN` - Sentry error tracking (optional)

**RULEBOOK Reference:**

- CI/CD workflow: `.claude/RULEBOOK.md` lines 346-361
- Performance targets: `.claude/RULEBOOK.md` lines 265-282

#### Definition of Done

- ✅ All 3 GitHub Actions workflows created
- ✅ `lighthouserc.json` configured
- ✅ Repository secrets configured (Vercel tokens)
- ✅ First CI run passes (all checks green)
- ✅ Lighthouse score 90+ achieved
- ✅ Committed to git with message: "feat: Configure CI/CD pipelines with GitHub Actions"

---

### **[INIT-010] Configure Code Quality Tools (Husky, lint-staged)**

**Epic:** Project Initialization
**Priority:** P1 (High)
**Type:** Setup
**Estimate:** 1 hour
**Labels:** `setup`, `p1-high`, `epic-initialization`, `code-quality`

#### Story Description

Set up Git hooks with Husky and lint-staged to enforce code quality before commits. This ensures all code is formatted, linted, type-checked, and tested before it reaches the repository.

#### Acceptance Criteria

- [ ] Husky installed and initialized
- [ ] `.husky/pre-commit` hook created (runs lint-staged)
- [ ] `.husky/pre-push` hook created (runs type-check + tests)
- [ ] `.lintstagedrc.json` configured
- [ ] Attempting to commit unformatted code triggers auto-formatting
- [ ] Attempting to commit with lint errors blocks the commit
- [ ] Attempting to push with failing tests blocks the push
- [ ] All hooks work on team members' machines (cross-platform)

#### Tasks

- [ ] Initialize Husky: `pnpm exec husky init`
- [ ] Copy `.husky/pre-commit` from SETUP_GUIDE.md Section 10 (lines 1866-1875)
- [ ] Copy `.husky/pre-push` from SETUP_GUIDE.md Section 10 (lines 1876-1885)
- [ ] Copy `.lintstagedrc.json` from SETUP_GUIDE.md Section 10 (lines 1886-1900)
- [ ] Make hooks executable: `chmod +x .husky/*`
- [ ] Test pre-commit hook:
  1. Create file with unformatted code
  2. Run `git add .`
  3. Run `git commit -m "test"`
  4. Verify Prettier auto-formats the file
- [ ] Test pre-push hook:
  1. Create file with TypeScript error
  2. Try to push
  3. Verify push is blocked
- [ ] Add `prepare` script to package.json: `"prepare": "husky"`

#### Technical Notes

**Code Quality Source:** `.rumbo/SETUP_GUIDE.md` Section 10 (Code Quality)

**Husky Hooks:**

**Pre-Commit Hook (`.husky/pre-commit`):**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm exec lint-staged
```

**Pre-Push Hook (`.husky/pre-push`):**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm run type-check
pnpm run test
```

**Lint-Staged Config (`.lintstagedrc.json`):**

```json
{
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write", "vitest related --run"],
  "*.{json,md,yml,yaml}": ["prettier --write"],
  "*.css": ["prettier --write"]
}
```

**What Happens on Commit:**

1. Developer runs `git commit`
2. Husky triggers `.husky/pre-commit`
3. lint-staged runs on staged files:
   - ESLint (auto-fix issues)
   - Prettier (auto-format)
   - Vitest (run tests for changed files)
4. If all pass: commit proceeds
5. If any fail: commit blocked, developer fixes issues

**What Happens on Push:**

1. Developer runs `git push`
2. Husky triggers `.husky/pre-push`
3. Runs:
   - `pnpm run type-check` (TypeScript compilation)
   - `pnpm run test` (all unit/integration tests)
4. If all pass: push proceeds
5. If any fail: push blocked, developer fixes issues

**RULEBOOK Reference:**

- Code quality: `.claude/RULEBOOK.md` lines 391-403 (CRITICAL RULES)
- Workflow: `.claude/RULEBOOK.md` lines 346-361

#### Definition of Done

- ✅ Husky initialized
- ✅ Pre-commit hook works (auto-formats code)
- ✅ Pre-push hook works (blocks push on errors)
- ✅ `.lintstagedrc.json` configured
- ✅ Hooks tested and verified
- ✅ Team can clone and hooks work automatically
- ✅ Committed to git with message: "feat: Configure Git hooks with Husky and lint-staged"

---

### **[INIT-011] Create Project Folder Structure**

**Epic:** Project Initialization
**Priority:** P0 (Critical - Blocker)
**Type:** Setup
**Estimate:** 30 mins
**Labels:** `setup`, `p0-critical`, `epic-initialization`

#### Story Description

Create the complete folder structure following the feature-based architecture defined in the RULEBOOK. This provides the organizational foundation for all feature development.

#### Acceptance Criteria

- [ ] All feature folders created under `src/features/`
- [ ] All shared component folders created under `src/components/`
- [ ] All server folders created under `src/server/`
- [ ] All test folders created under `tests/`
- [ ] All infrastructure folders created (`.storybook/`, `.github/`, `docker/`, etc.)
- [ ] Folder structure matches RULEBOOK exactly
- [ ] Each folder has a `.gitkeep` file (for empty directories)

#### Tasks

- [ ] Create feature directories:
  ```bash
  mkdir -p src/features/{transactions,budgets,bills,accounts,ai-chat,dashboard}/{components,hooks,types,utils}
  ```
- [ ] Create shared component directories:
  ```bash
  mkdir -p src/components/{ui,layout,common}
  ```
- [ ] Create server directories:
  ```bash
  mkdir -p src/server/{api/routers,db,services,auth,jobs}
  ```
- [ ] Create shared directories:
  ```bash
  mkdir -p src/{lib,hooks,types}
  ```
- [ ] Create test directories:
  ```bash
  mkdir -p tests/{e2e,fixtures,mocks}
  ```
- [ ] Create infrastructure directories:
  ```bash
  mkdir -p .storybook .github/workflows docker public/images
  ```
- [ ] Add `.gitkeep` to all empty directories:
  ```bash
  find . -type d -empty -not -path "./.git/*" -exec touch {}/.gitkeep \;
  ```
- [ ] Verify structure matches RULEBOOK:
  ```bash
  tree -L 3 src/
  ```

#### Technical Notes

**Folder Structure Source:** `.claude/RULEBOOK.md` lines 92-149

**Feature-Based Architecture:**

```
rumbo/
├── .claude/                 # Claude Code configuration
│   └── RULEBOOK.md          # Project law
├── .rumbo/                  # Project documentation
│   ├── CODE_STANDARDS.md    # Code structure (MANDATORY)
│   ├── TECH_STACK.md
│   ├── FEATURES_BACKLOG.md
│   └── ...
├── app/                     # Next.js App Router (ROUTES ONLY)
│   ├── (auth)/              # Auth layout group
│   ├── (authenticated)/     # Main app layout group
│   └── api/trpc/[trpc]/     # tRPC endpoint
├── src/
│   ├── features/            # ⭐ FEATURE-BASED ORGANIZATION
│   │   ├── transactions/
│   │   │   ├── components/  # Transaction-specific components
│   │   │   ├── hooks/       # Transaction-specific hooks
│   │   │   ├── types/       # Transaction-specific types
│   │   │   └── utils/       # Transaction-specific utilities
│   │   ├── budgets/
│   │   ├── bills/
│   │   ├── accounts/
│   │   ├── ai-chat/
│   │   └── dashboard/
│   ├── components/          # Shared components
│   │   ├── ui/              # Shadcn/ui (ALL in folders)
│   │   ├── layout/          # Layout components
│   │   └── common/          # Common components
│   ├── server/              # Backend code
│   │   ├── api/routers/     # tRPC routers
│   │   ├── db/              # Prisma
│   │   ├── services/        # Business logic
│   │   ├── auth/            # NextAuth
│   │   └── jobs/            # BullMQ
│   ├── lib/                 # Shared utilities
│   ├── hooks/               # Shared hooks
│   └── types/               # Shared types
├── tests/e2e/               # Playwright E2E (centralized)
├── docker/                  # Docker configs
└── [config files]
```

**Key Principles:**

1. `app/` is for **routes only** (pages, layouts, API routes)
2. `src/features/` contains **ALL business logic** (components, hooks, types, utils per feature)
3. `src/components/` contains **shared UI** (reusable across features)
4. `src/server/` contains **backend code** (tRPC, services, jobs)
5. **EVERY component is a folder** (no single-file components)

**RULEBOOK Reference:**

- Architecture: `.claude/RULEBOOK.md` lines 92-149
- Code standards: `.rumbo/CODE_STANDARDS.md` Section 1 (Folder Architecture)

#### Definition of Done

- ✅ All folders created
- ✅ Folder structure matches RULEBOOK
- ✅ `.gitkeep` files added to empty directories
- ✅ `tree` command shows correct structure
- ✅ Committed to git with message: "feat: Create feature-based folder structure"

---

### **[INIT-012] Verify Complete Setup and Create Health Check**

**Epic:** Project Initialization
**Priority:** P0 (Critical - Blocker)
**Type:** Setup
**Estimate:** 1-2 hours
**Labels:** `setup`, `p0-critical`, `epic-initialization`

#### Story Description

Verify that all initialization steps are complete and working. Create a comprehensive health check page that tests database, authentication, tRPC, and all critical services. This confirms the project is ready for feature development.

#### Acceptance Criteria

- [ ] All previous initialization stories (INIT-001 to INIT-011) completed
- [ ] Health check page created at `/health`
- [ ] Health check tests:
  - ✅ Database connection (Prisma)
  - ✅ Redis connection
  - ✅ tRPC working (public + protected procedures)
  - ✅ Authentication working (session retrieval)
  - ✅ Environment variables loaded
- [ ] All Docker services running (`docker-compose ps`)
- [ ] All quality checks pass (`pnpm run check`)
- [ ] Development server runs without errors
- [ ] Storybook starts without errors
- [ ] Documentation updated with "Setup Complete" status

#### Tasks

- [ ] Review checklist: Verify all INIT-001 to INIT-011 stories completed
- [ ] Create health check tRPC procedure:

  ```typescript
  // src/server/api/routers/health.ts
  health: publicProcedure.query(async ({ ctx }) => {
    // Test database
    const dbCheck = await ctx.db.$queryRaw`SELECT 1`;

    // Test Redis (if configured)
    // const redisCheck = await redis.ping()

    return {
      status: 'ok',
      timestamp: new Date(),
      services: {
        database: !!dbCheck,
        redis: true, // TODO: Implement Redis check
      },
      environment: process.env.NODE_ENV,
    };
  });
  ```

- [ ] Create health check page:

  ```typescript
  // app/health/page.tsx
  'use client'
  import { trpc } from '@/lib/trpc/react'

  export default function HealthPage() {
    const { data, isLoading } = trpc.health.check.useQuery()

    if (isLoading) return <div>Checking...</div>

    return (
      <div>
        <h1>Health Check</h1>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    )
  }
  ```

- [ ] Test health check:
  1. Start dev server: `pnpm run dev`
  2. Visit: http://localhost:3000/health
  3. Verify all services show as healthy
- [ ] Run all quality checks:
  ```bash
  pnpm run check
  # Should run: format:check, lint, type-check, test
  ```
- [ ] Verify Docker services:
  ```bash
  docker-compose ps
  # All services should show "Up"
  ```
- [ ] Create initialization completion document:
  ```bash
  echo "# Setup Complete\n\nDate: $(date)\n\nAll initialization stories completed.\n\nNext: Start feature development." > .rumbo/SETUP_COMPLETE.md
  ```

#### Technical Notes

**Health Check Pattern:**

A health check endpoint is critical for:

1. **Development:** Verify local setup works
2. **CI/CD:** Pre-deployment health verification
3. **Production:** Monitoring and alerting
4. **Debugging:** Quick service status overview

**What to Check:**

1. **Database:** Prisma connection + simple query
2. **Redis:** Ping command (for caching/jobs)
3. **Environment:** Verify NODE_ENV, DATABASE_URL, etc.
4. **Authentication:** Verify NextAuth session (if authenticated)
5. **tRPC:** Verify type safety and procedures work

**Example Response:**

```json
{
  "status": "ok",
  "timestamp": "2026-01-12T10:30:00.000Z",
  "services": {
    "database": true,
    "redis": true,
    "auth": true
  },
  "environment": "development",
  "version": "1.0.0"
}
```

**RULEBOOK Reference:**

- Health checks: Best practice (not in RULEBOOK, but production-grade standard)
- Quality standards: `.claude/RULEBOOK.md` lines 391-403

#### Definition of Done

- ✅ All initialization stories (INIT-001 to INIT-011) completed
- ✅ Health check page works
- ✅ All services healthy (database, Redis, tRPC)
- ✅ `pnpm run check` passes (all quality checks)
- ✅ Docker services running
- ✅ `SETUP_COMPLETE.md` created
- ✅ Committed to git with message: "feat: Add health check and verify complete setup"
- ✅ **Project ready for feature development** 🚀

---

## 🎯 Epic 0 Summary

**Total Stories:** 12
**Estimated Time:** 15-20 hours (2-3 days)
**Blockers:** All P0 stories must be completed before starting Epic 1

**Completion Criteria:**

- ✅ Next.js 16 project initialized
- ✅ All dependencies installed
- ✅ All configuration files in place
- ✅ Database running and migrated
- ✅ Docker infrastructure running
- ✅ Authentication configured
- ✅ tRPC API layer working
- ✅ Design system ready
- ✅ Testing infrastructure ready
- ✅ CI/CD pipelines configured
- ✅ Code quality tools active
- ✅ Folder structure created
- ✅ Health check passing

**Next Epic:** Epic 1 - Authentication & User Setup

---

## 🔐 Epic 1: Authentication & User Setup

**Description:** Enable users to sign up, log in, and configure their profile and preferences

**Goal:** Users can create accounts, authenticate securely, and customize their experience (currency, language, timezone)

### Epic 1 Stories

---

### **[AUTH-001] Create User Registration UI (Signup Page)**

**Epic:** Authentication & User Setup
**Priority:** P0 (Critical)
**Type:** Feature
**Estimate:** 4-6 hours
**Labels:** `epic-auth`, `p0-critical`, `feature`

#### Story Description

Build the user registration page with a complete signup form (email, password, name, date of birth, preferred name). The page must be mobile-first, accessible (WCAG 2.1 AA), and follow Colombian context defaults (es-CO, COP currency, America/Bogota timezone).

#### Acceptance Criteria

- [ ] Signup page exists at `/register` (unauthenticated route)
- [ ] Form includes all required fields: email, password, name, date of birth, preferred name
- [ ] Email field has proper validation (format, required)
- [ ] Password field has strength requirements (min 8 chars, uppercase, lowercase, number, special char)
- [ ] Password confirmation field validates match
- [ ] Date of birth field has calendar picker (Colombian DD/MM/YYYY format)
- [ ] Age validation enforces minimum 13 years old
- [ ] Form has loading states (submit button disabled during submission)
- [ ] Form shows inline validation errors (client-side)
- [ ] Form shows server-side errors (duplicate email, validation failures)
- [ ] Success state redirects to `/dashboard`
- [ ] Authenticated users redirected away from `/register` to `/dashboard`
- [ ] Mobile-responsive (works on iPhone 13, iPad, desktop)
- [ ] Accessibility: All form fields labeled, keyboard navigation works, ARIA attributes

#### Tasks

- [ ] Create `app/(auth)/register/page.tsx` (Server Component)
- [ ] Create `src/features/auth/components/signup-form/index.tsx` (Client Component)
- [ ] Create `src/features/auth/components/signup-form/types.ts`
- [ ] Create validation schema with Zod (matching backend schema):
  ```typescript
  // src/features/auth/schemas/signup.schema.ts
  const signupSchema = z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/)
      .regex(/[a-z]/)
      .regex(/[0-9]/)
      .regex(/[^A-Za-z0-9]/),
    name: z.string().min(2),
    preferredName: z.string().optional(),
    dateOfBirth: z.date().refine((date) => calculateAge(date) >= 13),
  });
  ```
- [ ] Integrate with tRPC `auth.signup` mutation
- [ ] Add form state management (React Hook Form + Zod resolver)
- [ ] Add loading states (button spinner, disabled inputs)
- [ ] Add error handling (display tRPC errors)
- [ ] Add success handling (redirect to dashboard with NextAuth session)
- [ ] Style with Tailwind + Shadcn/ui components (Input, Button, Card)
- [ ] Test on mobile (iPhone 13 viewport)
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility

#### Technical Notes

**Source:** `.rumbo/FEATURES_BACKLOG.md` lines 29-56 (Feature 1.1)

**Key Implementation Details:**

- **Component Location:** `src/features/auth/components/signup-form/`
- **Page Location:** `app/(auth)/register/page.tsx`
- **Validation:** Client + server (Zod schemas must match)
- **Form Library:** React Hook Form with `@hookform/resolvers/zod`
- **Colombian Defaults:**
  - Currency: COP
  - Language: es-CO
  - Timezone: America/Bogota
  - Date format: DD/MM/YYYY

**Password Requirements:**

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (!@#$%^&\*)

**Date of Birth Validation:**

- Minimum age: 13 years old
- Use Colombian date format (DD/MM/YYYY)
- Calendar picker (Shadcn DatePicker)

**RULEBOOK Reference:**

- Component structure: `.rumbo/CODE_STANDARDS.md` Section 3 (Component Structure)
- File naming: `.rumbo/CODE_STANDARDS.md` lines 203-238 (kebab-case)
- Form validation: Security requirement (Zod on client + server)
- Colombian context: `.claude/RULEBOOK.md` lines 300-327
- Accessibility: `.rumbo/TECHNICAL_REQUIREMENTS.md` WCAG 2.1 AA

#### Definition of Done

- ✅ Signup form works end-to-end
- ✅ All validations pass (client + server)
- ✅ Mobile-responsive (tested on iPhone 13, iPad, desktop)
- ✅ Accessible (WCAG 2.1 AA, keyboard navigation, screen reader)
- ✅ Error states handled (duplicate email, weak password, etc.)
- ✅ Loading states visible (button spinner)
- ✅ Success redirects to dashboard
- ✅ Storybook story created: `signup-form.stories.tsx`
- ✅ Vitest tests written: `signup-form.test.tsx` (form rendering, validation, submission)
- ✅ Code follows RULEBOOK patterns (kebab-case, named exports, folder structure)
- ✅ Code reviewed and committed

---

### **[AUTH-002] Create Signup tRPC Mutation (Backend)**

**Epic:** Authentication & User Setup
**Priority:** P0 (Critical)
**Type:** Feature
**Estimate:** 3-4 hours
**Labels:** `epic-auth`, `p0-critical`, `feature`, `backend`

#### Story Description

Create the backend tRPC mutation for user registration. Hash passwords with Argon2 (OWASP 2024 parameters), validate input with Zod, create user in database, and handle errors (duplicate emails, validation failures).

#### Acceptance Criteria

- [ ] tRPC router `auth` created at `src/server/api/routers/auth/`
- [ ] `signup` mutation accepts: email, password, name, dateOfBirth, preferredName
- [ ] Input validated with Zod schema (matches client schema)
- [ ] Password hashed with Argon2 (OWASP 2024 parameters: 19456 memoryCost, 2 timeCost)
- [ ] User created in database with default Colombian preferences (COP, es-CO, America/Bogota)
- [ ] Duplicate email check (returns clear error: "Email already exists")
- [ ] Error handling for all edge cases (weak password, invalid email, database errors)
- [ ] Success returns user object (without password hash)
- [ ] Database transaction used (rollback on failure)
- [ ] Unit tests cover: successful signup, duplicate email, weak password, invalid input

#### Tasks

- [ ] Create `src/server/api/routers/auth/index.ts` (router definition)
- [ ] Create `src/server/api/routers/auth/schemas.ts` (Zod schemas)
- [ ] Define `signupSchema`:
  ```typescript
  export const signupSchema = z.object({
    email: z.string().email().toLowerCase(),
    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/)
      .regex(/[a-z]/)
      .regex(/[0-9]/)
      .regex(/[^A-Za-z0-9]/),
    name: z.string().min(2).max(100),
    preferredName: z.string().min(1).max(50).optional(),
    dateOfBirth: z.date(),
  });
  ```
- [ ] Implement `signup` mutation:

  ```typescript
  signup: publicProcedure.input(signupSchema).mutation(async ({ ctx, input }) => {
    // 1. Check if email exists
    const existing = await ctx.db.user.findUnique({ where: { email: input.email } });
    if (existing) throw new TRPCError({ code: 'CONFLICT', message: 'Email already exists' });

    // 2. Hash password (Argon2 OWASP 2024)
    const hashedPassword = await hash(input.password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    // 3. Calculate age
    const age = calculateAge(input.dateOfBirth);
    if (age < 13) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Must be 13+ years old' });

    // 4. Create user with Colombian defaults
    const user = await ctx.db.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        name: input.name,
        preferredName: input.preferredName,
        dateOfBirth: input.dateOfBirth,
        currency: 'COP',
        language: 'es-CO',
        timezone: 'America/Bogota',
        dateFormat: 'DD/MM/YYYY',
      },
    });

    // 5. Return user (without password)
    return { id: user.id, email: user.email, name: user.name };
  });
  ```

- [ ] Add router to `src/server/api/root.ts`
- [ ] Write unit tests: `src/server/api/routers/auth/auth.test.ts`
  - Test: Successful signup
  - Test: Duplicate email error
  - Test: Weak password error
  - Test: Invalid email format
  - Test: Underage user (<13 years old)
- [ ] Test with tRPC devtools in browser

#### Technical Notes

**Source:** `.rumbo/SETUP_GUIDE.md` Section 4 (Authentication Setup)

**Key Implementation Details:**

**Argon2 Hashing (OWASP 2024 Standards):**

```typescript
import { hash } from '@node-rs/argon2';

const hashedPassword = await hash(password, {
  memoryCost: 19456, // 19 MB (OWASP 2024)
  timeCost: 2, // 2 iterations
  outputLen: 32, // 32 bytes
  parallelism: 1, // 1 thread
});
```

**Colombian Defaults:**

- Currency: `COP`
- Language: `es-CO`
- Timezone: `America/Bogota`
- Date format: `DD/MM/YYYY`

**Error Handling:**

- Duplicate email: `TRPCError({ code: 'CONFLICT', message: 'Email already exists' })`
- Weak password: `TRPCError({ code: 'BAD_REQUEST', message: 'Password does not meet requirements' })`
- Invalid input: Zod handles automatically

**Database Schema Reference:**

```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  password      String
  name          String
  preferredName String?
  dateOfBirth   DateTime
  currency      String   @default("COP")
  language      String   @default("es-CO")
  timezone      String   @default("America/Bogota")
  dateFormat    String   @default("DD/MM/YYYY")
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

**RULEBOOK Reference:**

- tRPC patterns: `.rumbo/CODE_STANDARDS.md` Section 5 (tRPC & API Patterns)
- Security: `.claude/RULEBOOK.md` lines 246-263 (NEVER store plaintext passwords)
- Argon2 config: `.rumbo/SETUP_GUIDE.md` lines 468-480
- Error handling: `.rumbo/CODE_STANDARDS.md` lines 605-627

#### Definition of Done

- ✅ `auth.signup` mutation works end-to-end
- ✅ Passwords hashed with Argon2 (OWASP 2024 params)
- ✅ Duplicate emails rejected with clear error
- ✅ Colombian defaults applied
- ✅ Age validation enforced (13+ years)
- ✅ Unit tests pass (5+ test cases)
- ✅ tRPC type inference works (autocomplete in frontend)
- ✅ Code follows RULEBOOK patterns (router structure, error handling)
- ✅ Code reviewed and committed

---

### **[AUTH-003] Create Login UI (Signin Page)**

**Epic:** Authentication & User Setup
**Priority:** P0 (Critical)
**Type:** Feature
**Estimate:** 3-4 hours
**Labels:** `epic-auth`, `p0-critical`, `feature`

#### Story Description

Build the user login page with email/password form. The page must handle authentication via NextAuth credentials provider, show loading states, handle errors (invalid credentials, server errors), and redirect to dashboard on success.

#### Acceptance Criteria

- [ ] Login page exists at `/login` (unauthenticated route)
- [ ] Form includes email and password fields
- [ ] Email field has proper validation (format, required)
- [ ] Password field has visibility toggle (show/hide password)
- [ ] Form has loading states (submit button disabled during submission)
- [ ] Form shows inline validation errors
- [ ] Form shows authentication errors ("Invalid email or password")
- [ ] Success state redirects to `/dashboard`
- [ ] Authenticated users redirected away from `/login` to `/dashboard`
- [ ] "Forgot password?" link displayed (points to `/forgot-password` - stub for v2)
- [ ] "Don't have an account? Sign up" link to `/register`
- [ ] Mobile-responsive (works on iPhone 13, iPad, desktop)
- [ ] Accessibility: All form fields labeled, keyboard navigation works, ARIA attributes

#### Tasks

- [ ] Create `app/(auth)/login/page.tsx` (Server Component)
- [ ] Create `src/features/auth/components/login-form/index.tsx` (Client Component)
- [ ] Create `src/features/auth/components/login-form/types.ts`
- [ ] Create validation schema:
  ```typescript
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, 'Password is required'),
  });
  ```
- [ ] Integrate with NextAuth `signIn()` function:

  ```typescript
  const result = await signIn('credentials', {
    email: data.email,
    password: data.password,
    redirect: false,
  });

  if (result?.error) {
    setError('Invalid email or password');
  } else {
    router.push('/dashboard');
  }
  ```

- [ ] Add form state management (React Hook Form + Zod resolver)
- [ ] Add loading states (button spinner, disabled inputs)
- [ ] Add error handling (display NextAuth errors)
- [ ] Add password visibility toggle (eye icon)
- [ ] Add "Forgot password?" link (stub, navigates to `/forgot-password`)
- [ ] Add "Sign up" link (navigates to `/register`)
- [ ] Style with Tailwind + Shadcn/ui components
- [ ] Test on mobile (iPhone 13 viewport)
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility

#### Technical Notes

**Source:** `.rumbo/FEATURES_BACKLOG.md` lines 58-83 (Feature 1.2)

**Key Implementation Details:**

- **Component Location:** `src/features/auth/components/login-form/`
- **Page Location:** `app/(auth)/login/page.tsx`
- **Authentication:** NextAuth v5 `signIn()` function
- **Error Handling:** NextAuth returns errors, display as "Invalid email or password"

**NextAuth Integration:**

```typescript
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const handleSubmit = async (data: LoginFormData) => {
  setIsLoading(true);

  const result = await signIn('credentials', {
    email: data.email,
    password: data.password,
    redirect: false,
  });

  if (result?.error) {
    setError('root', { message: 'Invalid email or password' });
  } else if (result?.ok) {
    router.push('/dashboard');
  }

  setIsLoading(false);
};
```

**Password Visibility Toggle:**

```typescript
const [showPassword, setShowPassword] = useState(false)

<Input
  type={showPassword ? 'text' : 'password'}
  {...register('password')}
/>
<Button onClick={() => setShowPassword(!showPassword)}>
  {showPassword ? <EyeOff /> : <Eye />}
</Button>
```

**RULEBOOK Reference:**

- Component structure: `.rumbo/CODE_STANDARDS.md` Section 3
- NextAuth integration: `.rumbo/SETUP_GUIDE.md` Section 4
- Form validation: Security requirement (Zod validation)
- Accessibility: `.rumbo/TECHNICAL_REQUIREMENTS.md` WCAG 2.1 AA

#### Definition of Done

- ✅ Login form works end-to-end
- ✅ All validations pass
- ✅ Mobile-responsive (tested on iPhone 13, iPad, desktop)
- ✅ Accessible (WCAG 2.1 AA, keyboard navigation)
- ✅ Error states handled (invalid credentials, server errors)
- ✅ Loading states visible
- ✅ Success redirects to dashboard
- ✅ Password visibility toggle works
- ✅ Storybook story created: `login-form.stories.tsx`
- ✅ Vitest tests written: `login-form.test.tsx`
- ✅ Code follows RULEBOOK patterns
- ✅ Code reviewed and committed

---

### **[AUTH-004] Create Login tRPC Mutation & NextAuth Credentials Provider**

**Epic:** Authentication & User Setup
**Priority:** P0 (Critical)
**Type:** Feature
**Estimate:** 3-4 hours
**Labels:** `epic-auth`, `p0-critical`, `feature`, `backend`

#### Story Description

Configure NextAuth Credentials provider to authenticate users with email/password. Verify password with Argon2, create JWT session, and handle authentication errors (invalid credentials, user not found).

#### Acceptance Criteria

- [ ] NextAuth Credentials provider configured in `src/server/auth/config.ts`
- [ ] Provider accepts email and password
- [ ] User lookup by email (case-insensitive)
- [ ] Password verification with Argon2 `verify()`
- [ ] JWT session created on successful authentication
- [ ] Session includes userId and email
- [ ] Invalid credentials return clear error
- [ ] User not found returns same error as invalid password (security: don't leak user existence)
- [ ] Session persists across page reloads
- [ ] Session expires after inactivity (30 days default)
- [ ] Unit tests cover: successful login, invalid password, user not found

#### Tasks

- [ ] Update `src/server/auth/config.ts` with Credentials provider:

  ```typescript
  import { verify } from '@node-rs/argon2';

  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        // Find user (case-insensitive email)
        const user = await db.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        if (!user) {
          throw new Error('Invalid email or password');
        }

        // Verify password
        const isValid = await verify(user.password, credentials.password);

        if (!isValid) {
          throw new Error('Invalid email or password');
        }

        // Return user (NextAuth will create session)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ];
  ```

- [ ] Configure JWT callbacks to add userId:
  ```typescript
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.userId = user.id
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId
      }
      return session
    },
  }
  ```
- [ ] Configure session strategy: `session: { strategy: 'jwt' }`
- [ ] Configure session max age: `maxAge: 30 * 24 * 60 * 60` (30 days)
- [ ] Write unit tests: `src/server/auth/auth.test.ts`
  - Test: Successful login
  - Test: Invalid password
  - Test: User not found
  - Test: Missing credentials
- [ ] Test with NextAuth devtools

#### Technical Notes

**Source:** `.rumbo/SETUP_GUIDE.md` Section 4 (Authentication Setup)

**Key Implementation Details:**

**Argon2 Password Verification:**

```typescript
import { verify } from '@node-rs/argon2';

const isValid = await verify(hashedPassword, inputPassword);
// Returns: true if match, false otherwise
```

**Session Strategy:**

- **JWT:** Stateless, stored in HTTP-only cookie
- **Max Age:** 30 days (configurable)
- **Secure:** HTTPS-only in production

**Security Best Practices:**

1. ✅ Use same error message for "user not found" and "invalid password" (don't leak user existence)
2. ✅ Hash comparison is constant-time (Argon2 handles this)
3. ✅ Email lookup is case-insensitive
4. ✅ Session stored in HTTP-only cookie (not accessible to JavaScript)

**NextAuth JWT Callbacks:**

```typescript
callbacks: {
  // Add userId to JWT token
  jwt({ token, user }) {
    if (user) {
      token.userId = user.id
      token.email = user.email
    }
    return token
  },

  // Add userId to session object
  session({ session, token }) {
    if (session.user) {
      session.user.id = token.userId as string
      session.user.email = token.email as string
    }
    return session
  },
}
```

**RULEBOOK Reference:**

- NextAuth config: `.rumbo/SETUP_GUIDE.md` lines 960-1062
- Security: `.claude/RULEBOOK.md` lines 246-263
- Argon2 verification: Same library as hashing (`@node-rs/argon2`)
- Error handling: `.rumbo/CODE_STANDARDS.md` lines 605-627

#### Definition of Done

- ✅ Credentials provider configured
- ✅ Login works end-to-end (email/password → session)
- ✅ Password verification with Argon2 works
- ✅ JWT session created and persists
- ✅ Invalid credentials handled securely
- ✅ Session includes userId and email
- ✅ Unit tests pass (4+ test cases)
- ✅ Code follows RULEBOOK patterns
- ✅ Code reviewed and committed

---

### **[AUTH-005] Create User Profile Settings Page (UI)**

**Epic:** Authentication & User Setup
**Priority:** P1 (High)
**Type:** Feature
**Estimate:** 4-5 hours
**Labels:** `epic-auth`, `p1-high`, `feature`

#### Story Description

Build the user profile settings page where users can update their profile (name, email, preferredName) and preferences (currency, language, timezone, date format). The page must be accessible only to authenticated users.

#### Acceptance Criteria

- [ ] Settings page exists at `/settings` (authenticated route)
- [ ] Page displays current user profile data
- [ ] Form includes profile fields: name, email, preferredName
- [ ] Form includes preference fields: currency, language, timezone, date format
- [ ] Currency dropdown includes: COP (default), USD, EUR
- [ ] Language dropdown includes: es-CO (default), en-US
- [ ] Timezone dropdown includes: America/Bogota (default), 4 other common timezones
- [ ] Date format dropdown includes: DD/MM/YYYY (default), MM/DD/YYYY
- [ ] Form has validation (email format, required fields)
- [ ] Form has loading states (save button disabled during submission)
- [ ] Form shows success message after save (auto-hide after 3 seconds)
- [ ] Form shows server-side errors
- [ ] Logout button available (redirects to `/login`)
- [ ] Mobile-responsive (works on iPhone 13, iPad, desktop)
- [ ] Accessibility: All form fields labeled, keyboard navigation works

#### Tasks

- [ ] Create `app/(authenticated)/settings/page.tsx` (Server Component)
- [ ] Create `src/features/auth/components/profile-settings-form/index.tsx` (Client Component)
- [ ] Create `src/features/auth/components/profile-settings-form/types.ts`
- [ ] Create validation schema:
  ```typescript
  const profileSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    preferredName: z.string().min(1).max(50).optional(),
    currency: z.enum(['COP', 'USD', 'EUR']),
    language: z.enum(['es-CO', 'en-US']),
    timezone: z.string(),
    dateFormat: z.enum(['DD/MM/YYYY', 'MM/DD/YYYY']),
  });
  ```
- [ ] Fetch current user data with tRPC: `trpc.user.getProfile.useQuery()`
- [ ] Pre-populate form with current values
- [ ] Integrate with tRPC `user.updateProfile` mutation
- [ ] Add form state management (React Hook Form + Zod resolver)
- [ ] Add loading states
- [ ] Add success/error messages (toast or inline)
- [ ] Add logout button:

  ```typescript
  import { signOut } from 'next-auth/react';

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/login' });
  };
  ```

- [ ] Style with Tailwind + Shadcn/ui components (Input, Select, Button, Card)
- [ ] Test on mobile
- [ ] Test keyboard navigation

#### Technical Notes

**Source:** `.rumbo/FEATURES_BACKLOG.md` lines 85-112 (Feature 1.3)

**Key Implementation Details:**

- **Component Location:** `src/features/auth/components/profile-settings-form/`
- **Page Location:** `app/(authenticated)/settings/page.tsx`
- **Protected Route:** Use NextAuth middleware to enforce authentication
- **Data Fetching:** tRPC `user.getProfile` (fetches current user data)
- **Data Mutation:** tRPC `user.updateProfile` (saves changes)

**Form Pre-Population:**

```typescript
const { data: user, isLoading } = trpc.user.getProfile.useQuery();

const form = useForm({
  resolver: zodResolver(profileSchema),
  defaultValues: user, // Pre-populate with current data
});

// If data loads after form initialization
useEffect(() => {
  if (user) {
    form.reset(user);
  }
}, [user, form]);
```

**Logout Implementation:**

```typescript
import { signOut } from 'next-auth/react'

<Button onClick={() => signOut({ callbackUrl: '/login' })}>
  Logout
</Button>
```

**Success Message (Auto-Hide):**

```typescript
const [success, setSuccess] = useState(false);

const handleSubmit = async (data) => {
  await updateProfile.mutateAsync(data);
  setSuccess(true);
  setTimeout(() => setSuccess(false), 3000); // Hide after 3 seconds
};
```

**RULEBOOK Reference:**

- Component structure: `.rumbo/CODE_STANDARDS.md` Section 3
- Form validation: Zod schemas
- Protected routes: NextAuth middleware (`.rumbo/SETUP_GUIDE.md` Section 4)
- Colombian defaults: `.claude/RULEBOOK.md` lines 300-327

#### Definition of Done

- ✅ Settings page works end-to-end
- ✅ Form pre-populates with current user data
- ✅ All fields editable and save correctly
- ✅ Success message displays and auto-hides
- ✅ Logout button works
- ✅ Mobile-responsive (tested on iPhone 13, iPad, desktop)
- ✅ Accessible (WCAG 2.1 AA)
- ✅ Loading states visible
- ✅ Storybook story created: `profile-settings-form.stories.tsx`
- ✅ Vitest tests written: `profile-settings-form.test.tsx`
- ✅ Code follows RULEBOOK patterns
- ✅ Code reviewed and committed

---

### **[AUTH-006] Create User Profile tRPC Procedures (Backend)**

**Epic:** Authentication & User Setup
**Priority:** P1 (High)
**Type:** Feature
**Estimate:** 3-4 hours
**Labels:** `epic-auth`, `p1-high`, `feature`, `backend`

#### Story Description

Create tRPC procedures for fetching and updating user profile data. Ensure only authenticated users can access/modify their own data.

#### Acceptance Criteria

- [ ] tRPC router `user` created at `src/server/api/routers/user/`
- [ ] `getProfile` query returns current user's profile (protected procedure)
- [ ] `updateProfile` mutation updates user profile (protected procedure)
- [ ] Input validated with Zod schema
- [ ] Users can only update their own profile (authorization check)
- [ ] Email uniqueness validated (if email changed)
- [ ] Preferences applied app-wide after update
- [ ] Error handling for all edge cases
- [ ] Unit tests cover: successful update, duplicate email, unauthorized access

#### Tasks

- [ ] Create `src/server/api/routers/user/index.ts` (router definition)
- [ ] Create `src/server/api/routers/user/schemas.ts` (Zod schemas)
- [ ] Define `updateProfileSchema`:
  ```typescript
  export const updateProfileSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
    preferredName: z.string().min(1).max(50).optional(),
    currency: z.enum(['COP', 'USD', 'EUR']).optional(),
    language: z.enum(['es-CO', 'en-US']).optional(),
    timezone: z.string().optional(),
    dateFormat: z.enum(['DD/MM/YYYY', 'MM/DD/YYYY']).optional(),
  });
  ```
- [ ] Implement `getProfile` query:

  ```typescript
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        preferredName: true,
        currency: true,
        language: true,
        timezone: true,
        dateFormat: true,
      },
    });

    if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });

    return user;
  });
  ```

- [ ] Implement `updateProfile` mutation:

  ```typescript
  updateProfile: protectedProcedure.input(updateProfileSchema).mutation(async ({ ctx, input }) => {
    // If email changed, check uniqueness
    if (input.email) {
      const existing = await ctx.db.user.findUnique({ where: { email: input.email } });
      if (existing && existing.id !== ctx.session.user.id) {
        throw new TRPCError({ code: 'CONFLICT', message: 'Email already in use' });
      }
    }

    // Update user
    const updated = await ctx.db.user.update({
      where: { id: ctx.session.user.id },
      data: input,
    });

    return updated;
  });
  ```

- [ ] Add router to `src/server/api/root.ts`
- [ ] Write unit tests: `src/server/api/routers/user/user.test.ts`
  - Test: Get profile (successful)
  - Test: Update profile (successful)
  - Test: Update email (duplicate email error)
  - Test: Unauthorized access (no session)

#### Technical Notes

**Source:** `.rumbo/FEATURES_BACKLOG.md` lines 85-112 (Feature 1.3)

**Key Implementation Details:**

**Protected Procedure:**

```typescript
// Only authenticated users can access
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      ...ctx,
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});
```

**Authorization:**

- User can only access/update their own profile
- Session includes `userId` (from JWT callback)
- All queries/mutations use `ctx.session.user.id`

**Email Uniqueness Check:**

```typescript
// Only check if email is being changed
if (input.email && input.email !== currentUser.email) {
  const existing = await ctx.db.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new TRPCError({ code: 'CONFLICT', message: 'Email already in use' });
  }
}
```

**RULEBOOK Reference:**

- tRPC patterns: `.rumbo/CODE_STANDARDS.md` Section 5 (tRPC & API Patterns)
- Protected procedures: `.rumbo/SETUP_GUIDE.md` Section 5
- Authorization: Security requirement (verify permissions on EVERY procedure)
- Error handling: `.rumbo/CODE_STANDARDS.md` lines 605-627

#### Definition of Done

- ✅ `user.getProfile` query works
- ✅ `user.updateProfile` mutation works
- ✅ Email uniqueness validated
- ✅ Authorization enforced (users can only update own profile)
- ✅ Unit tests pass (4+ test cases)
- ✅ tRPC type inference works
- ✅ Code follows RULEBOOK patterns
- ✅ Code reviewed and committed

---

### **[AUTH-007] Create Protected Route Middleware**

**Epic:** Authentication & User Setup
**Priority:** P0 (Critical)
**Type:** Feature
**Estimate:** 2-3 hours
**Labels:** `epic-auth`, `p0-critical`, `feature`, `backend`

#### Story Description

Create Next.js middleware to protect authenticated routes and redirect unauthenticated users to login. Ensure auth routes (`/login`, `/register`) redirect authenticated users to dashboard.

#### Acceptance Criteria

- [ ] Middleware created at `middleware.ts` (root level)
- [ ] Authenticated routes protected: `/dashboard`, `/settings`, `/transactions`, `/budgets`, `/bills`
- [ ] Unauthenticated users redirected to `/login`
- [ ] Auth routes (`/login`, `/register`) redirect authenticated users to `/dashboard`
- [ ] Public routes accessible without authentication: `/`, `/health`
- [ ] API routes exempt from middleware (tRPC handles auth internally)
- [ ] Middleware runs on all routes (using matcher)
- [ ] NextAuth session checked efficiently (no database calls)

#### Tasks

- [ ] Create `middleware.ts` at project root:

  ```typescript
  import { NextResponse } from 'next/server';
  import type { NextRequest } from 'next/server';
  import { getToken } from 'next-auth/jwt';

  const protectedRoutes = [
    '/dashboard',
    '/settings',
    '/transactions',
    '/budgets',
    '/bills',
    '/accounts',
  ];
  const authRoutes = ['/login', '/register'];
  const publicRoutes = ['/', '/health'];

  export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const isAuthenticated = !!token;

    const { pathname } = request.nextUrl;

    // Protected routes: require authentication
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
      if (!isAuthenticated) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    // Auth routes: redirect if already authenticated
    if (authRoutes.some((route) => pathname.startsWith(route))) {
      if (isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    return NextResponse.next();
  }

  export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  };
  ```

- [ ] Test unauthenticated access to `/dashboard` (should redirect to `/login`)
- [ ] Test authenticated access to `/login` (should redirect to `/dashboard`)
- [ ] Test public route `/` (should be accessible to all)
- [ ] Test `callbackUrl` parameter (after login, redirect to original page)
- [ ] Write E2E tests: `tests/e2e/auth-middleware.spec.ts`
  - Test: Unauthenticated user redirected from protected route
  - Test: Authenticated user redirected from auth routes
  - Test: Public routes accessible

#### Technical Notes

**Source:** NextAuth v5 middleware pattern

**Key Implementation Details:**

**NextAuth JWT Token Check:**

```typescript
import { getToken } from 'next-auth/jwt';

const token = await getToken({ req: request });
const isAuthenticated = !!token;
```

**Why JWT Token (not session)?**

- Middleware runs on Edge (no database access)
- JWT token stored in cookie, fast to verify
- No database round-trip required

**Route Protection:**

- **Protected routes:** Require authentication (redirect to `/login` if not authenticated)
- **Auth routes:** Redirect to `/dashboard` if already authenticated (prevent logged-in users from seeing login page)
- **Public routes:** Accessible to all (no redirect)

**Matcher Configuration:**

```typescript
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

- Excludes: API routes, Next.js static files, images, favicon
- Includes: All page routes

**Callback URL Pattern:**

```typescript
// If user tries to access /settings without auth:
// 1. Redirect to /login?callbackUrl=/settings
// 2. After successful login, redirect to /settings
const loginUrl = new URL('/login', request.url);
loginUrl.searchParams.set('callbackUrl', pathname);
return NextResponse.redirect(loginUrl);
```

**RULEBOOK Reference:**

- Middleware: Next.js 13+ pattern (Edge runtime)
- Security: `.claude/RULEBOOK.md` lines 246-263 (Authorization on EVERY endpoint)
- NextAuth integration: `.rumbo/SETUP_GUIDE.md` Section 4

#### Definition of Done

- ✅ Middleware created and works
- ✅ Protected routes enforce authentication
- ✅ Auth routes redirect authenticated users
- ✅ Public routes accessible
- ✅ Callback URL pattern works
- ✅ E2E tests pass (3+ test cases)
- ✅ Code follows RULEBOOK patterns
- ✅ Code reviewed and committed

---

### **[AUTH-008] Write Integration Tests for Auth Flow**

**Epic:** Authentication & User Setup
**Priority:** P1 (High)
**Type:** Testing
**Estimate:** 3-4 hours
**Labels:** `epic-auth`, `p1-high`, `testing`

#### Story Description

Write comprehensive integration tests for the complete authentication flow: signup, login, session persistence, profile update, and logout. Tests must cover happy path and edge cases.

#### Acceptance Criteria

- [ ] Signup flow tested (successful signup, duplicate email, weak password)
- [ ] Login flow tested (successful login, invalid credentials, user not found)
- [ ] Session persistence tested (session survives page reload)
- [ ] Profile update tested (successful update, duplicate email)
- [ ] Logout tested (session cleared, redirect to login)
- [ ] All tests pass (13+ integration tests)
- [ ] Tests use test fixtures for data (no hardcoded users)
- [ ] Tests clean up database after each run (no test pollution)

#### Tasks

- [ ] Create test fixtures: `tests/fixtures/user.fixture.ts`

  ```typescript
  import { hash } from '@node-rs/argon2';

  let userCounter = 0;

  export const createUserFixture = async (overrides = {}) => {
    userCounter++;
    return {
      email: `test${userCounter}@example.com`,
      password: await hash('Test1234!', { memoryCost: 19456, timeCost: 2 }),
      name: `Test User ${userCounter}`,
      dateOfBirth: new Date('1990-01-01'),
      ...overrides,
    };
  };
  ```

- [ ] Write signup integration tests: `src/features/auth/components/signup-form/signup-form.test.tsx`
  - Test: Successful signup (form submission → tRPC call → redirect)
  - Test: Duplicate email error displayed
  - Test: Weak password error displayed
  - Test: Form validation errors displayed
- [ ] Write login integration tests: `src/features/auth/components/login-form/login-form.test.tsx`
  - Test: Successful login (form submission → NextAuth → redirect)
  - Test: Invalid credentials error displayed
  - Test: Form validation errors displayed
- [ ] Write profile update integration tests: `src/features/auth/components/profile-settings-form/profile-settings-form.test.tsx`
  - Test: Successful profile update
  - Test: Duplicate email error displayed
  - Test: Form pre-populates with current data
- [ ] Write backend auth tests: `src/server/api/routers/auth/auth.test.ts`
  - Test: `signup` mutation (successful, duplicate email, weak password)
  - Test: NextAuth authorize (successful, invalid password, user not found)
- [ ] Write backend user tests: `src/server/api/routers/user/user.test.ts`
  - Test: `getProfile` query (successful, unauthorized)
  - Test: `updateProfile` mutation (successful, duplicate email, unauthorized)
- [ ] Create test cleanup utility: `tests/utils/cleanup.test-utils.ts`

  ```typescript
  import { db } from '@/server/db';

  export async function cleanupTestDatabase() {
    await db.$transaction([db.user.deleteMany(), db.session.deleteMany(), db.account.deleteMany()]);
  }
  ```

- [ ] Add cleanup to test setup: `tests/setup.ts`

  ```typescript
  import { afterEach } from 'vitest';
  import { cleanupTestDatabase } from './utils/cleanup.test-utils';

  afterEach(async () => {
    await cleanupTestDatabase();
  });
  ```

#### Technical Notes

**Source:** `.rumbo/CODE_STANDARDS.md` Section 6 (Testing Patterns)

**Key Implementation Details:**

**Test Fixtures (Factory Pattern):**

- Always use factory pattern for test data
- Unique data per test (no collisions)
- Easy to customize with overrides
- Type-safe

**Test Database Strategy:**

- Use real test database (not mocked Prisma)
- Clean up between tests (truncate tables)
- Seed data with fixtures

**Integration Test Example:**

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SignupForm } from './index'
import { createUserFixture } from '@/tests/fixtures/user.fixture'

describe('SignupForm', () => {
  it('should sign up user successfully', async () => {
    const user = userEvent.setup()
    const fixture = await createUserFixture()

    render(<SignupForm />)

    await user.type(screen.getByLabelText('Email'), fixture.email)
    await user.type(screen.getByLabelText('Password'), 'Test1234!')
    await user.type(screen.getByLabelText('Name'), fixture.name)
    await user.click(screen.getByRole('button', { name: 'Sign up' }))

    await waitFor(() => {
      expect(window.location.pathname).toBe('/dashboard')
    })
  })
})
```

**RULEBOOK Reference:**

- Testing strategy: `.claude/RULEBOOK.md` lines 220-244
- Test fixtures: `.rumbo/CODE_STANDARDS.md` lines 967-991
- Test cleanup: `.rumbo/CODE_STANDARDS.md` lines 1032-1074
- Coverage: 100% for critical paths (auth is critical)

#### Definition of Done

- ✅ 13+ integration tests written
- ✅ All tests pass
- ✅ Coverage: 100% for auth flows (signup, login, profile update)
- ✅ Test fixtures created and used
- ✅ Database cleanup works (no test pollution)
- ✅ Tests follow RULEBOOK patterns (colocated, descriptive names)
- ✅ Code reviewed and committed

---

### **[AUTH-009] Write E2E Tests for Auth Flow**

**Epic:** Authentication & User Setup
**Priority:** P1 (High)
**Type:** Testing
**Estimate:** 3-4 hours
**Labels:** `epic-auth`, `p1-high`, `testing`

#### Story Description

Write end-to-end tests using Playwright for the complete authentication flow. Tests must run in real browsers (Chromium, Firefox, WebKit) and test the full user journey.

#### Acceptance Criteria

- [ ] E2E tests for signup flow (visit `/register` → fill form → submit → redirect to `/dashboard`)
- [ ] E2E tests for login flow (visit `/login` → fill form → submit → redirect to `/dashboard`)
- [ ] E2E tests for protected routes (access `/dashboard` without auth → redirect to `/login`)
- [ ] E2E tests for profile update (login → visit `/settings` → update → save → success message)
- [ ] E2E tests for logout (login → visit `/settings` → logout → redirect to `/login`)
- [ ] All tests pass on Chromium, Firefox, WebKit
- [ ] Tests use Page Object Model pattern
- [ ] Tests clean up data after each run

#### Tasks

- [ ] Create Page Object: `tests/e2e/pages/signup.page.ts`

  ```typescript
  export class SignupPage {
    constructor(private page: Page) {}

    async goto() {
      await this.page.goto('/register');
    }

    async fillForm(data: { email: string; password: string; name: string }) {
      await this.page.fill('[name="email"]', data.email);
      await this.page.fill('[name="password"]', data.password);
      await this.page.fill('[name="name"]', data.name);
    }

    async submit() {
      await this.page.click('button[type="submit"]');
    }

    async expectSuccess() {
      await this.page.waitForURL('/dashboard');
    }
  }
  ```

- [ ] Create Page Object: `tests/e2e/pages/login.page.ts`
- [ ] Create Page Object: `tests/e2e/pages/settings.page.ts`
- [ ] Write E2E test: `tests/e2e/auth.spec.ts`

  ```typescript
  import { test, expect } from '@playwright/test';
  import { SignupPage } from './pages/signup.page';
  import { LoginPage } from './pages/login.page';

  test('user can sign up', async ({ page }) => {
    const signupPage = new SignupPage(page);

    await signupPage.goto();
    await signupPage.fillForm({
      email: 'test@example.com',
      password: 'Test1234!',
      name: 'Test User',
    });
    await signupPage.submit();
    await signupPage.expectSuccess();
  });

  test('user can log in', async ({ page }) => {
    // Seed user first
    // ...

    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('test@example.com', 'Test1234!');
    await loginPage.expectSuccess();
  });
  ```

- [ ] Write protected routes test: `tests/e2e/auth-middleware.spec.ts`
- [ ] Write profile update test: `tests/e2e/profile.spec.ts`
- [ ] Write logout test: `tests/e2e/logout.spec.ts`
- [ ] Add test data cleanup: Use Playwright's `afterEach` hook
- [ ] Run tests on all browsers: `pnpm test:e2e`

#### Technical Notes

**Source:** `.rumbo/CODE_STANDARDS.md` Section 6 (Testing Patterns)

**Key Implementation Details:**

**Page Object Model:**

- Encapsulate page interactions
- Reusable across tests
- Easy to maintain

**Playwright Configuration:**

```typescript
// playwright.config.ts
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
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

**Test Data Strategy:**

- Seed test user before test
- Clean up after test
- Use unique emails per test (avoid conflicts)

**E2E Test Example:**

```typescript
test('user can update profile', async ({ page }) => {
  // 1. Seed user
  const user = await seedUser({ email: 'test@example.com', password: 'Test1234!' });

  // 2. Login
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('test@example.com', 'Test1234!');

  // 3. Navigate to settings
  await page.goto('/settings');

  // 4. Update profile
  await page.fill('[name="name"]', 'Updated Name');
  await page.click('button:has-text("Save")');

  // 5. Verify success message
  await expect(page.locator('text=Profile updated successfully')).toBeVisible();
});
```

**RULEBOOK Reference:**

- E2E testing: `.claude/RULEBOOK.md` lines 77-83 (Playwright)
- Page Object Model: `.rumbo/CODE_STANDARDS.md` lines 1100-1140
- Test organization: `.rumbo/CODE_STANDARDS.md` Section 6

#### Definition of Done

- ✅ 8+ E2E tests written
- ✅ All tests pass on Chromium, Firefox, WebKit
- ✅ Page Object Model used
- ✅ Tests cover full auth flow (signup, login, profile, logout)
- ✅ Test data cleanup works
- ✅ Tests follow RULEBOOK patterns (centralized E2E tests)
- ✅ Code reviewed and committed

---

### **[AUTH-010] Create Storybook Stories for Auth Components**

**Epic:** Authentication & User Setup
**Priority:** P2 (Medium)
**Type:** Documentation
**Estimate:** 2-3 hours
**Labels:** `epic-auth`, `p2-medium`, `storybook`

#### Story Description

Create Storybook stories for all authentication components (SignupForm, LoginForm, ProfileSettingsForm). Stories must demonstrate all component states (default, loading, error, success) and be interactive.

#### Acceptance Criteria

- [ ] Storybook story created for SignupForm (5+ stories: default, loading, error, success, validation)
- [ ] Storybook story created for LoginForm (5+ stories: default, loading, error, success, validation)
- [ ] Storybook story created for ProfileSettingsForm (5+ stories: default, loading, error, success, validation)
- [ ] All stories interactive (can type in inputs, click buttons)
- [ ] All stories demonstrate edge cases (long text, special characters, etc.)
- [ ] Stories use Storybook controls for props
- [ ] Stories include documentation (description, usage examples)
- [ ] Storybook accessible at `http://localhost:6006`

#### Tasks

- [ ] Create `signup-form.stories.tsx`:

  ```typescript
  import type { Meta, StoryObj } from '@storybook/react';
  import { SignupForm } from './index';

  const meta: Meta<typeof SignupForm> = {
    title: 'Features/Auth/SignupForm',
    component: SignupForm,
    parameters: {
      layout: 'centered',
    },
  };
  export default meta;

  type Story = StoryObj<typeof SignupForm>;

  export const Default: Story = {};

  export const Loading: Story = {
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      const submitButton = canvas.getByRole('button', { name: 'Sign up' });
      await userEvent.click(submitButton);
    },
  };

  export const Error: Story = {
    // Simulate error state
  };
  ```

- [ ] Create `login-form.stories.tsx`
- [ ] Create `profile-settings-form.stories.tsx`
- [ ] Add interaction tests with `@storybook/test`
- [ ] Add accessibility checks with `@storybook/addon-a11y`
- [ ] Test stories in Storybook: `pnpm storybook`
- [ ] Verify all stories render correctly
- [ ] Verify interactions work (type, click, etc.)

#### Technical Notes

**Source:** `.rumbo/CODE_STANDARDS.md` Section 6 (Testing Patterns)

**Key Implementation Details:**

**Storybook Story Structure:**

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent } from '@storybook/test';
import { Component } from './index';

const meta: Meta<typeof Component> = {
  title: 'Features/Auth/Component',
  component: Component,
  parameters: {
    layout: 'centered', // or 'fullscreen'
  },
  tags: ['autodocs'], // Auto-generate docs
};
export default meta;

type Story = StoryObj<typeof Component>;

// Default state
export const Default: Story = {};

// Loading state
export const Loading: Story = {
  args: { isLoading: true },
};

// Error state
export const WithError: Story = {
  args: { error: 'Invalid credentials' },
};

// Interactive test
export const UserInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(canvas.getByLabelText('Password'), 'password123');
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));
  },
};
```

**Storybook Addons:**

- `@storybook/addon-a11y` - Accessibility testing
- `@storybook/addon-interactions` - Interaction testing
- `@storybook/addon-essentials` - Basic addons (controls, actions, etc.)

**RULEBOOK Reference:**

- Storybook: `.claude/RULEBOOK.md` lines 77-83 (Component development)
- Story location: Colocated (`.stories.tsx` next to component)
- Testing strategy: `.claude/RULEBOOK.md` lines 220-244

#### Definition of Done

- ✅ 15+ Storybook stories created (5 per component)
- ✅ All stories render correctly
- ✅ All stories interactive
- ✅ Stories demonstrate all component states
- ✅ Accessibility addon shows no violations
- ✅ Stories include documentation
- ✅ Storybook builds successfully: `pnpm build-storybook`
- ✅ Code follows RULEBOOK patterns (colocated stories)
- ✅ Code reviewed and committed

---

## 🎯 Epic 1 Summary

**Total Stories:** 10
**Estimated Time:** 30-35 hours (5-6 days)
**Priority:** P0 (Critical - all stories must be completed for users to authenticate)

**Completion Criteria:**

- ✅ Users can sign up with email/password
- ✅ Users can log in and sessions persist
- ✅ Users can update profile and preferences
- ✅ Protected routes enforce authentication
- ✅ All auth flows tested (integration + E2E)
- ✅ All components documented in Storybook
- ✅ Code coverage: 100% for auth flows

**Next Epic:** Epic 2 - Smart Data Import

---
