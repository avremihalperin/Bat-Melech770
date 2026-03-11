import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function SupervisionPage() {
  await requireRole(["branch_supervisor", "secretary", "admin"]);
  const supabase = await createClient();
  const { data: branches } = await supabase
    .from("branches")
    .select("id, name, address")
    .order("name");

  const branchIds = (branches ?? []).map((b) => b.id);
  const counts = await Promise.all(
    branchIds.map(async (branchId) => {
      const { count: t } = await supabase.from("trainees").select("id", { count: "exact", head: true }).eq("branch_id", branchId);
      const { count: s } = await supabase.from("staff").select("id", { count: "exact", head: true }).eq("branch_id", branchId);
      return { branchId, trainees: t ?? 0, staff: s ?? 0 };
    })
  );
  const countMap = Object.fromEntries(counts.map((c) => [c.branchId, { trainees: c.trainees, staff: c.staff }]));

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-primary text-2xl font-bold">מעקב ופיקוח</h1>
      <p className="text-muted-foreground">צפייה ועריכה בנתוני סניפים, חניכות וצוות.</p>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">סניפים</CardTitle>
          <CardDescription>נתוני סניפים, חניכות וצוות</CardDescription>
        </CardHeader>
        <CardContent>
          {!branches?.length ? (
            <p className="text-muted-foreground">אין סניפים.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {branches.map((b) => {
                const c = countMap[b.id];
                return (
                  <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3">
                    <div>
                      <p className="font-medium">{b.name}</p>
                      {b.address && <p className="text-muted-foreground text-sm">{b.address}</p>}
                      <p className="text-muted-foreground text-sm">חניכות: {c?.trainees ?? 0} | צוות: {c?.staff ?? 0}</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/users-branches/branch/${b.id}`}>צפייה בנתונים</Link>
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
