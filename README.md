# Rumbo - Personal Finance Management for Colombians

[![CI/CD](https://github.com/dsantiagomj/RumboApp/workflows/CI%2FCD/badge.svg)](https://github.com/dsantiagomj/RumboApp/actions/workflows/ci.yml)
[![Security](https://github.com/dsantiagomj/RumboApp/workflows/Security/badge.svg)](https://github.com/dsantiagomj/RumboApp/actions/workflows/security.yml)
[![Deploy](https://github.com/dsantiagomj/RumboApp/workflows/Deploy/badge.svg)](https://github.com/dsantiagomj/RumboApp/actions/workflows/deploy.yml)
[![Release](https://github.com/dsantiagomj/RumboApp/workflows/Release/badge.svg)](https://github.com/dsantiagomj/RumboApp/actions/workflows/release.yml)
[![codecov](https://codecov.io/gh/dsantiagomj/RumboApp/branch/main/graph/badge.svg)](https://codecov.io/gh/dsantiagomj/RumboApp)

> Modern, privacy-first personal finance app designed specifically for the Colombian market

**Status:** 🚧 Pre-Implementation Phase

---

## 🎯 About

Rumbo is a personal finance management application built specifically for Colombian users, featuring:

- 💰 Multi-account tracking (savings, checking, cash, credit cards)
- 📊 Transaction management with Colombian categorization
- 📈 Budget planning and tracking
- 💳 Bill payment reminders
- 🤖 AI-powered financial insights (GPT-4o-mini)
- 🇨🇴 Colombian context (COP currency, es-CO locale, local banks)
- 🔒 Privacy-first with self-hosting option

---

## 🚀 Tech Stack

### Frontend

- **Next.js 16.1** - App Router with Turbopack (10-14x faster builds)
- **React 19.2** - Server Components and Actions
- **Tailwind CSS 4.0** - Oxide engine (5x faster, 100x incremental)
- **Shadcn/ui** - Component library with oklch colors

### Backend

- **tRPC 11** - End-to-end type safety
- **Prisma 7.2** - ORM with PostgreSQL 16
- **NextAuth.js v5** - Authentication with Argon2
- **Redis 7** - Rate limiting and caching

### Infrastructure

- **Docker** - PostgreSQL + PgBouncer + Redis
- **Vercel** - Production deployment
- **Cloudflare R2** - File storage
- **Sentry** - Error monitoring

### Testing & Quality

- **Vitest** - Unit testing (80%+ coverage target)
- **Playwright** - E2E testing (5 browsers/devices)
- **Storybook 10** - Component development
- **ESLint 9** - Flat config
- **Prettier** - Code formatting
- **Husky** - Git hooks

---

## 📋 Prerequisites

- **Node.js** 20+
- **pnpm** 9+
- **Docker** (for local development)
- **PostgreSQL** 16 (or use Docker)
- **Redis** 7 (or use Docker)

---

## 🛠️ Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd RumboApp

# Install dependencies
pnpm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Configure your environment variables
# - DATABASE_URL (PostgreSQL connection)
# - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
# - NEXTAUTH_URL (http://localhost:3000 for dev)
# - OPENAI_API_KEY (for AI features)
# - REDIS_URL (for rate limiting)
```

### 3. Database Setup

```bash
# Start Docker services (PostgreSQL + Redis)
docker compose up -d

# Run Prisma migrations
pnpm prisma migrate dev --name init

# Seed database with Colombian categories
pnpm prisma db seed
```

### 4. Development Server

```bash
# Start development server
pnpm dev

# Open http://localhost:3000
```

---

## 📁 Project Structure

```
RumboApp/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth routes (login, register)
│   ├── (dashboard)/         # Protected dashboard routes
│   ├── api/                 # API routes (tRPC, NextAuth)
│   └── globals.css          # Global styles
├── src/
│   ├── server/              # Server-side code
│   │   ├── api/            # tRPC routers
│   │   ├── auth/           # NextAuth configuration
│   │   └── lib/            # Server utilities
│   ├── lib/                 # Shared utilities
│   ├── components/          # React components
│   └── hooks/               # Custom React hooks
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Database seed data
├── tests/
│   ├── e2e/                # Playwright E2E tests
│   ├── unit/               # Vitest unit tests
│   └── fixtures/           # Test fixtures
└── docker/
    └── docker-compose.yml  # Local infrastructure
```

---

## 🧪 Testing

```bash
# Run unit tests
pnpm test

# Run unit tests with coverage
pnpm test:coverage

# Run E2E tests
pnpm test:e2e

# Run Storybook
pnpm storybook
```

---

## 🚢 Deployment

### Environments

- **Production (main):** https://rumbo-app.vercel.app/
  - Deployed automatically on merge to `main`
  - Semantic versioning enabled
  - All CI checks required

- **Development (develop):** https://rumbo-app-git-develop-\*.vercel.app/
  - Preview deployment for `develop` branch
  - Latest development features
  - Testing before production

### Vercel (Recommended)

Automated via GitHub Actions:

- Push to `main` → Production deployment
- Push to `develop` → Preview deployment
- Pull requests → Temporary preview URLs

Manual deployment:

```bash
# Install Vercel CLI
pnpm i -g vercel

# Deploy to production
vercel --prod

# Deploy to preview
vercel
```

### Docker (Self-hosted)

```bash
# Build production image
docker build -t rumbo .

# Run with docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🇨🇴 Colombian Features

- **Currency:** Colombian Peso (COP) primary currency
- **Locale:** Spanish (es-CO) throughout the app
- **Banks:** Pre-configured Colombian banks (Bancolombia, Davivienda, Nequi, etc.)
- **Categories:** Colombian-specific expense categories
- **ID Types:** CC, CE, NIT, Passport support
- **Payment Methods:** PSE, Nequi, Daviplata integration ready

---

## 🔒 Security

- **Password Hashing:** Argon2id (OWASP 2024 compliant)
- **Session Management:** JWT with 24-hour expiry
- **Rate Limiting:** @upstash/ratelimit (5 login attempts/15min)
- **CSP:** Strict Content Security Policy
- **Authentication:** NextAuth.js v5 with email + OAuth

---

## 📊 Performance Targets

- **Lighthouse Score:** 90+ across all metrics
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3.5s
- **Bundle Size:** < 300KB initial JS
- **Test Coverage:** 80%+ (100% critical paths)

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](./.github/CONTRIBUTING.md) for details on:

- Development workflow and branch strategy
- Commit conventions (Conventional Commits)
- Pull request process
- Code standards and testing requirements

### Quick Start

1. Fork the repository
2. Create a feature branch from `develop`: `git checkout -b feature/your-feature`
3. Make changes following [Code Standards](./.rumbo/CODE_STANDARDS.md)
4. Write tests (80%+ coverage target)
5. Commit using [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` for new features (minor version bump)
   - `fix:` for bug fixes (patch version bump)
   - `feat!:` for breaking changes (major version bump)
6. Push and create PR to `develop`
7. Wait for CI checks and code review

### Versioning

We use [Semantic Versioning](https://semver.org/) with automated releases:

- **Patch (0.0.X):** `fix:` commits → Bug fixes, minor improvements
- **Minor (0.X.0):** `feat:` commits → New features, backwards-compatible
- **Major (X.0.0):** `feat!:` or `BREAKING CHANGE:` → Breaking changes

Releases are automated via [semantic-release](https://github.com/semantic-release/semantic-release) when code is merged to `main`.

### Branch Protection

- ✅ Direct pushes to `main` are **blocked**
- ✅ All changes require **pull requests**
- ✅ **1 approval** required before merge
- ✅ All **CI checks must pass** (lint, tests, build, security)

See [Branch Protection Rules](./.github/BRANCH_PROTECTION.md) for details.

---

## 📄 License

TBD

---

## 🙏 Acknowledgments

Built with modern, production-ready technologies:

- Next.js team for the amazing framework
- Vercel for hosting and infrastructure
- Prisma team for the excellent ORM
- tRPC team for type-safe APIs
- Shadcn for the beautiful component library

---

**Made with ❤️ for the Colombian community**
