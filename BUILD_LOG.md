# GlobalGrad — Build Log & Requirements Traceability

**One place to track everything that has been built**, mapped against the PRD.

- **PRD (source of truth):** the CSE471 "Systems Analysis and Design" functional-requirements
  specification (BRAC University, Summer 2026) — the product spec this build traces to.
- **This build:** the full platform implemented solo as Zubairul Islam's CV project ("GlobalGrad").
- **Live:** https://globalgrad-wheat.vercel.app · **Repo:** https://github.com/sobarslap/Globalgrad
- **Status:** **14 of the 15 spec features + 3 roles** done and deployed; one (Similar Student
  Finder) was deliberately removed to keep the site free of fabricated data. Post-launch = ROADMAP polish.

Companion docs: `README.md` (overview), `ROADMAP.md` (what's still worth adding), `SECURITY.md`
(security checklist). This file is the *traceability + history* record.

---

## 1. Requirements traceability matrix

Legend: ✅ done & live · 🟡 done in a lighter/curated form than the ambitious spec · ⬜ not built.

### Module 1 — Recommendation & decision core

| # | Spec feature | Status | Where it lives |
|---|--------------|--------|----------------|
| 1 | **Candidate Readiness Scorecard** — analyze profile → readiness score per tier; flag strengths/weaknesses | ✅ | Engine `src/lib/engines/readiness.ts`; shown on `/dashboard` |
| 2 | **Smart University Matching** — Safe / Target / Reach buckets from readiness | ✅ | Engine `src/lib/engines/matching.ts`; `/dashboard` results |
| 3 | **Scholarship Eligibility Engine** — matching % from nationality/GPA/research | ✅ | Engine `src/lib/engines/scholarship.ts`; `/dashboard` |
| 4 | **Country Decision Dashboard** — compare countries on work-visa / cost / part-time laws | ✅ | Engine `src/lib/engines/country.ts`; page `/countries` |

### Module 2 — Application management

| # | Spec feature | Status | Where it lives |
|---|--------------|--------|----------------|
| 1 | **Application Strategy Builder** — one-click balanced plan (3 Safe / 4 Target / 2 Reach) | ✅ | `src/lib/actions/applications.ts` (`buildBalancedPlan`); `/applications` |
| 2 | **Smart Document Checklist** — per-application 10-item checklist, Pending/Prepared/Submitted | ✅ | `applications.ts` (DEFAULT_DOCS, `setChecklistItemStatus`); `/applications` |
| 3 | **Application Progress Tracker** — statuses Planned→…→Enrolled | ✅ | `applications.ts` (`updateApplicationStatus`); `/applications` board |
| 4 | **Deadline & Requirement Monitor** — deadline alerts (+ requirement-change alerts) | 🟡 | Deadlines: `/applications` monitor + email cron `src/app/api/cron/deadlines/route.ts`. **Requirement-change detection not built** (ROADMAP A5). |

### Module 3 — Insights & AI

| # | Spec feature | Status | Where it lives |
|---|--------------|--------|----------------|
| 1 | **Public Insight Engine** — summarize public sources with citations | 🟡 | `src/lib/actions/insights.ts` + `/insights`. Uses **curated, paraphrased** public-source excerpts, AI-synthesized with `[n]` citations. **Live crawler not built** (ROADMAP A1). |
| 2 | **University Reality Check** — cost-of-living/housing/part-time/language | ✅ | Qualitative public-info indicators in `src/lib/data/reality.ts`; page `/reality` |
| 3 | **Similar Student Finder** — compare vs anonymized past applicants | ⬜ | **Removed** — it required fabricated applicant outcomes with no real public dataset to ground it; dropped for data integrity |
| 4 | **AI Study Abroad Advisor** — grounded Q&A, explains not replaces | ✅ | `src/lib/actions/advisor.ts` + `src/lib/ai.ts` (Gemini); `/advisor` |

### Module 4 — Cost, visa & feed

| # | Spec feature | Status | Where it lives |
|---|--------------|--------|----------------|
| 1 | **Cost of Degree Calculator** — tuition/living/visa/insurance/flights/emergency, editable | ✅ | Engine `src/lib/engines/cost.ts`; page `/cost` (+ FX via `src/lib/fx.ts`) |
| 2 | **Funding Gap Analyzer** — budget vs cost → scholarships / cheaper options | ✅ | `cost.ts` (`analyzeFundingGap`); `/cost` |
| 3 | **Visa Preparation Hub** — docs, financial proof, embassy links, timeline, fees, mistakes | ✅ | Curated `src/lib/data/visa.ts`; page `/visa` (US/CA/GB/DE/AU) |
| 4 | **Personalized Opportunity Feed** — profile-driven updates | ✅ | Page `/feed` (aggregates matches + scholarships + deadlines + country insight) |

### User roles (all three)

| Role | Status | Where it lives |
|------|--------|----------------|
| **Student** | ✅ | Default role; owns profile/applications/feed; all Module 1–4 student pages |
| **Content Manager** | ✅ | `/content` — publish/unpublish universities, programs, scholarships, insight sources (`src/lib/actions/admin.ts` `setContentPublished`) |
| **Admin** | ✅ | `/admin` — user management + role changes, stats, audit log (`admin.ts` `setUserRole`, `src/lib/data/admin.ts`) |

**Spec coverage: 14 of 15 features shipped** (Similar Student Finder removed for data integrity; 1 more in a deliberately lighter form — see §5), **3/3 roles**.

---

## 2. Tech stack — spec vs as-built

| Concern | Spec asked for | Built with | Note |
|---------|----------------|------------|------|
| Language | TypeScript / JS | **TypeScript** | ✅ |
| Framework | React + Express | **Next.js 16 (App Router) + React 19** | Server Actions & Route Handlers replace a separate Express API |
| Styling | TailwindCSS | **Tailwind v4** (CSS `@theme`) + shadcn-style tokens + Framer Motion | ✅ |
| Database | PostgreSQL | **Neon Postgres** (ap-southeast-1) | ✅ |
| ORM | Prisma | **Prisma 6.19** | Pinned to 6 (Prisma 7 needs driver-adapter config) |
| Auth | JWT / Google OAuth | **Auth.js (next-auth v5)** — Credentials(argon2id)+JWT; Google ready (needs creds) | ✅ (Google conditional on env) |
| Search | PG full-text | **`/search`** with filters | Keyword + filters (A2) |
| Vector search | pgvector | ⬜ | ROADMAP A1 |
| Deployment | Vercel/Render/Railway | **Vercel** (auto-deploy on push to `main`) | ✅ |
| AI | Gemini / OpenAI | **Gemini** (`gemini-flash-latest`) | ✅ |
| Email | Gmail / Resend | **Resend** | ✅ (free tier → owner inbox until domain verified) |
| Maps | Open Maps | ⬜ | ROADMAP A4 |
| Exchange rate API | yes | **open.er-api.com** (keyless, 12h cache) | ✅ |

---

## 3. Platform / infrastructure built (beyond the feature list)

- **Auth & security:** email verification gate, password reset (hashed single-use tokens),
  account deletion (cascade), Postgres-backed rate limiting, per-request role re-fetch,
  security headers + CSP in `next.config.ts`, audit logging. See `SECURITY.md`.
- **Data layer:** Prisma schema + migrations (`prisma/schema.prisma`), seed (`prisma/seed.ts`) —
  14 countries, ~53 universities, 61 real programs, 19 real scholarships,
  10 real-source insight citations, deadlines.
- **Email:** `src/lib/mailer.ts` (Resend) + daily deadline-digest cron (`vercel.json` + `/api/cron/deadlines`, fails closed without `CRON_SECRET`).
- **Testing/CI:** Vitest engine tests (readiness/matching/scholarship/cost/country/requirements, 60 green)
  + GitHub Actions (`.github/workflows/ci.yml`: install + lint + typecheck + test).
- **UX shell:** landing page, shared `app-header` + mobile slide-over nav, compare (`/compare`),
  print/PDF export, dark/light theme.
- **Knowledge graph:** `graphify-out/` (graph of `src/` for cross-session navigation).

---

## 4. History — how it was built (chronological)

| Phase | What landed | Key commits |
|-------|-------------|-------------|
| Scaffold | Next.js + Tailwind v4 + tokens + landing page; pure engines + dashboard; security baseline | `0712ab9`, `71e5cbe` |
| Database | Neon Postgres connected, initial migration + seed | `59b1fe4` |
| Auth | Auth.js email/password + DB-backed dashboard | `956966d` |
| Modules 1,2,4 + roles | Country dashboard, applications, cost/visa/feed, Admin + Content Manager | (feature commits) |
| Module 3 | AI advisor, reality check, public insight engine | incl. `f854820` |
| Deploy | GitHub + Vercel live; env vars; `postinstall: prisma generate` | (deploy phase) |
| Auth polish + email | password reset, account deletion, Resend, deadline cron | `7b19791` |
| Security hardening | rate limiting, email verification, fresh roles, CSP, audit fixes | `a4093aa` |
| Docs | SECURITY.md update + ROADMAP.md | `89de674` |
| Polish (post-launch) | mobile nav (C1) → tests+CI (B7) → search (A2) → compare + PDF (C3/C5) | `67f97a6`, `a520f75`, `0bc23dd`, `ba5d612` |
| Auth fix | defensive per-request role re-fetch; removed temp login diagnostics | `2215217`, `79809d8` |

---

## 5. Known gaps & deliberate simplifications

1. **Live crawler (A1)** — the Public Insight Engine uses *curated, paraphrased* sources instead of
   live Playwright/Cheerio scraping. Chosen for ToS/legal safety; same UX. Needs Redis + a job runner + pgvector.
2. **Requirement-change detection (A5)** — deadlines are monitored; requirement diffs (e.g. IELTS
   6.0→6.5) are not. Depends on live crawl data.
3. **pgvector semantic search** — not enabled; `/search` is keyword + filters.
4. **Maps (A4)** — not built.
5. **Google OAuth** — code path ready; needs client credentials to activate.
6. **Dataset scale** — small demo dataset (see §3); realistic but not exhaustive.

Full backlog with sizing lives in `ROADMAP.md`.

---

## 6. Quick reference — pages

`/` landing · `/dashboard` · `/matches` · `/readiness` · `/scholarships` · `/countries` ·
`/applications` · `/search` · `/compare` · `/cost` · `/visa` · `/feed` · `/advisor` · `/reality` ·
`/insights` · `/settings` · `/admin` (Admin) · `/content` (CM|Admin) ·
auth: `/sign-in` `/sign-up` `/verify-email` `/forgot-password` `/reset-password`.

*Last updated from repo state at commit `79809d8`.*
