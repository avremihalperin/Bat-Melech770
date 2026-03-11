"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type FinanceActionState = { error?: string };

export async function allocateBudgetAction(
  _prev: FinanceActionState,
  formData: FormData
): Promise<FinanceActionState> {
  const branch_id = (formData.get("branch_id") as string)?.trim();
  const amountStr = (formData.get("amount") as string)?.trim();
  const note = (formData.get("note") as string)?.trim() || null;

  if (!branch_id || !amountStr) {
    return { error: "נא לבחור סניף ולהזין סכום." };
  }
  const amount = parseFloat(amountStr);
  if (Number.isNaN(amount) || amount <= 0) {
    return { error: "נא להזין סכום תקין." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "יש להתחבר מחדש." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "secretary" && profile?.role !== "admin") {
    return { error: "אין הרשאה להזנת תקציב." };
  }

  const { error } = await supabase.from("budget_allocations").insert({
    branch_id,
    amount,
    note,
    allocated_by: user.id,
  });

  if (error) return { error: "שגיאה בשמירה. נסי שוב." };
  revalidatePath("/dashboard/finance");
  return {};
}

export async function approveReceiptAction(
  _prev: FinanceActionState,
  formData: FormData
): Promise<FinanceActionState> {
  const receiptId = (formData.get("receipt_id") as string)?.trim();
  if (!receiptId) return { error: "חסר מזהה קבלה." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "יש להתחבר מחדש." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "secretary" && profile?.role !== "admin") {
    return { error: "אין הרשאה." };
  }

  const { error } = await supabase
    .from("receipts")
    .update({
      status: "approved",
      approved_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", receiptId)
    .eq("status", "pending");

  if (error) return { error: "שגיאה באישור." };
  revalidatePath("/dashboard/finance");
  return {};
}

export async function rejectReceiptAction(
  _prev: FinanceActionState,
  formData: FormData
): Promise<FinanceActionState> {
  const receiptId = (formData.get("receipt_id") as string)?.trim();
  const reason = (formData.get("rejection_reason") as string)?.trim() || null;
  if (!receiptId) return { error: "חסר מזהה קבלה." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "יש להתחבר מחדש." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "secretary" && profile?.role !== "admin") {
    return { error: "אין הרשאה." };
  }

  const { error } = await supabase
    .from("receipts")
    .update({
      status: "rejected",
      rejection_reason: reason,
      updated_at: new Date().toISOString(),
    })
    .eq("id", receiptId)
    .eq("status", "pending");

  if (error) return { error: "שגיאה בדחייה." };
  revalidatePath("/dashboard/finance");
  return {};
}
