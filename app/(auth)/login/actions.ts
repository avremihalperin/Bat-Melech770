"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { isDemoUser } from "@/lib/demo";

export type LoginState = { error?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "נא למלא דואר אלקטרוני וסיסמה." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "פרטי ההתחברות שגויים. נסי שוב." };
  }

  if (isDemoUser(email)) {
    redirect("/demo");
  }
  redirect("/");
}
