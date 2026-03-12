/**
 * פונקציות עזר לאותנטיקציה והרשאות — לשימוש ב-Server Components ו-Server Actions.
 * יש לקרוא רק בצד שרת (createClient מ־server).
 */

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import type { Profile, ProfileWithBranch, UserRole } from "@/types/database";
import { redirect } from "next/navigation";
import { isDemoUser } from "@/lib/demo";

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
 * משתמש דמו במצב "מרכזת סניף" (demo_nav_role=branch_center): משתמש ב־demo_branch_id מהקוקי.
 */
export async function requireBranch(): Promise<string> {
  const profile = await requireApprovedUser();
  if (profile.branch_id) return profile.branch_id;

  // דמו: אם צופים כ־מרכזת סניף — השתמש ב־branch_id מהקוקי
  if (isDemoUser(profile.email ?? undefined)) {
    const cookieStore = await cookies();
    const demoNavRole = cookieStore.get("demo_nav_role")?.value;
    const demoBranchId = cookieStore.get("demo_branch_id")?.value;
    if (demoNavRole === "branch_center" && demoBranchId) return demoBranchId;
  }

  redirect("/dashboard");
}
