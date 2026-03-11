"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ContentFormState = { error?: string };

export async function uploadContentMaterialAction(
  _prev: ContentFormState,
  formData: FormData
): Promise<ContentFormState> {
  const title = (formData.get("title") as string)?.trim();
  const file_url = (formData.get("file_url") as string)?.trim();
  const category = (formData.get("category") as string)?.trim() || "activity_materials";
  if (!title || !file_url) return { error: "נא למלא כותרת וקישור לקובץ." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "יש להתחבר מחדש." };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "content_manager" && profile?.role !== "admin") return { error: "אין הרשאה." };

  const { error } = await supabase.from("content_materials").insert({
    title,
    file_url,
    category,
    uploaded_by: user.id,
  });
  if (error) return { error: "שגיאה בשמירה." };
  revalidatePath("/dashboard/materials");
  revalidatePath("/dashboard/content");
  return {};
}

export async function uploadBranchDocumentAction(
  _prev: ContentFormState,
  formData: FormData
): Promise<ContentFormState> {
  const name = (formData.get("name") as string)?.trim();
  const file_url = (formData.get("file_url") as string)?.trim();
  const document_type = (formData.get("document_type") as string) as "document" | "photo" || "document";
  const category = (formData.get("category") as string)?.trim() || null;
  if (!name || !file_url) return { error: "נא למלא שם וקישור." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "יש להתחבר מחדש." };
  const { data: profile } = await supabase.from("profiles").select("role, branch_id").eq("id", user.id).single();
  if (!profile?.branch_id && profile?.role !== "secretary" && profile?.role !== "admin") return { error: "אין הרשאה." };
  const branch_id = profile?.branch_id ?? (formData.get("branch_id") as string);
  if (!branch_id) return { error: "חסר סניף." };

  const { error } = await supabase.from("branch_documents").insert({
    branch_id,
    file_url,
    name,
    document_type: document_type === "photo" ? "photo" : "document",
    category,
    uploaded_by: user.id,
  });
  if (error) return { error: "שגיאה בשמירה." };
  revalidatePath("/dashboard/content");
  return {};
}
