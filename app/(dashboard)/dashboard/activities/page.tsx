import { requireBranch } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ActivityAddForm } from "./activity-add-form";
import { ActivityChecklistButtons } from "./activity-checklist-buttons";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("he-IL", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));
}

const STATUS_LABELS: Record<string, string> = {
  scheduled: "מתוכנן",
  completed: "בוצע",
  cancelled: "בוטל",
};

export default async function ActivitiesPage() {
  const branchId = await requireBranch();
  const supabase = await createClient();

  const { data: activities } = await supabase
    .from("activities")
    .select("id, title, scheduled_at, status, checklist_start_completed_at, checklist_end_completed_at")
    .eq("branch_id", branchId)
    .order("scheduled_at", { ascending: false });

  const now = new Date().toISOString();
  const upcoming = (activities ?? []).filter((a) => a.scheduled_at >= now && a.status === "scheduled");
  const past = (activities ?? []).filter((a) => a.scheduled_at < now || a.status !== "scheduled");

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-primary text-2xl font-bold">פעילויות (לוח)</h1>
      <p className="text-muted-foreground">
        רשימות נוכחות, צ&#39;ק-ליסט התחלה וסיום פעילות.
      </p>

      <Card className="border-primary/20 bg-gradient-to-br from-primary-50/30 to-card shadow-sm">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg">הוסף פעילות חדשה</CardTitle>
            <CardDescription>תכנון פעילות עם תאריך ושעה</CardDescription>
          </div>
          <ActivityAddForm branchId={branchId} />
        </CardHeader>
      </Card>

      {upcoming.length > 0 && (
        <Card className="border-primary/20 bg-primary-50/20 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">פעילויות קרובות</CardTitle>
            <CardDescription>צ&#39;ק-ליסט תחילת פעילות וצ&#39;ק-ליסט סיום פעילות</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2">
              {upcoming.map((a) => (
                <li
                  key={a.id}
                  className="border-border flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{a.title}</p>
                    <p className="text-muted-foreground text-sm">{formatDate(a.scheduled_at)}</p>
                  </div>
                  <ActivityChecklistButtons activity={a} />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">כל הפעילויות</CardTitle>
          <CardDescription>היסטוריה ומתוכננות</CardDescription>
        </CardHeader>
        <CardContent>
          {!activities?.length ? (
            <p className="text-muted-foreground">אין פעילויות. הוסיפי פעילות חדשה.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {(past.length ? past : activities).map((a) => (
                <li
                  key={a.id}
                  className="border-border flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{a.title}</p>
                    <p className="text-muted-foreground text-sm">
                      {formatDate(a.scheduled_at)} · {STATUS_LABELS[a.status] ?? a.status}
                    </p>
                  </div>
                  {a.status === "scheduled" && a.scheduled_at >= now && (
                    <ActivityChecklistButtons activity={a} />
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
