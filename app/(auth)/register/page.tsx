import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisterForm } from "./register-form";
import { createClient } from "@/lib/supabase/server";

export default async function RegisterPage() {
  const supabase = await createClient();
  const { data: branches } = await supabase
    .from("branches")
    .select("id, name")
    .order("name");

  return (
    <div className="w-full max-w-lg px-3 sm:px-0">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-primary text-xl">
            ברוכות הבאות למערכת ניהול ארגון נוער בנות חב&quot;ד
          </CardTitle>
          <CardDescription>
            הרשמה למערכת — מלאי את הפרטים ושלחי בקשת הצטרפות
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm branches={branches ?? []} />
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <p className="text-muted-foreground text-center text-sm">
            כבר יש לך חשבון?{" "}
            <Link
              href="/login"
              className="text-primary font-medium underline underline-offset-2"
            >
              התחברי
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
