"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerAction, type RegisterState } from "./actions";

const STAFF_ROLE_LABELS: Record<string, string> = {
  secretary: "מזכירה",
  branch_supervisor: "אחראית סניפים",
  content_manager: "אחראית תוכן",
  admin: "מנהלת",
  safety_officer: "אחראית בטיחות",
};

type Branch = { id: string; name: string };

export function RegisterForm({ branches }: { branches: Branch[] }) {
  const [kind, setKind] = useState<"branch_center" | "staff">("branch_center");
  const [state, formAction] = useActionState(registerAction, {} as RegisterState);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="radio"
            name="kind"
            checked={kind === "branch_center"}
            onChange={() => setKind("branch_center")}
            className="rounded-full"
          />
          <span>מרכזת סניף</span>
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="radio"
            name="kind"
            checked={kind === "staff"}
            onChange={() => setKind("staff")}
            className="rounded-full"
          />
          <span>צוות מטה</span>
        </label>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="kind" value={kind} />
        <div className="grid gap-2">
          <Label htmlFor="full_name">שם פרטי *</Label>
          <Input id="full_name" name="full_name" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="family_name">שם משפחה *</Label>
          <Input id="family_name" name="family_name" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="mother_name">שם האם</Label>
          <Input id="mother_name" name="mother_name" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="id_number">תעודת זהות (9 ספרות)</Label>
          <Input
            id="id_number"
            name="id_number"
            type="text"
            inputMode="numeric"
            maxLength={9}
            placeholder="123456789"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">דואר אלקטרוני *</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">טלפון נייד</Label>
          <Input id="phone" name="phone" type="tel" />
        </div>

        {kind === "branch_center" && (
          <div className="grid gap-2">
            <Label htmlFor="branch_id">בחרי סניף מהרשימה *</Label>
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
        )}

        {kind === "staff" && (
          <div className="grid gap-2">
            <Label htmlFor="role">תפקיד במטה *</Label>
            <select
              id="role"
              name="role"
              required
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">בחירת תפקיד</option>
              {Object.entries(STAFF_ROLE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="password">סיסמה * (לפחות 6 תווים)</Label>
          <Input
            id="password"
            name="password"
            type="password"
            minLength={6}
            required
          />
        </div>

        {state?.error && (
          <p className="text-destructive text-sm">{state.error}</p>
        )}

        <Button type="submit" variant="gradient" className="w-full">
          שלחי בקשת הצטרפות למערכת
        </Button>
      </form>
    </div>
  );
}
