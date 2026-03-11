import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function MedicalPage() {
  await requireRole(["safety_officer", "admin"]);
  const supabase = await createClient();
  const { data: trainees } = await supabase
    .from("trainees")
    .select("id, first_name, last_name, allergies, sensitivities, emergency_instructions, branch_id, branches(name)")
    .order("branch_id")
    .order("last_name");

  const byBranch = (trainees ?? []).reduce<Record<string, { name: string; allergies: string | null; sensitivities: string | null; emergency_instructions: string | null }[]>>((acc, t) => {
    const b = t.branches;
    const branchName = (Array.isArray(b) ? b[0]?.name : (b as { name?: string })?.name) ?? "ללא סניף";
    if (!acc[branchName]) acc[branchName] = [];
    acc[branchName].push({
      name: `${t.first_name} ${t.last_name}`,
      allergies: t.allergies,
      sensitivities: t.sensitivities,
      emergency_instructions: t.emergency_instructions,
    });
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-primary text-2xl font-bold">תיק רפואי</h1>
      <p className="text-muted-foreground">צפייה ועדכון רגישויות ואלרגיות של כל החניכות.</p>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">רגישויות ואלרגיות לפי סניף</CardTitle>
          <CardDescription>מידע רפואי — טיפול זהיר</CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(byBranch).length === 0 ? (
            <p className="text-muted-foreground">אין נתונים.</p>
          ) : (
            <div className="flex flex-col gap-6">
              {Object.entries(byBranch).map(([branchName, list]) => (
                <div key={branchName}>
                  <h3 className="font-semibold text-primary mb-2">{branchName}</h3>
                  <ul className="flex flex-col gap-2">
                    {list.map((t, i) => (
                      <li key={i} className="rounded-lg border border-border bg-muted/20 p-3">
                        <p className="font-medium">{t.name}</p>
                        {t.allergies && <p className="text-sm"><span className="text-muted-foreground">אלרגיות:</span> {t.allergies}</p>}
                        {t.sensitivities && <p className="text-sm"><span className="text-muted-foreground">רגישויות:</span> {t.sensitivities}</p>}
                        {t.emergency_instructions && <p className="text-sm text-destructive"><span className="text-muted-foreground">הנחיות חירום:</span> {t.emergency_instructions}</p>}
                        {!t.allergies && !t.sensitivities && !t.emergency_instructions && (
                          <p className="text-muted-foreground text-sm">אין רשום</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}