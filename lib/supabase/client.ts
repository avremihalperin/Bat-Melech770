import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client לשימוש ברכיבי Client (דפדפן).
 * משתמש רק במשתנים עם NEXT_PUBLIC_ — מתאים לאבטחה.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("חסרים משתני סביבה: NEXT_PUBLIC_SUPABASE_URL או NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return createBrowserClient(url, anonKey);
}
