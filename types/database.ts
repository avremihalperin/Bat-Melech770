/**
 * טיפוסים התואמים לטבלאות Supabase (פרויקט ארגון נוער).
 * לעדכן בהתאם ל־schema אם משתנים שמות או שדות.
 */

export type UserRole =
  | "branch_center"
  | "secretary"
  | "branch_supervisor"
  | "content_manager"
  | "admin"
  | "safety_officer";

export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface Branch {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  family_name: string;
  mother_name: string | null;
  id_number: string | null;
  phone: string | null;
  email: string | null;
  role: UserRole;
  branch_id: string | null;
  approval_status: ApprovalStatus;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileWithBranch extends Profile {
  branch?: Branch | null;
}
