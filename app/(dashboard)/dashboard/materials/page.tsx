import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MaterialsUploadForm } from "./materials-upload-form";
import { SpecialRequestsList } from "./special-requests-list";

export default async function MaterialsPage() {
  await requireRole(["content_manager", "admin"]);
  const supabase = await createClient();
  const [
    { data: materials },
    { data: pendingRequests },
  ] = await Promise.all([
    supabase.from("content_materials").select("id, title, file_url, category, created_at").order("created_at", { ascending: false }),
    supabase.from("special_activity_requests").select("id, title, description, status, branch_id, branches(name)").in("status", ["pending", "safety_approved"]).order("created_at", { ascending: false }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-primary text-2xl font-bold">ניהול חומרים</h1>
      <p className="text-muted-foreground">העלאת מערכי פעילות, תיקיות לסניפים.</p>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg">חומרי פעילות</CardTitle>
            <CardDescription>העלאת מערכי פעילות וקבצים לסניפים</CardDescription>
          </div>
          <MaterialsUploadForm />
        </CardHeader>
        <CardContent>
          {!materials?.length ? (
            <p className="text-muted-foreground">אין חומרים.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {materials.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-2 rounded-lg border border-border p-2">
                  <span className="font-medium">{m.title}</span>
                  <a href={m.file_url} target="_blank" rel="noopener noreferrer" className="text-primary text-sm underline">
                    קישור
                  </a>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">בקשות שוברות שגרה — אישור תוכן</CardTitle>
          <CardDescription>בקשות ממתינות לאישור אחרי בטיחות</CardDescription>
        </CardHeader>
        <CardContent>
          <SpecialRequestsList requests={pendingRequests ?? []} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">ארכיון תוכן</CardTitle>
          <CardDescription>כל החומרים שהועלו</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" asChild>
            <Link href="/dashboard/archive">לארכיון התוכן</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
