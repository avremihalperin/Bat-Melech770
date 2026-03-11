import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SafetySpecialRequestsApprove } from "./safety-special-requests-approve";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("he-IL", { dateStyle: "short", timeStyle: "short" }).format(new Date(iso));
}

export default async function SafetyReportsPage() {
  await requireRole(["safety_officer", "admin"]);
  const supabase = await createClient();
  const [
    { data: reports },
    { data: pendingRequests },
  ] = await Promise.all([
    supabase.from("safety_reports").select("id, report_type, description, branch_id, created_at, branches(name)").order("created_at", { ascending: false }).limit(30),
    supabase.from("special_activity_requests").select("id, title, description, status, branch_id, branches(name)").eq("status", "pending").order("created_at", { ascending: false }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-primary text-2xl font-bold">בטיחות סניפים</h1>
      <p className="text-muted-foreground">אישור בקשות שוברות שגרה, דיווחי בטיחות.</p>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">בקשות שוברות שגרה — ממתינות לאישור בטיחות</CardTitle>
          <CardDescription>אישור לפני העברה לאחראית תוכן</CardDescription>
        </CardHeader>
        <CardContent>
          <SafetySpecialRequestsApprove requests={pendingRequests ?? []} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">דיווחי בטיחות אחרונים</CardTitle>
        </CardHeader>
        <CardContent>
          {!reports?.length ? (
            <p className="text-muted-foreground">אין דיווחים.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {reports.map((r) => (
                <li key={r.id} className="rounded-lg border border-border p-3">
                  <p className="font-medium">{r.report_type === "emergency" ? "חירום" : "כמעט ונפגע"}</p>
                  <p className="text-muted-foreground text-sm">{Array.isArray(r.branches) ? r.branches[0]?.name : (r.branches as { name?: string })?.name} — {formatDate(r.created_at)}</p>
                  {r.description && <p className="mt-1 text-sm">{r.description}</p>}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
