/**
 * Email sender via Resend (REST). Server-only. No-ops safely when RESEND_API_KEY
 * is not set, so flows that trigger email don't break in dev/preview. Never logs
 * recipient PII or the API key.
 */
export interface SendResult {
  ok: boolean;
  skipped?: boolean;
  error?: string;
}

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  /** Optional Reply-To — e.g. route replies to a contact-form sender. */
  replyTo?: string;
}): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, skipped: true };

  const from = process.env.EMAIL_FROM || "GlobalGrad <onboarding@resend.dev>";
  // Bound the request so a hung Resend endpoint can't stall the caller (a server
  // action) indefinitely.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        from,
        to: params.to,
        subject: params.subject,
        html: params.html,
        ...(params.replyTo ? { reply_to: params.replyTo } : {}),
      }),
      cache: "no-store",
      signal: controller.signal,
    });
    if (!res.ok) {
      console.error(`[mailer] resend status=${res.status}`);
      return { ok: false, error: "Email failed to send." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Email service unreachable." };
  } finally {
    clearTimeout(timeout);
  }
}

/** Small helper for consistent, simple HTML emails. */
export function emailShell(title: string, body: string): string {
  return `<div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#111">
    <h2 style="margin:0 0 12px">${title}</h2>
    ${body}
    <p style="margin-top:24px;font-size:12px;color:#888">GlobalGrad — Study Abroad &amp; Scholarship Planning</p>
  </div>`;
}
