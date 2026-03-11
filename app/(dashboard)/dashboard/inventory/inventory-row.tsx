"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateInventoryItemAction, type InventoryFormState } from "@/app/actions/inventory";

type Item = { id: string; name: string; quantity: number; unit: string | null; notes: string | null };

export function InventoryRow({ item }: { item: Item }) {
  const [state, formAction] = useActionState(updateInventoryItemAction, {} as InventoryFormState);
  const [editing, setEditing] = useState(false);

  return (
    <tr className="border-b border-border">
      <td className="py-2 pe-2">{item.name}</td>
      <td className="py-2 pe-2">
        {editing ? (
          <form action={formAction} className="flex items-center gap-2">
            <input type="hidden" name="item_id" value={item.id} />
            <Input name="quantity" type="number" min={0} defaultValue={item.quantity} className="w-20" />
            <Button type="submit" size="sm">עדכן</Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(false)}>ביטול</Button>
            {state?.error && <span className="text-destructive text-xs">{state.error}</span>}
          </form>
        ) : (
          item.quantity
        )}
      </td>
      <td className="py-2 pe-2 text-muted-foreground">{item.unit ?? "—"}</td>
      <td className="py-2 pe-2 text-muted-foreground text-sm">{item.notes ?? "—"}</td>
      <td className="py-2 pe-2">
        {!editing && <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>עדכון כמות</Button>}
      </td>
    </tr>
  );
}
