"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type InventoryFormState = { error?: string };

export async function addInventoryItemAction(
  _prev: InventoryFormState,
  formData: FormData
): Promise<InventoryFormState> {
  const name = (formData.get("name") as string)?.trim();
  const quantityStr = (formData.get("quantity") as string)?.trim();
  if (!name) return { error: "נא למלא שם." };
  const quantity = parseInt(quantityStr || "0", 10);
  if (Number.isNaN(quantity) || quantity < 0) return { error: "נא להזין כמות תקינה." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "יש להתחבר מחדש." };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "secretary" && profile?.role !== "admin") return { error: "אין הרשאה." };

  const { error } = await supabase.from("inventory_items").insert({
    name,
    quantity,
    unit: (formData.get("unit") as string)?.trim() || null,
    notes: (formData.get("notes") as string)?.trim() || null,
    updated_by: user.id,
  });
  if (error) return { error: "שגיאה בשמירה." };
  revalidatePath("/dashboard/inventory");
  return {};
}

export async function updateInventoryItemAction(
  _prev: InventoryFormState,
  formData: FormData
): Promise<InventoryFormState> {
  const id = (formData.get("item_id") as string)?.trim();
  const quantityStr = (formData.get("quantity") as string)?.trim();
  if (!id) return { error: "חסר מזהה." };
  const quantity = parseInt(quantityStr ?? "0", 10);
  if (Number.isNaN(quantity) || quantity < 0) return { error: "כמות לא תקינה." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "יש להתחבר מחדש." };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "secretary" && profile?.role !== "admin") return { error: "אין הרשאה." };

  const { error } = await supabase.from("inventory_items").update({
    quantity,
    updated_by: user.id,
    updated_at: new Date().toISOString(),
  }).eq("id", id);
  if (error) return { error: "שגיאה בעדכון." };
  revalidatePath("/dashboard/inventory");
  return {};
}
