"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addTraineeAction, type TraineeFormState } from "@/app/actions/trainees";

export function TraineeAddForm() {
  const [state, formAction] = useActionState(addTraineeAction, {} as TraineeFormState);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button
        type="button"
        variant="gradient"
        size="sm"
        onClick={() => setOpen((o) => !o)}
      >
        + הוספת חניכה חדשה
      </Button>
      {open && (
        <form
          action={formAction}
          className="border-border mt-4 flex flex-col gap-3 rounded-lg border bg-muted/30 p-4"
        >
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <Label htmlFor="t_first_name">שם פרטי *</Label>
              <Input id="t_first_name" name="first_name" required />
            </div>
            <div>
              <Label htmlFor="t_last_name">שם משפחה *</Label>
              <Input id="t_last_name" name="last_name" required />
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <Label htmlFor="t_mother_name">שם האם</Label>
              <Input id="t_mother_name" name="mother_name" />
            </div>
            <div>
              <Label htmlFor="t_id_number">תעודת זהות</Label>
              <Input id="t_id_number" name="id_number" type="text" maxLength={9} />
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <Label htmlFor="t_phone">טלפון</Label>
              <Input id="t_phone" name="phone" type="tel" />
            </div>
            <div>
              <Label htmlFor="t_email">מייל</Label>
              <Input id="t_email" name="email" type="email" />
            </div>
          </div>
          <div>
            <Label htmlFor="t_address">כתובת</Label>
            <Input id="t_address" name="address" />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <Label htmlFor="t_parent_phone">טלפון הורים</Label>
              <Input id="t_parent_phone" name="parent_phone" type="tel" />
            </div>
            <div>
              <Label htmlFor="t_parent_email">מייל הורים</Label>
              <Input id="t_parent_email" name="parent_email" type="email" />
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <Label htmlFor="t_allergies">אלרגיות</Label>
              <Input id="t_allergies" name="allergies" />
            </div>
            <div>
              <Label htmlFor="t_sensitivities">רגישויות</Label>
              <Input id="t_sensitivities" name="sensitivities" />
            </div>
          </div>
          <div>
            <Label htmlFor="t_emergency_instructions">הנחיות חירום</Label>
            <Input id="t_emergency_instructions" name="emergency_instructions" />
          </div>
          <div>
            <Label htmlFor="t_notes">הערות</Label>
            <Input id="t_notes" name="notes" />
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
