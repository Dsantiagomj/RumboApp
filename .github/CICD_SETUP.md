# CI/CD Setup Guide

This document provides step-by-step instructions for configuring the CI/CD pipelines for RumboApp.

## Overview

The project uses GitHub Actions for:

- **CI/CD Pipeline**: Automated testing, linting, and building
- **Security Pipeline**: Vulnerability scanning and secret detection
- **Deployment Pipeline**: Automated deployment to Vercel

## Required Configuration

### 1. Vercel Deployment Secrets

These secrets are **required** for the deployment workflow to function.

#### VERCEL_TOKEN

**Status**: ✅ Provided

**How to get it**:

1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it "GitHub Actions - RumboApp"
4. Set scope to your team "dsantiagomjs-projects"
5. Click "Create"

**Your value**: `8fXgJdKtCmx0wqLcnwdZz0Fe`

---

#### VERCEL_PROJECT_ID

**Status**: ✅ Provided

**Your value**: `prj_vkow7d8Ig0EA2LfUCWpilsvFjd1b`

---

#### VERCEL_ORG_ID

**Status**: ⏳ Needs to be retrieved

**How to get it**:

1. Go to https://vercel.com/
2. Click on your team dropdown (top left) and select "dsantiagomjs-projects"
3. Go to **Settings** (in the left sidebar)
4. Under **General**, find **Team ID** or **Organization ID**
5. Copy the ID (it will look like `team_xxxxx` or a random string)

**Alternative method using Vercel CLI**:

```bash
# Login to Vercel
vercel login

# Link to your project (if not already linked)
vercel link

# The team ID will be shown during the link process
# Or check .vercel/project.json after linking
cat .vercel/project.json | grep orgId
```

---

### 2. Configure GitHub Secrets

Once you have all three values, add them to GitHub:

1. Go to https://github.com/Dsantiagomj/RumboApp/settings/secrets/actions
2. Click **New repository secret**
3. Add each secret:

| Secret Name         | Value                              | Required |
| ------------------- | ---------------------------------- | -------- |
| `VERCEL_TOKEN`      | `8fXgJdKtCmx0wqLcnwdZz0Fe`         | ✅ Yes   |
| `VERCEL_PROJECT_ID` | `prj_vkow7d8Ig0EA2LfUCWpilsvFjd1b` | ✅ Yes   |
| `VERCEL_ORG_ID`     | _[Get from Vercel dashboard]_      | ✅ Yes   |

---

## Optional Secrets

These enhance CI/CD functionality but are not required:

### LHCI_GITHUB_APP_TOKEN (Lighthouse CI)

**Purpose**: Enable Lighthouse performance audits with GitHub integration

**How to get it**:

1. Go to https://github.com/apps/lighthouse-ci
2. Click "Install"
3. Select your repository
4. Follow the setup instructions to get the token

**When to add**: When you want detailed performance reports in PRs

---

### SNYK_TOKEN (Security Scanning)

**Purpose**: Enhanced vulnerability scanning with Snyk

**How to get it**:

1. Sign up at https://snyk.io/
2. Go to Account Settings → API Token
3. Copy your token

**When to add**: For production apps requiring enhanced security

---

### CODECOV_TOKEN (Coverage Reporting)

**Purpose**: Coverage reporting for private repositories

**How to get it**:

1. Sign up at https://codecov.io/
2. Add your repository
3. Copy the upload token

**When to add**: If you make the repository private

---

## Workflow Status

### CI/CD Workflow (`.github/workflows/ci.yml`)

**Current Status**: ⚠️ Will partially fail

**Expected Behavior**:

- ✅ Code Quality: Should pass (lint, format, type-check)
- ⚠️ Tests: Will fail (no unit tests in `src/` yet)
- ✅ E2E Tests: Should pass (15 Playwright tests)
- ✅ Build: Should pass
- ⚠️ Lighthouse: May fail without `LHCI_GITHUB_APP_TOKEN`

**Action Needed**: Fix the test job to handle missing unit tests gracefully.

---

### Security Workflow (`.github/workflows/security.yml`)

**Current Status**: ✅ Should mostly pass

**Expected Behavior**:

- ✅ Dependency Audit: Will pass (only 1 low-severity vuln remaining)
- ✅ Secret Scan: Will pass (GitLeaks works without token)
- ✅ OWASP Check: Will pass
- ⚠️ Snyk: Will skip without `SNYK_TOKEN`
- ✅ CodeQL: Will pass

**Action Needed**: None (all failures are expected for optional features)

---

### Deploy Workflow (`.github/workflows/deploy.yml`)

**Current Status**: ❌ Will fail until secrets are configured

**Expected Behavior**:

- After configuring the 3 Vercel secrets, deployment should succeed
- Runs only on pushes to `main` branch
- Includes post-deployment smoke tests

**Action Needed**: Configure the 3 required Vercel secrets.

---

## Fixing Known Issues

### Issue 1: Test Job Fails (No Unit Tests)

**Problem**: The test job runs `pnpm run test -- --run --coverage` but there are no unit tests yet in `src/`.

**Solution**: Already implemented in pre-push hook. Will be fixed in next commit.

### Issue 2: Lighthouse Requires Token

**Problem**: Lighthouse CI job expects `LHCI_GITHUB_APP_TOKEN` secret.

**Solution**: Make the token optional or remove the Lighthouse job temporarily.

---

## Verification Steps

After configuring all secrets:

1. **Trigger CI/CD**:

   ```bash
   git commit --allow-empty -m "test: Trigger CI/CD workflows"
   git push origin main
   ```

2. **Check Workflow Runs**:
   - Go to https://github.com/Dsantiagomj/RumboApp/actions
   - Verify all workflows are running

3. **Monitor Deployment**:
   - Check https://vercel.com/dsantiagomjs-projects/rumboapp
   - Verify the deployment succeeds

4. **Test Deployed App**:
   - Visit your Vercel URL (will be shown in deployment logs)
   - Verify the app loads correctly

---

## Maintenance

### Rotating Secrets

**Vercel Token**:

- Rotate every 90 days
- Create new token at https://vercel.com/account/tokens
- Update GitHub secret immediately

**Other Tokens**:

- Follow each service's security best practices
- Update GitHub secrets when rotating

### Monitoring

- Check Actions tab regularly: https://github.com/Dsantiagomj/RumboApp/actions
- Enable GitHub notifications for failed workflows
- Review Dependabot alerts weekly: https://github.com/Dsantiagomj/RumboApp/security/dependabot

---

## Troubleshooting

### Deployment Fails with "Error: No token found"

**Cause**: Missing or incorrect `VERCEL_TOKEN`

**Solution**:

1. Verify the token is correctly set in GitHub secrets
2. Regenerate token on Vercel if expired
3. Ensure token has deployment permissions for the team

### Build Fails in CI but Passes Locally

**Cause**: Environment differences or missing dependencies

**Solution**:

1. Check Node.js version (should be 20)
2. Verify pnpm lockfile is committed
3. Run `pnpm install --frozen-lockfile` locally

### E2E Tests Timeout in CI

**Cause**: GitHub Actions runners might be slower

**Solution**:

1. Increase timeout in `playwright.config.ts`
2. Check if dev server is starting correctly
3. Review Playwright report artifacts in failed runs

---

## Security Enhancements (2026-01-13)

### 5. Snyk Security Scanning

**Status**: ✅ Configured

Snyk integration provides real-time vulnerability scanning for dependencies.

**How it was configured**:

1. Created Snyk account at https://snyk.io/
2. Generated API token: Account Settings → General → API Token
3. Added `SNYK_TOKEN` to GitHub Secrets:
   - Navigate to: https://github.com/Dsantiagomj/RumboApp/settings/secrets/actions
   - Name: `SNYK_TOKEN`
   - Value: [Snyk API token]
4. Workflow already configured in `.github/workflows/security.yml`

**Features**:

- Scans dependencies for vulnerabilities on push/schedule
- Severity threshold: High
- Report uploaded as artifact
- Continue on error (doesn't block CI)

**To view reports**:

1. Go to GitHub Actions → Security workflow run
2. Download "snyk-report" artifact
3. Or visit https://app.snyk.io/org/[your-org]/projects

### 6. Branch Protection Rules

**Status**: ✅ Enabled

Branch protection prevents direct pushes to `main` and enforces code review workflow.

**Configured Rules** (on `main` branch):

1. ✅ **Require pull request before merging**
   - Minimum 1 approval required
   - Dismiss stale reviews when new commits pushed

2. ✅ **Require status checks to pass**
   - All CI/CD checks must pass
   - Branch must be up to date

3. ✅ **Do not allow bypassing settings**
   - Rules apply to administrators
   - No force pushes allowed

4. ✅ **Restrict who can push**
   - Direct pushes blocked for everyone

**How it was configured**:

1. Navigate to: https://github.com/Dsantiagomj/RumboApp/settings/branches
2. Click "Add branch protection rule"
3. Branch name pattern: `main`
4. Enable settings listed above
5. Click "Create"

**Impact**:

- ✅ No more accidental pushes to production
- ✅ All code reviewed before merging
- ✅ CI checks guaranteed to run
- ✅ Maintains clean git history

**See also**: [Branch Protection Rules](../.claude/BRANCH_PROTECTION.md)

### 7. Semantic Versioning & Releases

**Status**: ✅ Configured

Automated version management using semantic-release.

**How it works**:

1. Commits follow [Conventional Commits](https://www.conventionalcommits.org/)
2. On merge to `main`, semantic-release runs
3. Analyzes commits since last release
4. Determines version bump (major/minor/patch)
5. Creates GitHub release with changelog
6. Updates package.json and CHANGELOG.md

**Commit Convention**:

- `feat:` → Minor bump (0.1.0 → 0.2.0)
- `fix:` → Patch bump (0.1.0 → 0.1.1)
- `feat!:` or `BREAKING CHANGE:` → Major bump (0.1.0 → 1.0.0)

**Configuration Files**:

- `.releaserc.json` - semantic-release config
- `.github/workflows/release.yml` - Release workflow

**Example**:

```bash
git commit -m "feat: Add user profile editing"
# Merges to main → Creates v0.2.0 release

git commit -m "fix: Resolve theme toggle bug"
# Merges to main → Creates v0.2.1 release
```

**See also**: [Contributing Guidelines](./CONTRIBUTING.md)

---

## Next Steps

1. ✅ Get `VERCEL_ORG_ID` from Vercel dashboard
2. ✅ Configure all 3 required GitHub secrets
3. ✅ Fix test job to handle missing unit tests
4. ✅ Simplify Lighthouse job (make token optional)
5. ✅ Push changes and verify workflows pass
6. ✅ Test deployment to Vercel
7. ✅ Configure Snyk security scanning
8. ✅ Enable GitHub branch protection on `main`
9. ✅ Set up semantic versioning and releases
10. ✅ Create `develop` branch for preview deployments
11. ⏸️ (Optional) Configure additional secrets for enhanced features

---

**Last Updated**: 2026-01-13
**Maintained By**: @Dsantiagomj
