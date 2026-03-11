"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type AddBranchState = { error?: string; success?: boolean };

export async function addBranchAction(
  _prev: AddBranchState,
  formData: FormData
): Promise<AddBranchState> {
  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "נא למלא שם סניף." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "יש להתחבר מחדש." };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const role = profile?.role;
  if (role !== "secretary" && role !== "branch_supervisor" && role !== "admin") {
    return { error: "אין הרשאה להוספת סניף." };
  }

  const { error } = await supabase.from("branches").insert({
    name,
    address: (formData.get("address") as string)?.trim() || null,
    phone: (formData.get("phone") as string)?.trim() || null,
    updated_at: new Date().toISOString(),
  });

  if (error) return { error: "שגיאה בשמירה. ייתכן שהסניף כבר קיים." };
  revalidatePath("/dashboard/users-branches");
  revalidatePath("/demo");
  return { success: true };
}
