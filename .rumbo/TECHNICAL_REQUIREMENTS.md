# Rumbo - Technical Requirements

> **Purpose:** Define technical constraints and requirements
> **Use:** Guide tech stack and architecture decisions
> **Focus:** What the system MUST do technically

---

## 🎯 Core Technical Requirements

### 1. **Platform Requirements**

#### Must Support:

- ✅ **Web (Desktop)** - Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ **Web (Mobile)** - Responsive, touch-optimized
- ✅ **PWA** - Installable on mobile (iOS, Android)
- ⏳ **Native Mobile Apps** (Future: v5+) - React Native or similar

#### Deployment:

- ✅ **Cloud-hosted** (primary) - Vercel, Netlify, or similar
- ✅ **Self-hostable** (secondary) - Docker, easy setup
- ✅ **Offline-capable** (partial) - View data, add transactions offline

---

### 2. **Performance Requirements**

#### Page Load:

- ✅ **First Contentful Paint (FCP):** <1.5s
- ✅ **Largest Contentful Paint (LCP):** <2.5s
- ✅ **Time to Interactive (TTI):** <3.5s
- ✅ **Lighthouse Score:** 90+ (Performance, Accessibility, Best Practices, SEO)

#### Runtime:

- ✅ **AI chat response:** <3s for simple queries, <10s for complex
- ✅ **Transaction list:** <1s to render 100 transactions
- ✅ **Receipt OCR:** <5s to process receipt
- ✅ **Data import:** <30s for 1000 transactions

#### Mobile Performance:

- ✅ **Mobile network (3G):** Usable experience
- ✅ **Battery efficient:** No excessive background processing
- ✅ **Data efficient:** Minimal API calls, smart caching

#### Bundle Size Budgets:

**JavaScript Bundles:**

- ✅ **First Load JS (total):** < 200 KB (gzipped)
  - Includes: React + Next.js + framework code + initial page code
  - Measured on: `/` (homepage), `/dashboard` (main app)
- ✅ **Shared chunks:** < 100 KB (gzipped)
  - Common code shared across pages
  - Vendors (React, Next.js, UI libraries)
- ✅ **Page-specific bundles:** < 50 KB each (gzipped)
  - Individual route code
  - Lazy-loaded components
- ✅ **Route segments:** < 30 KB each (gzipped)
  - Feature-specific code (transactions, budgets, bills)

**CSS Bundles:**

- ✅ **Total CSS:** < 50 KB (gzipped)
  - Tailwind CSS utilities
  - Component styles
  - Global styles
- ✅ **Critical CSS:** < 15 KB (inline)
  - Above-the-fold styles
  - Inlined in HTML for faster FCP

**Images:**

- ✅ **Hero images:** < 200 KB each
  - Format: AVIF with WebP fallback
  - Responsive sizes (srcset)
- ✅ **UI icons:** < 5 KB each (SVG preferred)
- ✅ **Uploaded receipts:** < 500 KB each (enforced at upload)

**Fonts:**

- ✅ **Total font files:** < 100 KB
  - Inter font family (variable font preferred)
  - Latin subset only (for v1)
  - Font-display: swap

**Third-Party Scripts:**

- ✅ **Analytics:** < 10 KB (Plausible is lightweight)
- ✅ **Error tracking:** < 30 KB (Sentry SDK)
- ✅ **Total third-party:** < 50 KB

**Budget Enforcement:**

- ✅ **CI/CD checks:** Fail build if budget exceeded
- ✅ **Bundle analyzer:** Run on every PR
- ✅ **Warnings at:** 90% of budget
- ✅ **Errors at:** 100% of budget
- ✅ **Monitoring:** Track bundle size trends over time

**Tools:**

- **@next/bundle-analyzer** - Visualize bundle composition
- **GitHub Actions** - Automated size checks on PR
- **Bundle size report** - Comment on PRs with size changes

**Route-Specific Budgets:**

| Route           | First Load JS | Page JS | Shared JS | CSS     |
| --------------- | ------------- | ------- | --------- | ------- |
| `/` (Landing)   | < 180 KB      | < 30 KB | < 100 KB  | < 40 KB |
| `/dashboard`    | < 200 KB      | < 50 KB | < 100 KB  | < 50 KB |
| `/transactions` | < 200 KB      | < 50 KB | < 100 KB  | < 50 KB |
| `/ai-chat`      | < 220 KB      | < 70 KB | < 100 KB  | < 50 KB |

**Note:** AI chat route has higher budget due to streaming dependencies (AI SDK, server-sent events handling).

---

### 3. **Data Requirements**

#### Database:

- ✅ **Relational database** (PostgreSQL preferred)
- ✅ **ACID compliance** (financial data requires accuracy)
- ✅ **Scalable** (start small, grow to millions of records)
- ✅ **Hosted option** (Neon, Supabase, PlanetScale)
- ✅ **Self-host option** (Docker PostgreSQL)

#### Data Models:

```
Users → Accounts → Transactions
     → Categories
     → Tags
     → Merchants
     → Budgets
     → Goals → Tasks
     → Bills
     → Receipts → Items
     → Financial Plans
     → Family (future) → Members → Permissions
```

#### Data Volume (Projections):

- **v1 (You):** 1 user, 3-5 accounts, 500-1000 transactions/year, 50-100 receipts/year
- **v2 (Beta):** 10-50 users, ~10,000 transactions/year total
- **v3 (Launch):** 500-1000 users, ~500,000 transactions/year
- **v5 (Scale):** 10,000+ users, 10M+ transactions/year

---

### 4. **AI Requirements**

#### AI Provider:

- ✅ **OpenAI** (GPT-4, GPT-3.5 Turbo)
- ⏳ **Anthropic Claude** (alternative, future)
- ⏳ **Google Gemini** (alternative, future)
- ✅ **User-provided API key** (self-hosted option)

#### AI Use Cases:

1. **Chat Assistant**
   - Query financial data
   - Answer questions
   - Function calling to access user data

2. **Auto-Categorization**
   - Classify transactions by description
   - Learn from user corrections
   - Batch categorization

3. **Receipt OCR**
   - Extract text from images
   - Parse receipt structure
   - Identify items, prices, store

4. **Financial Planning**
   - Analyze financial situation
   - Generate personalized plan
   - Create tasks and goals

5. **Grocery Intelligence** (v3)
   - Pattern analysis
   - Predict restocking needs
   - Suggest alternatives

6. **Product Health Analysis** (v3)
   - Nutrition scoring
   - Toxicity warnings
   - Healthier alternatives

#### AI Performance:

- ✅ **Chat latency:** <3s for simple queries
- ✅ **Streaming:** Real-time response streaming
- ✅ **Cost:** <$0.10/user/month (free tier), <$1/user/month (pro tier)
- ✅ **Rate limiting:** Handle API limits gracefully
- ✅ **Fallback:** Degrade gracefully if AI unavailable

---

### 5. **Security Requirements**

#### Authentication:

- ✅ **Email/password** auth (primary)
- ✅ **Password hashing** (bcrypt or Argon2)
- ✅ **Session management** (JWT or session cookies)
- ⏳ **OAuth** (Google, GitHub) (future)
- ⏳ **2FA/MFA** (optional, v4+)

#### Authorization:

- ✅ **Role-based access control** (USER, ADMIN)
- ✅ **Row-level security** (users only see their data)
- ✅ **Family permissions** (v4: view, edit, admin)

#### Data Security:

- ✅ **Encryption at rest** (database-level)
- ✅ **Encryption in transit** (HTTPS/TLS)
- ✅ **Secure API keys** (environment variables, never committed)
- ✅ **XSS protection** (input sanitization)
- ✅ **CSRF protection** (CSRF tokens)
- ✅ **SQL injection protection** (parameterized queries, ORM)

#### Privacy:

- ✅ **GDPR-compliant** (data export, deletion)
- ✅ **Colombian data protection** (Ley 1581 de 2012)
- ✅ **No third-party tracking** (no Google Analytics, use privacy-first)
- ✅ **User data ownership** (users own their data)

---

### 6. **Scalability Requirements**

#### Horizontal Scaling:

- ✅ **Stateless backend** (can run multiple instances)
- ✅ **Database connection pooling**
- ✅ **CDN for static assets**

#### Vertical Scaling:

- ✅ **Start small** (can run on $5/month server)
- ✅ **Grow gradually** (add resources as needed)

#### Caching:

- ✅ **Browser caching** (static assets, images)
- ✅ **API response caching** (financial summaries)
- ✅ **Database query caching** (frequent queries)

---

### 7. **Internationalization (i18n)**

#### Languages:

- ✅ **Spanish (es-CO):** Primary, Colombian Spanish
- ⏳ **English (en-US):** Secondary (v4+)
- ⏳ **Portuguese (pt-BR):** (v5+, Brazil)

#### Localization:

- ✅ **Currency formatting:** COP (primary), USD, EUR
- ✅ **Number formatting:** 1.234.567,89 (es-CO)
- ✅ **Date formatting:** DD/MM/YYYY (Colombia)
- ✅ **Time zone:** America/Bogota (UTC-5)

#### Translation:

- ✅ **All UI strings** translatable
- ✅ **AI responses** in user's language
- ✅ **Error messages** localized

---

### 8. **Accessibility Requirements**

#### WCAG 2.1 Level AA:

- ✅ **Keyboard navigation** (tab, enter, esc)
- ✅ **Screen reader support** (ARIA labels)
- ✅ **Color contrast** (4.5:1 for text, 3:1 for UI elements)
- ✅ **Focus indicators** (visible focus states)
- ✅ **Alt text** (images, icons)
- ✅ **Semantic HTML** (headings, landmarks)

#### Responsive Design:

- ✅ **Mobile-first** (320px minimum width)
- ✅ **Touch targets** (44x44px minimum)
- ✅ **Zoom support** (up to 200% zoom)

---

### 9. **Monitoring & Observability**

#### Error Tracking:

- ✅ **Client-side errors** (JavaScript errors)
- ✅ **Server-side errors** (API errors, database errors)
- ✅ **User context** (what action caused error)
- ✅ **Stack traces** (for debugging)
- ⏳ **Tools:** Sentry (preferred) or similar

#### Analytics:

- ✅ **Privacy-first analytics** (Plausible, Umami, or self-hosted)
- ❌ **NO Google Analytics** (privacy concerns)
- ✅ **Event tracking:**
  - User signup
  - Expense created
  - Receipt scanned
  - AI chat session
  - Plan created
  - Goal completed

#### Performance Monitoring:

- ✅ **Real User Monitoring (RUM)**
- ✅ **Core Web Vitals** (LCP, FID, CLS)
- ✅ **API response times**
- ✅ **Database query performance**

#### Logging:

- ✅ **Structured logging** (JSON format)
- ✅ **Log levels** (DEBUG, INFO, WARN, ERROR)
- ✅ **Searchable logs** (filtering, querying)
- ⏳ **Tools:** Logtail, Axiom, or self-hosted (Loki)

---

### 10. **Testing Requirements**

#### Unit Tests:

- ✅ **Utility functions** (formatters, calculators)
- ✅ **Business logic** (plan generation, categorization)
- ✅ **Database queries** (ORM functions)
- ✅ **Target:** 70%+ code coverage

#### Integration Tests:

- ✅ **API endpoints** (tRPC procedures or REST)
- ✅ **Database operations** (create, read, update, delete)
- ✅ **AI integrations** (mock AI responses)

#### E2E Tests (Critical Paths):

**Authentication Flows:**

- ✅ **Signup flow**: Visit register → Enter details → Verify email → Redirected to dashboard
- ✅ **Login flow**: Visit login → Enter credentials → Redirected to dashboard
- ✅ **Google OAuth flow**: Click "Continue with Google" → Authorize → Redirected to dashboard
- ✅ **Password reset flow**: Forgot password → Enter email → Receive email → Reset password → Login with new password
- ✅ **Logout flow**: Click logout → Redirected to login page → Cannot access protected routes

**Transaction Management:**

- ✅ **Create expense**: Dashboard → Add expense → Fill form → Save → Appears in list
- ✅ **Edit transaction**: Transaction list → Click edit → Modify amount/category → Save → Changes reflected
- ✅ **Delete transaction**: Transaction list → Click delete → Confirm → Transaction removed
- ✅ **Filter transactions**: Select date range → Select category → Transactions filtered
- ✅ **Search transactions**: Enter description → Results update in real-time

**Account Management:**

- ✅ **Create financial account**: Accounts → Add account → Enter details → Save → Account created
- ✅ **Transfer between accounts**: Select source → Select destination → Enter amount → Transfer → Balances updated
- ✅ **View account balance**: Dashboard → See real-time balance from all transactions

**Budget Management:**

- ✅ **Create budget**: Budgets → New budget → Set category + limit → Save → Budget active
- ✅ **Track spending against budget**: Add expenses → Budget progress updates → Alert when near limit
- ✅ **Budget exceeded alert**: Spend over limit → Notification shown → Budget marked red

**Bill Management:**

- ✅ **Create recurring bill**: Bills → Add bill → Set recurrence (monthly) → Save → Appears in upcoming bills
- ✅ **Mark bill as paid**: Upcoming bills → Mark as paid → Link to transaction → Bill moved to paid
- ✅ **Bill reminder notification**: Due date approaches → Notification shown → User can pay from notification

**AI Chat:**

- ✅ **Ask financial question**: AI chat → Type question → Get response → Response appears with streaming
- ✅ **Get financial advice**: Ask about budget → AI analyzes transactions → Provides recommendations
- ✅ **Chat history**: Previous conversations saved → Can scroll back → Context preserved

**File Upload:**

- ✅ **Upload receipt**: Transaction → Upload receipt → Select file → File uploaded to R2 → Thumbnail shown
- ✅ **OCR receipt scanning**: Upload receipt → AI extracts amount/date/merchant → Pre-fills transaction form
- ✅ **Delete receipt**: Transaction → Delete receipt → Confirm → File removed from R2

**Error Handling:**

- ✅ **Network error recovery**: Lose connection → Show offline indicator → Reconnect → Retry failed requests
- ✅ **Server error (500)**: API error → Show error toast → Retry button → Success after retry
- ✅ **Validation error**: Submit invalid form → Show field errors → Fix errors → Submit successfully
- ✅ **Rate limit exceeded**: Too many requests → Show rate limit message → Wait → Try again successfully

**Offline Support:**

- ✅ **Offline create transaction**: Go offline → Create transaction → Goes to queue → Go online → Transaction syncs
- ✅ **Offline indicator**: Lose connection → Banner shows "You're offline" → Reconnect → Banner disappears
- ✅ **Sync conflict resolution**: Edit same transaction offline and online → Conflict detected → Last-write-wins or prompt user

**Performance:**

- ✅ **Page load under 3s**: Navigate to dashboard → Loads in < 3s on 4G
- ✅ **Infinite scroll**: Transaction list → Scroll to bottom → Load more → No lag
- ✅ **Optimistic UI**: Create transaction → Appears immediately → Confirmed by server → No flicker

**Accessibility:**

- ✅ **Keyboard navigation**: Tab through entire app → All interactive elements reachable → Enter/Space activate
- ✅ **Screen reader**: Use VoiceOver → All content announced → Forms properly labeled → Errors announced
- ✅ **Focus indicators**: Tab through app → Clear focus ring on all elements

**Mobile-Specific:**

- ✅ **Touch gestures**: Swipe to delete transaction → Confirm → Transaction removed
- ✅ **Mobile menu**: Tap hamburger → Menu opens → Navigate → Menu closes
- ✅ **Pull to refresh**: Pull down on transaction list → List refreshes → New transactions appear

**Target:** 100% of critical paths covered (authentication, transactions, budgets, bills, errors, offline)

#### Manual Testing:

- ✅ **Mobile devices** (iOS Safari, Android Chrome)
- ✅ **Browsers** (Chrome, Firefox, Safari, Edge)
- ✅ **Accessibility** (keyboard, screen reader)

---

### 11. **DevOps Requirements**

#### Version Control:

- ✅ **Git** (GitHub, GitLab, or similar)
- ✅ **Branching strategy** (main, develop, feature branches)
- ✅ **Commit conventions** (Conventional Commits)

#### CI/CD:

- ✅ **Automated testing** (run tests on PR)
- ✅ **Automated deployment** (merge to main → deploy)
- ✅ **Staging environment** (test before production)
- ✅ **Rollback capability** (if deployment fails)

#### Infrastructure as Code:

- ✅ **Docker** (containerization)
- ✅ **Docker Compose** (local development)
- ⏳ **Terraform/Pulumi** (future, if self-hosting at scale)

---

### 12. **Documentation Requirements**

#### Code Documentation:

- ✅ **TypeScript types** (self-documenting)
- ✅ **JSDoc comments** (functions, complex logic)
- ✅ **README** (setup instructions)

#### API Documentation:

- ✅ **API reference** (tRPC schema or OpenAPI)
- ✅ **Authentication guide**
- ✅ **Error codes and handling**

#### User Documentation:

- ⏳ **User guide** (how to use Rumbo)
- ⏳ **FAQ** (common questions)
- ⏳ **Video tutorials** (optional)

---

## 🚀 Technology Constraints

### Must-Haves:

- ✅ **TypeScript** (type safety required)
- ✅ **React** or similar (component-based UI)
- ✅ **PostgreSQL** (relational database)
- ✅ **Modern build tools** (Vite, Next.js, or similar)
- ✅ **Mobile-responsive CSS** (Tailwind preferred)

### Preferences:

- ✅ **Next.js** (full-stack framework)
- ✅ **tRPC** (type-safe API) or **Server Actions**
- ✅ **Prisma** or **Drizzle** (ORM)
- ✅ **Shadcn/ui** (component library)
- ✅ **Vercel** (deployment)

### Avoid:

- ❌ **No PHP** (outdated for new projects)
- ❌ **No jQuery** (legacy)
- ❌ **No Bootstrap** (prefer Tailwind)
- ❌ **No MongoDB** (need relational for financial data)

---

## 📱 Mobile Requirements

### PWA (Progressive Web App):

- ✅ **Manifest.json** (installable)
- ✅ **Service Worker** (offline support)
- ✅ **Home screen icon**
- ✅ **Full-screen mode**
- ✅ **Push notifications** (optional, future)

### Mobile-Specific Features:

- ✅ **Camera access** (receipt scanning)
- ✅ **Touch gestures** (swipe, long-press)
- ✅ **Haptic feedback** (optional)
- ✅ **Native date/number pickers**

### Native Apps (v5+):

- ⏳ **React Native** (code sharing with web)
- ⏳ **Expo** (simplified React Native)
- ⏳ **iOS & Android** (both platforms)

---

## 🔧 Development Environment

### Local Development:

- ✅ **MacOS, Windows, or Linux** (cross-platform)
- ✅ **Node.js 18+** (JavaScript runtime)
- ✅ **pnpm** (package manager, faster than npm)
- ✅ **Docker** (local database)
- ✅ **VS Code** (recommended editor)

### Hot Reload:

- ✅ **Fast refresh** (<1s for code changes)
- ✅ **Preserve state** (don't lose form data on refresh)

### Developer Experience:

- ✅ **TypeScript autocompletion**
- ✅ **ESLint** (code quality)
- ✅ **Prettier** (code formatting)
- ✅ **Git hooks** (lint/format on commit)

---

## 🎯 Technical Success Criteria

### v1 (Skateboard):

- [ ] Loads in <3s on mobile (4G)
- [ ] Works offline for viewing data
- [ ] Zero security vulnerabilities (high/critical)
- [ ] 70%+ code coverage (tests)
- [ ] Works on iPhone (Safari) and Android (Chrome)

### v2 (Scooter):

- [ ] AI chat responds in <3s
- [ ] Receipt OCR processes in <5s
- [ ] 90+ Lighthouse score
- [ ] Handles 100 concurrent users

### v5 (Car):

- [ ] Handles 10,000+ users
- [ ] 99.9% uptime
- [ ] <100ms API response times (p95)
- [ ] Scales horizontally

---

**Next:** Use these requirements to choose tech stack in next document.
