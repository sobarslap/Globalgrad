# GlobalGrad — Roadmap

The 15 spec features, 3 roles, AI, email, deploy/CI and a security pass are done and
live. This roadmap plans everything **still worth adding**, grouped and sized
(**S** ≈ hours, **M** ≈ a day, **L** ≈ multiple days). "Dep" = external dependency needed.

---

## A. Complete the remaining spec features

### A1. Public Insight Engine — real crawler (**L**)
Today the insight engine synthesizes from *curated* sources. The full spec collects from
live public sources.
- **Approach:** background workers (BullMQ + Redis) running Playwright/Cheerio to fetch
  university FAQs, embassy pages, blogs, forums and YouTube transcripts → clean → store as
  `InsightSource` (unpublished) → Content Manager reviews → publish. Add **pgvector**
  embeddings for semantic retrieval so the AI cites the most relevant passages.
- **Why lighter first:** live scraping is brittle and ToS/law-sensitive; the curated
  version demos the same UX safely. Add the crawler only for whitelisted, ToS-compliant
  sources with rate limits and caching.
- **Dep:** Redis (Upstash), pgvector (Neon supports it), a job runner.

### A2. University / scholarship search (**M**)
No search exists yet (only matching).
- **Approach:** PostgreSQL full-text search (`tsvector`) for keyword search, optionally
  pgvector for semantic "find programs like…". A `/search` page with filters (country,
  field, level, tuition, deadline).

### A3. Document uploads (**M**)
The checklist tracks status only; students can't upload files.
- **Approach:** UploadThing or S3-compatible storage; validate type/size server-side,
  store per user with ownership checks, never serve executable content from the app origin.
- **Dep:** a storage provider (UploadThing free tier).

### A4. Maps (**S–M**)
Spec mentions OpenStreetMap.
- **Approach:** Leaflet + OpenStreetMap tiles (no key) to plot universities/countries on
  the Country Dashboard and program pages.

### A5. Requirement-change detection (**M**)
The Deadline & Requirement Monitor shows deadlines but doesn't detect requirement changes
(e.g. IELTS 6.0 → 6.5).
- **Approach:** snapshot each program's requirements; a scheduled job diffs against the
  latest crawl/edit and emits a change alert + email. Depends on A1 for live data.

### A6. Admin: crawler control & subscriptions (**M**)
Spec mentions admin crawler control and optional subscriptions.
- **Approach:** an admin panel to enable/disable crawl sources and view job runs;
  subscription tier gating if the app is ever monetized (Stripe).

---

## B. Security & robustness hardening

### B1. Nonce-based CSP (**M**)
`'unsafe-inline'` is still allowed (Next needs it). Move to a **nonce + strict-dynamic**
CSP via middleware to fully close inline-script risk. Test carefully with the App Router.

### B2. Two-factor authentication (**M**)
TOTP (authenticator apps) for accounts, especially Admin/Content Manager.
- **Approach:** `otplib` + a `twoFactorSecret` on the user; challenge after password.

### B3. Distributed rate limiting via Upstash (**S**)
The current limiter is Postgres-backed (works, adds DB writes). For scale, move hot paths
to Upstash Redis (`@upstash/ratelimit`).
- **Dep:** Upstash (free tier).

### B4. Observability & alerting (**S–M**)
No error tracking today.
- **Approach:** Sentry for errors + performance; structured logging; alert on auth
  anomalies (spikes in failed logins / resets).

### B5. Stable, monitored AI credentials (**S**)
The current Gemini key is an `AQ.` OAuth-style token that could be short-lived.
- **Approach:** confirm/rotate to a long-lived key, add a health check + graceful "AI
  temporarily unavailable" state (already partially handled), and monitor 401/503 rates.

### B6. Dependency stabilization + Dependabot (**S**)
`next-auth@5` is beta. Pin versions, enable Dependabot/`npm audit` in CI, upgrade when
stable.

### B7. More automated tests (**M**)
Only readiness/matching/scholarship engines are unit-tested.
- **Approach:** unit tests for cost/country/similar engines; **Playwright E2E** for
  sign-up → verify → sign-in → profile → matching → applications; a GitHub Actions CI
  job running lint + typecheck + tests on every PR.

---

## C. UX & polish

### C1. Mobile navigation (**S**) — highest-value quick win
The header nav is hidden below `lg` with **no hamburger menu**, so on phones the app's
pages are only reachable by URL.
- **Approach:** a slide-over mobile menu (Radix Dialog / a Sheet) listing all links.

### C2. Accessibility & Lighthouse pass (**M**)
Audit labels, focus states, colour contrast, keyboard nav, reduced-motion; fix and target
90+ Lighthouse across the board.

### C3. Compare universities side-by-side (**S–M**)
Select 2–4 programs and compare readiness, cost, deadlines, reality-check and country in
one table.

### C4. Application calendar / timeline (**S–M**)
A calendar view of deadlines and application statuses across all tracked programs.

### C5. Export plan to PDF (**S**)
Export the balanced application plan + cost estimate + checklist as a shareable PDF.

### C6. In-app notifications (**M**)
A `Notification` model + a bell menu for deadline reminders, requirement changes and new
matches (complements email).

### C7. Streaming AI responses (**S**)
Stream the advisor's answer token-by-token for a snappier feel.

### C8. Internationalization (**M**)
`next-intl` for multi-language support (relevant for an international audience).

---

## D. Data & scale

### D1. Real, larger dataset (**M**)
Currently 8 universities / 6 scholarships / 7 countries / 20 synthetic applicants. Expand
to a broad, real (or realistically-modelled) dataset; make the Similar Student Finder use
embeddings over a larger anonymized pool.

### D2. Caching & performance (**S–M**)
Cache catalog reads, memoize engine runs, add DB indexes as data grows, and consider
`unstable_cache`/ISR for public pages.

---

## Suggested order (highest impact first)

1. **C1 mobile nav** (quick, very visible)
2. **B7 tests + CI** and **B4 Sentry** (confidence + professionalism)
3. **A2 search** and **A3 uploads** (rounds out the core product)
4. **A4 maps**, **C3 compare**, **C4 calendar**, **C5 PDF** (UX depth)
5. **A1 crawler + pgvector** and **A5 requirement detection** (the ambitious finale)
6. **B1 nonce CSP**, **B2 2FA**, **B3 Upstash**, **B6 deps** (hardening for real use)
