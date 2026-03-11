"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { allocateBudgetAction, type FinanceActionState } from "@/app/actions/finance";

type Branch = { id: string; name: string };

export function AllocateBudgetForm({ branches }: { branches: Branch[] }) {
  const [state, formAction] = useActionState(allocateBudgetAction, {} as FinanceActionState);

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="branch_id">סניף *</Label>
        <select
          id="branch_id"
          name="branch_id"
          required
          className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">בחירת סניף</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>
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
        <Label htmlFor="note">הערה (אופציונלי)</Label>
        <Input id="note" name="note" type="text" placeholder="למשל: תקציב חודשי" />
      </div>
      {state?.error && (
        <p className="text-destructive text-sm">{state.error}</p>
      )}
      <Button type="submit" variant="default">
        הזנת תקציב
      </Button>
    </form>
  );
}
