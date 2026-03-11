import { requireBranch } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SafetyReportForm } from "./safety-report-form";

export default async function SafetyPage() {
  const branchId = await requireBranch();
  const supabase = await createClient();

  const { data: trainees } = await supabase
    .from("trainees")
    .select("id, first_name, last_name, allergies, sensitivities, emergency_instructions")
    .eq("branch_id", branchId)
    .order("last_name");

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-primary text-2xl font-bold">תיק רפואי ובטיחות</h1>
      <p className="text-muted-foreground">
        רשימת חניכות עם אלרגיות/רגישויות, דרכי מניעה ופעולה בחירום.
      </p>

      <div className="rounded-lg border border-red-200 bg-red-50/50 p-4 text-red-900">
        <p className="font-medium">
          שימי לב: אזור זה מכיל מידע רפואי רגיש. חובה לעיין בדרכי המניעה והפעולה
          עבור כל חניכה לפני כל פעילות.
        </p>
      </div>

      <Card className="border-destructive/20 bg-destructive/5 shadow-sm">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg">דיווח אירוע חריג</CardTitle>
            <CardDescription>כמעט ונפגע / חירום — נשלח לאחראית בטיחות</CardDescription>
          </div>
          <SafetyReportForm branchId={branchId} />
        </CardHeader>
      </Card>

      <Card className="border-primary/20 bg-primary-50/20 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">רשימת חניכות — נתונים רפואיים</CardTitle>
          <CardDescription>
            אלרגיות, רגישויות והנחיות חירום. צפי בפרטים לפני כל פעילות.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!trainees?.length ? (
            <p className="text-muted-foreground">אין חניכות רשומות.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {trainees.map((t) => (
                <li
                  key={t.id}
                  className="border-border rounded-lg border p-3"
                >
                  <p className="font-medium">
                    {t.first_name} {t.last_name}
                  </p>
                  {(t.allergies || t.sensitivities) && (
                    <p className="text-muted-foreground mt-1 text-sm">
                      אלרגיות/רגישויות: {[t.allergies, t.sensitivities].filter(Boolean).join(" · ") || "—"}
                    </p>
                  )}
                  {t.emergency_instructions && (
                    <p className="mt-1 text-sm">
                      <span className="font-medium">הנחיות חירום:</span>{" "}
                      {t.emergency_instructions}
                    </p>
                  )}
                  {!t.allergies && !t.sensitivities && !t.emergency_instructions && (
                    <p className="text-muted-foreground mt-1 text-sm">אין נתונים רפואיים רשומים.</p>
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
