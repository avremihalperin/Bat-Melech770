"use client";

import Link from "next/link";
import { useState } from "react";

type Branch = { id: string; name: string };

export function BranchList({ branches }: { branches: Branch[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-2">
      {branches.map((b) => (
        <div
          key={b.id}
          className="rounded-xl border-2 border-primary/30 bg-card overflow-hidden"
        >
          {/* מובייל: כותרת נפתחת (אקורדיון) */}
          <div className="sm:hidden">
            <button
              type="button"
              onClick={() => setOpenId((id) => (id === b.id ? null : b.id))}
              className="flex w-full items-center justify-between gap-2 px-4 py-3 text-start font-medium text-foreground hover:bg-primary/5"
              aria-expanded={openId === b.id}
            >
              <span>{b.name}</span>
              <span
                className={`shrink-0 text-primary transition-transform ${openId === b.id ? "rotate-180" : ""}`}
                aria-hidden
              >
                ▼
              </span>
            </button>
            {openId === b.id && (
              <div className="flex flex-col gap-2 border-t border-primary/20 bg-muted/30 px-4 pb-3 pt-2">
                <Link
                  href={`/dashboard?view=branch_center&branch_id=${b.id}`}
                  className="min-h-[44px] touch-manipulation rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
                >
                  דשבורד סניף
                </Link>
                <Link
                  href={`/dashboard/users-branches/branch/${b.id}`}
                  className="min-h-[44px] touch-manipulation rounded-lg border border-primary/40 bg-background px-4 py-2.5 text-center text-sm font-medium text-foreground transition hover:bg-primary/10"
                >
                  פרופיל וצוות
                </Link>
              </div>
            )}
          </div>

          {/* טאבלט ומעלה: שורה עם שם + כפתורים, בלי רווח מיותר */}
          <div className="hidden items-center justify-between gap-2 px-4 py-2 sm:flex">
            <span className="font-medium text-foreground">{b.name}</span>
            <div className="flex shrink-0 gap-2">
              <Link
                href={`/dashboard?view=branch_center&branch_id=${b.id}`}
                className="min-h-[40px] min-w-[44px] touch-manipulation rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
              >
                דשבורד סניף
              </Link>
              <Link
                href={`/dashboard/users-branches/branch/${b.id}`}
                className="min-h-[40px] min-w-[44px] touch-manipulation rounded-lg border border-primary/40 bg-background px-3 py-2 text-xs font-medium text-foreground transition hover:bg-primary/10"
              >
                פרופיל וצוות
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
