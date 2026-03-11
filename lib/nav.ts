/**
 * ניווט צד (Sidebar) לפי תפקיד.
 * מתאים לאפיון: קישורים לכל האזורים המרכזיים של אותו בעל תפקיד.
 */

import type { UserRole } from "@/types/database";

export interface NavItem {
  label: string;
  href: string;
}

const ROLE_NAV: Record<UserRole, NavItem[]> = {
  branch_center: [
    { label: "דשבורד", href: "/dashboard" },
    { label: "ניהול תקציב", href: "/dashboard/budget" },
    { label: "חניכות וצוות", href: "/dashboard/trainees" },
    { label: "פרופיל הסניף", href: "/dashboard/branch-profile" },
    { label: "בטיחות ורגישויות", href: "/dashboard/safety" },
    { label: "פעילויות", href: "/dashboard/activities" },
    { label: "תוכן וארכיון", href: "/dashboard/content" },
    { label: "בקשות מיוחדות", href: "/dashboard/special-requests" },
    { label: "הודעות", href: "/dashboard/messages" },
  ],
  secretary: [
    { label: "דשבורד", href: "/dashboard" },
    { label: "ניהול כספים", href: "/dashboard/finance" },
    { label: "ניהול משתמשים וסניפים", href: "/dashboard/users-branches" },
    { label: "פתיחת / הוספת סניף", href: "/dashboard/users-branches/add" },
    { label: "מלאי וציוד", href: "/dashboard/inventory" },
    { label: "הודעות", href: "/dashboard/messages" },
    { label: "אישורי הרשמה", href: "/approvals" },
  ],
  branch_supervisor: [
    { label: "דשבורד", href: "/dashboard" },
    { label: "מעקב ופיקוח", href: "/dashboard/supervision" },
    { label: "פתיחת / הוספת סניף", href: "/dashboard/users-branches/add" },
    { label: "תקשורת", href: "/dashboard/messages" },
  ],
  content_manager: [
    { label: "דשבורד", href: "/dashboard" },
    { label: "ניהול חומרים", href: "/dashboard/materials" },
    { label: "ארכיון תוכן", href: "/dashboard/archive" },
    { label: "תקשורת", href: "/dashboard/messages" },
  ],
  admin: [
    { label: "דשבורד", href: "/dashboard" },
    { label: "אישורים", href: "/approvals" },
    { label: "בקרת נתונים", href: "/dashboard/admin-data" },
  ],
  safety_officer: [
    { label: "דשבורד", href: "/dashboard" },
    { label: "בטיחות סניפים", href: "/dashboard/safety-reports" },
    { label: "פניות", href: "/dashboard/safety-inbox" },
    { label: "תיק רפואי", href: "/dashboard/medical" },
  ],
};

export function getNavItemsForRole(role: UserRole): NavItem[] {
  return ROLE_NAV[role] ?? ROLE_NAV.branch_center;
}
