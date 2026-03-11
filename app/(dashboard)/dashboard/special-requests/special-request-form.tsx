"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitSpecialRequestAction, type SpecialRequestFormState } from "@/app/actions/special-requests";

export function SpecialRequestForm() {
  const [state, formAction] = useActionState(submitSpecialRequestAction, {} as SpecialRequestFormState);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button variant="gradient" size="sm" onClick={() => setOpen((o) => !o)}>
        📄 בקשה לפעילות שוברת שגרה
      </Button>
      {open && (
        <form action={formAction} className="mt-4 flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-4">
          <div>
            <Label htmlFor="sr_title">כותרת הבקשה *</Label>
            <Input id="sr_title" name="title" required placeholder="למשל: טיול שנתי" />
          </div>
          <div>
            <Label htmlFor="sr_description">תיאור</Label>
            <Input id="sr_description" name="description" placeholder="פרטים נוספים" />
          </div>
          {state?.error && <p className="text-destructive text-sm">{state.error}</p>}
          <div className="flex gap-2">
            <Button type="submit">שליחת בקשה</Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>ביטול</Button>
          </div>
        </form>
      )}
    </div>
  );
}
