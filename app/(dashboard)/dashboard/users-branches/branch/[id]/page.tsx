import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function BranchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["secretary", "admin", "branch_supervisor"]);
  const { id: branchId } = await params;
  const supabase = await createClient();

  const { data: branch } = await supabase.from("branches").select("id, name, address, phone").eq("id", branchId).single();
  if (!branch) return <p className="text-destructive">סניף לא נמצא.</p>;

  const [
    { data: profile },
    { count: traineesCount },
    { data: staffList },
  ] = await Promise.all([
    supabase.from("branch_profiles").select("opening_hours, summary_notes").eq("branch_id", branchId).single(),
    supabase.from("trainees").select("id", { count: "exact", head: true }).eq("branch_id", branchId),
    supabase.from("staff").select("id, full_name, role_title, phone").eq("branch_id", branchId),
  ]);

  const { data: trainees } = await supabase
    .from("trainees")
    .select("id, first_name, last_name, phone, parent_phone")
    .eq("branch_id", branchId)
    .order("last_name")
    .limit(50);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/users-branches">← חזרה לסניפים</Link>
        </Button>
      </div>
      <h1 className="text-primary text-2xl font-bold">{branch.name}</h1>
      {branch.address && <p className="text-muted-foreground">{branch.address}</p>}
      {branch.phone && <p className="text-muted-foreground">{branch.phone}</p>}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">פרופיל סניף</CardTitle>
          <CardDescription>שעות פעילות והערות</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">שעות: {profile?.opening_hours ?? "—"}</p>
          <p className="mt-2 text-sm">{profile?.summary_notes ?? "—"}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">חניכות ({traineesCount ?? 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {!trainees?.length ? (
            <p className="text-muted-foreground">אין חניכות רשומות.</p>
          ) : (
            <ul className="flex flex-col gap-1">
              {trainees.map((t) => (
                <li key={t.id} className="flex justify-between rounded border border-border px-2 py-1 text-sm">
                  <span>{t.first_name} {t.last_name}</span>
                  <span className="text-muted-foreground">{t.phone ?? t.parent_phone ?? "—"}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">צוות</CardTitle>
        </CardHeader>
        <CardContent>
          {!staffList?.length ? (
            <p className="text-muted-foreground">אין צוות רשום.</p>
          ) : (
            <ul className="flex flex-col gap-1">
              {staffList.map((s) => (
                <li key={s.id} className="flex justify-between rounded border border-border px-2 py-1 text-sm">
                  <span>{s.full_name} — {s.role_title ?? "—"}</span>
                  <span className="text-muted-foreground">{s.phone ?? "—"}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
