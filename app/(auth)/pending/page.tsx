import { getProfile } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function PendingPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");
  if (profile.approval_status === "approved") redirect("/dashboard");

  return (
    <div className="w-full max-w-md">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-primary">ממתינה לאישור</CardTitle>
          <CardDescription>
            בקשתך התקבלה בהצלחה וממתינה לאישור המשרד. אנו נודיעך ברגע שהחשבון
            יאושר.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center text-sm">
            אם יש לך שאלות, פני למשרד הארגון.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
