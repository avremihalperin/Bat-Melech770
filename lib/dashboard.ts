/**
 * נתונים לדשבורד — יתרה, הודעות מתגלגלות, פעילויות קרובות.
 * לשימוש ב-Server Components בלבד.
 */

import { createClient } from "@/lib/supabase/server";

export interface BranchBalance {
  totalAllocations: number;
  totalApprovedReceipts: number;
  balance: number;
}

export async function getBranchBalance(
  branchId: string
): Promise<BranchBalance> {
  const supabase = await createClient();

  const { data: allocations } = await supabase
    .from("budget_allocations")
    .select("amount")
    .eq("branch_id", branchId);

  const { data: receipts } = await supabase
    .from("receipts")
    .select("amount")
    .eq("branch_id", branchId)
    .eq("status", "approved");

  const totalAllocations = (allocations ?? []).reduce(
    (sum, r) => sum + Number(r.amount),
    0
  );
  const totalApprovedReceipts = (receipts ?? []).reduce(
    (sum, r) => sum + Number(r.amount),
    0
  );

  return {
    totalAllocations,
    totalApprovedReceipts,
    balance: totalAllocations - totalApprovedReceipts,
  };
}

export interface AnnouncementRow {
  id: string;
  title: string;
  body: string;
  created_at: string;
}

export async function getActiveAnnouncements(
  limit = 10
): Promise<AnnouncementRow[]> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data } = await supabase
    .from("announcements")
    .select("id, title, body, created_at")
    .or(`active_until.is.null,active_until.gte.${now}`)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []) as AnnouncementRow[];
}

export interface UpcomingActivity {
  id: string;
  title: string;
  scheduled_at: string;
  status: string;
}

export async function getUpcomingActivities(
  branchId: string,
  limit = 5
): Promise<UpcomingActivity[]> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data } = await supabase
    .from("activities")
    .select("id, title, scheduled_at, status")
    .eq("branch_id", branchId)
    .in("status", ["scheduled"])
    .gte("scheduled_at", now)
    .order("scheduled_at", { ascending: true })
    .limit(limit);

  return (data ?? []) as UpcomingActivity[];
}

/** מזכירה: מספר הרשמות ממתינות (מרכזות + צוות) */
export async function getPendingApprovalsCount(): Promise<{ branchCenters: number; staff: number }> {
  const supabase = await createClient();
  const [bc, staff] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("approval_status", "pending").eq("role", "branch_center"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("approval_status", "pending").neq("role", "branch_center"),
  ]);
  return { branchCenters: bc.count ?? 0, staff: staff.count ?? 0 };
}

/** אחראית תוכן: בקשות שוברות שגרה ממתינות */
export async function getPendingSpecialRequests(limit = 10) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("special_activity_requests")
    .select("id, title, branch_id, status, created_at, branches(name)")
    .in("status", ["pending", "safety_approved"])
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

/** אחראית בטיחות: דיווחי בטיחות אחרונים */
export async function getRecentSafetyReports(limit = 10) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("safety_reports")
    .select("id, report_type, description, branch_id, created_at, branches(name)")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

/** מנהלת: סטטיסטיקות כלליות */
export async function getAdminStats(): Promise<{
  branchesCount: number;
  traineesCount: number;
  pendingApprovals: number;
}> {
  const supabase = await createClient();
  const [branches, trainees, pending] = await Promise.all([
    supabase.from("branches").select("id", { count: "exact", head: true }),
    supabase.from("trainees").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("approval_status", "pending"),
  ]);
  return {
    branchesCount: branches.count ?? 0,
    traineesCount: trainees.count ?? 0,
    pendingApprovals: pending.count ?? 0,
  };
}

/** אחראית סניפים: פעילויות קרובות מכל הסניפים */
export async function getUpcomingActivitiesAllBranches(limit = 15) {
  const supabase = await createClient();
  const now = new Date().toISOString();
  const { data } = await supabase
    .from("activities")
    .select("id, title, scheduled_at, branch_id, branches(name)")
    .in("status", ["scheduled"])
    .gte("scheduled_at", now)
    .order("scheduled_at", { ascending: true })
    .limit(limit);
  return data ?? [];
}
