"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ActivityFormState = { error?: string };

export async function addActivityAction(
  _prev: ActivityFormState,
  formData: FormData
): Promise<ActivityFormState> {
  const title = (formData.get("title") as string)?.trim();
  const scheduled_at = (formData.get("scheduled_at") as string)?.trim();
  if (!title || !scheduled_at) {
    return { error: "נא למלא כותרת ותאריך." };
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

  if (!profile || (profile.role !== "branch_center" && profile.role !== "branch_supervisor" && profile.role !== "admin")) {
    return { error: "אין הרשאה." };
  }
  const branchId = profile.branch_id ?? (formData.get("branch_id") as string);
  if (!branchId && profile.role === "branch_center") {
    return { error: "חסר סניף." };
  }
  if (!branchId) {
    return { error: "נא לבחור סניף." };
  }

  const { error } = await supabase.from("activities").insert({
    branch_id: branchId,
    title,
    scheduled_at,
    status: "scheduled",
    created_by: user.id,
  });

  if (error) return { error: "שגיאה בשמירה. נסי שוב." };
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/activities");
  return {};
}

export async function completeChecklistStartAction(
  _prev: ActivityFormState,
  formData: FormData
): Promise<ActivityFormState> {
  const activityId = (formData.get("activity_id") as string)?.trim();
  if (!activityId) return { error: "חסר מזהה פעילות." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "יש להתחבר מחדש." };

  const { error } = await supabase
    .from("activities")
    .update({
      checklist_start_completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", activityId);

  if (error) return { error: "שגיאה." };
  revalidatePath("/dashboard/activities");
  return {};
}

export async function completeChecklistEndAction(
  _prev: ActivityFormState,
  formData: FormData
): Promise<ActivityFormState> {
  const activityId = (formData.get("activity_id") as string)?.trim();
  if (!activityId) return { error: "חסר מזהה פעילות." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "יש להתחבר מחדש." };

  const { error } = await supabase
    .from("activities")
    .update({
      checklist_end_completed_at: new Date().toISOString(),
      status: "completed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", activityId);

  if (error) return { error: "שגיאה." };
  revalidatePath("/dashboard/activities");
  return {};
}
