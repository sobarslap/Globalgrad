import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail, emailShell } from "@/lib/mailer";

/**
 * Deadline & Requirement Monitor email digest (Module 2, F4).
 * Intended to run daily via Vercel Cron. Protected by CRON_SECRET — Vercel Cron
 * injects `Authorization: Bearer <CRON_SECRET>` automatically when it's set.
 * No-ops safely if RESEND_API_KEY is unset (mailer skips).
 */
export async function GET(req: Request) {
  // Fail closed: without a configured secret the endpoint is disabled, and with
  // one the caller must present it (Vercel Cron injects it automatically).
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = Date.now();
  const horizon = new Date(now + 14 * 24 * 60 * 60 * 1000);

  // Applications whose program has a deadline within the next 14 days.
  const apps = await db.application.findMany({
    where: {
      status: { notIn: ["ENROLLED", "REJECTED"] },
      program: { deadlines: { some: { dueDate: { gte: new Date(), lte: horizon } } } },
    },
    include: {
      user: { select: { email: true, name: true } },
      program: {
        include: {
          university: { select: { name: true } },
          deadlines: { where: { dueDate: { gte: new Date(), lte: horizon } } },
        },
      },
    },
  });

  // Group upcoming deadlines by user into a single digest.
  const byUser = new Map<
    string,
    { name: string | null; items: { title: string; days: number }[] }
  >();
  for (const a of apps) {
    const entry = byUser.get(a.user.email) ?? {
      name: a.user.name,
      items: [],
    };
    for (const d of a.program.deadlines) {
      const days = Math.ceil((d.dueDate.getTime() - now) / (24 * 60 * 60 * 1000));
      entry.items.push({
        title: `${a.program.university.name} — ${a.program.programName}`,
        days,
      });
    }
    byUser.set(a.user.email, entry);
  }

  const esc = (s: string) =>
    s.replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
    );

  let sent = 0;
  for (const [email, { name, items }] of byUser) {
    if (items.length === 0) continue;
    items.sort((x, y) => x.days - y.days);
    const rows = items
      .map(
        (i) =>
          `<li>${esc(i.title)} — <strong>${i.days} day${i.days === 1 ? "" : "s"}</strong> left</li>`
      )
      .join("");
    const res = await sendEmail({
      to: email,
      subject: "Upcoming study-abroad deadlines",
      html: emailShell(
        `Deadlines coming up${name ? `, ${esc(name)}` : ""}`,
        `<p>You have deadlines within the next two weeks:</p><ul>${rows}</ul>
         <p>Review them in your <a href="https://globalgrad-wheat.vercel.app/applications" style="color:#7c3aed">Applications</a>.</p>`
      ),
    });
    if (res.ok) sent += 1;
  }

  return NextResponse.json({ users: byUser.size, emailsSent: sent });
}
