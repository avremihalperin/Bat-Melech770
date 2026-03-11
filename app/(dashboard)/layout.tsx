import { cookies } from "next/headers";
import { requireApprovedUser } from "@/lib/auth";
import { getNavItemsForRole } from "@/lib/nav";
import { isDemoUser } from "@/lib/demo";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

function roleLabel(role: string): string {
  const labels: Record<string, string> = {
    branch_center: "מרכזת סניף",
    secretary: "מזכירה",
    branch_supervisor: "אחראית סניפים",
    content_manager: "אחראית תוכן",
    admin: "מנהלת",
    safety_officer: "אחראית בטיחות",
  };
  return labels[role] ?? role;
}

const DEMO_VIEW_ROLES = ["secretary", "branch_supervisor", "content_manager", "admin", "safety_officer", "branch_center"] as const;

/**
 * Layout לאזור המאושר — Header + Sidebar דינמי לפי תפקיד, רספונסיבי.
 * משתמש דמו: הסרגל והכותרת לפי cookie demo_nav_role (נשמר ב־/dashboard?view=...).
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireApprovedUser();
  const cookieStore = await cookies();
  const demoNavRole = cookieStore.get("demo_nav_role")?.value;

  const isDemo = isDemoUser(profile.email ?? undefined);
  const roleForNav =
    isDemo &&
    demoNavRole &&
    DEMO_VIEW_ROLES.includes(demoNavRole as (typeof DEMO_VIEW_ROLES)[number])
      ? (demoNavRole as (typeof DEMO_VIEW_ROLES)[number])
      : profile.role;

  const subtitle =
    profile.branch?.name != null
      ? `${profile.branch.name} — ${roleLabel(profile.role)}`
      : `מטה — ${roleLabel(roleForNav)}`;

  const baseNav = getNavItemsForRole(roleForNav);
  const navItems = isDemo
    ? [{ label: "מסך הדגמה", href: "/demo" }, ...baseNav]
    : baseNav;

  return (
    <DashboardShell
      navItems={navItems}
      subtitle={subtitle}
      notificationCount={0}
    >
      {children}
    </DashboardShell>
  );
}
