"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadContentMaterialAction, type ContentFormState } from "@/app/actions/content";

export function MaterialsUploadForm() {
  const [state, formAction] = useActionState(uploadContentMaterialAction, {} as ContentFormState);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button variant="gradient" size="sm" onClick={() => setOpen((o) => !o)}>
        העלאת חומר
      </Button>
      {open && (
        <form action={formAction} className="mt-4 flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-4">
          <div>
            <Label htmlFor="mat_title">כותרת *</Label>
            <Input id="mat_title" name="title" required />
          </div>
          <div>
            <Label htmlFor="mat_url">קישור לקובץ *</Label>
            <Input id="mat_url" name="file_url" type="url" required placeholder="https://..." />
          </div>
          <div>
            <Label htmlFor="mat_cat">קטגוריה</Label>
            <Input id="mat_cat" name="category" placeholder="activity_materials" />
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
