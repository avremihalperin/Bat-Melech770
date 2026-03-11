"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type TraineeFormState = { error?: string };

export async function addTraineeAction(
  _prev: TraineeFormState,
  formData: FormData
): Promise<TraineeFormState> {
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

  const { error } = await supabase.from("trainees").insert({
    branch_id: profile.branch_id,
    first_name,
    last_name,
    mother_name: (formData.get("mother_name") as string)?.trim() || null,
    id_number: (formData.get("id_number") as string)?.trim() || null,
    phone: (formData.get("phone") as string)?.trim() || null,
    address: (formData.get("address") as string)?.trim() || null,
    parent_phone: (formData.get("parent_phone") as string)?.trim() || null,
    parent_email: (formData.get("parent_email") as string)?.trim() || null,
    email: (formData.get("email") as string)?.trim() || null,
    allergies: (formData.get("allergies") as string)?.trim() || null,
    sensitivities: (formData.get("sensitivities") as string)?.trim() || null,
    emergency_instructions: (formData.get("emergency_instructions") as string)?.trim() || null,
    notes: (formData.get("notes") as string)?.trim() || null,
    created_by: user.id,
  });

  if (error) return { error: "שגיאה בשמירה. נסי שוב." };
  revalidatePath("/dashboard/trainees");
  return {};
}
