import { getProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SendMessageForm } from "./send-message-form";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("he-IL", { dateStyle: "short", timeStyle: "short" }).format(new Date(iso));
}

export default async function MessagesPage() {
  const profile = await getProfile();
  if (!profile) return null;
  const supabase = await createClient();

  const messagesFilter = profile.branch_id
    ? `to_user_id.eq.${profile.id},to_branch_id.eq.${profile.branch_id}`
    : `to_user_id.eq.${profile.id}`;
  const { data: messages } = await supabase
    .from("messages")
    .select("id, from_user_id, to_user_id, to_branch_id, subject, body, read_at, created_at")
    .or(messagesFilter)
    .order("created_at", { ascending: false })
    .limit(50);

  const { data: branches } = profile.role === "secretary" || profile.role === "admin"
    ? await supabase.from("branches").select("id, name").order("name")
    : { data: [] };

  return (
    <div className="flex min-w-0 flex-col gap-6 sm:gap-8">
      <h1 className="text-primary text-xl font-bold sm:text-2xl">הודעות</h1>
      <p className="text-muted-foreground text-sm sm:text-base">תיבת דואר פנימית להתכתבות מול מחלקות המשרד.</p>

      {(profile.role === "secretary" || profile.role === "admin") && branches && branches.length > 0 && (
        <Card>
          <CardHeader className="px-3 py-3 sm:px-6 sm:py-4">
            <CardTitle className="text-base sm:text-lg">שליחת הודעה לסניף</CardTitle>
            <CardDescription>הודעה תגיע לתיבת ההודעות של הסניף</CardDescription>
          </CardHeader>
          <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
            <SendMessageForm branches={branches} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="px-3 py-3 sm:px-6 sm:py-4">
          <CardTitle className="text-base sm:text-lg">תיבת דואר נכנס</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
          {!messages?.length ? (
            <p className="text-muted-foreground">אין הודעות.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {messages.map((m: { id: string; subject: string; body: string; read_at: string | null; created_at: string }) => (
                  <li key={m.id} className={`rounded-lg border p-3 ${m.read_at ? "border-border" : "border-primary/30 bg-primary/5"}`}>
                    <p className="font-medium">{m.subject}</p>
                    <p className="text-muted-foreground text-sm">הודעה מהמשרד</p>
                    <p className="mt-1 text-sm">{m.body}</p>
                    <p className="text-muted-foreground mt-1 text-xs">{formatDate(m.created_at)}</p>
                  </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
