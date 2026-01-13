# Active Agents for Rumbo Project

> **Last Updated:** January 11, 2026
> **Total Active:** 26 agents (10 core + 16 specialized)

---

## Core Agents (Always Active)

1. **architecture-advisor** - System design, scalability, architectural decisions
2. **code-reviewer** - Code quality, best practices, PR reviews
3. **dependency-manager** - Package management, version conflicts, updates
4. **documentation-engineer** - Documentation quality, completeness, clarity
5. **git-workflow-specialist** - Git workflows, branching, versioning
6. **performance-optimizer** - Performance analysis, optimization strategies
7. **project-analyzer** - Project structure, patterns, conventions
8. **refactoring-specialist** - Code refactoring, technical debt
9. **security-auditor** - Security vulnerabilities, OWASP compliance
10. **test-strategist** - Testing strategies, coverage, quality

---

## Specialized Pool Agents (Stack-Specific)

### Frontend (3)

11. **react-specialist** - React 19, hooks, Server Components, patterns
12. **tailwind-expert** - Tailwind CSS 4, utility classes, design system
13. **ui-accessibility** - WCAG 2.1 AA/AAA, a11y patterns, screen readers

### Full-Stack Framework (1)

14. **nextjs-specialist** - Next.js 16, App Router, Turbopack, PPR

### Language (1)

15. **typescript-pro** - TypeScript 5.9, strict mode, advanced patterns

### Database (3)

16. **postgres-expert** - PostgreSQL 16, indexing, optimization, queries
17. **prisma-specialist** - Prisma 7.2, schema design, migrations, performance
18. **redis-specialist** - Redis, caching, BullMQ, rate limiting

### Infrastructure (4)

19. **docker-specialist** - Docker, docker-compose, containerization
20. **vercel-deployment-specialist** - Vercel deployment, Edge, previews
21. **cicd-automation-specialist** - GitHub Actions, CI/CD pipelines, workflows
22. **monitoring-observability-specialist** - Sentry, logging, metrics, alerts

### Testing (3)

23. **vitest-specialist** - Vitest configuration, testing patterns, coverage
24. **playwright-e2e-specialist** - Playwright E2E, cross-browser, mobile
25. **storybook-testing-specialist** - Storybook 8, stories, interaction tests

### Specialized (1)

26. **ai-ml-integration-specialist** - OpenAI integration, AI SDK, prompts

---

## Agent Activation Status

All agents are **symlinked** from global agent pool:

- **Core:** `~/.claude-global/agents/core/*.md`
- **Pool:** `~/.claude-global/agents/pool/**/*.md`

Location: `.claude/agents/`

---

## Usage

These agents are automatically consulted when:

- Reviewing code (code-reviewer, architecture-advisor)
- Making tech decisions (relevant specialists)
- Analyzing documentation (documentation-engineer)
- Planning implementations (all relevant agents)
- Auditing project (project-analyzer, security-auditor)

**To use agents explicitly**, mention their role in your request.

---

**Document Status:** ✅ Complete
**Agents Active:** 26/26 operational
