"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addActivityAction, type ActivityFormState } from "@/app/actions/activities";

export function ActivityAddForm({ branchId }: { branchId: string }) {
  const [state, formAction] = useActionState(addActivityAction, {} as ActivityFormState);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button
        type="button"
        variant="gradient"
        size="sm"
        onClick={() => setOpen((o) => !o)}
      >
        הוסף פעילות חדשה
      </Button>
      {open && (
        <form
          action={formAction}
          className="border-border mt-4 flex flex-col gap-3 rounded-lg border bg-muted/30 p-4"
        >
          <input type="hidden" name="branch_id" value={branchId} />
          <div>
            <Label htmlFor="act_title">כותרת הפעילות *</Label>
            <Input id="act_title" name="title" required placeholder="למשל: מפגש שבועי" />
          </div>
          <div>
            <Label htmlFor="act_scheduled_at">תאריך ושעה *</Label>
            <Input
              id="act_scheduled_at"
              name="scheduled_at"
              type="datetime-local"
              required
            />
          </div>
          {state?.error && (
            <p className="text-destructive text-sm">{state.error}</p>
          )}
          <div className="flex gap-2">
            <Button type="submit" variant="default">
              שמירה
            </Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              ביטול
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
