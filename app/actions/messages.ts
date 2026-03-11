"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type MessageFormState = { error?: string };

export async function sendMessageAction(
  _prev: MessageFormState,
  formData: FormData
): Promise<MessageFormState> {
  const subject = (formData.get("subject") as string)?.trim();
  const body = (formData.get("body") as string)?.trim();
  const to_user_id = (formData.get("to_user_id") as string)?.trim() || null;
  const to_branch_id = (formData.get("to_branch_id") as string)?.trim() || null;
  if (!subject || !body) return { error: "נא למלא נושא ותוכן." };
  if (!to_user_id && !to_branch_id) return { error: "נא לבחור נמען או סניף." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "יש להתחבר מחדש." };

  const { error } = await supabase.from("messages").insert({
    from_user_id: user.id,
    to_user_id: to_user_id || null,
    to_branch_id: to_branch_id || null,
    subject,
    body,
  });
  if (error) return { error: "שגיאה בשליחה." };
  revalidatePath("/dashboard/messages");
  return {};
}

export async function markMessageReadAction(messageId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("messages").update({ read_at: new Date().toISOString() }).eq("id", messageId).eq("to_user_id", user.id);
  revalidatePath("/dashboard/messages");
}
