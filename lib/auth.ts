/**
 * פונקציות עזר לאותנטיקציה והרשאות — לשימוש ב-Server Components ו-Server Actions.
 * יש לקרוא רק בצד שרת (createClient מ־server).
 */

import { createClient } from "@/lib/supabase/server";
import type { Profile, ProfileWithBranch, UserRole } from "@/types/database";
import { redirect } from "next/navigation";

/**
 * מחזיר את הפרופיל של המשתמש המחובר, או null אם אין פרופיל.
 */
export async function getProfile(): Promise<ProfileWithBranch | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, branch:branches(*)")
    .eq("id", user.id)
    .single();

  return profile as ProfileWithBranch | null;
}

/**
 * מחזיר את הפרופיל או מפנה להתחברות אם אין משתמש.
 */
export async function requireProfile(): Promise<ProfileWithBranch> {
  const profile = await getProfile();
  if (!profile) redirect("/login");
  return profile;
}

/**
 * מחזיר את הפרופיל רק אם המשתמש מאושר. אחרת מפנה ל־/pending או /login.
 */
export async function requireApprovedUser(): Promise<ProfileWithBranch> {
  const profile = await getProfile();
  if (!profile) redirect("/login");
  if (profile.approval_status !== "approved") redirect("/pending");
  return profile;
}

/**
 * בודק שהמשתמש מאושר ושיש לו אחד מהתפקידים המבוקשים. אחרת מפנה.
 */
export async function requireRole(
  allowedRoles: UserRole[]
): Promise<ProfileWithBranch> {
  const profile = await requireApprovedUser();
  if (!allowedRoles.includes(profile.role)) {
    redirect("/dashboard");
  }
  return profile;
}

/**
 * מחזיר את ה־branch_id של המשתמש המחובר (רק למרכזת סניף רלוונטי).
 */
export async function getMyBranchId(): Promise<string | null> {
  const profile = await getProfile();
  return profile?.branch_id ?? null;
}

/**
 * דורש שמשתמש יהיה מאושר ושייך לסניף (מרכזת). מחזיר את ה־branch_id.
 */
export async function requireBranch(): Promise<string> {
  const profile = await requireApprovedUser();
  if (!profile.branch_id) redirect("/dashboard");
  return profile.branch_id;
}
