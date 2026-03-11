"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateBranchProfileAction, type BranchProfileFormState } from "@/app/actions/branch-profile";

export function BranchProfileForm({
  branchId,
  initialOpeningHours,
  initialSummaryNotes,
}: {
  branchId: string;
  initialOpeningHours: string;
  initialSummaryNotes: string;
}) {
  const [state, formAction] = useActionState(updateBranchProfileAction, {} as BranchProfileFormState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="branch_id" value={branchId} />
      <div>
        <Label htmlFor="opening_hours">שעות פעילות</Label>
        <Input
          id="opening_hours"
          name="opening_hours"
          type="text"
          defaultValue={initialOpeningHours}
          placeholder="למשל: א׳-ה׳ 16:00–19:00"
        />
      </div>
      <div>
        <Label htmlFor="summary_notes">הערות סיכום</Label>
        <Input
          id="summary_notes"
          name="summary_notes"
          type="text"
          defaultValue={initialSummaryNotes}
          placeholder="הערות כלליות על הסניף"
        />
      </div>
      {state?.error && (
        <p className="text-destructive text-sm">{state.error}</p>
      )}
      <Button type="submit" variant="default">
        שמירת שינויים
      </Button>
    </form>
  );
}
