import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { DEMO_USER_EMAIL } from "@/lib/demo";

const DEMO_VIEW_ROLES = ["secretary", "branch_supervisor", "content_manager", "admin", "safety_officer", "branch_center"];

/**
 * Middleware של Next.js — רץ לפני כל בקשת דף.
 * משמש לרענון סשן Supabase (אותנטיקציה).
 * עבור משתמש דמו: שומר view= ו־branch_id ב-cookie כדי שהסרגל והמסכים יתעדכנו.
 */
export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const pathname = request.nextUrl.pathname;
  const isDemo = user?.email === DEMO_USER_EMAIL;

  if (isDemo && pathname === "/dashboard") {
    const view = request.nextUrl.searchParams.get("view");
    const branchId = request.nextUrl.searchParams.get("branch_id");
    const role =
      view && DEMO_VIEW_ROLES.includes(view) ? view : "admin";
    response.cookies.set("demo_nav_role", role, {
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    if (view === "branch_center" && branchId) {
      response.cookies.set("demo_branch_id", branchId, {
        path: "/",
        maxAge: 60 * 60 * 24,
      });
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
