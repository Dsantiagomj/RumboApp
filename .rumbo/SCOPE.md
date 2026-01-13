# Rumbo - Project Scope & Roadmap

> **Last Updated:** January 11, 2026 (Production-Grade Update)
> **Development Philosophy:** Solve Daniel's problem first, then build a business
> **Approach:** Production-grade personal tool → Polished product → Profitable business
> **Quality:** Zero Shortcuts - Build it RIGHT from day one 💪

---

## 🎯 Development Strategy (Production-Grade)

### Phase 0: Personal Use (Months 1-6) - PRODUCTION-GRADE FOUNDATION

**Goal:** Build what YOU need to solve YOUR financial problems - BUT BUILT RIGHT

- Focus: Your use case, your workflows, your Colombian context
- **Production-grade from day one** (no shortcuts, no technical debt)
- Beautiful, polished UI/UX (Storybook, Framer Motion)
- Full test coverage (80%+, 100% critical paths)
- CI/CD, monitoring, security from start
- **Success:** You use it daily, it's reliable, it's beautiful, it scales

### Phase 1: Product (Months 7-12)

**Goal:** Polish for other users like you

- Clean up UX, fix bugs, improve performance
- Add onboarding for new users
- Write documentation
- **Success:** 10-50 users successfully using it

### Phase 2: Business (Months 13+)

**Goal:** Turn it into a sustainable business

- Pricing model, payment integration
- Marketing, growth
- Scale infrastructure
- **Success:** Profitable, growing user base

---

## 🛹 SKATEBOARD (v1) - "Daniel's Personal Finance Tool"

**Timeline:** 3-4 months (+ 10 days upfront for production-grade foundation)
**Goal:** YOU can manage your finances better than you do today
**Audience:** Just you
**Quality bar:** Production-grade from day one - works perfectly, scales smoothly, beautiful UI

### Critical Features (What YOU need):

#### 1. **Quick Data Import** 🚀

**Your Problem:** You have months of bank statements, entering manually sucks

**Solution:**

- Upload CSV/PDF from Bancolombia, Nequi, Davivienda
- AI creates accounts automatically
- AI imports all transactions
- Confirm balances (handle mismatches)
- Create task to upload next month's report

**Success:** Your last 3-6 months of data loaded in <15 minutes

---

#### 2. **Bills Tracking** 💡

**Your Problem:** Recurring bills (electricity, internet, mobile) are easy to forget

**Solution:**

- During setup, add your recurring bills
- Codensa (electricity)
- Internet (home + mobile)
- Water, gas
- Store amount, due date, account
- Reminders before due

**Success:** You never miss a bill payment

---

#### 3. **Basic Expense Tracking**

**Your Problem:** Need to know where money is going

**Solution:**

- Manual expense entry (quick add)
- Accounts: Bancolombia savings, Nequi, credit card
- Colombian categories (Alimentación, Transporte, etc.)
- Simple list view
- Basic dashboard

**Success:** You can see your spending at a glance

---

#### 4. **AI Chat Assistant** 🤖

**Your Problem:** Want to ask questions about your finances without digging through data

**Solution:**

- Chat interface
- Ask: "¿Cuánto gasté en comida este mes?"
- Ask: "¿Cuánto debo en la tarjeta?"
- Ask: "¿Puedo pagar $100,000 más en la tarjeta este mes?"
- AI has access to your data

**Success:** You get answers in seconds

---

#### 5. **Auto-Categorization**

**Your Problem:** Categorizing 100+ imported transactions is tedious

**Solution:**

- AI suggests category based on description
- "EXITO BOGOTA" → Alimentación
- "TRANSMILENIO" → Transporte
- Learn from your corrections

**Success:** 70%+ transactions auto-categorized correctly

---

#### 6. **Simple Budget** (Optional for v1)

**Your Problem:** Want to limit spending in categories

**Solution:**

- Set monthly limits per category
- See progress (spent vs budgeted)
- Warnings when approaching limit

**Success:** You stay within your food budget

---

### What's EXPLICITLY OUT of v1:

- ❌ Receipt scanning (v2)
- ❌ Financial plans (v2)
- ❌ Goals/tasks (v2)
- ❌ Perfect UI/UX
- ❌ Onboarding for new users
- ❌ Family sharing
- ❌ Bank sync
- ❌ Public launch
- ❌ Business model
- ❌ Marketing

### v1 Success Criteria (Production-Grade):

- [ ] You upload your financial data successfully
- [ ] All your accounts and balances are correct
- [ ] You can track new expenses easily (mobile)
- [ ] AI chat answers your questions accurately
- [ ] Bills are tracked and you get reminders
- [ ] You use it at least 4x/week
- [ ] It helps you make better financial decisions
- [ ] **Lighthouse score 90+ (performance, accessibility, best practices)**
- [ ] **80%+ test coverage, 100% critical paths**
- [ ] **CI/CD pipeline working (automated tests, deployments)**
- [ ] **Monitoring active (Sentry, Plausible, Axiom)**
- [ ] **Beautiful UI (Storybook for all components)**
- [ ] **Zero critical security vulnerabilities**
- [ ] **Works flawlessly on mobile (iPhone, Android)**

---

## 🛴 SCOOTER (v2) - "Financial Recovery Tool"

**Timeline:** 2-3 months after v1
**Goal:** Get YOU out of financial deficit
**Audience:** Still mainly you, maybe a few friends
**Quality bar:** Reliable enough to share

### New Features (What YOU need next):

#### 1. **Receipt Scanning** 📸

**Your Problem:** Groceries are a huge expense, need to optimize

**Solution:**

- Camera receipt capture (mobile)
- OCR for Colombian receipts (Éxito, Carulla, D1, Ara)
- Extract items and prices
- Create expense automatically
- Store items for future grocery intelligence

**Success:** You scan every grocery receipt, takes <30 seconds

---

#### 2. **AI Financial Plan** 🤖

**Your Problem:** In deficit, don't know how to fix it

**Solution:**

- AI analyzes your situation:
  - Income: $X/month
  - Expenses: $Y/month
  - Deficit: $Z/month
  - Debts: Credit card $W
- Generates step-by-step plan:
  - Phase 1: Stop deficit (reduce groceries, transport, subscriptions)
  - Phase 2: Pay off debt (how much per month, timeline)
  - Phase 3: Build emergency fund
- Specific, actionable steps

**Success:** You have a clear plan to follow

---

#### 3. **Goals & Tasks**

**Your Problem:** Plans are useless without execution

**Solution:**

- Create goals from plan
  - "Break even by March"
  - "Pay off credit card by December"
- AI generates tasks
  - "Reduce groceries to $X this month"
  - "Pay $Y to credit card on the 15th"
- Track progress
- Check off completed tasks

**Success:** You complete tasks, make progress toward goals

---

#### 4. **Commitments & Reminders**

**Your Problem:** Easy to slip back into old habits

**Solution:**

- Make commitments
  - "I will spend max $150,000 on food this month"
- Daily/weekly check-ins
  - "You've spent $87,000 on food so far (58% of budget)"
- Reminders
  - "Payday tomorrow—pay $50,000 to credit card"
- Streak tracking

**Success:** You stay accountable, build better habits

---

#### 5. **Enhanced AI Insights**

**Your Problem:** Hard to spot trends in your own behavior

**Solution:**

- Spending trends
  - "You spent 15% less on transport this month—great!"
- Anomalies
  - "Unusual: $80,000 at Rappi—more than usual"
- Proactive suggestions
  - "Switch from Uber to Transmilenio 3x/week, save $60,000/month"

**Success:** AI catches things you miss

---

### What's STILL OUT of v2:

- ❌ Grocery intelligence (predictive, store comparison) → v3
- ❌ Family sharing → v4
- ❌ Bank sync → v5
- ❌ Perfect design
- ❌ Public launch

### v2 Success Criteria:

- [ ] You scan every grocery receipt
- [ ] You have a financial plan you believe in
- [ ] You're completing plan tasks weekly
- [ ] Your deficit is shrinking
- [ ] Your credit card balance is decreasing
- [ ] You feel more in control
- [ ] 2-3 friends/family start using it (alpha testers)

---

## 🚲 BIKE (v3) - "Grocery Optimization Engine"

**Timeline:** 3-4 months after v2
**Goal:** Maximize savings on daily purchases
**Audience:** You + alpha users (10-50 people)
**Quality bar:** Ready for early adopters

### New Features:

Now that you have 3-6 months of grocery receipts, AI can:

#### 1. **Shopping Pattern Analysis**

- Track what you buy and how often
- "You buy eggs every 8 days"
- "Coffee every 2 weeks"
- Build your shopping profile

#### 2. **Predictive Restocking**

- Predict when you'll run out
- "You'll need milk in 2 days"
- Auto-generate shopping lists
- Batch suggestions ("Go shopping Saturday for 8 items")

#### 3. **Store Price Comparison**

- Track prices at Éxito, Carulla, D1, Ara, etc.
- "Eggs: $9,000 at D1, $12,000 at Éxito → Save $3,000"
- Historical price tracking
- Best time to buy alerts

#### 4. **Product Alternatives**

- Based on your budget state
  - Tight month: "Switch to store brand rice, save $4,000"
  - Comfortable: "Try organic eggs, only $2,000 more"
- Based on health
  - "Whole wheat bread has lower glycemic index"
- Based on preferences
  - Learn what you care about (price vs quality vs health)

#### 5. **Shopping List Optimizer**

- Multi-store optimization
  - "Buy basics at D1 ($45,000), produce at Éxito ($30,000), save $8,000 vs all at Éxito"
- Route planning
  - "D1 then Éxito, 15 min total"

#### 6. **Product Health Scores**

- Nutrition info
- Toxicity warnings (trans fats, additives)
- Healthier alternatives in same price range

### v3 Success Criteria:

- [ ] Predictive restocking 80%+ accurate
- [ ] You save average $50,000+/month on groceries
- [ ] 50-100 active users
- [ ] Users report significant savings

---

## 🏍️ MOTORCYCLE (v4) - "Family Financial Management"

**Timeline:** 3-4 months after v3
**Goal:** Works for families, not just individuals
**Audience:** 100-500 users
**Quality bar:** Polished, reliable

### New Features:

- Family accounts (share with household)
- Shared budgets and goals
- Selective sharing (privacy controls)
- Family grocery planning
- Collaborative decision-making

### v4 Success Criteria:

- [ ] 30% of users use family features
- [ ] 500-1,000 active users
- [ ] Strong user retention (60%+ after 30 days)

---

## 🚗 CAR (v5) - "Complete Financial Platform"

**Timeline:** 4-6 months after v4
**Goal:** Production-ready business
**Audience:** 1,000+ users, ready for public launch
**Quality bar:** Professional, scalable

### New Features:

- Bank sync (Belvo API for Colombian banks)
- Investment tracking
- Debt optimization tools
- Colombian tax features (DIAN)
- Advanced AI (predictions, forecasting)
- Third-party integrations
- API for developers

### v5 Success Criteria:

- [ ] 1,000-5,000 active users
- [ ] Revenue-generating (subscriptions or one-time)
- [ ] Sustainable, profitable
- [ ] Ready to scale

---

## 🚀 Beyond Car: Business Evolution

### v6+ - Scale & Growth

- Marketing, SEO, content
- Expand to other Latin American countries
- Mobile apps (iOS, Android)
- Advanced features based on user feedback

---

## 📊 Development Priorities (What Gets Built When)

### Immediate (v1 - Months 1-4):

1. Data import
2. Bills tracking
3. Basic expense tracking
4. AI chat
5. Auto-categorization

### Soon (v2 - Months 5-7):

6. Receipt scanning
7. Financial planning
8. Goals & tasks
9. Accountability system

### Later (v3 - Months 8-11):

10. Grocery intelligence
11. Shopping optimization
12. Product alternatives

### Much Later (v4-v5 - Months 12-24):

13. Family features
14. Bank sync
15. Investments
16. Business model

---

## 🎯 Key Principles

### 1. Solve YOUR Problem First

Every feature must answer: **"Does this help Daniel manage his finances better?"**

If yes → Build it RIGHT (production-grade)
If no → Skip it (for now)

Once it works for you, THEN make it work for others.

### 2. Zero Shortcuts (Production-Grade)

**Build it RIGHT the first time:**

- ✅ Full test coverage (80%+, 100% critical paths)
- ✅ CI/CD pipeline (automated tests, Lighthouse, security)
- ✅ Monitoring from day one (Sentry, Plausible, Axiom)
- ✅ Beautiful UI (Storybook, Framer Motion, Design System)
- ✅ Accessibility (WCAG 2.1 AA)
- ✅ Security (OWASP Top 10)
- ✅ Self-hosted (Docker, privacy-first)

**Short-term cost:**

- 10 days upfront setup
- Slower initial feature development
- Higher discipline required

**Long-term benefit:**

- ✅ NO rework needed
- ✅ NO refactoring debt
- ✅ NO "let's rewrite this" moments
- ✅ Scales from 1 user → 10,000 users
- ✅ Easy to add features (solid foundation)
- ✅ Easy to onboard developers (clear patterns)

**This is not an MVP. This is production-ready from day one. 💪**

---

**Next:** See FEATURES_BACKLOG.md for detailed task breakdown
