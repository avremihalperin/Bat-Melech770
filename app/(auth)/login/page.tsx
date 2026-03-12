import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "./login-form";
import { DEMO_USER_EMAIL, DEMO_USER_PASSWORD } from "@/lib/demo";

export default function LoginPage() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Card className="border-primary/20 shadow-lg">
        <CardHeader className="text-center">
          <div className="bg-background mb-4 flex flex-row flex-wrap items-center justify-center gap-4 rounded-lg p-2">
            <div className="flex h-[102px] shrink-0 items-center justify-center rounded-lg bg-white p-2 shadow-[inset_0_0_0_3px_rgba(255,255,255,1)]">
              <Image
                src="/logo-bat-melech.png"
                alt="בת מלך — ארגון נוער בנות חב״ד"
                width={165}
                height={102}
                className="h-auto max-h-[102px] w-[165px] object-contain object-center"
                style={{ backgroundColor: "white" }}
                priority
              />
            </div>
            <div className="flex h-[102px] shrink-0 items-center justify-center">
              <Image
                src="/logo-chabad-youth.png"
                alt="ארגון נוער חב״ד"
                width={140}
                height={102}
                className="h-auto max-h-[102px] w-[140px] object-contain"
                priority
              />
            </div>
          </div>
          <CardTitle className="text-primary text-2xl">
            ברוכות הבאות למערכת הניהול של בת מלך
          </CardTitle>
          <CardDescription>התחברי עם הדואר האלקטרוני והסיסמה שלך</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <p className="text-muted-foreground text-center text-sm">
            עדיין לא נרשמת?{" "}
            <Link
              href="/register"
              className="text-primary font-medium underline underline-offset-2"
            >
              הרשמה למערכת
            </Link>
          </p>
        </CardFooter>
      </Card>

      <Card className="border-accent/30 bg-gradient-to-br from-primary-50 to-accent/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">מסך הדגמה</CardTitle>
          <CardDescription>
            כניסה למסך עם כפתורים לכל המסכים במערכת (משתמש דגמה בלבד)
          </CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          <p>שם משתמש: <strong className="text-foreground">{DEMO_USER_EMAIL}</strong></p>
          <p>סיסמה: <strong className="text-foreground">{DEMO_USER_PASSWORD}</strong></p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full border-primary/40" asChild>
            <Link href="/demo">כניסה למסך הדגמה</Link>
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-2 text-center text-[11px] leading-relaxed text-muted-foreground">
        <div className="mb-1 flex justify-center">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-muted-foreground/50 text-[10px] font-semibold">
            C
          </span>
        </div>
        <div>כל הזכויות שמורות לא. הלפרין</div>
        <div>avremihalperin@gmail.com</div>
        <div>אין לעשות שימוש ללא רשות בכתב בהתאם לכל דין</div>
      </div>
    </div>
  );
}
