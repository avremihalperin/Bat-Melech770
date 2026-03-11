"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { UserRole } from "@/types/database";

export type RegisterState = { error?: string };

const STAFF_ROLES: UserRole[] = [
  "secretary",
  "branch_supervisor",
  "content_manager",
  "admin",
  "safety_officer",
];

export async function registerAction(
  _prev: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const kind = formData.get("kind") as string;
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const full_name = (formData.get("full_name") as string)?.trim();
  const family_name = (formData.get("family_name") as string)?.trim();
  const mother_name = (formData.get("mother_name") as string)?.trim() || null;
  const id_number = (formData.get("id_number") as string)?.trim() || null;
  const phone = (formData.get("phone") as string)?.trim() || null;

  if (!email || !password || !full_name || !family_name) {
    return { error: "נא למלא את כל השדות החובה." };
  }
  if (password.length < 6) {
    return { error: "הסיסמה חייבת להכיל לפחות 6 תווים." };
  }

  if (kind === "branch_center") {
    const branch_id = (formData.get("branch_id") as string)?.trim();
    if (!branch_id) {
      return { error: "נא לבחור סניף." };
    }
    return registerBranchCenter(formData, {
      email,
      password,
      full_name,
      family_name,
      mother_name,
      id_number,
      phone,
      branch_id,
    });
  }

  if (kind === "staff") {
    const role = formData.get("role") as UserRole;
    if (!role || !STAFF_ROLES.includes(role)) {
      return { error: "נא לבחור תפקיד תקין." };
    }
    return registerStaff(formData, {
      email,
      password,
      full_name,
      family_name,
      mother_name,
      id_number,
      phone,
      role,
    });
  }

  return { error: "נא לבחור סוג הרשמה (מרכזת סניף או צוות מטה)." };
}

async function registerBranchCenter(
  _formData: FormData,
  data: {
    email: string;
    password: string;
    full_name: string;
    family_name: string;
    mother_name: string | null;
    id_number: string | null;
    phone: string | null;
    branch_id: string;
  }
): Promise<RegisterState> {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: { emailRedirectTo: undefined },
  });

  if (authError) {
    return {
      error:
        authError.message === "User already registered"
          ? "כתובת הדואר כבר רשומה במערכת."
          : "אירעה שגיאה. נסי שוב.",
    };
  }
  if (!authData.user) {
    return { error: "אירעה שגיאה ביצירת החשבון." };
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: authData.user.id,
    full_name: data.full_name,
    family_name: data.family_name,
    mother_name: data.mother_name,
    id_number: data.id_number,
    phone: data.phone,
    email: data.email,
    role: "branch_center",
    branch_id: data.branch_id,
    approval_status: "pending",
  });

  if (profileError) {
    return { error: "החשבון נוצר אך שמירת הפרטים נכשלה. פני למשרד." };
  }

  redirect("/pending");
}

async function registerStaff(
  _formData: FormData,
  data: {
    email: string;
    password: string;
    full_name: string;
    family_name: string;
    mother_name: string | null;
    id_number: string | null;
    phone: string | null;
    role: UserRole;
  }
): Promise<RegisterState> {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: { emailRedirectTo: undefined },
  });

  if (authError) {
    return {
      error:
        authError.message === "User already registered"
          ? "כתובת הדואר כבר רשומה במערכת."
          : "אירעה שגיאה. נסי שוב.",
    };
  }
  if (!authData.user) {
    return { error: "אירעה שגיאה ביצירת החשבון." };
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: authData.user.id,
    full_name: data.full_name,
    family_name: data.family_name,
    mother_name: data.mother_name,
    id_number: data.id_number,
    phone: data.phone,
    email: data.email,
    role: data.role,
    branch_id: null,
    approval_status: "pending",
  });

  if (profileError) {
    return { error: "החשבון נוצר אך שמירת הפרטים נכשלה. פני למשרד." };
  }

  redirect("/pending");
}
