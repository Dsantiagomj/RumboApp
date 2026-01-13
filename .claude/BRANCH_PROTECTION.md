# Branch Protection Rules

**Last Updated:** 2026-01-12

## 🔒 Protected Branches

### `main` Branch

**Protection Level:** Full protection with admin enforcement

**Rules Applied:**

- ✅ **Require pull request before merging**
  - Minimum 1 approval required
  - Dismisses stale reviews when new commits are pushed
- ✅ **Require status checks to pass before merging**
  - All CI/CD checks must pass
  - Branch must be up to date with base branch
- ✅ **Do not allow bypassing the above settings**
  - Rules apply to administrators and repository owners
- ✅ **Restrict who can push to matching branches**
  - Direct pushes blocked for everyone

**Required Status Checks:**

- Code Quality (ESLint, Prettier, TypeScript)
- Tests (Vitest unit tests, Playwright E2E)
- Build (Next.js production build)
- Security (Dependency audit, Secret scan, CodeQL)
- Lighthouse (Performance, accessibility, SEO)

---

## 📋 Contribution Workflow

### For Feature Development

1. **Create a feature branch from `develop`:**

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes and commit:**

   ```bash
   git add .
   git commit -m "feat: Add your feature description"
   ```

   **Use Conventional Commits:**
   - `feat:` - New feature (minor version bump)
   - `fix:` - Bug fix (patch version bump)
   - `docs:` - Documentation changes
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks
   - `feat!:` or `fix!:` - Breaking changes (major version bump)

3. **Push to remote:**

   ```bash
   git push -u origin feature/your-feature-name
   ```

4. **Create Pull Request:**
   - Go to: https://github.com/Dsantiagomj/RumboApp/pulls
   - Click "New pull request"
   - Base: `develop` ← Compare: `feature/your-feature-name`
   - Fill in PR description with:
     - Summary of changes
     - Testing done
     - Screenshots (if UI changes)

5. **Wait for CI checks to pass**
   - All workflows must complete successfully
   - Fix any failing checks

6. **Get approval**
   - At least 1 approval required
   - Address any review comments

7. **Merge to develop**
   - Use "Squash and merge" for clean history

### For Production Releases

1. **Create PR from `develop` to `main`:**

   ```bash
   # Ensure develop is up to date
   git checkout develop
   git pull origin develop

   # Create PR via GitHub UI
   # Base: main ← Compare: develop
   ```

2. **All checks must pass** (same as feature workflow)

3. **Get approval** (required)

4. **Merge to main**
   - This triggers production deployment to Vercel
   - semantic-release automatically creates version tag and changelog

---

## ❌ What Happens If You Try to Push Directly to `main`

**Error you'll see:**

```
! [remote rejected] main -> main (protected branch hook declined)
error: failed to push some refs to 'github.com:Dsantiagomj/RumboApp.git'
```

**Why this is good:**

- Prevents accidental pushes to production
- Ensures all code goes through review
- Guarantees CI checks run before deployment
- Maintains clean git history

---

## 🚨 Emergency Hotfixes

If you need to deploy an urgent fix to production:

1. **Create hotfix branch from `main`:**

   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/critical-bug-description
   ```

2. **Make the fix and test thoroughly**

3. **Create PR to `main` directly:**
   - Base: `main` ← Compare: `hotfix/critical-bug-description`
   - Mark as "HOTFIX" in title
   - Explain urgency in description

4. **Get fast-track review** (still need approval)

5. **After merging to `main`, backport to `develop`:**
   ```bash
   git checkout develop
   git pull origin develop
   git merge hotfix/critical-bug-description
   git push origin develop
   ```

---

## 🔧 Branch Strategy

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
hotfix/* branches (emergency only, targets main directly)
bugfix/* branches (targets develop)
```

**Deployments:**

- `main` → https://rumbo-app.vercel.app/ (Production)
- `develop` → https://rumbo-app-dev.vercel.app/ (Preview)
- Feature branches → Temporary preview URLs

---

## 📚 Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Branch Protection Docs](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)
- [Project RULEBOOK](./../.claude/RULEBOOK.md)
- [Code Standards](../.rumbo/CODE_STANDARDS.md)

---

**Questions?** Check the CONTRIBUTING.md or open a discussion in GitHub.
