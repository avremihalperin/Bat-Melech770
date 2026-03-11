"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadBranchDocumentAction, type ContentFormState } from "@/app/actions/content";

export function BranchDocumentUploadForm({ branchId }: { branchId: string }) {
  const [state, formAction] = useActionState(uploadBranchDocumentAction, {} as ContentFormState);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button variant="gradient" size="sm" onClick={() => setOpen((o) => !o)}>
        העלאת מסמך / תמונה
      </Button>
      {open && (
        <form action={formAction} className="mt-4 flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-4">
          <input type="hidden" name="branch_id" value={branchId} />
          <div>
            <Label htmlFor="doc_name">שם *</Label>
            <Input id="doc_name" name="name" required />
          </div>
          <div>
            <Label htmlFor="doc_url">קישור לקובץ *</Label>
            <Input id="doc_url" name="file_url" type="url" required placeholder="https://..." />
          </div>
          <div>
            <Label>סוג</Label>
            <select name="document_type" className="mt-1 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
              <option value="document">מסמך</option>
              <option value="photo">תמונה</option>
            </select>
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
