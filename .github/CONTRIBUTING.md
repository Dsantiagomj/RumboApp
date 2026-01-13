# Contributing to Rumbo

Thank you for your interest in contributing to Rumbo! This document provides guidelines and instructions for contributing to the project.

---

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Code Standards](#code-standards)
- [Testing Requirements](#testing-requirements)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** >= 20.0.0
- **pnpm:** >= 9.0.0
- **Git:** Latest version

### Initial Setup

1. **Fork and clone the repository:**

   ```bash
   git clone https://github.com/YOUR_USERNAME/RumboApp.git
   cd RumboApp
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

4. **Start development server:**
   ```bash
   pnpm dev
   ```

---

## 🔄 Development Workflow

### Branch Strategy

```
main (production)
  ↑
  PR (with approvals + CI checks)
  ↑
develop (development)
  ↑
  PR (with approvals + CI checks)
  ↑
feature/* branches
bugfix/* branches
hotfix/* branches (emergency only)
```

### Creating a Feature

1. **Pull latest develop:**

   ```bash
   git checkout develop
   git pull origin develop
   ```

2. **Create feature branch:**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make changes and commit:**

   ```bash
   git add .
   git commit -m "feat: Add your feature description"
   ```

4. **Push to your fork:**

   ```bash
   git push -u origin feature/your-feature-name
   ```

5. **Create Pull Request:**
   - Base: `develop` ← Compare: `feature/your-feature-name`
   - Fill in PR template
   - Wait for CI checks to pass
   - Request review

### Bug Fixes

Same as feature workflow, but use `bugfix/` prefix:

```bash
git checkout -b bugfix/fix-description
```

### Hotfixes (Emergency Production Fixes)

1. **Create from main:**

   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/critical-issue
   ```

2. **Fix and test thoroughly**

3. **Create PR to main:**
   - Base: `main` ← Compare: `hotfix/critical-issue`
   - Mark as "HOTFIX" in title

4. **After merging to main, backport to develop:**
   ```bash
   git checkout develop
   git pull origin develop
   git merge hotfix/critical-issue
   git push origin develop
   ```

---

## 📝 Commit Convention

**We use [Conventional Commits](https://www.conventionalcommits.org/) for automatic versioning and changelog generation.**

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat:** New feature (minor version bump: 0.1.0 → 0.2.0)
- **fix:** Bug fix (patch version bump: 0.1.0 → 0.1.1)
- **docs:** Documentation changes
- **test:** Adding or updating tests
- **chore:** Maintenance tasks (dependencies, scripts, etc.)
- **refactor:** Code refactoring (no feature change)
- **style:** Code style changes (formatting, whitespace)
- **perf:** Performance improvements
- **ci:** CI/CD changes

### Breaking Changes

For breaking changes, add `!` or `BREAKING CHANGE:` footer:

```bash
feat!: Change API structure

BREAKING CHANGE: API endpoints now use /v2/ prefix
```

This triggers a major version bump (0.1.0 → 1.0.0).

### Examples

```bash
# Feature (minor bump)
git commit -m "feat: Add user profile editing"

# Bug fix (patch bump)
git commit -m "fix: Resolve theme toggle hydration issue"

# Breaking change (major bump)
git commit -m "feat!: Redesign authentication flow"

# With scope and body
git commit -m "feat(auth): Add OAuth support

Implemented OAuth 2.0 flow with Google and GitHub providers.
Users can now sign in using their existing accounts."

# Documentation
git commit -m "docs: Update README with deployment instructions"

# Chore
git commit -m "chore: Update dependencies to latest versions"
```

### Commit Message Guidelines

- ✅ Use imperative mood ("Add feature" not "Added feature")
- ✅ Keep subject line under 72 characters
- ✅ Capitalize first letter of subject
- ✅ No period at end of subject
- ✅ Separate subject from body with blank line
- ✅ Wrap body at 72 characters
- ✅ Use body to explain "what" and "why", not "how"

---

## 🔍 Pull Request Process

### Before Creating PR

1. **Ensure all CI checks pass locally:**

   ```bash
   pnpm check  # Runs lint, format, type-check, tests
   ```

2. **Run E2E tests:**

   ```bash
   pnpm test:e2e
   ```

3. **Build successfully:**
   ```bash
   pnpm build
   ```

### PR Requirements

- ✅ **Conventional Commits:** All commits follow convention
- ✅ **Tests:** New features have tests (80%+ coverage target)
- ✅ **Documentation:** Update docs if needed
- ✅ **No breaking changes** (unless major version bump intended)
- ✅ **CI Passing:** All GitHub Actions workflows green
- ✅ **Code Review:** At least 1 approval required
- ✅ **Branch Protection:** Cannot bypass rules

### PR Template

```markdown
## Summary

Brief description of changes

## Type of Change

- [ ] Bug fix (patch)
- [ ] New feature (minor)
- [ ] Breaking change (major)
- [ ] Documentation
- [ ] Other (describe)

## Testing

- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Checklist

- [ ] Code follows project style guide
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] All tests pass locally
```

---

## 📐 Code Standards

**CRITICAL:** Read [`.rumbo/CODE_STANDARDS.md`](../.rumbo/CODE_STANDARDS.md) before writing any code.

### Quick Rules

1. **ALL components are folders** (no single-file components)

   ```
   ✅ src/components/ui/button/index.tsx
   ❌ src/components/ui/button.tsx
   ```

2. **File naming: kebab-case ONLY**

   ```
   ✅ transaction-list.tsx
   ❌ TransactionList.tsx
   ```

3. **Named exports ONLY** (no default exports except Next.js pages)

   ```typescript
   ✅ export function Button() {}
   ❌ export default function Button() {}
   ```

4. **Explicit type imports**

   ```typescript
   ✅ import type { User } from '@/types'
   ❌ import { User } from '@/types'
   ```

5. **Path aliases: @/\* for everything**
   ```typescript
   ✅ import { Button } from '@/components/ui/button'
   ❌ import { Button } from '../../../components/ui/button'
   ```

### Tech Stack

- **Framework:** Next.js 16+ (App Router)
- **Language:** TypeScript 5.9+ (strict mode)
- **Styling:** Tailwind CSS 4
- **Components:** Shadcn/ui
- **Testing:** Vitest (unit), Playwright (E2E), Storybook (component)
- **API:** tRPC 11
- **Database:** PostgreSQL + Prisma

---

## 🧪 Testing Requirements

### Coverage Targets

- **General:** 80%+ coverage
- **Critical paths:** 100% (auth, transactions, financial calculations)

### Test Types

1. **Unit Tests** (Vitest)
   - Located next to source files (`.test.ts(x)`)
   - Test pure functions, utilities, hooks
   - Fast, isolated, no dependencies

2. **Component Tests** (Storybook)
   - Located next to components (`.stories.tsx`)
   - Visual regression testing
   - Accessibility testing

3. **Integration Tests** (Vitest)
   - Test feature workflows
   - Mock external dependencies
   - Database integration (if needed)

4. **E2E Tests** (Playwright)
   - Located in `tests/e2e/`
   - Test critical user flows
   - Run against real deployment

### Running Tests

```bash
# Unit tests
pnpm test              # Watch mode
pnpm test run          # Single run
pnpm test:coverage     # With coverage

# E2E tests
pnpm test:e2e          # Headless
pnpm test:e2e:ui       # UI mode

# All tests
pnpm check             # Lint + format + type + test
```

### Writing Tests

**Example Unit Test:**

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './index';

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });
});
```

---

## 🔒 Security

- **Never commit secrets** (.env files are gitignored)
- **Input validation:** Use Zod on client AND server
- **SQL injection:** Prisma handles this (avoid raw queries)
- **XSS:** React escapes by default, use DOMPurify for HTML
- **Authentication:** NextAuth.js 5 + Argon2
- **Dependencies:** Run `pnpm audit` regularly

---

## 📚 Additional Resources

- [Project RULEBOOK](../.claude/RULEBOOK.md)
- [Code Standards](../.rumbo/CODE_STANDARDS.md)
- [Tech Stack Details](../.rumbo/TECH_STACK.md)
- [Branch Protection Rules](./BRANCH_PROTECTION.md)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## 💬 Questions?

- Open a [GitHub Discussion](https://github.com/Dsantiagomj/RumboApp/discussions)
- Check existing [Issues](https://github.com/Dsantiagomj/RumboApp/issues)
- Read the [RULEBOOK](../.claude/RULEBOOK.md)

---

**Thank you for contributing to Rumbo! 🚀**
