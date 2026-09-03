# Security — GlobalGrad

This project applies the **5 pre-launch security checks** (Gitleaks / Bearer / ECC
Production Audit / Trail of Bits / ECC Attacker Review). Status is tracked here and
re-verified with the `security-review` skill before any deploy. This app has
**custom email/password + Google OAuth auth and personalized student data** (no payments).

## 1. Secret Leak Prevention (Gitleaks)
- [x] `.env*` is git-ignored; no secret is a string literal in source.
- [x] `.env.example` documents required vars with placeholder values only.
- [ ] All secrets (DATABASE_URL, AUTH_SECRET, Google client secret, AI + Resend keys)
      live in env vars, read server-side only.
- [ ] No sensitive value uses a `NEXT_PUBLIC_` prefix (only genuinely public values may).
- [ ] README warns to rotate any previously committed secret.

## 2. Personal Data Flow Audit (Bearer)
- Data collected: email, password (hashed), name, and academic profile
  (CGPA, IELTS, nationality, field, experience).
- [x] Passwords hashed with **argon2id** before storage (`src/lib/password.ts`) —
      never stored/logged/returned plaintext (verified against Neon).
- [x] No PII in `console.log`; auth `authorize` returns only id/email/name/role (no hash).
- [x] Session cookies `httpOnly` + `sameSite=lax` (Auth.js default; `secure` in prod).
      Dashboard profile moved from `localStorage` to server-side `StudentProfile`.
- [x] `authorize` never returns the password hash; catalog loaders map only public fields.
- [ ] Account deletion flow removes/anonymizes all personal data. (TODO)

## 3. Pre-Deploy Production Audit (ECC)
- [ ] App refuses to start if a critical env var is missing (validated env module).
- [ ] No debug endpoints (`/test`, `/debug`, `/seed`) reachable in production.
- [ ] Client errors are generic + correlation ID; stack traces server-side only.
- [x] Security headers on every response (`next.config.ts`): nosniff, X-Frame-Options
      DENY, Referrer-Policy, Permissions-Policy, CSP; HSTS in production.
- [x] Rate limiting on auth actions (login 5/min/IP, signup 5/15min/IP;
      `src/lib/rate-limit.ts`). NOTE: in-memory/per-instance — swap for Upstash Redis
      for multi-instance production.
- [x] Same-origin (Next server actions/route handlers); no wildcard CORS.
- [x] DB connection uses TLS (`sslmode=require`) — enforced by Neon.

## 4. Deep Security Audit — auth (Trail of Bits)
- [x] Protected routes gated by middleware; `saveProfile`/`getMyProfile` key rows by
      the **session** user id only — a client can't target another user (no IDOR).
- [ ] Password reset tokens: random, single-use, ≤15 min, tied to one user. (model
      `PasswordResetToken` exists; flow not built yet — TODO)
- [x] Sessions/JWT: strong `AUTH_SECRET`, JWT strategy, invalidated on logout (signOut).
- [x] Role checks enforced **server-side** in middleware (`/admin` ADMIN, `/content`
      CONTENT_MANAGER|ADMIN) via the edge-safe `authorized` callback.
- [x] All DB access via Prisma parameterized queries (no raw SQL).
- [x] Inputs re-validated with Zod on the server (sign-up + saveProfile), not just client.

## 5. Attacker's Perspective Review (ECC)
- [ ] ID manipulation / IDOR swept across every id-taking endpoint.
- [ ] No endpoint works without a valid, unexpired token where auth is required.
- [x] Privilege escalation blocked: middleware gates /admin & /content by role AND
      every admin/content server action re-checks role (defense in depth); role lives
      in the signed JWT, not client-editable. Verified: student redirected off /admin.
- [ ] Feature-abuse limits (mass signup, spam, upload fill) rate-limited.
- [ ] Stored-XSS: user text (SOP, bios, field names) escaped on render.
- [ ] No internal exposure (`.env`, `.git`, source maps, verbose health checks).

> Re-run check 5 (`security-review` skill) after every major feature. For real-scale
> handling of sensitive data, add a human security review before launch.
