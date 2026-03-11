import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function UsersBranchesPage() {
  await requireRole(["secretary", "admin", "branch_supervisor"]);
  const supabase = await createClient();
  const { data: branches } = await supabase
    .from("branches")
    .select("id, name, address, phone")
    .order("name");

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-primary text-2xl font-bold">ניהול משתמשים וסניפים</h1>
      <p className="text-muted-foreground">אישור מרכזות, פרופיל סניפים, חניכות וצוות.</p>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">אישור הרשמות</CardTitle>
          <CardDescription>מרכזות סניף וצוות מטה ממתינים לאישור</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="gradient" asChild>
            <Link href="/approvals">למסך האישורים</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg">רשימת סניפים</CardTitle>
            <CardDescription>גישה לפרופיל סניף, חניכות וצוות לפי סניף</CardDescription>
          </div>
          <Button variant="gradient" size="sm" asChild>
            <Link href="/dashboard/users-branches/add">+ פתיחת / הוספת סניף</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {!branches?.length ? (
            <p className="text-muted-foreground">אין סניפים.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {branches.map((b) => (
                <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3">
                  <div>
                    <p className="font-medium">{b.name}</p>
                    {b.address && <p className="text-muted-foreground text-sm">{b.address}</p>}
                    {b.phone && <p className="text-muted-foreground text-sm">{b.phone}</p>}
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/users-branches/branch/${b.id}`}>פרופיל סניף / חניכות וצוות</Link>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
