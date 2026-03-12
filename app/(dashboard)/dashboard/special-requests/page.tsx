import { requireBranch } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SpecialRequestForm } from "./special-request-form";

const STATUS_LABELS: Record<string, string> = {
  pending: "ממתין",
  safety_approved: "אושר בטיחות",
  content_approved: "אושר תוכן",
  rejected: "נדחה",
};

export default async function SpecialRequestsPage() {
  const branchId = await requireBranch();
  const supabase = await createClient();
  const { data: requests } = await supabase
    .from("special_activity_requests")
    .select("id, title, description, status, created_at")
    .eq("branch_id", branchId)
    .order("created_at", { ascending: false });

  return (
    <div className="flex min-w-0 flex-col gap-6 sm:gap-8">
      <h1 className="text-primary text-xl font-bold sm:text-2xl">בקשות מיוחדות</h1>
      <p className="text-muted-foreground text-sm sm:text-base">טופס בקשה לפעילות שוברת שגרה.</p>

      <Card>
        <CardHeader className="flex flex-col gap-4 px-3 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6 sm:py-4">
          <div className="min-w-0">
            <CardTitle className="text-base sm:text-lg">בקשה לפעילות שוברת שגרה</CardTitle>
            <CardDescription>הגישי בקשה לאישור המטה (בטיחות + תוכן)</CardDescription>
          </div>
          <SpecialRequestForm />
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="px-3 py-3 sm:px-6 sm:py-4">
          <CardTitle className="text-base sm:text-lg">הבקשות שלי</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
          {!requests?.length ? (
            <p className="text-muted-foreground">אין בקשות.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {requests.map((r) => (
                <li key={r.id} className="rounded-lg border border-border p-3">
                  <p className="font-medium">{r.title}</p>
                  {r.description && <p className="text-muted-foreground text-sm">{r.description}</p>}
                  <p className="mt-1 text-sm">{STATUS_LABELS[r.status] ?? r.status}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
