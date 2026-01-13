# Rumbo - Technical Stack

> **Last Updated:** January 11, 2026
> **Version:** 1.1 (Production-Grade Foundation)
> **Purpose:** Define the complete tech stack for Rumbo
> **Based on:** TECHNICAL_REQUIREMENTS.md
> **Philosophy:** Zero Shortcuts - Build it RIGHT from day one 💪

---

## 🎯 Stack Philosophy

### Core Principles:

1. **Production-Grade from Day One** - No shortcuts, no technical debt
2. **Type-Safe** - TypeScript everywhere (strict mode)
3. **Performance-First** - Mobile-optimized, Lighthouse 90+ enforced
4. **Developer Experience** - Fast iteration, great tooling, Storybook
5. **Beautiful by Design** - Polished UI/UX, Framer Motion, Design System
6. **Privacy-First** - Self-hosted database, user data ownership
7. **Colombian Context** - Support for COP, Spanish, local banks/stores
8. **Zero Shortcuts** - 80%+ test coverage, CI/CD, monitoring from day one

---

## 🏗️ Core Stack (The Foundation)

### **Language**

- **TypeScript 5.9.3** (Latest stable as of Jan 2026)
  - Strict mode enabled
  - Full type safety across frontend + backend
  - Shared types between client/server
  - Path aliases (@/, @components/, @lib/, etc.)

### **Framework**

- **Next.js 16** (Latest stable - October 2025)
  - **App Router** (file-based routing, layouts, nested routes)
  - **React 19.2.3** (Server Components, Partial Pre-rendering)
  - **Turbopack** (default bundler, 5x faster builds)
  - **Server Actions** (type-safe server mutations)
  - **Server Components** (zero client JS by default)
  - **Edge Runtime** support (optional)

**Why Next.js 16?**

- Full-stack React with zero API boilerplate
- Server Components reduce client bundle size
- Automatic code splitting & optimization
- Built-in image/font optimization
- Perfect for mobile-first PWA

### **Runtime**

- **Node.js 20 LTS** (Latest LTS)
- **pnpm 9+** (Faster package manager than npm)

---

## 🎨 Frontend Stack

### **UI Framework**

- **React 19.2.3** (Latest stable - October 2025)
  - Server Components (render on server)
  - Client Components (interactive UI)
  - Suspense & Streaming
  - useOptimistic hook (optimistic UI)
  - useFormStatus hook (form state)

### **Component Development**

- **Storybook 8+** (Latest)
  - Visual component development
  - Component documentation
  - Interaction testing
  - Accessibility testing (a11y addon)
  - All UI components documented

### **Animations**

- **Framer Motion** (Latest)
  - Smooth, performant animations
  - Gesture recognition
  - Layout animations
  - Respect `prefers-reduced-motion`
  - Page transitions

### **Styling**

- **Tailwind CSS 4.0** (Latest - January 2025)
  - **Oxide Engine** (5x faster builds)
  - **CSS-based config** (no more tailwind.config.js)
  - Automatic content detection
  - Modern CSS features (cascade layers, @property)
  - Mobile-first utilities
  - Dark mode support (class strategy)
  - Colombian breakpoints:
    - `xs`: 320px (small phones)
    - `sm`: 640px (large phones)
    - `md`: 768px (tablets)
    - `lg`: 1024px (laptops)
    - `xl`: 1280px (desktops)

### **Component Library**

- **Shadcn/ui** (Latest)
  - Copy/paste components (no dependency bloat)
  - Built on Radix UI primitives
  - Full TypeScript support
  - Customizable with Tailwind
  - Accessible (WCAG 2.1 AA)
  - Components needed for v1:
    - Button, Input, Select, Dialog
    - Card, Badge, Avatar
    - Sheet (mobile drawer)
    - DropdownMenu, Command
    - Form components (with react-hook-form)
    - Table, Tabs
    - Toast notifications
    - Calendar, DatePicker

### **Forms**

- **React Hook Form 7+** (Latest)
  - Performant (minimal re-renders)
  - TypeScript support
  - Zod integration for validation
  - Native HTML5 validation fallback

### **Validation**

- **Zod 3+** (Latest)
  - TypeScript-first schema validation
  - Shared schemas (client + server)
  - Type inference
  - Custom error messages in Spanish

### **State Management**

- **React Server Components** (Primary - server state)
- **useState/useReducer** (Local UI state)
- **Zustand 4+** (Optional - complex client state)
  - Lightweight (1kb)
  - No boilerplate
  - TypeScript support
  - Persist middleware (localStorage)
  - Use ONLY when needed (AI chat state, UI preferences)

### **Data Fetching**

- **Next.js Server Actions** (Primary)
  - Type-safe mutations
  - Progressive enhancement
  - Automatic revalidation
- **Server Components** (Queries)
  - Direct database access
  - No client-side fetching needed
- **SWR** (Optional - client-side polling if needed)

### **Date/Time**

- **date-fns 3+** (Preferred over moment.js)
  - Tree-shakeable
  - Immutable
  - TypeScript support
  - Colombian locale (es-CO)
  - Timezone support (America/Bogota)

### **Number Formatting**

- **Intl.NumberFormat** (Native browser API)
  - COP currency formatting
  - Colombian number format (1.234.567,89)
  - Zero dependencies

### **Icons**

- **Lucide React** (Latest)
  - Clean, consistent icons
  - Tree-shakeable
  - TypeScript support
  - 1000+ icons

---

## 🔧 Backend Stack

### **API Layer**

- **tRPC 11** (Primary - Production-grade type safety)
  - End-to-end type safety (client ↔ server)
  - No code generation needed
  - TanStack Query integration (caching, optimistic updates)
  - WebSocket support (future real-time features)
  - Better DX than Server Actions for complex APIs

**Why tRPC over Server Actions:**

- Full type inference across client/server boundary
- Better error handling
- Built-in input validation with Zod
- React Query integration (caching, background refetch)
- Scales better for complex APIs

## 🎯 tRPC vs Server Actions Decision Matrix

**This project uses tRPC as the PRIMARY API layer.** Here's when to use each:

### **tRPC 11 (PRIMARY - Use for ALL API Communication)**

✅ **Use tRPC for:**

- ALL client-server data fetching (queries)
- ALL mutations (create, update, delete operations)
- Complex business logic that needs type safety
- API endpoints that need caching (TanStack Query integration)
- Real-time subscriptions (future v3+)
- Any operation that needs error handling with TRPCError codes
- Multi-step flows that need optimistic updates

**Example:**

```typescript
// ✅ CORRECT: Use tRPC for all data operations
export function TransactionForm() {
  const createMutation = api.transactions.create.useMutation();

  const handleSubmit = async (data: TransactionInput) => {
    await createMutation.mutateAsync(data);
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### **Server Actions (ONLY for Forms with Progressive Enhancement)**

✅ **Use Server Actions for:**

- Form submissions that MUST work without JavaScript
- Actions that need native browser form validation
- Simple, one-off actions that don't need complex error handling
- Progressive enhancement scenarios (e.g., public contact form)

❌ **Do NOT use Server Actions for:**

- Complex business logic
- Operations that need optimistic updates
- API routes that need caching
- Operations that need TanStack Query features

**Example:**

```typescript
// ✅ ACCEPTABLE: Server Action for progressive enhancement
'use server';
export async function submitContactForm(formData: FormData) {
  // Simple validation
  const email = formData.get('email');
  await sendEmail(email);
  revalidatePath('/contact');
}

// Usage (works without JS)
<form action={submitContactForm}>
  <input name="email" />
  <button>Submit</button>
</form>
```

### **Server Components (ONLY for Initial Page Data)**

✅ **Use Server Components for:**

- Initial SSR data fetching (first page load)
- SEO-critical content
- Static generation (`export const dynamic = 'force-static'`)
- Public pages that don't need authentication

⚠️ **Then hydrate to tRPC on client:**

- After initial load, use tRPC for all subsequent data fetching
- Enables caching, optimistic updates, background refetch

❌ **Do NOT use Server Components for:**

- Nested data fetching (causes prop drilling)
- Client-side interactions (use tRPC in Client Components)
- Operations that need mutations

**Example:**

```typescript
// ✅ CORRECT: Server Component → tRPC hydration
export default async function DashboardPage() {
  const session = await getServerSession();

  // Server: Fetch initial data (SSR)
  const initialData = await db.transaction.findMany({
    where: { userId: session.user.id },
    take: 20,
  });

  // Client: Hydrate to tRPC for mutations
  return <TransactionList initialData={initialData} />;
}

// Client component
'use client';
export function TransactionList({ initialData }) {
  // tRPC with initial data (no flash of loading)
  const { data } = api.transactions.getAll.useQuery(undefined, {
    initialData,
    refetchOnMount: false, // Don't refetch on mount (we have SSR data)
  });

  // Use tRPC for mutations
  const createMutation = api.transactions.create.useMutation({
    onSuccess: () => {
      // Optimistic updates work!
    },
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      createMutation.mutate(formData); // ✅ Use tRPC, NOT Server Actions
    }}>
      {/* ... */}
    </form>
  );
}
```

### **Summary Decision Table**

| Use Case                             | Use tRPC            | Use Server Actions           | Use Server Components |
| ------------------------------------ | ------------------- | ---------------------------- | --------------------- |
| **Data fetching (queries)**          | ✅ PRIMARY          | ❌ Never                     | ⚠️ Only initial SSR   |
| **Mutations (create/update/delete)** | ✅ PRIMARY          | ⚠️ Only for forms without JS | ❌ Never              |
| **Complex business logic**           | ✅ PRIMARY          | ❌ Never                     | ❌ Never              |
| **Optimistic updates**               | ✅ PRIMARY          | ❌ Can't do                  | ❌ Can't do           |
| **Caching/background refetch**       | ✅ PRIMARY          | ❌ Can't do                  | ❌ Can't do           |
| **Forms (progressive enhancement)**  | ⚠️ Secondary        | ✅ Primary                   | ❌ Never              |
| **Initial page data (SSR)**          | ⚠️ Secondary        | ❌ Never                     | ✅ Primary            |
| **Real-time subscriptions**          | ✅ PRIMARY (future) | ❌ Can't do                  | ❌ Can't do           |

**In Rumbo:** 99% of API calls will use tRPC. Server Actions are reserved for the rare case where we need forms to work without JavaScript (e.g., public contact form, accessibility).

---

### **Authentication**

- **NextAuth.js 5** (Auth.js)
  - Credentials provider (email/password)
  - Session management (JWT)
  - Edge-compatible
  - TypeScript support
  - **Future:** OAuth (Google, GitHub)
  - **Future:** 2FA support

**Version Decision: NextAuth v5 Beta**

**Status:** v5.0.0-beta.25 (Beta since 2023, widely used in production)

**Why v5 instead of v4:**

- ✅ **Complete TypeScript rewrite** - Better type safety, fewer runtime errors
- ✅ **Modern architecture** - Edge runtime support, better Next.js 15+ integration
- ✅ **Better App Router support** - Built for Next.js App Router from ground up
- ✅ **Improved DX** - Simpler configuration, better error messages
- ✅ **Future-proof** - v4 is in maintenance mode (no new features)
- ✅ **Production-ready** - Used by major companies despite "beta" label
- ✅ **Active development** - Regular updates, responsive maintainers

**Why "beta" label:**

- "Beta" refers to **API stability**, not quality or production-readiness
- Major breaking changes unlikely at this stage (beta since mid-2023)
- Many production apps successfully use v5 beta

**Risks:**

- 🟡 **API changes possible** - Beta means API not fully locked
- 🟡 **Documentation gaps** - Some v5 docs still incomplete
- 🟡 **Community support** - Fewer StackOverflow answers vs v4

**Mitigation Strategy:**

**1. Version Pinning**

```json
{
  "dependencies": {
    "next-auth": "5.0.0-beta.25" // Exact version, NO ^ or ~
  }
}
```

- Pin exact version to avoid automatic updates
- Test new versions thoroughly before upgrading
- Document current version in TECH_STACK.md

**2. Monitoring**

- ⭐ Watch GitHub releases: https://github.com/nextauthjs/next-auth/releases
- Subscribe to NextAuth Discord/Twitter for announcements
- Review changelog before ANY version bump
- Test auth flows after every upgrade

**3. Rollback Plan**

- Keep current version in git history
- Test rollback process in staging
- Document rollback steps in runbook
- If v5 beta becomes unstable: downgrade to v4 (migration guide available)

**4. Testing Coverage**

- ✅ 100% E2E coverage for ALL auth flows (login, register, logout, OAuth, password reset)
- ✅ Integration tests for session management
- ✅ Monitor Sentry for auth-related errors
- ✅ Canary releases (deploy to staging first, then production)

**5. Fallback Option**
If v5 beta proves problematic:

- **Option A:** Wait for v5 stable (likely Q1-Q2 2026)
- **Option B:** Downgrade to NextAuth v4.24.x (stable, well-documented)
  - Migration guide: https://authjs.dev/getting-started/migrating-to-v5
  - Reverse migration: mostly configuration changes, minimal code impact

**Decision:** ✅ **Proceed with v5 beta**

- Benefits outweigh risks for greenfield project
- Mitigation strategy in place
- Can rollback if needed
- Future-proof choice (v4 EOL coming)

**Password Hashing:**

- **Argon2** (via @node-rs/argon2)
  - More secure than bcrypt (2024 OWASP recommendation)
  - Resistant to GPU attacks
  - Configurable memory cost (46 MiB minimum)
  - Time cost: 3+ iterations (OWASP 2024 minimum)

### **Database**

- **PostgreSQL 16+** (Latest stable)
  - ACID compliance (critical for finance)
  - JSON support (flexible data)
  - Full-text search
  - Excellent performance
  - Self-hostable

**Hosting Strategy (Production-Grade):**

- **Primary:** Self-hosted via Docker + docker-compose
  - Full control over data
  - Privacy-first approach
  - User data ownership
  - PgBouncer for connection pooling
  - Automated backups
  - Docker volume for persistence
- **Cloud Option (if needed):** Neon or Supabase
  - For users who prefer managed hosting
  - Easy migration path (Prisma handles this)

### **ORM**

- **Prisma 7.2+** (Latest - Rust-free, ES Modules)
  - Type-safe database client
  - Migrations (version controlled)
  - Introspection
  - Prisma Studio (database GUI)
  - Connection pooling (with PgBouncer)
  - TypeScript-native (no Rust compilation issues)

**Why Prisma over Drizzle:**

- More mature ecosystem
- Better TypeScript inference
- Prisma Studio (visual database browser)
- Migration tooling (rock-solid)
- Better documentation
- Easier for team collaboration

### **File Storage**

- **Vercel Blob** (v1 - Receipts, PDFs)
  - Simple API
  - CDN integration
  - Free tier (1GB)
  - Automatic optimization

**Future (v3+):**

- **AWS S3** (if scaling)
- **Cloudflare R2** (S3-compatible, cheaper)

### **Background Jobs**

- **Inngest** (v2+ for async tasks)
  - Serverless background jobs
  - Scheduled tasks (bill reminders)
  - Retries & error handling
  - Local development

---

## 🤖 AI Stack

### **AI Provider**

- **OpenAI API** (Primary)
  - **GPT-4 Turbo** (complex reasoning, planning)
  - **GPT-3.5 Turbo** (fast, cheap categorization)
  - **GPT-4 Vision** (Receipt OCR - v2)
  - Streaming support
  - Function calling
  - JSON mode

**Future Alternatives:**

- **Anthropic Claude 3.5** (alternative provider)
- **Google Gemini** (multimodal)

### **AI SDK**

- **Vercel AI SDK 4+** (Latest)
  - Stream text/objects from AI
  - React hooks (useChat, useCompletion)
  - Server Actions integration
  - Function calling helpers
  - Provider-agnostic (OpenAI, Anthropic, etc.)

### **Vector Database (Future v3+)**

- **Pinecone** or **Supabase pgvector**
  - Grocery product embeddings
  - Semantic search
  - Product recommendations

---

## 📱 Mobile/PWA Stack

### **PWA**

- **Next.js PWA** (next-pwa)
  - Service worker
  - Offline support
  - Install prompt
  - Push notifications (future)
  - App manifest

### **Mobile Features**

- **Camera API** (Receipt scanning - v2)
- **Geolocation API** (Store proximity - v3)
- **Web Share API** (Share reports)
- **Credential Management API** (Password autofill)

### **Future (v5+):**

- **Expo** (React Native)
- **Capacitor** (Web-to-native)

---

## 🔐 Security Stack

### **Authentication**

- **NextAuth.js 5** (see above)
- **Argon2** (password hashing)
- **JWT** (session tokens)
- **HTTP-only cookies** (token storage)

### **Authorization**

- **Prisma Row-Level Security**
  - Users only access their data
  - Middleware enforcement
- **RBAC** (Role-Based Access Control)
  - USER, ADMIN roles
  - **Future:** FAMILY_MEMBER, VIEWER

### **Data Security**

- **Encryption at rest** (Database-level)
- **Encryption in transit** (HTTPS/TLS)
- **Environment variables** (Vercel, .env.local)
- **Secrets management** (Vercel Environment Variables)

### **Input Validation**

- **Zod** (Schema validation)
- **DOMPurify** (XSS protection)
- **SQL injection** (Prisma parameterized queries)
- **CSRF** (Next.js built-in)
- **Rate limiting** (Vercel Edge Config or Upstash)

---

## 🧪 Testing Stack (PRODUCTION-GRADE: Zero Shortcuts)

### **Unit Testing**

- **Vitest 3+** (Latest)
  - Vite-powered (10x faster than Jest)
  - TypeScript support
  - ESM support
  - Compatible with Jest API
  - Watch mode (instant feedback)

### **Component Testing**

- **Storybook 8+** (Visual testing)
  - Interaction tests
  - Accessibility tests (a11y addon)
  - Visual regression (Chromatic optional)
  - Component documentation
  - All UI components have stories

### **Integration Testing**

- **Vitest** (tRPC procedures, database operations)
- **MSW** (Mock Service Worker - API mocking)
- **Prisma** (test database setup)

### **E2E Testing**

- **Playwright 1.50+** (Latest)
  - Cross-browser (Chromium, Firefox, Safari)
  - Mobile emulation (iPhone, Android)
  - Visual regression (screenshots)
  - Trace viewer (debugging)
  - Parallel execution
  - Video recording (on failure)

### **Accessibility Testing**

- **axe-core** (via Storybook addon)
  - Automated WCAG 2.1 AA checks
  - Component-level testing
  - CI integration

### **Performance Testing**

- **Lighthouse CI** (Latest)
  - Automated performance checks on every PR
  - Enforces 90+ score (fails PR if below)
  - Core Web Vitals monitoring
  - Budget enforcement

### **Coverage**

- **c8** (via Vitest)
  - Target: **80%+ coverage** (not 70%)
  - **100% coverage** on critical paths:
    - Authentication (login, register, logout)
    - Transactions (create, update, delete)
    - Financial calculations
    - AI interactions
  - Focus on business logic, not UI styling

---

## 📊 Monitoring & Observability

### **Error Tracking**

- **Sentry** (Preferred)
  - Client + server errors
  - Source maps
  - User context
  - Performance monitoring
  - Free tier (5k events/month)

**Alternative:**

- **Highlight.io** (open-source)

### **Analytics**

- **Plausible** or **Umami** (Privacy-first)
  - No cookies
  - GDPR compliant
  - Self-hostable
  - Simple dashboard

**❌ NO Google Analytics** (privacy concerns)

### **Logging**

- **Axiom** or **Better Stack** (formerly Logtail)
  - Structured logs (JSON format)
  - Searchable, filterable
  - Real-time tail
  - Free tier (generous)
  - Fast query performance
  - Alerting on errors

**Self-hosted Option:**

- **Grafana Loki** (if full self-hosting)
- Docker-based setup
- Integrated with Grafana dashboards

### **Performance**

- **Vercel Analytics** (Built-in)
  - Real User Monitoring
  - Core Web Vitals
  - Free with Vercel
- **Lighthouse CI** (CI/CD checks)

---

## 🚀 DevOps Stack

### **Deployment**

**Primary: Vercel**

- Zero-config Next.js deployment
- Edge Network (global CDN)
- Preview deployments (every PR)
- Environment variables (secure)
- Free hobby tier
- Automatic HTTPS
- Analytics built-in

**Self-hosted Option: Docker**

- **docker-compose.yml** includes:
  - Next.js app (production build)
  - PostgreSQL 16 (with PgBouncer)
  - Redis (for rate limiting, future caching)
- **Production-ready Dockerfile**
  - Multi-stage build (optimized size)
  - Security best practices
  - Health checks
- **Environment variables** via `.env` file
- **Backup strategy** for database (pg_dump)
- **Monitoring** (Sentry, custom logging)

**Why Both:**

- Vercel: Fast deployment, great DX, preview PRs
- Docker: Privacy-first, user data ownership, full control
- Easy migration path between the two

### **CI/CD** (Production-Grade Pipeline)

- **GitHub Actions** (Complete automation)

**On Pull Request:**

1. TypeScript type check (strict mode)
2. ESLint + Prettier check
3. Unit tests (Vitest)
4. Integration tests (tRPC + Prisma)
5. E2E tests (Playwright - critical paths)
6. Lighthouse CI (performance check - must score 90+)
7. Accessibility audit (axe-core)
8. Security audit (npm audit, Snyk)
9. Deploy preview to Vercel
10. Comment on PR with results

**On Merge to Main:**

1. All checks from PR (re-run)
2. Deploy to Vercel production
3. Run smoke tests (production)
4. Notify Sentry of new release
5. Update changelog (auto-generated)
6. Tag release (semantic versioning)

**Scheduled (Daily):**

- Dependency updates (Dependabot)
- Security scans
- Database backup verification

**Zero tolerance for failures:**

- If ANY check fails, PR is blocked
- No manual overrides
- Fix or revert

### **Version Control**

- **Git** + **GitHub**
  - Conventional Commits
  - Branching: main, develop, feature/\*
  - PR reviews (even solo, good practice)
  - Protected main branch

### **Code Quality**

- **ESLint 9+** (Linting)
  - Next.js config
  - TypeScript rules
  - React hooks rules
  - Accessibility rules
- **Prettier 3+** (Formatting)
  - Single quotes
  - 2-space indent
  - Trailing commas
  - Auto-format on save
- **Husky** (Git hooks)
  - Pre-commit: lint, format, type-check
  - Pre-push: run tests
- **lint-staged** (Only lint changed files)

---

## 🌍 Internationalization

### **i18n Library**

- **next-intl** (Next.js App Router)
  - TypeScript support
  - Server Components compatible
  - Locale routing
  - Namespace support

### **Languages (Priority)**

1. **Spanish (es-CO)** - Colombian Spanish (v1)
2. **English (en-US)** - (v4+)
3. **Portuguese (pt-BR)** - Brazil (v5+)

### **Localization**

- **Currency:** Intl.NumberFormat (COP, USD, EUR)
- **Dates:** date-fns with locales
- **Numbers:** Colombian format (1.234.567,89)
- **Timezone:** America/Bogota (UTC-5)

---

## 📦 Package Manager & Tooling

### **Package Manager**

- **pnpm 9+** (Preferred)
  - Faster than npm/yarn
  - Disk space efficient
  - Strict dependency resolution
  - Workspace support

### **Build Tool**

- **Turbopack** (Next.js 16 default)
  - 5x faster than Webpack
  - Built in Rust
  - Incremental builds

### **Development**

- **VS Code** (Recommended editor)
  - Extensions:
    - ESLint
    - Prettier
    - Tailwind CSS IntelliSense
    - Prisma
    - TypeScript Vue Plugin (Volar)
    - Error Lens
    - GitLens
    - Auto Rename Tag

---

## 🗂️ Project Structure (Feature-Based Architecture)

**Philosophy:** Organize by domain/feature, not by technical type. Scales better.

```
rumbo/
├── .github/
│   └── workflows/
│       ├── ci.yml              # CI/CD (tests, lint, Lighthouse)
│       ├── security.yml        # Security audit
│       └── deploy.yml          # Deployment workflows
├── .claude/                    # Claude Code config
│   ├── RULEBOOK.md            # Project rules (PRODUCTION-GRADE)
│   ├── agents/                # AI agents
│   └── commands/              # Custom commands
├── .rumbo/                    # Project docs (DO NOT DELETE)
│   ├── PROJECT_DEFINITION.md
│   ├── TECHNICAL_REQUIREMENTS.md
│   ├── TECH_STACK.md         # This file
│   ├── SCOPE.md
│   └── ...
├── .storybook/                # Storybook config
│   ├── main.ts
│   └── preview.ts
├── docker/                    # Docker configs (self-hosted deployment)
│   ├── docker-compose.yml     # Postgres + app + Redis
│   ├── Dockerfile             # Production image
│   └── .env.docker            # Docker environment template
├── prisma/                    # Database
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Migration history
│   └── seed.ts                # Seed data (Colombian categories)
├── public/                    # Static assets
│   ├── icons/
│   ├── manifest.json          # PWA manifest
│   └── ...
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/            # Auth routes group
│   │   ├── (dashboard)/       # Dashboard routes group
│   │   ├── api/
│   │   │   └── trpc/
│   │   │       └── [trpc]/
│   │   │           └── route.ts  # tRPC endpoint
│   │   ├── layout.tsx         # Root layout (with TRPCProvider)
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── features/              # 🔥 FEATURE-BASED STRUCTURE
│   │   ├── health/            # Health check feature
│   │   │   ├── api/
│   │   │   │   └── router.ts      # tRPC router for health
│   │   │   └── components/
│   │   │       └── health-check.tsx
│   │   ├── transactions/      # Transaction feature
│   │   │   ├── api/
│   │   │   │   └── router.ts      # tRPC procedures
│   │   │   ├── components/
│   │   │   │   ├── transaction-list.tsx
│   │   │   │   ├── transaction-form.tsx
│   │   │   │   └── *.stories.tsx  # Storybook stories
│   │   │   ├── hooks/
│   │   │   │   └── use-transactions.ts
│   │   │   ├── types/
│   │   │   └── utils/
│   │   ├── bills/             # Bills feature
│   │   ├── budgets/           # Budgets feature
│   │   └── ai-chat/           # AI chat feature
│   └── shared/                # Shared across features
│       ├── components/
│       │   └── ui/            # Shadcn components
│       ├── lib/               # Shared utilities
│       │   ├── db.ts          # Prisma client
│       │   ├── auth.ts        # NextAuth config
│       │   ├── utils.ts       # Helper functions
│       │   ├── trpc/          # tRPC config
│       │   │   ├── init.ts    # tRPC initialization
│       │   │   ├── root.ts    # Root router
│       │   │   └── client.ts  # tRPC client
│       │   └── ai/            # AI utilities
│       ├── providers/         # React providers
│       │   └── trpc-provider.tsx
│       ├── hooks/             # Shared hooks
│       └── types/             # Shared types
├── tests/                     # Tests
│   ├── unit/                  # Vitest unit tests
│   ├── integration/           # Vitest integration tests
│   ├── e2e/                   # Playwright E2E tests
│   └── __mocks__/             # MSW mocks
├── .env.local                 # Local environment (NEVER commit)
├── .env.example               # Example env vars (committed)
├── eslint.config.mjs          # ESLint 9 flat config
├── .prettierrc                # Prettier config
├── next.config.ts             # Next.js config
├── tailwind.config.ts         # Tailwind config
├── tsconfig.json              # TypeScript config (strict mode)
├── vitest.config.ts           # Vitest config
├── playwright.config.ts       # Playwright config
├── package.json
├── pnpm-lock.yaml
└── README.md
```

---

## 📚 Key Dependencies (Production-Grade Stack)

### Production Dependencies:

```json
{
  "next": "^16.1.0",
  "react": "^19.2.3",
  "react-dom": "^19.2.3",
  "typescript": "^5.9.3",

  "@prisma/client": "^7.2.0",
  "next-auth": "^5.0.0",
  "@node-rs/argon2": "^2.0.0",

  "@trpc/server": "^11.0.0",
  "@trpc/client": "^11.0.0",
  "@trpc/react-query": "^11.0.0",
  "@tanstack/react-query": "^5.0.0",

  "zod": "^4.0.0",
  "react-hook-form": "^7.54.0",
  "@hookform/resolvers": "^3.10.0",

  "ai": "^4.0.0",
  "openai": "^4.80.0",

  "date-fns": "^4.0.0",
  "lucide-react": "^0.470.0",
  "framer-motion": "^11.0.0",

  "@radix-ui/react-*": "^1.1.0",
  "tailwindcss": "^4.1.0",
  "next-intl": "^3.26.0",
  "zustand": "^4.5.0"
}
```

### Dev Dependencies:

```json
{
  "prisma": "^7.2.0",
  "eslint": "^9.20.0",
  "prettier": "^3.4.0",
  "prettier-plugin-tailwindcss": "^0.6.0",

  "vitest": "^3.0.0",
  "@vitest/ui": "^3.0.0",
  "msw": "^2.6.0",

  "storybook": "^8.0.0",
  "@storybook/react": "^8.0.0",
  "@storybook/addon-a11y": "^8.0.0",
  "@storybook/addon-interactions": "^8.0.0",

  "playwright": "^1.50.0",
  "@axe-core/playwright": "^4.10.0",

  "@lhci/cli": "^0.15.0",

  "@types/node": "^22.10.0",
  "@types/react": "^19.0.0",

  "husky": "^9.0.0",
  "lint-staged": "^15.0.0"
}
```

---

## 🎯 Tech Stack Evolution

### **v1 (Foundation) - Current Focus:**

**Production-grade from day one:**

- Next.js 16.1 + React 19.2.3 + TypeScript 5.9.3
- tRPC 11 + TanStack Query 5
- Prisma 7.2 + PostgreSQL 16 (Docker self-hosted)
- Tailwind CSS 4.1 + Shadcn/ui + Storybook 8
- Framer Motion (animations)
- OpenAI API (GPT-4 Turbo, GPT-3.5)
- Vercel (deployment) + Docker (self-hosted option)
- NextAuth.js 5 + Argon2
- **Testing:** Vitest + Storybook + Playwright + Lighthouse CI (80%+ coverage)
- **Monitoring:** Sentry + Plausible/Umami + Axiom/Better Stack
- **CI/CD:** GitHub Actions (full automation)

**Features:**

- Manual transaction tracking
- Bills tracking
- Basic budgets
- AI chat assistant
- Auto-categorization
- Colombian categories

### **v2 (Enhanced Intelligence):**

- +Inngest (background jobs for reminders)
- +GPT-4 Vision (receipt OCR)
- +Vercel Blob (file storage)
- +Receipt scanning
- +Financial planning
- +Goals & tasks

### **v3 (Grocery Intelligence):**

- +Vector DB (Pinecone or pgvector)
- +Advanced AI (embeddings, product recommendations)
- +Store price comparison
- +Predictive restocking

### **v4 (Family Collaboration):**

- +Real-time sync (Pusher or Supabase Realtime)
- +Family features (multi-tenant)
- +Shared budgets

### **v5 (Complete Platform):**

- +Expo/React Native (native mobile apps)
- +Belvo (bank sync API for Colombian banks)
- +Investment tracking
- +Advanced monitoring (full self-hosted stack)

---

## 🔄 Migration Strategy (Production-Grade Setup)

### From Current (Nothing) → v1 Production-Grade:

**Phase 1: Core Setup (Day 1-2)**

1. Initialize Next.js 16.1 with App Router + TypeScript strict mode
2. Setup Docker (Postgres 16 + PgBouncer + Redis)
3. Configure Prisma 7.2 + migrations
4. Setup tRPC 11 + TanStack Query 5
5. Configure Tailwind CSS 4.1 + design tokens
6. Install Shadcn/ui components
7. Setup Storybook 8 (component development)

**Phase 2: Auth & Security (Day 3-4)**

1. Setup NextAuth.js 5 + Argon2
2. Configure Row-level security (Prisma middleware)
3. Add rate limiting (Upstash Redis)
4. Security headers + CSP
5. Environment variables (.env.local, .env.example)

**Phase 3: Testing Infrastructure (Day 5-6)**

1. Setup Vitest (unit + integration)
2. Configure Storybook testing
3. Setup Playwright (E2E)
4. Configure Lighthouse CI
5. Add axe-core (accessibility)
6. Setup MSW (API mocking)

**Phase 4: CI/CD & Monitoring (Day 7-8)**

1. GitHub Actions workflows (CI/CD)
2. Setup Sentry (error tracking)
3. Configure Plausible/Umami (analytics)
4. Setup Axiom/Better Stack (logging)
5. Lighthouse CI integration
6. Automated deployments

**Phase 5: Developer Experience (Day 9-10)**

1. ESLint 9 + Prettier 3 config
2. Husky + lint-staged (git hooks)
3. VS Code workspace settings
4. Storybook addons (a11y, interactions)
5. Docker Compose for local dev
6. Documentation (README, contributing)

**Total: 10 days for production-grade foundation**

### Future Migrations:

- **Drizzle:** Can migrate from Prisma if needed (v3+)
- **Native apps:** Expo shares code with Next.js (v5+)
- **Database:** Easy switch from Docker to cloud (Prisma abstracts this)

---

## 📖 Documentation & References

### Official Docs (2026):

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [React 19.2 Documentation](https://react.dev/blog/2025/10/01/react-19-2)
- [TypeScript 5.9 Documentation](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html)
- [Tailwind CSS 4.0 Documentation](https://tailwindcss.com/blog/tailwindcss-v4)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)

### Learning Resources:

- Next.js Learn (official tutorial)
- Prisma guides
- Shadcn/ui examples
- Vercel templates

---

## ✅ Stack Validation (Production-Grade Checklist)

### Technical Requirements Met:

- ✅ TypeScript (strict mode, no `any`)
- ✅ React (latest stable 19.2.3)
- ✅ PostgreSQL 16 (self-hosted Docker + PgBouncer)
- ✅ Mobile-first (Tailwind, PWA, Storybook mobile stories)
- ✅ Performance (Lighthouse 90+ enforced, <2.5s LCP)
- ✅ Security (NextAuth, Argon2, HTTPS, OWASP Top 10)
- ✅ AI (OpenAI integration, Vercel AI SDK)
- ✅ Colombian context (COP, es-CO, local stores/banks)
- ✅ Self-hostable (Docker production-ready)
- ✅ Modern tooling (pnpm, Turbopack, Storybook)

### Stack Principles Met:

- ✅ **Production-Grade from Day One** (no shortcuts)
- ✅ **Type-Safe** (TypeScript strict + tRPC end-to-end)
- ✅ **Performance-First** (Server Components, Turbopack, Lighthouse CI)
- ✅ **Beautiful by Design** (Storybook, Framer Motion, Design System)
- ✅ **Privacy-First** (Self-hosted DB, user data ownership)
- ✅ **Developer Experience** (Storybook, hot reload, clear patterns)
- ✅ **Zero Shortcuts** (80%+ test coverage, CI/CD, monitoring)
- ✅ **Colombian Context** (i18n, formatting, local integrations)

### Production-Grade Validation:

- ✅ **Testing:** 80%+ coverage, 100% critical paths
- ✅ **CI/CD:** Automated (tests, lint, E2E, Lighthouse, security)
- ✅ **Monitoring:** Sentry + Plausible + Axiom (day one)
- ✅ **Accessibility:** WCAG 2.1 AA (axe-core automated checks)
- ✅ **Security:** OWASP Top 10 compliance
- ✅ **Performance:** Lighthouse 90+ enforced on every PR
- ✅ **Documentation:** Storybook for all components
- ✅ **Code Quality:** ESLint + Prettier + Husky (enforced)
- ✅ **Deployment:** Vercel + Docker (both production-ready)
- ✅ **Database:** Self-hosted (privacy-first, full control)

---

## 🚀 Next Steps

1. **Initialize Project:**

   ```bash
   pnpm create next-app@latest rumbo --typescript --tailwind --app --no-src
   cd rumbo
   pnpm add prisma @prisma/client next-auth @node-rs/argon2 zod react-hook-form ai openai
   pnpm add -D @types/node
   ```

2. **Setup Prisma:**

   ```bash
   pnpx prisma init
   # Update schema, run migrations
   ```

3. **Install Shadcn/ui:**

   ```bash
   pnpx shadcn@latest init
   ```

4. **Create .env.local:**

   ```env
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET="..."
   OPENAI_API_KEY="sk-..."
   ```

5. **Start Development:**
   ```bash
   pnpm dev
   ```

---

**Document Status:** ✅ Complete (Production-Grade Update)
**Last Updated:** January 11, 2026
**Philosophy:** Zero Shortcuts - Build it RIGHT from day one 💪
**Ready for:** Production-grade development kickoff 🚀

---

## 🏆 Why This Stack?

**This is not an MVP. This is not a "we'll fix it later" approach.**

**This stack is designed for:**

1. **Immediate production use** (no rework needed)
2. **Beautiful, polished UI** (Storybook, Framer Motion, Design System)
3. **Privacy-first** (self-hosted database, user data ownership)
4. **Scalability** (1 user → 10,000 users without rewrite)
5. **Maintainability** (clear patterns, full test coverage)
6. **Colombian context** (COP, es-CO, local integrations)

**Short-term cost:**

- 10 days upfront setup (vs 2-3 days for quick MVP)
- Higher discipline required
- Slower initial feature development

**Long-term benefit:**

- ✅ **NO rework** (no "let's rewrite this" moments)
- ✅ **NO refactoring debt** (built right from day one)
- ✅ **NO production fires** (monitoring, testing, CI/CD from start)
- ✅ **Easy to add features** (solid foundation)
- ✅ **Easy to onboard developers** (clear patterns, documentation)
- ✅ **Scales smoothly** (production-grade architecture)

**This is a long-term investment in quality. Build it once, build it right. 💪**

---

**Sources:**

- [Next.js 16.1 Release](https://nextjs.org/blog/next-16-1)
- [React 19.2.3 Release](https://react.dev/versions)
- [TypeScript 5.9.3 Release](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html)
- [Tailwind CSS 4.1 Release](https://tailwindcss.com/blog/tailwindcss-v4)
- [tRPC 11 Docs](https://trpc.io/docs)
- [Prisma 7.2 Release](https://www.prisma.io/docs)
- [Storybook 8 Docs](https://storybook.js.org/docs)
