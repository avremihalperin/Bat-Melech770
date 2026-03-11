"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addStaffAction, type StaffFormState } from "@/app/actions/staff";

export function StaffAddForm() {
  const [state, formAction] = useActionState(addStaffAction, {} as StaffFormState);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button
        type="button"
        variant="gradient"
        size="sm"
        onClick={() => setOpen((o) => !o)}
      >
        + הוספת איש צוות
      </Button>
      {open && (
        <form
          action={formAction}
          className="border-border mt-4 flex flex-col gap-3 rounded-lg border bg-muted/30 p-4"
        >
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <Label htmlFor="s_first_name">שם פרטי *</Label>
              <Input id="s_first_name" name="first_name" required />
            </div>
            <div>
              <Label htmlFor="s_last_name">שם משפחה *</Label>
              <Input id="s_last_name" name="last_name" required />
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <Label htmlFor="s_phone">טלפון</Label>
              <Input id="s_phone" name="phone" type="tel" />
            </div>
            <div>
              <Label htmlFor="s_email">מייל</Label>
              <Input id="s_email" name="email" type="email" />
            </div>
          </div>
          <div>
            <Label htmlFor="s_role_notes">הערות תפקיד</Label>
            <Input id="s_role_notes" name="role_notes" />
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
