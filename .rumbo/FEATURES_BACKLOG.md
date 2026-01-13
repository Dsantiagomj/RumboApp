# Rumbo - Features Backlog (v1 Skateboard)

> **Goal:** Build what YOU need to manage your finances
> **Timeline:** 3-4 months
> **Audience:** Just you (Daniel)
> **Quality:** Works for you, doesn't need to be perfect

---

## 🎯 v1 Success Criteria

At the end of v1, you should be able to:

- [ ] Upload your financial reports and have all data imported
- [ ] See all your accounts and correct balances
- [ ] Track new expenses easily on mobile
- [ ] Ask AI questions about your finances
- [ ] Have all your bills tracked with reminders
- [ ] Use it at least 4x/week
- [ ] Make better financial decisions because of it

---

## 📋 Feature Breakdown

### **Epic 1: Authentication & User Setup** 🔐 ✅

**Goal:** You can sign up and set up your profile

#### Feature 1.1: User Registration ✅

**Priority:** P0 (Critical)
**Estimate:** 2-3 days
**Status:** COMPLETED (2026-01-08)

**Tasks:**

- [x] Create signup page (email, password, name)
- [x] Email validation (format check)
- [x] Password requirements (min 8 chars, uppercase, lowercase, number)
- [x] Hash password (bcrypt or Argon2)
- [x] Store user in database
- [ ] Send confirmation email (optional for v1)
- [x] Show success message

**Acceptance Criteria:**

- ✅ User can create account with email/password
- ✅ Passwords are securely hashed
- ✅ Duplicate emails are rejected
- ✅ Form validation works (client + server)

**Additional Features Implemented:**

- Date of birth field with calendar picker
- Preferred name field for AI personalization
- Auto-formatting for date input (DD/MM/YYYY)
- Age validation (minimum 13 years)
- Colombian locale defaults (COP, es-CO, America/Bogota)

---

#### Feature 1.2: User Login ✅

**Priority:** P0 (Critical)
**Estimate:** 1-2 days
**Status:** COMPLETED (2026-01-08)

**Tasks:**

- [x] Create login page (email, password)
- [x] Verify credentials
- [x] Create session (JWT or session cookie)
- [x] Redirect to dashboard
- [x] Handle incorrect credentials (clear error message)
- [ ] "Remember me" option (optional)

**Acceptance Criteria:**

- ✅ User can log in with correct credentials
- ✅ Session persists across page reloads
- ✅ Incorrect login shows helpful error
- ✅ Session expires after inactivity (configurable)

**Additional Features Implemented:**

- Protected route middleware
- Automatic redirect for authenticated users
- Session persistence across page reloads
- Loading states and error handling

---

#### Feature 1.3: User Profile Setup ✅

**Priority:** P1 (High)
**Estimate:** 1 day
**Status:** COMPLETED (2026-01-09)

**Tasks:**

- [x] Create profile settings page
- [x] Allow editing: name, email, preferredName
- [x] Currency selection (COP default, USD, EUR options)
- [x] Language selection (Spanish default, English option)
- [x] Date format (DD/MM/YYYY default, MM/DD/YYYY option)
- [x] Timezone selection (America/Bogota default, 4 other options)
- [x] Save preferences to database
- [x] Apply preferences app-wide

**Acceptance Criteria:**

- ✅ User can update profile info
- ✅ Currency/language preferences work
- ✅ Changes persist

**Additional Features Implemented:**

- Logout button with loading states
- Success/error messaging with auto-hide (3 seconds)
- Complete form validation matching backend schemas
- 13 integration tests
- 8 E2E tests (5 skipped for select refinement)

---

### **Epic 2: Smart Data Import** 🚀

**Goal:** You can upload your bank statements and have everything imported automatically

#### Feature 2.1: File Upload Interface

**Priority:** P0 (Critical - YOUR #1 need)
**Estimate:** 2-3 days

**Tasks:**

- [ ] Create "Import Data" page
- [ ] File upload dropzone (drag & drop + click)
- [ ] Support CSV files (Bancolombia, Nequi, Davivienda)
- [ ] Support PDF files (bank statements)
- [ ] File validation (size limit, format)
- [ ] Upload to server
- [ ] Show upload progress
- [ ] Store file temporarily for processing

**Acceptance Criteria:**

- User can upload CSV or PDF
- File uploads successfully
- Clear error if wrong format
- Works on mobile (camera option for PDF)

---

#### Feature 2.2: CSV Parsing & Account Detection

**Priority:** P0 (Critical)
**Estimate:** 3-4 days

**Tasks:**

- [ ] Parse CSV (detect delimiter, encoding)
- [ ] Detect Colombian bank formats:
  - Bancolombia CSV format
  - Nequi CSV format
  - Davivienda CSV format
- [ ] Extract account information:
  - Account name
  - Account type (checking, savings, credit card)
  - Account number (last 4 digits)
- [ ] Extract transactions:
  - Date, amount, description
  - Transaction type (debit, credit)
- [ ] AI suggests account names
  - "Cuenta de Ahorros Bancolombia"
  - "Tarjeta de Crédito Visa"
- [ ] Calculate initial balance from transactions

**Acceptance Criteria:**

- Correctly parses Colombian bank CSVs
- Identifies 90%+ of fields correctly
- AI suggests meaningful account names
- Handles encoding issues (Spanish characters)

---

#### Feature 2.3: PDF OCR (Bank Statements)

**Priority:** P1 (High - nice to have)
**Estimate:** 3-5 days

**Tasks:**

- [ ] OCR library integration (Tesseract or cloud API)
- [ ] Extract text from PDF
- [ ] Parse bank statement format:
  - Account name and number
  - Opening/closing balance
  - Transaction list (date, description, amount)
- [ ] AI structures extracted data
- [ ] Fallback to manual entry if OCR fails

**Acceptance Criteria:**

- Extracts data from PDF statements
- 80%+ accuracy on Colombian bank PDFs
- Graceful failure (allows manual correction)

---

#### Feature 2.4: Account Creation Flow

**Priority:** P0 (Critical)
**Estimate:** 2-3 days

**Tasks:**

- [ ] Show detected accounts to user
- [ ] For each account:
  - Display: name, type, balance
  - Allow editing name
  - Allow changing type (dropdown)
  - Confirm or skip account
- [ ] Create accounts in database
- [ ] Link transactions to accounts
- [ ] Set initial balances

**Acceptance Criteria:**

- User sees all detected accounts
- Can edit account details
- Accounts created correctly
- Balances match imported data

---

#### Feature 2.5: Balance Confirmation & Reconciliation

**Priority:** P0 (Critical - YOUR specific need)
**Estimate:** 3-4 days

**Tasks:**

- [ ] Calculate balance from transactions
- [ ] Compare to reported balance (from file)
- [ ] If mismatch:
  - Show difference ($X COP)
  - Offer 3 options:
    1. **Find missing transactions** (AI helps)
    2. **Override with report balance** (trust bank)
    3. **Review manually**
- [ ] Option 1: AI suggests missing transactions
  - "Possible transaction around $5,000 on Dec 28"
  - User can add or skip
- [ ] Option 2: Create adjustment entry
  - "Balance adjustment: $5,000"
- [ ] Option 3: Show all transactions
  - User marks correct/incorrect
  - User adds missing manually
- [ ] Save reconciliation state

**Acceptance Criteria:**

- Detects balance mismatches
- AI suggestions are helpful
- User can resolve discrepancies
- Final balance matches bank

**AI Integration:**

- Use GPT-4 to analyze transactions
- Suggest likely missing transactions
- Explain discrepancies

---

#### Feature 2.6: Follow-Up Task Creation

**Priority:** P1 (High)
**Estimate:** 1 day

**Tasks:**

- [ ] After first import, create task:
  - "Upload [Month+1] financial report"
  - Due date: 5th of next month
- [ ] Remind user to upload regularly
- [ ] Track import history

**Acceptance Criteria:**

- Task created automatically
- User receives reminder
- Can mark complete when done

---

### **Epic 3: Bills Tracking** 💡

**Goal:** You never forget to pay bills

#### Feature 3.1: Bills Setup (Onboarding)

**Priority:** P0 (Critical)
**Estimate:** 2-3 days

**Tasks:**

- [ ] After account setup, show "Let's add your bills" screen
- [ ] Pre-configured Colombian bill types:
  - ⚡ Electricity (Codensa, EPM, etc.)
  - 💧 Water (Acueducto)
  - 🔥 Gas (Vanti, Gas Natural)
  - 🏠 Rent/Mortgage
  - 🏢 HOA/Administración
  - 📡 Home Internet (Claro, Movistar, ETB)
  - 📱 Mobile Plan (Claro, Movistar, Tigo)
  - 📺 Cable TV/Streaming
- [ ] For each bill:
  - Provider name (autocomplete Colombian providers)
  - Typical amount (user enters or AI extracts from upload)
  - Due date (day of month, e.g., "15")
  - Account to pay from (dropdown)
  - Optional: Upload latest bill (PDF)
- [ ] AI extracts data from uploaded bills
  - Amount, due date, account number
- [ ] Store bills in database

**Acceptance Criteria:**

- User can add all recurring bills
- Colombian providers auto-suggested
- AI extracts data from PDFs (70%+ accuracy)
- Bills saved correctly

---

#### Feature 3.2: Bill Reminders

**Priority:** P1 (High)
**Estimate:** 2 days

**Tasks:**

- [ ] Calculate upcoming bills (next 7 days)
- [ ] Show in dashboard: "Bills Due Soon"
- [ ] Push notification (mobile, 3 days before)
- [ ] Email reminder (optional, 3 days before)
- [ ] Mark bill as paid
- [ ] Track payment history

**Acceptance Criteria:**

- User sees upcoming bills
- Receives reminders on time
- Can mark as paid easily
- Never misses a bill

---

#### Feature 3.3: Bill Amount Tracking

**Priority:** P2 (Medium)
**Estimate:** 1-2 days

**Tasks:**

- [ ] Track actual bill amounts each month
- [ ] Compare to typical amount
- [ ] Alert if bill increased significantly (>15%)
  - "Your Codensa bill increased $15,000 this month"
- [ ] Show bill history (chart)

**Acceptance Criteria:**

- Detects bill increases
- Alerts user proactively
- Historical data visible

---

### **Epic 4: Account & Expense Tracking** 💳

**Goal:** You can track your finances manually (when needed)

#### Feature 4.1: Account Management

**Priority:** P0 (Critical)
**Estimate:** 2-3 days

**Tasks:**

- [ ] Accounts list page
  - Show all accounts
  - Display: name, type, balance, currency
  - Group by type (Checking, Savings, Credit Cards)
- [ ] Create account (manual)
  - Name, type, initial balance, currency
  - Optional: icon, color
- [ ] Edit account
  - Update name, type, balance
- [ ] Delete account
  - Warn if has transactions
  - Offer to reassign transactions

**Acceptance Criteria:**

- User can view all accounts
- Can create/edit/delete accounts
- Balances displayed correctly
- Mobile-responsive

---

#### Feature 4.2: Manual Expense Entry

**Priority:** P0 (Critical)
**Estimate:** 3-4 days

**Tasks:**

- [ ] Quick add expense (mobile-optimized)
  - Amount (numeric keypad)
  - Account (dropdown)
  - Category (dropdown)
  - Date (date picker, default today)
  - Description (optional)
- [ ] Save transaction
- [ ] Update account balance
- [ ] Show success confirmation
- [ ] Quick add button (floating action button on mobile)

**Acceptance Criteria:**

- Can add expense in <10 seconds
- Works perfectly on mobile
- Balance updates immediately
- Smooth UX

---

#### Feature 4.3: Transaction List

**Priority:** P1 (High)
**Estimate:** 2-3 days

**Tasks:**

- [ ] Transactions list page
  - Show all transactions
  - Display: date, description, category, amount, account
  - Sort by date (newest first)
  - Paginate (20 per page)
- [ ] Filters:
  - By account
  - By category
  - By date range
  - Search by description
- [ ] Edit transaction
- [ ] Delete transaction

**Acceptance Criteria:**

- User can see all transactions
- Filters work correctly
- Mobile-responsive
- Fast loading (<1s for 100 transactions)

---

### **Epic 5: Categories** 🏷️

**Goal:** Organize expenses by category

#### Feature 5.1: Colombian Category Setup

**Priority:** P0 (Critical)
**Estimate:** 1-2 days

**Tasks:**

- [ ] Seed default Colombian categories:
  - **Expenses:**
    - 🍽️ Alimentación (Food & Groceries)
    - 🚗 Transporte (Transportation)
    - 🏠 Vivienda (Housing)
    - ⚡ Servicios Públicos (Utilities)
    - 🏥 Salud (Healthcare)
    - 📚 Educación (Education)
    - 🎭 Entretenimiento (Entertainment)
    - 👕 Ropa (Clothing)
    - 💳 Deudas (Debt Payments)
    - 💰 Ahorros (Savings)
  - **Income:**
    - 💼 Salario (Salary)
    - 💻 Freelance
    - 🏠 Arriendos (Rental Income)
    - 📈 Inversiones (Investments)
- [ ] Each category: name, icon, color, type (income/expense)
- [ ] Store in database on signup

**Acceptance Criteria:**

- Colombian categories available on signup
- Icons and colors assigned
- Categories work in Spanish

---

#### Feature 5.2: Category Management

**Priority:** P2 (Medium)
**Estimate:** 1-2 days

**Tasks:**

- [ ] View all categories
- [ ] Create custom category
  - Name, icon (from set), color, type
- [ ] Edit category
- [ ] Delete category (if no transactions)
- [ ] Category usage stats (how many transactions)

**Acceptance Criteria:**

- User can create custom categories
- Can't delete if in use
- Stats are accurate

---

### **Epic 6: AI Chat Assistant** 🤖

**Goal:** You can ask questions about your finances

#### Feature 6.1: Chat Interface

**Priority:** P0 (Critical - YOUR top AI feature)
**Estimate:** 3-4 days

**Tasks:**

- [ ] Chat UI component
  - Message list (scrollable)
  - Input field (with send button)
  - User messages (right-aligned)
  - AI messages (left-aligned)
  - Typing indicator
- [ ] Chat page (desktop + mobile)
- [ ] Chat history (persist conversations)
- [ ] New chat button
- [ ] Clear chat option

**Acceptance Criteria:**

- Clean, simple chat interface
- Works on mobile and desktop
- Messages persist
- Smooth UX

---

#### Feature 6.2: OpenAI Integration

**Priority:** P0 (Critical)
**Estimate:** 2-3 days

**Tasks:**

- [ ] Set up OpenAI API
- [ ] Create chat completion endpoint
- [ ] Stream responses (real-time)
- [ ] Handle errors gracefully
- [ ] Rate limiting (prevent abuse)
- [ ] Cost tracking (monitor API usage)

**Acceptance Criteria:**

- AI responds in <3s
- Streaming works smoothly
- Errors handled well
- Stays within budget (<$10/month initially)

---

#### Feature 6.3: Function Calling (Data Access)

**Priority:** P0 (Critical)
**Estimate:** 4-5 days

**Tasks:**

- [ ] Define AI functions:
  1. **getTransactions** - Get user's transactions
     - Filters: account, category, date range, amount
     - Returns: list of transactions
  2. **getAccounts** - Get user's accounts
     - Returns: list with balances
  3. **getBudgetStatus** - Get budget info (if implemented)
     - Returns: spent vs budgeted
  4. **getBills** - Get upcoming bills
     - Returns: bills due soon
  5. **getBalance** - Get total balance
     - Returns: sum of all accounts
- [ ] Implement function handlers
- [ ] Connect to OpenAI function calling
- [ ] Parse function results
- [ ] Format response to user

**Acceptance Criteria:**

- AI can access user's data
- Functions return correct data
- AI formats answers naturally
- Respects user privacy (only their data)

**Example Queries:**

- "¿Cuánto gasté en comida este mes?"
  - AI calls: `getTransactions(category="Alimentación", dateRange="thisMonth")`
  - Response: "Gastaste $287,500 en alimentación este mes."
- "¿Cuál es mi cuenta con más gastos?"
  - AI calls: `getTransactions()` for all accounts
  - Analyzes and responds
- "¿Cuánto debo en la tarjeta?"
  - AI calls: `getAccounts(type="credit_card")`
  - Response: "Debes $2,450,000 en tu Tarjeta Visa."

---

#### Feature 6.4: Conversation Context

**Priority:** P1 (High)
**Estimate:** 1-2 days

**Tasks:**

- [ ] Maintain conversation history
- [ ] AI remembers previous questions
- [ ] Follow-up questions work
  - User: "¿Cuánto gasté en comida?"
  - AI: "$287,500"
  - User: "¿Y el mes pasado?"
  - AI: (knows context, compares)
- [ ] Clear context option

**Acceptance Criteria:**

- AI remembers conversation
- Follow-ups work naturally
- User can start fresh chat

---

### **Epic 7: Auto-Categorization** 🏷️🤖

**Goal:** AI categorizes transactions automatically

#### Feature 7.1: AI Categorization

**Priority:** P0 (Critical)
**Estimate:** 3-4 days

**Tasks:**

- [ ] When transaction imported (no category):
  - Send description to AI
  - AI suggests category
  - AI provides confidence score (0-100%)
- [ ] Auto-apply if confidence >80%
- [ ] Suggest if confidence 50-80%
- [ ] Leave blank if <50%
- [ ] Show confidence to user
  - "AI suggested: Alimentación (85% confident)"

**Acceptance Criteria:**

- 70%+ transactions auto-categorized correctly
- User can accept/reject suggestions
- AI learns from corrections (future)

**Example:**

- Description: "EXITO BOGOTA"
  - AI: Alimentación (95% confident) ✅
- Description: "TRANSMILENIO RECARGA"
  - AI: Transporte (90% confident) ✅
- Description: "PAGO PSE"
  - AI: Unclear (<50%) → Leave blank

---

#### Feature 7.2: Batch Categorization

**Priority:** P1 (High)
**Estimate:** 2 days

**Tasks:**

- [ ] "Categorize All" button
- [ ] Process uncategorized transactions
- [ ] Show AI suggestions in list
- [ ] User reviews and approves
  - Accept all
  - Accept individually
  - Reject and manual categorize
- [ ] Apply approved categories

**Acceptance Criteria:**

- Can categorize 100+ transactions quickly
- Review process is efficient
- Changes saved correctly

---

#### Feature 7.3: Learning from Corrections (Future)

**Priority:** P2 (Low - nice to have)
**Estimate:** 3-4 days

**Tasks:**

- [ ] Track user corrections
  - "EXITO BOGOTA" → User changed to "Hogar" (not "Alimentación")
- [ ] Build user-specific patterns
- [ ] Improve suggestions over time
- [ ] Store patterns in database

**Acceptance Criteria:**

- AI learns from user
- Accuracy improves after 50+ corrections
- Personalized to user's habits

---

### **Epic 8: Dashboard** 📊

**Goal:** You can see your financial overview

#### Feature 8.1: Dashboard Layout

**Priority:** P1 (High)
**Estimate:** 2-3 days

**Tasks:**

- [ ] Create dashboard page
- [ ] Mobile-first layout
- [ ] Sections:
  1. Net worth summary
  2. Monthly overview (income vs expenses)
  3. Recent transactions (last 10)
  4. Upcoming bills
  5. Quick actions (add expense, chat with AI)
- [ ] Responsive design

**Acceptance Criteria:**

- Dashboard loads fast (<1s)
- Shows key financial info
- Mobile-optimized
- Quick actions accessible

---

#### Feature 8.2: Net Worth Summary

**Priority:** P1 (High)
**Estimate:** 1 day

**Tasks:**

- [ ] Calculate net worth
  - Sum of all accounts (checking, savings)
  - Minus credit card balances
  - Minus loans
- [ ] Display prominently
  - Large number
  - Trend (up/down from last month)
  - Percentage change
- [ ] Color coding (green if positive, red if negative)

**Acceptance Criteria:**

- Net worth calculated correctly
- Updates in real-time
- Visually clear

---

#### Feature 8.3: Monthly Overview Card

**Priority:** P1 (High)
**Estimate:** 2 days

**Tasks:**

- [ ] Calculate current month:
  - Total income
  - Total expenses
  - Net (income - expenses)
- [ ] Simple bar chart
  - Green bar (income)
  - Red bar (expenses)
- [ ] Show deficit/surplus
  - "Surplus: $50,000" (green)
  - "Deficit: -$250,000" (red)

**Acceptance Criteria:**

- Accurate calculations
- Simple, clear visualization
- Mobile-responsive

---

### **Epic 9: Simple Budgets** (Optional for v1)

**Goal:** Set spending limits per category

#### Feature 9.1: Budget Creation

**Priority:** P2 (Low - can wait for v2)
**Estimate:** 3-4 days

**Tasks:**

- [ ] Create budget page
- [ ] Set monthly budget per category
  - Category selection
  - Amount limit
  - Month selection
- [ ] Save budgets
- [ ] Show budget vs actual

**Acceptance Criteria:**

- User can set category budgets
- Budget tracked correctly
- Shows overage warnings

---

## 📊 Development Timeline (v1)

### Month 1:

- **Week 1-2:** Authentication, User Setup, File Upload
- **Week 3-4:** CSV Parsing, Account Detection, Balance Reconciliation

### Month 2:

- **Week 1-2:** Bills Tracking, Account Management, Manual Expense Entry
- **Week 3-4:** Categories, Transaction List

### Month 3:

- **Week 1-2:** AI Chat Interface, OpenAI Integration, Function Calling
- **Week 3-4:** Auto-Categorization, Dashboard

### Month 4 (Buffer/Polish):

- **Week 1:** Bug fixes, mobile optimization
- **Week 2:** Testing with your real data
- **Week 3:** Performance optimization
- **Week 4:** Documentation, deploy

---

## 🎯 Priority Guide

### P0 (Must Have - Blocks Launch):

- Authentication
- Data import & reconciliation
- Bills tracking
- Manual expense entry
- AI chat with data access
- Auto-categorization
- Basic dashboard

### P1 (Should Have - Important):

- Account management
- Transaction list
- Category management
- Dashboard charts
- Bill reminders

### P2 (Nice to Have - Can Wait):

- PDF OCR
- Learning from corrections
- Budgets
- Advanced dashboard features

---

## ✅ Definition of Done (for each feature)

A feature is DONE when:

- [ ] Code written and works
- [ ] Works on mobile (iPhone Safari, Android Chrome)
- [ ] Basic tests passing (manual testing OK for v1)
- [ ] No console errors
- [ ] You've tested it with your real data
- [ ] Documented (inline comments for complex logic)
- [ ] Committed to git

---

## 🚀 Getting Started

**First 3 features to build** (in order):

1. Authentication (signup/login)
2. User profile setup
3. File upload interface

Once those work, you can start testing with your data!

---

**Next:** Move docs to proper folder, setup claude-code-agents-toolkit, define tech stack
