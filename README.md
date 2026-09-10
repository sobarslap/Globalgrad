# GlobalGrad — Study Abroad & Scholarship Decision-Support Platform

A full-stack, AI-assisted platform that helps students make data-driven decisions about
international higher education: readiness scoring, smart university matching, scholarship
eligibility, application tracking, cost & funding analysis, visa prep, country comparison,
and an AI advisor grounded in the platform's own rule engines.

- **Live:** https://globalgrad-wheat.vercel.app
- **Stack:** Next.js 16 · React 19 · TypeScript · Tailwind v4 · PostgreSQL (Neon) · Prisma · Auth.js · Gemini · Resend · Vercel (CI/CD)

> Academic project for **CSE471 — System Analysis and Design** (BRAC University), implemented
> as a production-grade, deployable application. Data (universities, scholarships, countries,
> visa/insight content) is curated from public/official sources and must be verified against
> them before acting.

📊 **[Competitive case study](docs/CASE-STUDY.md)** — benchmarked against a comparable
competitor and engineered to match its polish and surpass it on data, architecture, and
go-to-market. · 🏗 **[Architecture](docs/ARCHITECTURE.md)**

---

## Features

Built to a 4-module, 15-feature specification, with three user roles.

### Module 1 — Matching core
- **Candidate Readiness Score** — analyzes GPA, IELTS, research and experience to score
  readiness per program tier, flagging strengths and gaps.
- **Smart University Matching** — sorts programs into **Safe / Target / Reach** from the
  readiness score and each program's selectivity.
- **Scholarship Eligibility Engine** — two-stage gates (nationality, level, field, GPA/IELTS)
  then a merit **funding-match percentage**; irrelevant awards are filtered out.
- **Country Decision Dashboard** — ranks destinations on macro factors (post-study work visa,
  living cost, part-time rights) with weightable priorities.

### Module 2 — Application flow
- **Application Strategy Builder** — one-click balanced plan (e.g. 3 Safe / 4 Target / 2 Reach).
- **Smart Document Checklist** — auto-generated per application; cycle Pending → Prepared → Submitted.
- **Application Progress Tracker** — Planned → Preparing → Applied → Interview → Offer → … → Enrolled.
- **Deadline & Requirement Monitor** — upcoming deadlines with day-countdown badges + a daily
  email digest.

### Module 3 — Insights & AI
- **Public Insight Engine** — synthesizes common advice / warnings / student experiences from
  curated, human-reviewed public sources, with inline `[n]` citations.
- **University Reality Check** — the practical stuff official pages omit, as qualitative
  indicators drawn from public information (cost of living, housing pressure, part-time
  availability, language barrier).
- **AI Study Abroad Advisor** — a Gemini chat grounded in your profile + the engines' results;
  it explains and contextualizes, but never replaces the rule-based matching.

### Module 4 — Money & feed
- **Cost of Degree Calculator** — tuition, living, visa, insurance, flights, emergency, with
  live currency conversion.
- **Funding Gap Analyzer** — budget vs. total cost, with scholarship and cheaper-country suggestions.
- **Visa Preparation Hub** — per-country documents, financial proof, timelines, fees, common mistakes.
- **Personalized Opportunity Feed** — matches, scholarships, deadlines and country insights tailored to you.

### Roles
- **Student** — everything above.
- **Content Manager** — reviews and publishes universities, programs, scholarships and insight sources.
- **Admin** — platform stats, user role management, and an audit-log feed.

---

## Architecture

```
src/
  app/
    (marketing)        # landing page
    (auth)             # sign-in / sign-up / forgot- & reset-password
    (app)              # dashboard, matches, readiness, scholarships, applications,
                       #   cost, visa, countries, reality, insights, advisor, feed,
                       #   settings, admin, content
    api/auth/[...]     # Auth.js route handler
    api/cron/deadlines # deadline email digest (Vercel Cron, secret-protected)
  components/          # ui primitives + feature blocks
  lib/
    engines/           # pure, unit-tested decision engines (readiness, matching,
                       #   scholarship, country, cost, requirements)
    actions/           # server actions (auth, profile, applications, admin,
                       #   advisor, insights, password, account) — all authz-guarded
    data/              # DB-backed loaders mapped to engine types
    ai.ts  mailer.ts  auth*.ts  db.ts  env.ts  rate-limit.ts
prisma/schema.prisma   # full domain model + Auth.js adapter models
```

**Design principle:** the decision engines are **pure functions** with unit tests; the AI
*explains* their output but never overrides it. Server actions re-validate and re-authorize
on the server — the client is never trusted.

---

## Security

This project applies the "5 pre-launch checks" (Gitleaks / Bearer / ECC / Trail of Bits) —
see [`SECURITY.md`](./SECURITY.md) for the full checklist. Highlights:

- **Auth:** Auth.js (JWT sessions), **argon2id** password hashing, Google OAuth-ready.
- **Authorization:** middleware route protection + **server-side role checks**; every mutation
  is keyed to the session user (no IDOR); roles live in the signed JWT (no privilege escalation).
- **Password reset:** random, SHA-256-hashed, single-use, 15-minute tokens; reset links use a
  trusted origin (not the request Host header) to prevent reset poisoning.
- **Hardening:** security headers + CSP, per-endpoint rate limiting, generic errors (no user
  enumeration), Zod validation on the server, parameterized Prisma queries, TLS to the database.
- **Privacy:** no PII in logs or `localStorage`; field-filtered API responses; self-service
  account deletion.
- A focused security review was run and its findings fixed.

> ⚠️ **Rotate any secret that was ever exposed.** If a database URL, `AUTH_SECRET`, or API key
> was pasted into a screenshot/chat or committed by mistake, rotate it immediately (Neon → Reset
> password; provider dashboards for API keys) and update `.env` + the Vercel env vars. Secrets
> live only in `.env*` (git-ignored) and the Vercel dashboard — never in source.

---

## Getting started (local)

Prerequisites: Node 20+, a PostgreSQL database (e.g. a free [Neon](https://neon.tech) project).

```bash
# 1. Install
npm install

# 2. Configure env — copy the template and fill in real values
cp .env.example .env        # then edit .env

# 3. Create the schema and seed demo data
npx prisma migrate dev
npm run db:seed

# 4. Run
npm run dev                 # http://localhost:3000
```

Required env vars (see `.env.example`): `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`.
Optional: `AUTH_GOOGLE_ID/SECRET` (Google login), `GEMINI_API_KEY` (AI advisor & insights),
`RESEND_API_KEY` + `EMAIL_FROM` (email), `CRON_SECRET` (deadline digest). The app degrades
gracefully when the optional keys are absent.

### Scripts
- `npm run dev` — dev server
- `npm run build` / `npm start` — production build / serve
- `npm test` — unit tests for the decision engines (Vitest)
- `npm run db:seed` — seed demo data
- `npm run lint` — ESLint

---

## Deployment

Deployed on **Vercel** from GitHub with **CI/CD** — every push to `main` builds and deploys.
The database is **Neon Postgres**; migrations are applied via Prisma. A daily **Vercel Cron**
hits `/api/cron/deadlines` (protected by `CRON_SECRET`) to send deadline digests.

---

## Tech stack

| Area | Choice |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, shadcn-style tokens, Framer Motion |
| Database / ORM | PostgreSQL (Neon), Prisma |
| Auth | Auth.js (Credentials + Google), argon2id |
| Validation / forms | Zod, React Hook Form |
| AI | Google Gemini (advisor + insight synthesis) |
| Email | Resend |
| Deploy | Vercel (CI/CD), GitHub |
| Testing | Vitest |

---

## Résumé bullets

- Built and deployed a full-stack, AI-assisted **study-abroad decision-support platform**
  (Next.js/TypeScript, PostgreSQL/Prisma, Auth.js) implementing **15 features across 4 modules**
  and **3 role-based dashboards**, live with CI/CD on Vercel.
- Designed **rule-based decision engines** (readiness scoring, Safe/Target/Reach matching,
  scholarship eligibility, country ranking, cost/funding) as pure, **unit-tested** functions,
  and layered a **Gemini AI advisor** that explains — never replaces — their output.
- Implemented **secure authentication & authorization** (argon2id, JWT, server-side RBAC,
  IDOR-safe server actions, single-use password-reset tokens) and ran a **security review**,
  fixing a host-header password-reset-poisoning vulnerability.
- Integrated **transactional email** (Resend) with a scheduled deadline-reminder cron, and a
  **cited "public insight" AI synthesis** over curated, content-manager-reviewed sources.

## License

MIT © 2026 Zubairul Islam Mahi — see [LICENSE](LICENSE).
