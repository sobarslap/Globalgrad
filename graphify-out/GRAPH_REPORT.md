# Graph Report - Study Abroad  (2026-09-05)

## Corpus Check
- Corpus is ~35,835 words - fits in a single context window. You may not need a graph.

## Summary
- 587 nodes · 1255 edges · 28 communities (23 shown, 5 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 65 edges (avg confidence: 0.53)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Product Features & Modules
- Dashboard, Seed & Scoring
- Authentication & Security
- Password Reset & Form Pages
- Landing Page & Countries
- Runtime Dependencies
- Roles, Admin & PRD
- Build Tooling & Dev Deps
- TypeScript Config
- Cost Calculator & Funding
- Reality Check & Compare
- Similar Student Finder
- Navigation & Settings
- Public Insight Engine
- Visa Preparation Hub
- Root Layout & Theming
- Auth Type Definitions
- Security Headers & CSP
- ESLint Config
- PostCSS Config
- Vercel Cron Config
- Prompting Reference
- Auth Route Handlers

## God Nodes (most connected - your core abstractions)
1. `Button` - 25 edges
2. `cn()` - 20 edges
3. `db` - 18 edges
4. `getMyProfile()` - 17 edges
5. `compilerOptions` - 16 edges
6. `AppHeader()` - 15 edges
7. `askAdvisor()` - 13 edges
8. `rateLimit()` - 13 edges
9. `Input` - 12 edges
10. `StudentProfile` - 12 edges

## Surprising Connections (you probably didn't know these)
- `Feature: Candidate Readiness Scorecard` --surfaced_on--> `DashboardPage()`  [INFERRED]
  docs/Group2_ssignment 01 Functional Requirements.pdf → src/app/(app)/dashboard/page.tsx
- `Feature: Scholarship Eligibility Engine` --surfaced_on--> `DashboardPage()`  [INFERRED]
  docs/Group2_ssignment 01 Functional Requirements.pdf → src/app/(app)/dashboard/page.tsx
- `Feature: Personalized Opportunity Feed` --surfaced_on--> `FeedPage()`  [INFERRED]
  docs/Group2_ssignment 01 Functional Requirements.pdf → src/app/(app)/feed/page.tsx
- `Feature: Deadline & Requirement Monitor` --implemented_by--> `GET()`  [INFERRED]
  docs/Group2_ssignment 01 Functional Requirements.pdf → src/app/api/cron/deadlines/route.ts
- `Feature: Cost of Degree Calculator` --implemented_by--> `computeCost()`  [INFERRED]
  docs/Group2_ssignment 01 Functional Requirements.pdf → src/lib/engines/cost.ts

## Import Cycles
- None detected.

## Communities (28 total, 5 thin omitted)

### Community 0 - "Product Features & Modules"
Cohesion: 0.05
Nodes (67): Feature: AI Study Abroad Advisor, Feature: Cost of Degree Calculator, Feature: Funding Gap Analyzer, Feature: Personalized Opportunity Feed, Feature: Smart University Matching, Feature: Application Strategy Builder, Feature: Smart Document Checklist, Feature: Application Progress Tracker (+59 more)

### Community 1 - "Dashboard, Seed & Scoring"
Cohesion: 0.07
Nodes (47): Feature: Candidate Readiness Scorecard, Feature: Scholarship Eligibility Engine, CI workflow, Engine Tests + CI, db, levelMap, NOTE: staff (Admin / Content Manager) accounts are intentionally NOT seeded., universityCountry (+39 more)

### Community 2 - "Authentication & Security"
Cohesion: 0.07
Nodes (42): Auth & Session Security, Email (Resend), Rate Limiting, Reference: Emergent Security Prompts, GET(), ForgotPasswordPage(), SignInPage(), SignUpPage() (+34 more)

### Community 3 - "Password Reset & Form Pages"
Cohesion: 0.10
Nodes (35): initial, metadata, initial, ResetForm(), initial, initial, metadata, initial (+27 more)

### Community 4 - "Landing Page & Countries"
Cohesion: 0.06
Nodes (33): Feature: Country Decision Dashboard, CountriesPage(), metadata, FeaturesSection(), flagship, secondary, HowItWorks(), steps (+25 more)

### Community 5 - "Runtime Dependencies"
Cohesion: 0.05
Nodes (41): @auth/prisma-adapter, class-variance-authority, clsx, framer-motion, @hookform/resolvers, lucide-react, motion, next (+33 more)

### Community 6 - "Roles, Admin & PRD"
Cohesion: 0.09
Nodes (31): BUILD_LOG.md (traceability), GlobalGrad Platform, PRD: Study Abroad Functional Requirements, Role: Admin, Role: Content Manager, Role: Student, AdminPage(), metadata (+23 more)

### Community 7 - "Build Tooling & Dev Deps"
Cohesion: 0.05
Nodes (37): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, prisma, tailwindcss, @tailwindcss/postcss (+29 more)

### Community 8 - "TypeScript Config"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 9 - "Cost Calculator & Funding"
Cohesion: 0.15
Nodes (16): CostCalculator(), defaults, fields, Props, CostProgram, analyzeFundingGap(), computeCost(), CostBreakdown (+8 more)

### Community 10 - "Reality Check & Compare"
Cohesion: 0.16
Nodes (12): Feature: University Reality Check, ComparePage(), label(), metadata, toIds(), metadata, RealityPage(), CompareProgram (+4 more)

### Community 11 - "Similar Student Finder"
Cohesion: 0.17
Nodes (13): Feature: Similar Student Finder, metadata, SimilarPage(), getAnonymizedApplicants(), ApplicantOutcomeRecord, ApplicantRecord, eqCI(), findSimilar() (+5 more)

### Community 12 - "Navigation & Settings"
Cohesion: 0.19
Nodes (11): metadata, roleLabel(), SettingsPage(), primaryNav, secondaryNav, MobileNav(), MobileNavItem, MoreMenu() (+3 more)

### Community 13 - "Public Insight Engine"
Cohesion: 0.29
Nodes (9): Feature: Public Insight Engine, InsightsPage(), metadata, InsightExplorer(), InsightResult, summarizeInsights(), getInsightCountries(), getInsightSources() (+1 more)

### Community 14 - "Visa Preparation Hub"
Cohesion: 0.36
Nodes (6): Feature: Visa Preparation Hub, metadata, VisaPage(), VisaHub(), VISA_GUIDES, VisaGuide

### Community 15 - "Root Layout & Theming"
Cohesion: 0.33
Nodes (4): geistMono, geistSans, metadata, ThemeProvider()

### Community 16 - "Auth Type Definitions"
Cohesion: 0.29
Nodes (6): AppRole, JWT, next-auth, next-auth/jwt, Session, User

### Community 17 - "Security Headers & CSP"
Cohesion: 0.50
Nodes (3): csp, nextConfig, securityHeaders

## Knowledge Gaps
- **188 isolated node(s):** `eslintConfig`, `csp`, `securityHeaders`, `nextConfig`, `name` (+183 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Button` connect `Password Reset & Form Pages` to `Product Features & Modules`, `Landing Page & Countries`, `Roles, Admin & PRD`, `Reality Check & Compare`, `Navigation & Settings`, `Public Insight Engine`, `Visa Preparation Hub`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Why does `db` connect `Authentication & Security` to `Product Features & Modules`, `Dashboard, Seed & Scoring`, `Password Reset & Form Pages`, `Roles, Admin & PRD`, `Reality Check & Compare`, `Similar Student Finder`, `Public Insight Engine`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `cn()` connect `Password Reset & Form Pages` to `Landing Page & Countries`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `csp`, `securityHeaders` to the rest of the system?**
  _188 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Product Features & Modules` be split into smaller, more focused modules?**
  _Cohesion score 0.05462962962962963 - nodes in this community are weakly interconnected._
- **Should `Dashboard, Seed & Scoring` be split into smaller, more focused modules?**
  _Cohesion score 0.06944444444444445 - nodes in this community are weakly interconnected._
- **Should `Authentication & Security` be split into smaller, more focused modules?**
  _Cohesion score 0.07456140350877193 - nodes in this community are weakly interconnected._