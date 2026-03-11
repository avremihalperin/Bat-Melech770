import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddBranchForm } from "./add-branch-form";

export default async function AddBranchPage() {
  await requireRole(["secretary", "branch_supervisor", "admin"]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/users-branches">← חזרה לניהול סניפים</Link>
        </Button>
      </div>
      <h1 className="text-primary text-2xl font-bold">פתיחת / הוספת סניף</h1>
      <p className="text-muted-foreground">הוספת סניף חדש לרשימת הסניפים במערכת.</p>

      <Card className="border-primary/20 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">נתוני הסניף החדש</CardTitle>
          <CardDescription>שם חובה; כתובת וטלפון אופציונליים</CardDescription>
        </CardHeader>
        <CardContent>
          <AddBranchForm />
        </CardContent>
      </Card>
    </div>
  );
}
