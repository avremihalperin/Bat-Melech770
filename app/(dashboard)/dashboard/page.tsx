import Link from "next/link";
import { cookies } from "next/headers";
import { requireApprovedUser } from "@/lib/auth";
import { isDemoUser } from "@/lib/demo";
import {
  getBranchBalance,
  getActiveAnnouncements,
  getUpcomingActivities,
  getPendingApprovalsCount,
  getPendingSpecialRequests,
  getRecentSafetyReports,
  getAdminStats,
  getUpcomingActivitiesAllBranches,
} from "@/lib/dashboard";
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
    const [balance, announcements, upcoming] = await Promise.all([
      getBranchBalance(branchIdForBranchView),
      getActiveAnnouncements(5),
      getUpcomingActivities(branchIdForBranchView, 3),
    ]);

    return (
      <div className="flex flex-col gap-6">
        {isDemoViewingRole && viewRole === "branch_center" && (
          <p className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-center text-sm font-medium text-primary">
            דוגמה: כך נראה הדשבורד של מרכזת סניף
          </p>
        )}
        <h1 className="text-primary text-2xl font-bold">דשבורד</h1>

        {/* תקציב נוכחי */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary-50/40 to-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">ניהול תקציב הסניף</CardTitle>
            <CardDescription>
              כאן תוכלי לראות את היתרה הזמינה ולהעלות קבלות לקבלת החזרים מהמטה.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">
              {formatCurrency(balance.balance)}
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              יתרה זמינה מתוך {formatCurrency(balance.totalAllocations)} שהוקצו
            </p>
            <Button variant="gradient" className="mt-4" asChild>
              <Link href="/dashboard/budget">+ העלאת קבלה לאישור</Link>
            </Button>
          </CardContent>
        </Card>

        {/* הודעות מתגלגלות */}
        {announcements.length > 0 && (
          <Card className="border-accent/20 shadow-sm" style={{ background: "linear-gradient(135deg, hsl(45,95%,98%) 0%, hsl(25,95%,97%) 100%)" }}>
            <CardHeader>
              <CardTitle className="text-lg">הודעות מהמשרד</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-2">
                {announcements.map((a) => (
                  <li
                    key={a.id}
                    className="border-border rounded-lg border bg-muted/30 px-3 py-2"
                  >
                    <p className="font-medium">{a.title}</p>
                    <p className="text-muted-foreground text-sm">{a.body}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* כפתורי פעולה מהירה */}
        <div className="flex flex-wrap gap-3">
          <Button variant="default" asChild>
            <Link href="/dashboard/activities">הוסף פעילות חדשה</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/activities">
              צ&#39;ק-ליסט פעילות קרובה
            </Link>
          </Button>
        </div>

        {/* פעילויות קרובות */}
        {upcoming.length > 0 && (
          <Card className="border-primary/20 bg-primary-50/30 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">פעילויות קרובות</CardTitle>
              <CardDescription>הפעילויות המתוכננות הבאות</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-2">
                {upcoming.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2"
                  >
                    <span className="font-medium">{a.title}</span>
                    <span className="text-muted-foreground text-sm">
                      {formatDate(a.scheduled_at)}
                    </span>
                  </li>
                ))}
              </ul>
              <Button variant="ghost" size="sm" className="mt-2" asChild>
                <Link href="/dashboard/activities">הצגי את כל הפעילויות</Link>
              </Button>
            </CardContent>
          </Card>
        )}
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
