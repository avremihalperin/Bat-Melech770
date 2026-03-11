import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("he-IL", { dateStyle: "short", timeStyle: "short" }).format(new Date(iso));
}

export default async function SafetyInboxPage() {
  await requireRole(["safety_officer", "admin"]);
  const supabase = await createClient();
  const { data: reports } = await supabase
    .from("safety_reports")
    .select("id, report_type, description, branch_id, created_at, branches(name)")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-primary text-2xl font-bold">פניות — תיבת דיווחי בטיחות</h1>
      <p className="text-muted-foreground">מענה בנושאי ביטחון ובטיחות, דיווחי חירום וכמעט ונפגע.</p>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">דיווחי בטיחות</CardTitle>
          <CardDescription>כל הדיווחים שהתקבלו מהסניפים</CardDescription>
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
