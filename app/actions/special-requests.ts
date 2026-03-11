"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type SpecialRequestFormState = { error?: string };

export async function submitSpecialRequestAction(
  _prev: SpecialRequestFormState,
  formData: FormData
): Promise<SpecialRequestFormState> {
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  if (!title) return { error: "נא למלא כותרת." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "יש להתחבר מחדש." };
  const { data: profile } = await supabase.from("profiles").select("role, branch_id").eq("id", user.id).single();
  if (!profile?.branch_id) return { error: "אין הרשאה (מרכזת סניף)." };

  const { error } = await supabase.from("special_activity_requests").insert({
    branch_id: profile.branch_id,
    requested_by: user.id,
    title,
    description,
    status: "pending",
  });
  if (error) return { error: "שגיאה בשמירה." };
  revalidatePath("/dashboard/special-requests");
  return {};
}

export async function approveSpecialRequestSafetyAction(
  _prev: SpecialRequestFormState,
  formData: FormData
): Promise<SpecialRequestFormState> {
  const id = (formData.get("request_id") as string)?.trim();
  if (!id) return { error: "חסר מזהה." };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "יש להתחבר מחדש." };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "safety_officer" && profile?.role !== "admin") return { error: "אין הרשאה." };

  const { error } = await supabase.from("special_activity_requests").update({
    status: "safety_approved",
    safety_approved_by: user.id,
    updated_at: new Date().toISOString(),
  }).eq("id", id).eq("status", "pending");
  if (error) return { error: "שגיאה." };
  revalidatePath("/dashboard/safety-reports");
  revalidatePath("/dashboard/special-requests");
  return {};
}

export async function approveSpecialRequestContentAction(
  _prev: SpecialRequestFormState,
  formData: FormData
): Promise<SpecialRequestFormState> {
  const id = (formData.get("request_id") as string)?.trim();
  if (!id) return { error: "חסר מזהה." };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "יש להתחבר מחדש." };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "content_manager" && profile?.role !== "admin") return { error: "אין הרשאה." };

  const { error } = await supabase.from("special_activity_requests").update({
    status: "content_approved",
    content_approved_by: user.id,
    updated_at: new Date().toISOString(),
  }).eq("id", id).in("status", ["pending", "safety_approved"]);
  if (error) return { error: "שגיאה." };
  revalidatePath("/dashboard/materials");
  revalidatePath("/dashboard/special-requests");
  return {};
}
