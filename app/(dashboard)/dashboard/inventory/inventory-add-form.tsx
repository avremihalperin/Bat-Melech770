"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addInventoryItemAction, type InventoryFormState } from "@/app/actions/inventory";

export function InventoryAddForm() {
  const [state, formAction] = useActionState(addInventoryItemAction, {} as InventoryFormState);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button variant="gradient" size="sm" onClick={() => setOpen((o) => !o)}>
        הוספת פריט
      </Button>
      {open && (
        <form action={formAction} className="mt-4 flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-4">
          <div>
            <Label htmlFor="inv_name">שם הפריט *</Label>
            <Input id="inv_name" name="name" required />
          </div>
          <div>
            <Label htmlFor="inv_qty">כמות *</Label>
            <Input id="inv_qty" name="quantity" type="number" min={0} defaultValue={0} required />
          </div>
          <div>
            <Label htmlFor="inv_unit">יחידה</Label>
            <Input id="inv_unit" name="unit" placeholder="למשל: יח', קופסה" />
          </div>
          <div>
            <Label htmlFor="inv_notes">הערות</Label>
            <Input id="inv_notes" name="notes" />
          </div>
          {state?.error && <p className="text-destructive text-sm">{state.error}</p>}
          <div className="flex gap-2">
            <Button type="submit">שמירה</Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>ביטול</Button>
          </div>
        </form>
      )}
    </div>
  );
}
