"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitReceiptAction, type ReceiptSubmitState } from "@/app/actions/receipts";

export function BudgetForm() {
  const [state, formAction] = useActionState(submitReceiptAction, {} as ReceiptSubmitState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="amount">סכום (₪) *</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min="0"
          required
          placeholder="0"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">תיאור (אופציונלי)</Label>
        <Input id="description" name="description" type="text" placeholder="למשל: ציוד לפעילות" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="receipt_url">קישור לקבלה (תמונה/קובץ) *</Label>
        <Input
          id="receipt_url"
          name="receipt_url"
          type="url"
          required
          placeholder="https://..."
        />
        <p className="text-muted-foreground text-xs">
          העלי את צילום הקבלה לאחסון (למשל Google Drive) והדביקי כאן קישור לצפייה.
        </p>
      </div>
      {state?.error && (
        <p className="text-destructive text-sm">{state.error}</p>
      )}
      <Button type="submit" variant="gradient">
        + העלאת קבלה לאישור
      </Button>
    </form>
  );
}
