# GlobalGrad — Competitive Case Study

A benchmark of **GlobalGrad** against a directly comparable competitor,
**StudyCompass** (`study-compass-bd.vercel.app`), and how GlobalGrad was
engineered to match its polish and surpass it on data, architecture, and
go-to-market.

> This document exists to make the engineering decisions legible. Figures in the
> product are curated from public/official sources and labelled "verify" — the
> same posture the competitor uses.

---

## The gap analysis

Both products implement the same brief (a study-abroad decision platform for
South-Asian applicants). A head-to-head review found StudyCompass *felt* more
finished for six specific reasons. Each was closed:

| # | Where StudyCompass led | What GlobalGrad shipped | Root cause it addressed |
|---|---|---|---|
| 1 | Coherent per-program data (tuition + CGPA + IELTS + GRE flowing into matching, cost, scholarships) | **Curated real dataset** — 61 real programs across 14 countries with real tuition/CGPA/IELTS/GRE + `minGre` schema field; one dataset feeds matching, cost, and scholarships | Seed data was synthetic (faked tuition/amounts) |
| 2 | "Why this match" reason bullets on every card | **`/matches`** cards render the readiness engine's strength/weakness `flags` (5–6 explicit reasons) | Engine already produced reasons; UI didn't surface them on a dedicated matcher |
| 3 | Rich scholarship wizard (funding, coverage, need/merit, deadline windows, flags) | **`/scholarships`** 3-step wizard + `filterScholarships` engine step over new schema fields | Scholarship model lacked funding/coverage/need-merit/renewable/deadline fields |
| 4 | Guided AI advisor (focus modes, grounding panel) | Advisor **focus modes** + **profile-grounding panel** + **deterministic free fallback** | Advisor was a plain chat with no modes and hard-failed without an API key |
| 5 | Clear tier readiness scorecard | **`/readiness`** — `scoreReadinessByTier` aggregates Top/Mid/Accessible with strengths/weaknesses/recommendations | Readiness existed per-program only, not aggregated per tier |
| 6 | One-click demo access | **"Try the demo account"** on sign-in → seeded demo student via a safe env-backed action | No frictionless evaluation path |

## Where GlobalGrad was already ahead — and pressed the advantage

- **Public, SEO-indexed marketing site** — StudyCompass is 100% login-gated (no top-of-funnel).
- **Real monetization** — live Stripe subscriptions (Free / Pro / Institution).
- **Unique decision tools** — Reality Check (qualitative cost-of-living / housing / language indicators from public info), interactive map, compare, and a public-insight feed with verifiable citations.
- **Live data pipeline** — crawler + cron + pgvector embeddings feed a RAG advisor; requirement-change tracking.
- **Production hardening** — Sentry, Upstash rate-limiting, audit log, 2FA (TOTP), email verification, argon2id hashing.
- **i18n** (English + Bangla) and **SSR/RSC** on Next.js 16.
- **Tested decision engines** — 60 unit tests across matching, readiness, cost, scholarship, country, requirements.

## Data integrity

A deliberate product decision: **no fabricated information anywhere on the site**, with student reviews the only labelled exception.

- Every catalog surface — programs, scholarships, countries, universities, visa guides — is **real data from official/public sources**, carried with a "verify" note (figures drift each admissions cycle).
- A **synthetic "Similar Student Finder"** (randomly-generated applicant outcomes) was **removed entirely** rather than shipped as if real — there is no public dataset of anonymized applicant results to ground it.
- **Reality Check** was rebuilt from invented 1–5 numeric ratings into **honest qualitative indicators** (Low/Moderate/High) drawn from broadly-known public information, with a "general guidance, verify" disclaimer.
- **Public Insights** cites **only real, verifiable URLs** (gov/embassy/official sites and named forums); every AI-synthesized claim carries an inline `[n]` citation, and the model declines to invent content its sources don't cover.
- The one illustrative marketing visual (a sample "Match report") is explicitly labelled **Example**.

This trades two flashy-but-fake features for a product a recruiter can trust end to end — the more defensible engineering story.

---

## Engineering highlights (résumé-ready)

- Built a **rule-based decision-engine layer** (matching, readiness, cost, scholarship, country, requirements) as pure, framework-agnostic TypeScript with **60 unit tests** — deterministic, explainable admissions guidance (Safe/Target/Reach with per-program reasoning).
- Designed a **curated real dataset** (programs, scholarships, country macro-data) with a Prisma seed, an **additive Postgres migration**, and a **hybrid live-refresh pipeline** (crawler + cron + pgvector) that keeps content current.
- Implemented a **RAG AI advisor** (Gemini) with focus modes, profile grounding, and a **graceful deterministic fallback** so the product degrades to still-useful, engine-grounded answers with zero API keys.
- Shipped **Stripe subscriptions**, **Auth.js** (credentials + Google, 2FA, email verification), **i18n**, **Sentry**, and **Upstash** rate-limiting on **Next.js 16 (RSC + server actions)**, deployed on Vercel with CI/CD.

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the system diagram and data flow.
