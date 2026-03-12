import { requireBranch } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BranchProfileForm } from "./branch-profile-form";

export default async function BranchProfilePage() {
  const branchId = await requireBranch();
  const supabase = await createClient();

  const [
    { data: branch },
    { data: profile },
    { count: traineesCount },
  ] = await Promise.all([
    supabase.from("branches").select("id, name").eq("id", branchId).single(),
    supabase
      .from("branch_profiles")
      .select("opening_hours, summary_notes, trainees_count_cached")
      .eq("branch_id", branchId)
      .single(),
    supabase.from("trainees").select("id", { count: "exact", head: true }).eq("branch_id", branchId),
  ]);

  const { data: staffList } = await supabase
    .from("staff")
    .select("id, first_name, last_name")
    .eq("branch_id", branchId);

  return (
    <div className="flex min-w-0 flex-col gap-6 sm:gap-8">
      <h1 className="text-primary text-xl font-bold sm:text-2xl">פרופיל הסניף</h1>
      <p className="text-muted-foreground text-sm sm:text-base">
        שעות פעילות, אנשי צוות, סיכום כמותי של חניכות.
      </p>

      <Card className="border-primary/20 bg-gradient-to-br from-primary-50/30 to-card shadow-sm">
        <CardHeader className="px-3 py-3 sm:px-6 sm:py-4">
          <CardTitle className="min-w-0 truncate text-base sm:text-lg">{branch?.name ?? "פרופיל הסניף"}</CardTitle>
          <CardDescription>שעות פעילות והערות</CardDescription>
        </CardHeader>
        <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
          <BranchProfileForm
            branchId={branchId}
            initialOpeningHours={profile?.opening_hours ?? ""}
            initialSummaryNotes={profile?.summary_notes ?? ""}
          />
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary-50/20 shadow-sm">
        <CardHeader className="px-3 py-3 sm:px-6 sm:py-4">
          <CardTitle className="text-base sm:text-lg">סיכום כמותי</CardTitle>
          <CardDescription>חניכות ואנשי צוות</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-6">
          <div>
            <p className="text-muted-foreground text-sm">חניכות</p>
            <p className="text-2xl font-bold text-primary">{traineesCount ?? 0}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">אנשי צוות</p>
            <p className="text-2xl font-bold text-primary">{staffList?.length ?? 0}</p>
          </div>
        </CardContent>
      </Card>

      {staffList && staffList.length > 0 && (
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">אנשי צוות</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-1">
              {staffList.map((s) => (
                <li key={s.id}>
                  {s.first_name} {s.last_name}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
