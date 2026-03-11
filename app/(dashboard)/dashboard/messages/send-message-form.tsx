"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendMessageAction, type MessageFormState } from "@/app/actions/messages";

type Branch = { id: string; name: string };

export function SendMessageForm({ branches }: { branches: Branch[] }) {
  const [state, formAction] = useActionState(sendMessageAction, {} as MessageFormState);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button variant="gradient" size="sm" onClick={() => setOpen((o) => !o)}>
        שליחת הודעה לסניף
      </Button>
      {open && (
        <form action={formAction} className="mt-4 flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-4">
          <div>
            <Label htmlFor="msg_branch">לסניף *</Label>
            <select id="msg_branch" name="to_branch_id" required className="mt-1 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
              <option value="">בחירה</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="msg_subject">נושא *</Label>
            <Input id="msg_subject" name="subject" required />
          </div>
          <div>
            <Label htmlFor="msg_body">תוכן *</Label>
            <Input id="msg_body" name="body" required />
          </div>
          {state?.error && <p className="text-destructive text-sm">{state.error}</p>}
          <div className="flex gap-2">
            <Button type="submit">שליחה</Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>ביטול</Button>
          </div>
        </form>
      )}
    </div>
  );
}
