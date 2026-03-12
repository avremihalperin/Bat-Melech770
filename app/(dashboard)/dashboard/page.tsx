import Link from "next/link";
import { cookies } from "next/headers";
import { requireApprovedUser } from "@/lib/auth";
import { isDemoUser } from "@/lib/demo";
import {
  getBranchBalance,
  getActiveAnnouncements,
  getUpcomingActivities,
  getUpcomingBirthdays,
  getPendingApprovalsCount,
  getPendingSpecialRequests,
  getRecentSafetyReports,
  getAdminStats,
  getUpcomingActivitiesAllBranches,
} from "@/lib/dashboard";
import { NewsTicker } from "@/components/dashboard/news-ticker";
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

type ViewRole = "secretary" | "branch_supervisor" | "content_manager" | "admin" | "safety_officer" | "branch_center";

const ALL_VIEW_ROLES: ViewRole[] = ["secretary", "branch_supervisor", "content_manager", "admin", "safety_officer", "branch_center"];

/** דף דינמי — searchParams (view, branch_id, org) חייבים להתעדכן בכל כניסה */
export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; branch_id?: string; org?: string }>;
}) {
  const profile = await requireApprovedUser();
  const { view: viewParam, branch_id: branchIdParam, org: orgParam } = await searchParams;
  const viewRole = (viewParam && ALL_VIEW_ROLES.includes(viewParam as ViewRole))
    ? (viewParam as ViewRole)
    : null;
  const isDemoViewingRole = viewRole && isDemoUser(profile.email ?? undefined);
  const cookieStore = await cookies();
  const demoBranchId = cookieStore.get("demo_branch_id")?.value ?? branchIdParam;

  const effectiveRole: ViewRole | null = isDemoViewingRole ? viewRole : null;
  const showAsRole = effectiveRole ?? (profile.role as ViewRole);

  const branchIdForBranchView =
    profile.role === "branch_center" && profile.branch_id && !isDemoViewingRole
      ? profile.branch_id
      : viewRole === "branch_center" && demoBranchId
        ? demoBranchId
        : null;

  if (branchIdForBranchView) {
    const [balance, announcements, announcementsForTicker, upcoming, birthdays] = await Promise.all([
      getBranchBalance(branchIdForBranchView),
      getActiveAnnouncements(5),
      getActiveAnnouncements(15),
      getUpcomingActivities(branchIdForBranchView, 3),
      getUpcomingBirthdays(branchIdForBranchView, 10),
    ]);

    return (
      <div className="flex w-full min-w-0 flex-col gap-3">
        {isDemoViewingRole && viewRole === "branch_center" && (
          <p className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-center text-xs font-medium text-primary sm:px-4 sm:py-2 sm:text-sm">
            דוגמה: כך נראה הדשבורד של מרכזת סניף
          </p>
        )}
        <h1 className="text-primary text-lg font-bold sm:text-xl">דשבורד</h1>

        {/* סרט זז — חדשות מהארגון */}
        <NewsTicker items={announcementsForTicker.map((a) => ({ id: a.id, title: a.title, body: a.body }))} />

        {/* גריד — מובייל: עמודה אחת רוחב מלא; טאבלט+: 2–4 עמודות */}
        <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {/* תקציב — טורקיז */}
          <Card className="w-full min-w-0 border-2 border-primary/30 bg-gradient-to-br from-primary-50 to-primary-100/50 p-2.5 shadow-sm sm:p-3">
            <CardHeader className="p-0 pb-1">
              <CardTitle className="text-base">ניהול תקציב הסניף</CardTitle>
              <CardDescription className="text-xs">יתרה והעלאת קבלות</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-2xl font-bold text-primary">{formatCurrency(balance.balance)}</p>
              <p className="text-muted-foreground text-xs">מתוך {formatCurrency(balance.totalAllocations)}</p>
              <Button variant="gradient" size="sm" className="mt-2 min-h-10 touch-manipulation sm:min-h-9" asChild>
                <Link href="/dashboard/budget">+ העלאת קבלה</Link>
              </Button>
            </CardContent>
          </Card>

          {/* ימי הולדת — תוכן בגריד כך שאין שטח מת */}
          {birthdays.length > 0 && (
            <Card className="w-full min-w-0 border-2 border-pink-200/80 bg-gradient-to-br from-pink-50 to-amber-50/70 p-2.5 shadow-sm sm:col-span-2 sm:p-3">
              <CardHeader className="p-0 pb-1.5 sm:pb-2">
                <CardTitle className="text-sm font-semibold sm:text-base">ימי הולדת קרובים</CardTitle>
                <CardDescription className="text-xs">30 הימים הקרובים</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
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
              </CardContent>
            </Card>
          )}

          {/* פעילויות — מסגרת קטנה */}
          {upcoming.length > 0 && (
            <Card className="w-full min-w-0 border-2 border-amber-300/60 bg-gradient-to-br from-amber-50 to-orange-50/60 p-2.5 shadow-sm sm:p-3">
              <CardHeader className="p-0 pb-1">
                <CardTitle className="text-base">פעילויות קרובות</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="space-y-1 text-sm">
                  {upcoming.slice(0, 3).map((a) => (
                    <li key={a.id} className="flex justify-between gap-2 rounded border border-amber-200/80 px-2 py-1">
                      <span className="font-medium truncate">{a.title}</span>
                      <span className="text-muted-foreground shrink-0 text-xs">{formatDate(a.scheduled_at)}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="ghost" size="sm" className="mt-1" asChild>
                  <Link href="/dashboard/activities">הצגי הכל</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* הודעות — תוכן בגריד כך שאין שטח מת */}
          {announcements.length > 0 && (
            <Card className="w-full min-w-0 border-2 border-yellow-300/50 bg-gradient-to-br from-yellow-50 to-lime-50/50 p-2.5 shadow-sm sm:col-span-2 sm:p-3">
              <CardHeader className="p-0 pb-1.5 sm:pb-2">
                <CardTitle className="text-sm font-semibold sm:text-base">הודעות מהמשרד</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="grid w-full min-w-0 grid-cols-1 gap-1.5 text-xs sm:grid-cols-2 sm:gap-2 sm:text-sm">
                  {announcements.slice(0, 4).map((a) => (
                    <li key={a.id} className="min-w-0 rounded border border-yellow-200/80 bg-white/60 px-1.5 py-1 sm:px-2 sm:py-1.5">
                      <p className="font-medium truncate">{a.title}</p>
                      <p className="text-muted-foreground truncate text-[10px] sm:text-xs">{a.body}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* כפתורי פעולה — מובייל: עמודה; טאבלט+: שורה */}
          <div className="flex w-full min-w-0 flex-col gap-2 sm:col-span-2 sm:flex-row sm:flex-wrap sm:justify-center">
            <Button variant="default" size="sm" className="min-h-11 w-full touch-manipulation sm:min-h-9 sm:w-auto" asChild>
              <Link href="/dashboard/activities">הוסף פעילות</Link>
            </Button>
            <Button variant="outline" size="sm" className="min-h-11 w-full touch-manipulation sm:min-h-9 sm:w-auto" asChild>
              <Link href="/dashboard/activities">צ&#39;ק-ליסט פעילות</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* דשבורד למטה — תוכן לפי תפקיד (כולל משתמש דמו שצופה כ־view=...) */
  if (showAsRole === "secretary") {
    const { branchCenters, staff } = await getPendingApprovalsCount();
    const pendingTotal = branchCenters + staff;
    return (
      <div className="flex flex-col gap-6">
        {isDemoViewingRole && (
          <div className="rounded-xl border border-primary/30 bg-primary-50/50 px-4 py-2 text-center text-sm text-primary">
            צפייה כדשבורד מזכירה — עם חשבון אחד גישה לכל המסכים
          </div>
        )}
        <h1 className="text-primary text-2xl font-bold">דשבורד — מזכירה</h1>
        <p className="text-muted-foreground">בקשות הרשמה ממתינות, גישה לסניפים.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border-primary/20 bg-gradient-to-br from-primary-50/50 to-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">אישורי הרשמה</CardTitle>
              <CardDescription>מרכזות: {branchCenters} | צוות מטה: {staff}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="gradient" asChild>
                <Link href="/approvals">{pendingTotal > 0 ? `למסך האישורים (${pendingTotal})` : "מסך האישורים"}</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-primary-50/30 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">סניפים ומשתמשים</CardTitle>
              <CardDescription>ניהול משתמשים, פרופיל סניפים, חניכות וצוות</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild>
                <Link href="/dashboard/users-branches">לניהול משתמשים וסניפים</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showAsRole === "branch_supervisor") {
    const upcoming = await getUpcomingActivitiesAllBranches(5);
    return (
      <div className="flex flex-col gap-6">
        {isDemoViewingRole && (
          <div className="rounded-xl border border-primary/30 bg-primary-50/50 px-4 py-2 text-center text-sm text-primary">
            צפייה כדשבורד אחראית סניפים — עם חשבון אחד גישה לכל המסכים
          </div>
        )}
        <h1 className="text-primary text-2xl font-bold">דשבורד — אחראית סניפים</h1>
        <p className="text-muted-foreground">לוח שנה גלובלי, סטטוס פעילויות.</p>
        <Card className="border-primary/20 bg-primary-50/30 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">פעילויות קרובות (כל הסניפים)</CardTitle>
          </CardHeader>
          <CardContent>
            {upcoming.length === 0 ? (
              <p className="text-muted-foreground">אין פעילויות מתוכננות.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {upcoming.map((a) => (
                  <li key={a.id} className="flex justify-between rounded-lg border border-border p-2">
                    <span>{a.title}</span>
                    <span className="text-muted-foreground text-sm">
                      {Array.isArray(a.branches) ? a.branches[0]?.name : (a.branches as { name?: string })?.name ?? ""} — {formatDate(a.scheduled_at)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <Button variant="ghost" size="sm" className="mt-2" asChild>
              <Link href="/dashboard/supervision">מעקב ופיקוח</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showAsRole === "content_manager") {
    const pendingRequests = await getPendingSpecialRequests(5);
    return (
      <div className="flex flex-col gap-6">
        {isDemoViewingRole && (
          <div className="rounded-xl border border-primary/30 bg-primary-50/50 px-4 py-2 text-center text-sm text-primary">
            צפייה כדשבורד אחראית תוכן — עם חשבון אחד גישה לכל המסכים
          </div>
        )}
        <h1 className="text-primary text-2xl font-bold">דשבורד — אחראית תוכן</h1>
        <p className="text-muted-foreground">בקשות שוברות שגרה.</p>
        <Card className="border-accent/20 shadow-sm" style={{ background: "linear-gradient(135deg, hsl(45,95%,98%) 0%, hsl(340,82%,97%) 100%)" }}>
          <CardHeader>
            <CardTitle className="text-lg">בקשות ממתינות לאישור תוכן</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingRequests.length === 0 ? (
              <p className="text-muted-foreground">אין בקשות ממתינות.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {pendingRequests.map((r) => (
                  <li key={r.id} className="rounded-lg border border-border p-2 font-medium">
                    {r.title} — {Array.isArray(r.branches) ? r.branches[0]?.name : (r.branches as { name?: string })?.name ?? ""}
                  </li>
                ))}
              </ul>
            )}
            <Button variant="gradient" size="sm" className="mt-2" asChild>
              <Link href="/dashboard/materials">ניהול חומרים</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showAsRole === "admin") {
    const stats = await getAdminStats();
    const isChabadOrg = orgParam === "chabad";
    return (
      <div className="flex flex-col gap-6">
        {isDemoViewingRole && !isChabadOrg && (
          <div className="rounded-xl border border-primary/30 bg-primary-50/50 px-4 py-2 text-center text-sm text-primary">
            צפייה כדשבורד מנהלת — עם חשבון אחד גישה לכל המסכים
          </div>
        )}
        <h1 className="text-primary text-2xl font-bold">
          {isChabadOrg ? "דשבורד — הנהלת הארגון" : "דשבורד — מנהלת"}
        </h1>
        <p className="text-muted-foreground">
          {isChabadOrg ? "מבט על — תקציבים, חניכות." : "מבט על — תקציבים, חניכות, הרשמות."}
        </p>
        <div className={`grid gap-4 ${isChabadOrg ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
          <Card className="border-primary/20 bg-primary-50/40 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">סניפים</CardTitle>
              <CardContent className="pt-0 text-2xl font-bold text-primary">{stats.branchesCount}</CardContent>
            </CardHeader>
          </Card>
          <Card className="border-primary/20 bg-primary-50/30 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">חניכות</CardTitle>
              <CardContent className="pt-0 text-2xl font-bold text-primary">{stats.traineesCount}</CardContent>
            </CardHeader>
          </Card>
          {!isChabadOrg && (
            <Card className="border-primary/20 bg-primary-50/30 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">הרשמות ממתינות</CardTitle>
                <CardContent className="pt-0 text-2xl font-bold text-primary">{stats.pendingApprovals}</CardContent>
              </CardHeader>
            </Card>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          {!isChabadOrg && (
            <Button variant="gradient" asChild>
              <Link href="/approvals">אישורים</Link>
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href="/dashboard/admin-data">בקרת נתונים</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (showAsRole === "safety_officer") {
    const recent = await getRecentSafetyReports(5);
    return (
      <div className="flex flex-col gap-6">
        {isDemoViewingRole && (
          <div className="rounded-xl border border-primary/30 bg-primary-50/50 px-4 py-2 text-center text-sm text-primary">
            צפייה כדשבורד אחראית בטיחות — עם חשבון אחד גישה לכל המסכים
          </div>
        )}
        <h1 className="text-primary text-2xl font-bold">דשבורד — אחראית בטיחות</h1>
        <p className="text-muted-foreground">התראות דיווחי בטיחות (חירום / כמעט ונפגע).</p>
        <Card className="border-destructive/20 bg-destructive/5 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">דיווחי בטיחות אחרונים</CardTitle>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <p className="text-muted-foreground">אין דיווחים.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {recent.map((r) => (
                  <li key={r.id} className="rounded-lg border border-border p-2">
                    <p className="font-medium">{r.report_type === "emergency" ? "חירום" : "כמעט ונפגע"}</p>
                    <p className="text-muted-foreground text-sm">{Array.isArray(r.branches) ? r.branches[0]?.name : (r.branches as { name?: string })?.name} — {formatDate(r.created_at)}</p>
                    {r.description && <p className="text-sm">{r.description}</p>}
                  </li>
                ))}
              </ul>
            )}
            <Button variant="gradient" size="sm" className="mt-2" asChild>
              <Link href="/dashboard/safety-reports">בטיחות סניפים</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-primary text-2xl font-bold">דשבורד</h1>
      <p className="text-muted-foreground">השתמשי בתפריט הצד לניווט.</p>
    </div>
  );
}
