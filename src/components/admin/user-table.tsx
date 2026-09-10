"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@prisma/client";
import type { UserRow } from "@/lib/data/admin";
import { setUserRole } from "@/lib/actions/admin";

const ROLES: Role[] = ["STUDENT", "CONTENT_MANAGER", "ADMIN"];
const roleLabel = (r: string) =>
  r
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const selectCls =
  "h-8 rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50";

export function UserTable({
  users,
  currentUserId,
}: {
  users: UserRow[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  const change = (id: string, role: Role) =>
    start(async () => {
      const res = await setUserRole(id, role);
      if (!res.ok) setErr(res.error ?? "Failed.");
      else setErr(null);
      router.refresh();
    });

  return (
    <div className="overflow-x-auto rounded-2xl border border-border/60">
      {err && <p className="p-3 text-sm text-destructive">{err}</p>}
      <table className="w-full text-sm">
        <thead className="border-b border-border/60 text-left text-muted-foreground">
          <tr>
            <th className="p-3 font-medium">User</th>
            <th className="p-3 font-medium">Apps</th>
            <th className="p-3 font-medium">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-border/40 last:border-0">
              <td className="p-3">
                <div className="font-medium">{u.name ?? "—"}</div>
                <div className="text-xs text-muted-foreground">{u.email}</div>
              </td>
              <td className="p-3 text-muted-foreground">{u.applications}</td>
              <td className="p-3">
                {u.id === currentUserId ? (
                  <span className="text-xs text-muted-foreground">
                    {roleLabel(u.role)} (you)
                  </span>
                ) : (
                  <select
                    className={selectCls}
                    value={u.role}
                    disabled={pending}
                    onChange={(e) => change(u.id, e.target.value as Role)}
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {roleLabel(r)}
                      </option>
                    ))}
                  </select>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
