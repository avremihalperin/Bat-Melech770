import Link from "next/link";
import { redirect } from "next/navigation";
import { requireApprovedUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { isDemoUser } from "@/lib/demo";

const VIEW_ROLES: { view: string; label: string }[] = [
  { view: "admin", label: "מנהלת בת מלך" },
  { view: "secretary", label: "מזכירה" },
  { view: "branch_supervisor", label: "אחראית סניפים" },
  { view: "content_manager", label: "אחראית תוכן" },
  { view: "safety_officer", label: "אחראית בטיחות" },
];

export default async function DemoNavPage() {
  const profile = await requireApprovedUser();
  if (!isDemoUser(profile.email ?? undefined)) {
    redirect("/dashboard");
  }

  const supabase = await createClient();
  const { data: allBranches } = await supabase
    .from("branches")
    .select("id, name");

  const orderedBranches = [...(allBranches ?? [])].sort((a, b) =>
    a.name.localeCompare(b.name, "he")
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-background to-accent/10">
      <div className="mx-auto max-w-6xl px-3 py-6 sm:px-4 sm:py-8">
        <div className="mb-6 rounded-2xl bg-primary/10 p-3 text-center shadow-sm ring-1 ring-primary/20 sm:mb-8 sm:p-4">
          <h1 className="text-primary text-xl font-bold sm:text-2xl">מסך ניווט הדגמה</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            גישה לכל המסכים האמיתיים עם חשבון אחד — בחרי דשבורד לפי תפקיד או גשי ישירות למסך
          </p>
          <Link
            href="/dashboard"
            className="text-primary mt-2 inline-block text-sm font-medium underline"
          >
            ← חזרה לדשבורד
          </Link>
        </div>

        {/* דשבורדים לפי סוג צוות המטה */}
        <section className="mb-8">
          <h2 className="text-foreground mb-3 text-lg font-semibold">
            דשבורדים לפי סוג צוות המטה
          </h2>
          <p className="text-muted-foreground mb-4 text-sm">
            כל כפתור פותח את הדשבורד האמיתי של התפקיד — אותם נתונים ומסכים
          </p>
          <div className="mb-4 flex flex-wrap justify-center gap-3">
            <a
              href="/dashboard?view=admin&org=chabad"
              className="min-h-[44px] min-w-[44px] touch-manipulation rounded-xl px-5 py-3 font-medium text-white shadow-md transition hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #E5398B 0%, #8DC63F 50%, #4FC3F7 100%)",
              }}
            >
              הנהלת ארגון נוער חב&quot;ד
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {VIEW_ROLES.map(({ view, label }) => (
              <a
                key={view}
                href={`/dashboard?view=${encodeURIComponent(view)}`}
                className="min-h-[44px] min-w-[44px] touch-manipulation rounded-xl bg-primary px-5 py-3 font-medium text-primary-foreground shadow-md transition hover:opacity-90"
              >
                {label}
              </a>
            ))}
          </div>
        </section>

        {/* קישורים ישירים למסכים */}
        <section className="mb-8">
          <h2 className="text-foreground mb-3 text-lg font-semibold">קישורים ישירים למסכים</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            ניהול כספים, משתמשים וסניפים, מלאי, הודעות, חומרים, בטיחות ועוד
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/dashboard/finance"
              className="min-h-[44px] touch-manipulation rounded-xl border-2 border-primary/40 bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition hover:bg-primary/10"
            >
              ניהול כספים
            </Link>
            <Link
              href="/dashboard/users-branches"
              className="min-h-[44px] touch-manipulation rounded-xl border-2 border-primary/40 bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition hover:bg-primary/10"
            >
              ניהול משתמשים וסניפים
            </Link>
            <Link
              href="/dashboard/users-branches/add"
              className="min-h-[44px] touch-manipulation rounded-xl border-2 border-primary/40 bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition hover:bg-primary/10"
            >
              הוספת סניף
            </Link>
            <Link
              href="/dashboard/inventory"
              className="min-h-[44px] touch-manipulation rounded-xl border-2 border-primary/40 bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition hover:bg-primary/10"
            >
              מלאי וציוד
            </Link>
            <Link
              href="/dashboard/messages"
              className="min-h-[44px] touch-manipulation rounded-xl border-2 border-primary/40 bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition hover:bg-primary/10"
            >
              הודעות
            </Link>
            <Link
              href="/dashboard/supervision"
              className="min-h-[44px] touch-manipulation rounded-xl border-2 border-primary/40 bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition hover:bg-primary/10"
            >
              מעקב ופיקוח
            </Link>
            <Link
              href="/dashboard/materials"
              className="min-h-[44px] touch-manipulation rounded-xl border-2 border-primary/40 bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition hover:bg-primary/10"
            >
              ניהול חומרים
            </Link>
            <Link
              href="/dashboard/archive"
              className="min-h-[44px] touch-manipulation rounded-xl border-2 border-primary/40 bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition hover:bg-primary/10"
            >
              ארכיון תוכן
            </Link>
            <Link
              href="/dashboard/safety-reports"
              className="min-h-[44px] touch-manipulation rounded-xl border-2 border-primary/40 bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition hover:bg-primary/10"
            >
              בטיחות סניפים
            </Link>
            <Link
              href="/dashboard/safety-inbox"
              className="min-h-[44px] touch-manipulation rounded-xl border-2 border-primary/40 bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition hover:bg-primary/10"
            >
              פניות בטיחות
            </Link>
            <Link
              href="/dashboard/medical"
              className="min-h-[44px] touch-manipulation rounded-xl border-2 border-primary/40 bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition hover:bg-primary/10"
            >
              תיק רפואי
            </Link>
            <Link
              href="/approvals"
              className="min-h-[44px] touch-manipulation rounded-xl border-2 border-primary/40 bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition hover:bg-primary/10"
            >
              אישורי הרשמה
            </Link>
            <Link
              href="/dashboard/admin-data"
              className="min-h-[44px] touch-manipulation rounded-xl border-2 border-primary/40 bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition hover:bg-primary/10"
            >
              בקרת נתונים
            </Link>
          </div>
        </section>

        {/* סניפים — דשבורד מרכזת סניף או פרופיל וצוות */}
        <section>
          <h2 className="text-foreground mb-3 text-lg font-semibold">סניפים</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            לכל סניף: צפייה בדשבורד של מרכזת הסניף (תקציב, הודעות, פעילויות) או במסך פרופיל הסניף, חניכות וצוות.
          </p>
          <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3">
            {orderedBranches.map((b) => (
              <div
                key={b.id}
                className="flex flex-wrap items-center justify-center gap-2 rounded-xl border-2 border-primary/30 bg-card px-3 py-3 sm:justify-between sm:px-4"
              >
                <span className="font-medium text-foreground">{b.name}</span>
                <div className="flex flex-wrap gap-2">
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
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
