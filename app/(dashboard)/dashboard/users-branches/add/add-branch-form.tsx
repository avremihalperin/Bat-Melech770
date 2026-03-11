"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addBranchAction, type AddBranchState } from "@/app/actions/branches";

export function AddBranchForm() {
  const [state, formAction] = useActionState(addBranchAction, {} as AddBranchState);
  const router = useRouter();

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="branch_name">שם הסניף *</Label>
        <Input id="branch_name" name="name" required placeholder="למשל: תל אביב מרכז" />
      </div>
      <div>
        <Label htmlFor="branch_address">כתובת</Label>
        <Input id="branch_address" name="address" placeholder="רחוב, עיר" />
      </div>
      <div>
        <Label htmlFor="branch_phone">טלפון</Label>
        <Input id="branch_phone" name="phone" type="tel" placeholder="02-1234567" />
      </div>
      {state?.error && <p className="text-destructive text-sm">{state.error}</p>}
      <div className="flex gap-2">
        <Button type="submit" variant="default">הוספת סניף</Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/dashboard/users-branches")}>
          ביטול
        </Button>
      </div>
      {"success" in state && state.success && (
        <p className="text-primary text-sm font-medium">הסניף נוסף. <button type="button" className="underline" onClick={() => router.push("/dashboard/users-branches")}>למעבר לרשימת הסניפים</button></p>
      )}
    </form>
  );
}
