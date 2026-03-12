import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { DEMO_USER_EMAIL } from "@/lib/demo";

const DEMO_VIEW_ROLES = ["secretary", "branch_supervisor", "content_manager", "admin", "safety_officer", "branch_center"];

const COOKIE_OPTS = {
  path: "/",
  maxAge: 60 * 60 * 24,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
} as const;

/**
 * Middleware של Next.js — רץ לפני כל בקשת דף.
 * משמש לרענון סשן Supabase (אותנטיקציה).
 * עבור משתמש דמו: שומר view= ו־branch_id ב-cookie ואז עושה redirect כדי שבבקשה הבאה
 * ה-layout יקרא את ה-cookie (כי ב-request הראשון ה-cookie עדיין לא נשלח).
 */
export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const pathname = request.nextUrl.pathname;
  const isDemo = user?.email === DEMO_USER_EMAIL;

  if (isDemo && pathname === "/dashboard") {
    const view = request.nextUrl.searchParams.get("view");
    const branchId = request.nextUrl.searchParams.get("branch_id");
    const role = view && DEMO_VIEW_ROLES.includes(view) ? view : null;

    if (role != null || (view === "branch_center" && branchId)) {
      const url = request.nextUrl.clone();
      url.searchParams.delete("view");
      url.searchParams.delete("branch_id");
      url.searchParams.delete("org");
      const redirectRes = NextResponse.redirect(url);
      // העתקת Set-Cookie מתשובת Supabase (אם קיים) ל-redirect
      const h = response.headers;
      if ("getSetCookie" in h && typeof (h as Headers & { getSetCookie(): string[] }).getSetCookie === "function") {
        (h as Headers & { getSetCookie(): string[] }).getSetCookie().forEach((v) =>
          redirectRes.headers.append("set-cookie", v)
        );
      }
      redirectRes.cookies.set("demo_nav_role", role ?? "admin", COOKIE_OPTS);
      if (view === "branch_center" && branchId)
        redirectRes.cookies.set("demo_branch_id", branchId, COOKIE_OPTS);
      return redirectRes;
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
