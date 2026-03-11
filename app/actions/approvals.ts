"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { UserRole } from "@/types/database";

export type ApprovalActionState = { error?: string };

export async function approveUserAction(
  _prev: ApprovalActionState,
  formData: FormData
): Promise<ApprovalActionState> {
  const profileId = formData.get("profile_id") as string;
  if (!profileId) return { error: "חסר מזהה משתמש." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "יש להתחבר מחדש." };

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("role, approval_status")
    .eq("id", user.id)
    .single();

  if (!myProfile || myProfile.approval_status !== "approved") {
    return { error: "אין הרשאה." };
  }

  const { data: target } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", profileId)
    .single();

  if (!target) return { error: "משתמש לא נמצא." };

  const canApproveBranchCenter =
    myProfile.role === "secretary" && target.role === "branch_center";
  const canApproveStaff =
    myProfile.role === "admin" &&
    ["secretary", "branch_supervisor", "content_manager", "admin", "safety_officer"].includes(
      target.role
    );

  if (!canApproveBranchCenter && !canApproveStaff) {
    return { error: "אין הרשאה לאשר משתמש זה." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      approval_status: "approved",
      approved_by: user.id,
      approved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", profileId);

  if (error) return { error: "שגיאה בעדכון." };
  revalidatePath("/approvals");
  return {};
}

export async function rejectUserAction(
  _prev: ApprovalActionState,
  formData: FormData
): Promise<ApprovalActionState> {
  const profileId = formData.get("profile_id") as string;
  if (!profileId) return { error: "חסר מזהה משתמש." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "יש להתחבר מחדש." };

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("role, approval_status")
    .eq("id", user.id)
    .single();

  if (!myProfile || myProfile.approval_status !== "approved") {
    return { error: "אין הרשאה." };
  }

  const { data: target } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", profileId)
    .single();

  if (!target) return { error: "משתמש לא נמצא." };

  const canRejectBranchCenter =
    myProfile.role === "secretary" && target.role === "branch_center";
  const canRejectStaff =
    myProfile.role === "admin" &&
    ["secretary", "branch_supervisor", "content_manager", "admin", "safety_officer"].includes(
      target.role
    );

  if (!canRejectBranchCenter && !canRejectStaff) {
    return { error: "אין הרשאה לדחות משתמש זה." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      approval_status: "rejected",
      updated_at: new Date().toISOString(),
    })
    .eq("id", profileId);

  if (error) return { error: "שגיאה בעדכון." };
  revalidatePath("/approvals");
  return {};
}
