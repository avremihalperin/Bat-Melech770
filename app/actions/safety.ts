"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type SafetyReportFormState = { error?: string };

export async function submitSafetyReportAction(
  _prev: SafetyReportFormState,
  formData: FormData
): Promise<SafetyReportFormState> {
  const report_type = formData.get("report_type") as string;
  const description = (formData.get("description") as string)?.trim();
  if (!report_type || !description) {
    return { error: "נא לבחור סוג דיווח ולמלא תיאור." };
  }
  if (report_type !== "emergency" && report_type !== "near_miss") {
    return { error: "סוג דיווח לא תקין." };
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

  if (!profile?.branch_id && profile?.role !== "safety_officer") {
    return { error: "אין הרשאה (מרכזת סניף בלבד)." };
  }
  const branch_id = profile.branch_id ?? (formData.get("branch_id") as string);
  if (!branch_id) return { error: "חסר סניף." };

  const { error } = await supabase.from("safety_reports").insert({
    branch_id,
    reported_by: user.id,
    report_type: report_type as "emergency" | "near_miss",
    description,
    status: "pending",
  });

  if (error) return { error: "שגיאה בשמירת הדיווח. נסי שוב." };
  revalidatePath("/dashboard/safety");
  return {};
}
