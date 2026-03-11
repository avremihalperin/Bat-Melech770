import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth";

/**
 * דף הבית: מפנה לפי סטטוס המשתמש — התחברות / ממתין לאישור / דשבורד.
 */
export default async function HomePage() {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  if (profile.approval_status !== "approved") {
    redirect("/pending");
  }

  redirect("/dashboard");
}
