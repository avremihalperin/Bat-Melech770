"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type BranchProfileFormState = { error?: string };

export async function updateBranchProfileAction(
  _prev: BranchProfileFormState,
  formData: FormData
): Promise<BranchProfileFormState> {
  const branch_id = (formData.get("branch_id") as string)?.trim();
  const opening_hours = (formData.get("opening_hours") as string)?.trim() || null;
  const summary_notes = (formData.get("summary_notes") as string)?.trim() || null;

  if (!branch_id) return { error: "חסר סניף." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "יש להתחבר מחדש." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, branch_id")
    .eq("id", user.id)
    .single();

  const canEdit =
    (profile?.role === "branch_center" && profile.branch_id === branch_id) ||
    profile?.role === "secretary" ||
    profile?.role === "admin";
  if (!canEdit) return { error: "אין הרשאה." };

  const { data: existing } = await supabase
    .from("branch_profiles")
    .select("id")
    .eq("branch_id", branch_id)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("branch_profiles")
      .update({ opening_hours, summary_notes, updated_at: new Date().toISOString() })
      .eq("branch_id", branch_id);
    if (error) return { error: "שגיאה בעדכון." };
  } else {
    const { error } = await supabase.from("branch_profiles").insert({
      branch_id,
      opening_hours,
      summary_notes,
    });
    if (error) return { error: "שגיאה בשמירה." };
  }

  revalidatePath("/dashboard/branch-profile");
  return {};
}
