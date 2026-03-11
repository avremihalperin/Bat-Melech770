"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitSafetyReportAction, type SafetyReportFormState } from "@/app/actions/safety";

export function SafetyReportForm({ branchId }: { branchId: string }) {
  const [state, formAction] = useActionState(submitSafetyReportAction, {} as SafetyReportFormState);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={() => setOpen((o) => !o)}
      >
        🚨 דיווח על אירוע חריג / כמעט ונפגע
      </Button>
      {open && (
        <form
          action={formAction}
          className="border-border mt-4 flex flex-col gap-3 rounded-lg border bg-muted/30 p-4"
        >
          <input type="hidden" name="branch_id" value={branchId} />
          <div>
            <Label>סוג דיווח *</Label>
            <div className="mt-2 flex gap-4">
              <label className="flex cursor-pointer items-center gap-2">
                <input type="radio" name="report_type" value="near_miss" required />
                <span>כמעט ונפגע</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input type="radio" name="report_type" value="emergency" />
                <span>חירום</span>
              </label>
            </div>
          </div>
          <div>
            <Label htmlFor="safety_description">תיאור *</Label>
            <Input
              id="safety_description"
              name="description"
              type="text"
              required
              placeholder="תארי את האירוע בקצרה"
            />
          </div>
          {state?.error && (
            <p className="text-destructive text-sm">{state.error}</p>
          )}
          <div className="flex gap-2">
            <Button type="submit" variant="destructive">
              שליחת דיווח
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
