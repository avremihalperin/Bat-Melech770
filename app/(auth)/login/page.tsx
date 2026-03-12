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
    <div className="flex w-full max-w-md flex-col gap-3 px-1 sm:gap-4 sm:px-0">
      <Card className="border-primary/20 shadow-lg">
        <CardHeader className="text-center px-3 sm:px-6">
          <div className="bg-background mb-3 flex flex-row flex-wrap items-center justify-center gap-2 rounded-lg p-2 sm:mb-4 sm:gap-4">
            <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg bg-white p-1.5 shadow-[inset_0_0_0_2px_rgba(255,255,255,1)] sm:h-[102px] sm:w-[140px] sm:p-2">
              <Image
                src="/logo-bat-melech.png"
                alt="בת מלך — ארגון נוער בנות חב״ד"
                width={165}
                height={102}
                className="h-auto max-h-14 w-full object-contain object-center sm:max-h-[102px] sm:w-[165px]"
                style={{ backgroundColor: "white" }}
                priority
              />
            </div>
            <div className="flex h-16 w-20 shrink-0 items-center justify-center sm:h-[102px] sm:w-[140px]">
              <Image
                src="/logo-chabad-youth.png"
                alt="ארגון נוער חב״ד"
                width={140}
                height={102}
                className="h-auto max-h-14 w-full object-contain sm:max-h-[102px] sm:w-[140px]"
                priority
              />
            </div>
          </div>
          <CardTitle className="text-primary text-xl sm:text-2xl">
            ברוכות הבאות למערכת הניהול של בת מלך
          </CardTitle>
          <CardDescription>התחברי עם הדואר האלקטרוני והסיסמה שלך</CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <LoginForm />
        </CardContent>
        <CardFooter className="flex flex-col gap-2 px-3 sm:px-6">
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
        <CardHeader className="pb-2 px-3 sm:px-6">
          <CardTitle className="text-lg">מסך הדגמה</CardTitle>
          <CardDescription>
            כניסה למסך עם כפתורים לכל המסכים במערכת (משתמש דגמה בלבד)
          </CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground px-3 text-sm sm:px-6">
          <p>שם משתמש: <strong className="text-foreground">{DEMO_USER_EMAIL}</strong></p>
          <p>סיסמה: <strong className="text-foreground">{DEMO_USER_PASSWORD}</strong></p>
        </CardContent>
        <CardFooter className="px-3 sm:px-6">
          <Button variant="outline" className="min-h-11 w-full touch-manipulation border-primary/40" asChild>
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
