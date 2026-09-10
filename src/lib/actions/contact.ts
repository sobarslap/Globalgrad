"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { sendEmail, emailShell } from "@/lib/mailer";
import { SITE } from "@/lib/site";

export type ContactState = { ok?: boolean; error?: string; message?: string };

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email."),
  topic: z.string().trim().max(60).optional(),
  message: z
    .string()
    .trim()
    .min(10, "Tell me a little more (at least 10 characters).")
    .max(4000),
  // Honeypot: real users never fill this; bots often do.
  company: z.string().max(0).optional(),
});

const escapeHtml = (v: string) =>
  v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Contact form handler. Validates input, rate-limits by IP, drops silent-spam
 * (honeypot), and emails the message to the site inbox with the sender set as
 * Reply-To so a reply goes straight back to them. Never reveals whether email
 * delivery is configured — the visitor always sees the same success state.
 */
export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const ip = clientIp(await headers());
  const rl = await rateLimit(`contact:${ip}`, 5, 60 * 60 * 1000); // 5 / hour / IP
  if (!rl.ok)
    return {
      error: `You've sent a few messages already. Try again in ${rl.retryAfterSec}s.`,
    };

  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    topic: formData.get("topic"),
    message: formData.get("message"),
    company: formData.get("company"),
  });

  if (!parsed.success) {
    // A tripped honeypot fails `company: max(0)`; treat as success, send nothing.
    const honeypot = String(formData.get("company") ?? "").length > 0;
    if (honeypot) return { ok: true, message: sentMessage };
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  const { name, email, topic, message } = parsed.data;

  await sendEmail({
    to: SITE.email,
    replyTo: email,
    subject: `New message from ${name}${topic ? ` — ${topic}` : ""}`,
    html: emailShell(
      "New contact message",
      `<p style="margin:0 0 4px"><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
       ${topic ? `<p style="margin:0 0 4px"><strong>Topic:</strong> ${escapeHtml(topic)}</p>` : ""}
       <p style="margin:12px 0 4px"><strong>Message:</strong></p>
       <p style="white-space:pre-wrap;margin:0">${escapeHtml(message)}</p>`
    ),
  });

  return { ok: true, message: sentMessage };
}

const sentMessage =
  "Thanks — your message is on its way. I read every one and usually reply within a day.";
