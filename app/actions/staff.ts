"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type StaffFormState = { error?: string };

export async function addStaffAction(
  _prev: StaffFormState,
  formData: FormData
): Promise<StaffFormState> {
  const first_name = (formData.get("first_name") as string)?.trim();
  const last_name = (formData.get("last_name") as string)?.trim();
  if (!first_name || !last_name) {
    return { error: "נא למלא שם פרטי ושם משפחה." };
  }

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

  if (!profile || profile.role !== "branch_center" || !profile.branch_id) {
    return { error: "אין הרשאה." };
  }

  const { error } = await supabase.from("staff").insert({
    branch_id: profile.branch_id,
    first_name,
    last_name,
    phone: (formData.get("phone") as string)?.trim() || null,
    email: (formData.get("email") as string)?.trim() || null,
    role_notes: (formData.get("role_notes") as string)?.trim() || null,
  });

  if (error) return { error: "שגיאה בשמירה. נסי שוב." };
  revalidatePath("/dashboard/trainees");
  return {};
}
