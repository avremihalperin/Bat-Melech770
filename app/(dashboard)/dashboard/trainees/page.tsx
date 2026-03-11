import { requireBranch } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TraineeAddForm } from "./trainee-add-form";
import { StaffAddForm } from "./staff-add-form";

export default async function TraineesPage() {
  const branchId = await requireBranch();
  const supabase = await createClient();

  const [
    { data: trainees },
    { data: staffList },
  ] = await Promise.all([
    supabase
      .from("trainees")
      .select("id, first_name, last_name, mother_name, id_number, phone, address, parent_phone, parent_email, email")
      .eq("branch_id", branchId)
      .order("last_name"),
    supabase
      .from("staff")
      .select("id, first_name, last_name, phone, email, role_notes")
      .eq("branch_id", branchId)
      .order("last_name"),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-primary text-2xl font-bold">
        רשימת חניכות וצוות הסניף
      </h1>
      <p className="text-muted-foreground">
        טבלאות חניכות וצוות, הוספת חניכה או איש צוות.
      </p>

      {/* חניכות */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary-50/30 to-card shadow-sm">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg">חניכות</CardTitle>
            <CardDescription>נתונים מלאים — שם, ת.ז., טלפון, כתובת, פרטי הורים, מייל</CardDescription>
          </div>
          <TraineeAddForm />
        </CardHeader>
        <CardContent>
          {!trainees?.length ? (
            <p className="text-muted-foreground">אין חניכות רשומות. הוסיפי חניכה חדשה.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-start text-sm">
                <thead>
                  <tr className="border-border border-b">
                    <th className="pb-2 pe-2 text-start font-medium">שם מלא</th>
                    <th className="pb-2 pe-2 text-start font-medium">ת.ז.</th>
                    <th className="pb-2 pe-2 text-start font-medium">טלפון</th>
                    <th className="pb-2 pe-2 text-start font-medium">כתובת</th>
                    <th className="pb-2 pe-2 text-start font-medium">הורים (טלפון / מייל)</th>
                    <th className="pb-2 pe-2 text-start font-medium">מייל</th>
                  </tr>
                </thead>
                <tbody>
                  {trainees.map((t) => (
                    <tr key={t.id} className="border-border border-b last:border-0">
                      <td className="py-2 pe-2">
                        {t.first_name} {t.last_name}
                        {t.mother_name ? ` (${t.mother_name})` : ""}
                      </td>
                      <td className="py-2 pe-2">{t.id_number ?? "—"}</td>
                      <td className="py-2 pe-2">{t.phone ?? "—"}</td>
                      <td className="py-2 pe-2">{t.address ?? "—"}</td>
                      <td className="py-2 pe-2">
                        {[t.parent_phone, t.parent_email].filter(Boolean).join(" / ") || "—"}
                      </td>
                      <td className="py-2 pe-2">{t.email ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* צוות */}
      <Card className="border-primary/20 bg-primary-50/20 shadow-sm">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg">אנשי צוות</CardTitle>
            <CardDescription>צוות הסניף</CardDescription>
          </div>
          <StaffAddForm />
        </CardHeader>
        <CardContent>
          {!staffList?.length ? (
            <p className="text-muted-foreground">אין אנשי צוות. הוסיפי איש צוות.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[400px] text-start text-sm">
                <thead>
                  <tr className="border-border border-b">
                    <th className="pb-2 pe-2 text-start font-medium">שם</th>
                    <th className="pb-2 pe-2 text-start font-medium">טלפון</th>
                    <th className="pb-2 pe-2 text-start font-medium">מייל</th>
                    <th className="pb-2 pe-2 text-start font-medium">הערות</th>
                  </tr>
                </thead>
                <tbody>
                  {staffList.map((s) => (
                    <tr key={s.id} className="border-border border-b last:border-0">
                      <td className="py-2 pe-2">
                        {s.first_name} {s.last_name}
                      </td>
                      <td className="py-2 pe-2">{s.phone ?? "—"}</td>
                      <td className="py-2 pe-2">{s.email ?? "—"}</td>
                      <td className="py-2 pe-2">{s.role_notes ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
