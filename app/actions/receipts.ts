"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ReceiptSubmitState = { error?: string };

export async function submitReceiptAction(
  _prev: ReceiptSubmitState,
  formData: FormData
): Promise<ReceiptSubmitState> {
  const amountStr = (formData.get("amount") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() ?? null;
  const receipt_url = (formData.get("receipt_url") as string)?.trim();

  if (!amountStr || !receipt_url) {
    return { error: "נא למלא סכום וקישור לקבלה." };
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
    .select("role, branch_id")
    .eq("id", user.id)
    .single();

  if (
    !profile ||
    profile.role !== "branch_center" ||
    !profile.branch_id
  ) {
    return { error: "אין הרשאה להעלות קבלה." };
  }

  const { error } = await supabase.from("receipts").insert({
    branch_id: profile.branch_id,
    amount,
    receipt_url,
    description,
    status: "pending",
    submitted_by: user.id,
  });

  if (error) return { error: "שגיאה בשמירת הקבלה. נסי שוב." };
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/budget");
  return {};
}
