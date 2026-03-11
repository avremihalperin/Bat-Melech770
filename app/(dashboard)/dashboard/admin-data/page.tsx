import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminDataPage() {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const [
    { count: branchesCount },
    { count: traineesCount },
    { count: activitiesCount },
    { count: receiptsCount },
  ] = await Promise.all([
    supabase.from("branches").select("id", { count: "exact", head: true }),
    supabase.from("trainees").select("id", { count: "exact", head: true }),
    supabase.from("activities").select("id", { count: "exact", head: true }),
    supabase.from("receipts").select("id", { count: "exact", head: true }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-primary text-2xl font-bold">בקרת נתונים</h1>
      <p className="text-muted-foreground">גישה מלאה: חניכות, צוות, פעילויות, כספים.</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">סניפים</CardTitle>
            <CardDescription>{branchesCount ?? 0}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/users-branches">לניהול סניפים</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">חניכות</CardTitle>
            <CardDescription>{traineesCount ?? 0} — צפייה דרך סניפים</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">פעילויות</CardTitle>
            <CardDescription>{activitiesCount ?? 0} — מעקב ופיקוח</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">קבלות</CardTitle>
            <CardDescription>{receiptsCount ?? 0}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/finance">לניהול כספים</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
