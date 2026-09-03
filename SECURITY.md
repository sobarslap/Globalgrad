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
- [ ] Passwords hashed with **argon2id** before storage — never stored/logged/returned plaintext.
- [ ] No PII in `console.log`, error handlers, or API responses (redact/omit).
- [ ] Session cookies `httpOnly` + `secure` + `sameSite=lax`; no PII in `localStorage`
      once the DB lands (the current pre-DB dashboard uses localStorage for the demo profile
      only — migrate to server-side StudentProfile).
- [ ] API responses field-filtered — never return password hashes or other users' rows.
- [ ] Account deletion flow removes/anonymizes all personal data.

## 3. Pre-Deploy Production Audit (ECC)
- [ ] App refuses to start if a critical env var is missing (validated env module).
- [ ] No debug endpoints (`/test`, `/debug`, `/seed`) reachable in production.
- [ ] Client errors are generic + correlation ID; stack traces server-side only.
- [ ] Security headers on every response: `X-Content-Type-Options: nosniff`,
      `X-Frame-Options: DENY`, `Strict-Transport-Security`, `Content-Security-Policy`.
- [ ] Rate limiting on auth routes (login ≥5/min/IP, password reset ≤3/hr).
- [ ] CORS restricted to the app's own origin (no `*`).
- [ ] DB connection uses TLS/SSL (`sslmode=require`) — enforced by Neon.

## 4. Deep Security Audit — auth (Trail of Bits)
- [ ] Every protected route/API checks auth (middleware) and **ownership** (no IDOR:
      a StudentProfile/Application is only accessible to its owner).
- [ ] Password reset tokens: random, single-use, ≤15 min, tied to one user.
- [ ] Sessions/JWT: strong `AUTH_SECRET`, expiry, invalidated on logout.
- [ ] Role checks (Student / Content Manager / Admin) enforced **server-side**.
- [ ] All DB access via Prisma parameterized queries (no raw string SQL).
- [ ] Inputs validated with Zod on the server, not just the client.

## 5. Attacker's Perspective Review (ECC)
- [ ] ID manipulation / IDOR swept across every id-taking endpoint.
- [ ] No endpoint works without a valid, unexpired token where auth is required.
- [ ] Privilege escalation blocked (can't reach admin routes by guessing/role-editing).
- [ ] Feature-abuse limits (mass signup, spam, upload fill) rate-limited.
- [ ] Stored-XSS: user text (SOP, bios, field names) escaped on render.
- [ ] No internal exposure (`.env`, `.git`, source maps, verbose health checks).

> Re-run check 5 (`security-review` skill) after every major feature. For real-scale
> handling of sensitive data, add a human security review before launch.
