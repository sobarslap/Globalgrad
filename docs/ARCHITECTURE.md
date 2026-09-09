# GlobalGrad — Architecture

## Stack

- **Framework:** Next.js 16 (App Router, React Server Components + Server Actions), React 19, TypeScript.
- **UI:** Tailwind CSS v4, custom shadcn-style primitives, framer-motion.
- **Data:** PostgreSQL (Neon) via Prisma; `pgvector(768)` for semantic retrieval.
- **Auth:** Auth.js (NextAuth) — credentials (argon2id) + Google, email verification, TOTP 2FA.
- **AI:** Gemini (advisor + embeddings) with a deterministic engine-only fallback.
- **Billing:** Stripe (subscriptions, webhook-driven).
- **Infra:** Vercel (CI/CD, Cron), Upstash Redis (rate limiting), Sentry (observability), UploadThing (files), Resend (email).
- **i18n:** next-intl (English, Bangla).

## Layered design

```
┌──────────────────────────────────────────────────────────────┐
│  App Router (RSC pages + Server Actions)                       │
│  /matches /readiness /scholarships /advisor /cost /dashboard … │
└───────────────┬───────────────────────────┬──────────────────┘
                │                            │
      ┌─────────▼─────────┐        ┌─────────▼──────────┐
      │  Decision engines │        │  Data access layer │
      │  (pure TS + tests)│◄───────│  src/lib/data/*    │
      │  matching         │        │  (Prisma + cache)  │
      │  readiness (tiers)│        └─────────┬──────────┘
      │  scholarship+filt.│                  │
      │  cost, country,   │        ┌─────────▼──────────┐
      │  similar          │        │  PostgreSQL (Neon) │
      └───────────────────┘        │  + pgvector        │
                                    └─────────┬──────────┘
      ┌───────────────────┐                  │
      │  RAG AI advisor   │  grounding ◄──────┘
      │  Gemini + fallback│
      └───────────────────┘

  Live pipeline:  Vercel Cron ─► crawler ─► InsightSource (+embeddings)
                  Vercel Cron ─► deadline digest (email)
                  Content edits ─► RequirementChange ─► notifications
```

## Key data flow — university matching

1. `getMyProfile()` loads the signed-in student's `StudentProfile`.
2. `getPublishedPrograms()` returns curated real programs (Prisma → domain type, cached with `unstable_cache`, tag `catalog`).
3. `matchPrograms(profile, programs)` runs `scoreReadiness` per program → Safe/Target/Reach buckets, each `ProgramMatch` carrying explanatory `flags` (incl. the GRE gate).
4. `/matches` renders tier tabs + filters + cards; each card shows the `flags` as "why this match".

## Real data + hybrid refresh

- **Curated base:** `prisma/data/{programs,scholarships,countries}.real.ts` → `prisma/seed.ts`. Real tuition/CGPA/IELTS/GRE and rich scholarship fields (funding, coverage, need/merit, renewable, deadline).
- **Live refresh:** the crawler + `/api/cron/*` routes keep insights fresh and detect requirement changes; the Hipolabs catalog powers the 22-country university browse.

## Graceful AI degradation

`buildAdvisorContext` returns both the LLM prompt **and** a deterministic
`fallback` composed purely from engine outputs. If `GEMINI_API_KEY` is unset or
the model errors/rate-limits, the advisor streams the grounded fallback instead
of failing — the demo never dead-ends.
