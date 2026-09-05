"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import type { NotificationView } from "@/lib/data/notifications";
import {
  markNotificationRead,
  markAllNotificationsRead,
} from "@/lib/actions/notifications";

function timeAgo(d: Date): string {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function NotificationBell({
  initial,
  unread,
}: {
  initial: NotificationView[];
  unread: number;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(initial);
  const [count, setCount] = useState(unread);
  const [, startTransition] = useTransition();
  const router = useRouter();

  function openItem(n: NotificationView) {
    if (!n.read) {
      setItems((prev) => prev.map((i) => (i.id === n.id ? { ...i, read: true } : i)));
      setCount((c) => Math.max(0, c - 1));
      startTransition(() => {
        void markNotificationRead(n.id);
      });
    }
    setOpen(false);
    if (n.href) router.push(n.href);
  }

  function markAll() {
    setItems((prev) => prev.map((i) => ({ ...i, read: true })));
    setCount(0);
    startTransition(() => {
      void markAllNotificationsRead();
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={`Notifications${count > 0 ? ` (${count} unread)` : ""}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <Bell className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-lg border border-border/60 bg-background shadow-lg">
            <div className="flex items-center justify-between border-b border-border/50 px-3 py-2">
              <span className="text-sm font-medium">Notifications</span>
              {count > 0 && (
                <button
                  type="button"
                  onClick={markAll}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {items.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                  You&rsquo;re all caught up.
                </p>
              ) : (
                items.map((n) => {
                  const inner = (
                    <div
                      className={`flex flex-col gap-0.5 px-3 py-2.5 transition-colors hover:bg-accent ${
                        n.read ? "" : "bg-accent/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-medium leading-snug">{n.title}</span>
                        {!n.read && (
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                        )}
                      </div>
                      {n.body && (
                        <span className="text-xs text-muted-foreground">{n.body}</span>
                      )}
                      <span className="text-[10px] text-muted-foreground">
                        {timeAgo(n.createdAt)}
                      </span>
                    </div>
                  );
                  return (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => openItem(n)}
                      className="block w-full border-b border-border/40 text-left last:border-0"
                    >
                      {inner}
                    </button>
                  );
                })
              )}
            </div>
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="block border-t border-border/50 px-3 py-2 text-center text-xs text-muted-foreground hover:text-foreground"
            >
              Notification settings
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
