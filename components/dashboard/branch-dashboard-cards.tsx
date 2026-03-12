"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("he-IL", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));
}

type Balance = { balance: number; totalAllocations: number };
type Announcement = { id: string; title: string; body?: string | null };
type Activity = { id: string; title: string; scheduled_at: string };
type Birthday = { id: string; first_name: string; last_name: string; daysUntil: number };

interface BranchDashboardCardsProps {
  balance: Balance;
  announcements: Announcement[];
  upcoming: Activity[];
  birthdays: Birthday[];
}

export function BranchDashboardCards({
  balance,
  announcements,
  upcoming,
  birthdays,
}: BranchDashboardCardsProps) {
  const [openSection, setOpenSection] = useState<string | null>("budget");

  const toggle = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  const sections = [
    {
      id: "budget",
      title: "ניהול תקציב הסניף",
      desc: "יתרה והעלאת קבלות",
      className: "border-2 border-primary/30 bg-gradient-to-br from-primary-50 to-primary-100/50",
      content: (
        <>
          <p className="text-2xl font-bold text-primary">{formatCurrency(balance.balance)}</p>
          <p className="text-muted-foreground text-xs">מתוך {formatCurrency(balance.totalAllocations)}</p>
          <Button variant="gradient" size="sm" className="mt-2 min-h-10 w-full touch-manipulation sm:min-h-9 sm:w-auto" asChild>
            <Link href="/dashboard/budget">+ העלאת קבלה</Link>
          </Button>
        </>
      ),
    },
    ...(birthdays.length > 0
      ? [
          {
            id: "birthdays",
            title: "ימי הולדת קרובים",
            desc: "30 הימים הקרובים",
            className: "border-2 border-pink-200/80 bg-gradient-to-br from-pink-50 to-amber-50/70",
            content: (
              <>
                <ul className="grid w-full min-w-0 grid-cols-2 gap-1.5 text-xs sm:grid-cols-3 sm:gap-2 sm:text-sm">
                  {birthdays.slice(0, 6).map((b) => (
                    <li key={b.id} className="flex items-center justify-between gap-1 rounded border border-pink-100 bg-white/50 px-1.5 py-1 sm:px-2 sm:py-1.5">
                      <span className="min-w-0 font-medium truncate">{b.first_name} {b.last_name}</span>
                      <span className="text-muted-foreground shrink-0 text-[10px] sm:text-xs">
                        {b.daysUntil === 0 ? "היום!" : b.daysUntil === 1 ? "מחר" : `בעוד ${b.daysUntil}`}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button variant="ghost" size="sm" className="mt-1.5 min-h-10 w-full touch-manipulation sm:mt-2 sm:min-h-9 sm:w-auto" asChild>
                  <Link href="/dashboard/trainees">לחניכות וצוות</Link>
                </Button>
              </>
            ),
          },
        ]
      : []),
    ...(upcoming.length > 0
      ? [
          {
            id: "activities",
            title: "פעילויות קרובות",
            desc: "",
            className: "border-2 border-amber-300/60 bg-gradient-to-br from-amber-50 to-orange-50/60",
            content: (
              <>
                <ul className="space-y-1 text-xs sm:text-sm">
                  {upcoming.slice(0, 3).map((a) => (
                    <li key={a.id} className="flex min-w-0 justify-between gap-1 rounded border border-amber-200/80 px-1.5 py-1 sm:px-2">
                      <span className="min-w-0 font-medium truncate">{a.title}</span>
                      <span className="text-muted-foreground shrink-0 text-[10px] sm:text-xs">{formatDate(a.scheduled_at)}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="ghost" size="sm" className="mt-1 min-h-10 w-full touch-manipulation sm:min-h-9 sm:w-auto" asChild>
                  <Link href="/dashboard/activities">הצגי הכל</Link>
                </Button>
              </>
            ),
          },
        ]
      : []),
    ...(announcements.length > 0
      ? [
          {
            id: "announcements",
            title: "הודעות מהמשרד",
            desc: "",
            className: "border-2 border-yellow-300/50 bg-gradient-to-br from-yellow-50 to-lime-50/50",
            content: (
              <ul className="grid w-full min-w-0 grid-cols-1 gap-1.5 text-xs sm:grid-cols-2 sm:gap-2 sm:text-sm">
                {announcements.slice(0, 4).map((a) => (
                  <li key={a.id} className="min-w-0 rounded border border-yellow-200/80 bg-white/60 px-1.5 py-1 sm:px-2 sm:py-1.5">
                    <p className="font-medium truncate">{a.title}</p>
                    <p className="text-muted-foreground truncate text-[10px] sm:text-xs">{a.body ?? ""}</p>
                  </li>
                ))}
              </ul>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="w-full min-w-0">
      {/* מובייל וטאבלט צר: אקורדיון — כותרות נפתחות בלחיצה (עד 768px) */}
      <div className="block space-y-2 md:hidden">
        {sections.map((s) => (
          <div
            key={s.id}
            className={`rounded-xl overflow-hidden shadow-sm ${s.className}`}
          >
            <button
              type="button"
              onClick={() => toggle(s.id)}
              className="flex w-full min-h-[48px] touch-manipulation items-center justify-between gap-2 px-4 py-3 text-start"
              aria-expanded={openSection === s.id}
            >
              <div className="min-w-0 flex-1">
                <span className="block font-semibold text-foreground">{s.title}</span>
                {s.desc && <span className="block text-xs text-muted-foreground">{s.desc}</span>}
              </div>
              <span
                className={`shrink-0 text-xl text-foreground/70 transition-transform ${openSection === s.id ? "rotate-180" : ""}`}
                aria-hidden
              >
                ▼
              </span>
            </button>
            {openSection === s.id && (
              <div className="border-t border-black/10 px-4 pb-4 pt-2">
                {s.content}
              </div>
            )}
          </div>
        ))}
        {/* כפתורי פעולה */}
        <div className="flex flex-col gap-2 pt-2">
          <Button variant="default" size="sm" className="min-h-11 w-full touch-manipulation" asChild>
            <Link href="/dashboard/activities">הוסף פעילות</Link>
          </Button>
          <Button variant="outline" size="sm" className="min-h-11 w-full touch-manipulation" asChild>
            <Link href="/dashboard/activities">צ&#39;ק-ליסט פעילות</Link>
          </Button>
        </div>
      </div>

      {/* טאבלט רחב ומעלה: גריד כרטיסים */}
      <div className="hidden md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-4">
        <Card className="w-full min-w-0 border-2 border-primary/30 bg-gradient-to-br from-primary-50 to-primary-100/50 p-2.5 shadow-sm md:p-3">
          <CardHeader className="p-0 pb-1">
            <CardTitle className="text-base">ניהול תקציב הסניף</CardTitle>
            <CardDescription className="text-xs">יתרה והעלאת קבלות</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-2xl font-bold text-primary">{formatCurrency(balance.balance)}</p>
            <p className="text-muted-foreground text-xs">מתוך {formatCurrency(balance.totalAllocations)}</p>
            <Button variant="gradient" size="sm" className="mt-2 min-h-10 touch-manipulation md:min-h-9" asChild>
              <Link href="/dashboard/budget">+ העלאת קבלה</Link>
            </Button>
          </CardContent>
        </Card>

        {birthdays.length > 0 && (
          <Card className="w-full min-w-0 border-2 border-pink-200/80 bg-gradient-to-br from-pink-50 to-amber-50/70 p-2.5 shadow-sm md:col-span-2 md:p-3">
            <CardHeader className="p-0 pb-1.5 md:pb-2">
              <CardTitle className="text-sm font-semibold md:text-base">ימי הולדת קרובים</CardTitle>
              <CardDescription className="text-xs">30 הימים הקרובים</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="grid w-full min-w-0 grid-cols-2 gap-1.5 text-xs md:grid-cols-3 md:gap-2 md:text-sm">
                {birthdays.slice(0, 6).map((b) => (
                  <li key={b.id} className="flex items-center justify-between gap-1 rounded border border-pink-100 bg-white/50 px-1.5 py-1 md:px-2 md:py-1.5">
                    <span className="min-w-0 font-medium truncate">{b.first_name} {b.last_name}</span>
                    <span className="text-muted-foreground shrink-0 text-[10px] md:text-xs">
                      {b.daysUntil === 0 ? "היום!" : b.daysUntil === 1 ? "מחר" : `בעוד ${b.daysUntil}`}
                    </span>
                  </li>
                ))}
              </ul>
              <Button variant="ghost" size="sm" className="mt-1.5 min-h-10 w-full touch-manipulation md:mt-2 md:min-h-9 md:w-auto" asChild>
                <Link href="/dashboard/trainees">לחניכות וצוות</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {upcoming.length > 0 && (
          <Card className="w-full min-w-0 border-2 border-amber-300/60 bg-gradient-to-br from-amber-50 to-orange-50/60 p-2.5 shadow-sm md:p-3">
            <CardHeader className="p-0 pb-1">
              <CardTitle className="text-sm font-semibold md:text-base">פעילויות קרובות</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="space-y-1 text-xs md:text-sm">
                {upcoming.slice(0, 3).map((a) => (
                  <li key={a.id} className="flex min-w-0 justify-between gap-1 rounded border border-amber-200/80 px-1.5 py-1 md:px-2">
                    <span className="min-w-0 font-medium truncate">{a.title}</span>
                    <span className="text-muted-foreground shrink-0 text-[10px] md:text-xs">{formatDate(a.scheduled_at)}</span>
                  </li>
                ))}
              </ul>
              <Button variant="ghost" size="sm" className="mt-1 min-h-10 w-full touch-manipulation md:min-h-9 md:w-auto" asChild>
                <Link href="/dashboard/activities">הצגי הכל</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {announcements.length > 0 && (
          <Card className="w-full min-w-0 border-2 border-yellow-300/50 bg-gradient-to-br from-yellow-50 to-lime-50/50 p-2.5 shadow-sm md:col-span-2 md:p-3">
            <CardHeader className="p-0 pb-1.5 md:pb-2">
              <CardTitle className="text-sm font-semibold md:text-base">הודעות מהמשרד</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="grid w-full min-w-0 grid-cols-1 gap-1.5 text-xs md:grid-cols-2 md:gap-2 md:text-sm">
                {announcements.slice(0, 4).map((a) => (
                  <li key={a.id} className="min-w-0 rounded border border-yellow-200/80 bg-white/60 px-1.5 py-1 md:px-2 md:py-1.5">
                    <p className="font-medium truncate">{a.title}</p>
                    <p className="text-muted-foreground truncate text-[10px] md:text-xs">{a.body ?? ""}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <div className="flex w-full min-w-0 flex-col gap-2 md:col-span-2 md:flex-row md:flex-wrap md:justify-center">
          <Button variant="default" size="sm" className="min-h-11 w-full touch-manipulation md:min-h-9 md:w-auto" asChild>
            <Link href="/dashboard/activities">הוסף פעילות</Link>
          </Button>
          <Button variant="outline" size="sm" className="min-h-11 w-full touch-manipulation md:min-h-9 md:w-auto" asChild>
            <Link href="/dashboard/activities">צ&#39;ק-ליסט פעילות</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
