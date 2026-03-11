"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "./actions";

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">דואר אלקטרוני</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="example@email.com"
          autoComplete="email"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">סיסמה</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      {state?.error && typeof state.error === "string" && (
        <p className="text-destructive text-sm">{state.error}</p>
      )}
      <Button type="submit" variant="default" className="w-full">
        התחברי
      </Button>
    </form>
  );
}
