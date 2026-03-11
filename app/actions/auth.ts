"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signOutAction(_formData?: FormData | unknown) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
