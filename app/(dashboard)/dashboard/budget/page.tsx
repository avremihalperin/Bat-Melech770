import { requireBranch } from "@/lib/auth";
import { getBranchBalance } from "@/lib/dashboard";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BudgetForm } from "./budget-form";

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

const STATUS_LABELS: Record<string, string> = {
  pending: "ממתין לאישור",
  approved: "אושר",
  rejected: "נדחה",
};

export default async function BudgetPage() {
  const branchId = await requireBranch();
  const balance = await getBranchBalance(branchId);
  const supabase = await createClient();

  const { data: receipts } = await supabase
    .from("receipts")
    .select("id, amount, receipt_url, description, status, created_at")
    .eq("branch_id", branchId)
    .order("created_at", { ascending: false });

  return (
    <div className="flex min-w-0 flex-col gap-4 sm:gap-6">
      <h1 className="text-primary text-xl font-bold sm:text-2xl">ניהול תקציב הסניף</h1>
      <p className="text-muted-foreground text-sm sm:text-base">
        כאן תוכלי לראות את היתרה הזמינה ולהעלות קבלות לקבלת החזרים מהמטה.
      </p>

      <Card className="border-primary/20 bg-gradient-to-br from-primary-50/40 to-card shadow-sm">
        <CardHeader className="px-3 py-3 sm:px-6 sm:py-4">
          <CardTitle className="text-base sm:text-lg">יתרה נוכחית</CardTitle>
          <CardDescription>
            הקצאות מהמטה פחות קבלות שאושרו
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
          <p className="text-2xl font-bold text-primary sm:text-3xl">
            {formatCurrency(balance.balance)}
          </p>
          <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
            מתוך {formatCurrency(balance.totalAllocations)} שהוקצו • {formatCurrency(balance.totalApprovedReceipts)} אושרו בקבלות
          </p>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-card shadow-sm">
        <CardHeader className="flex flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
          <div className="min-w-0">
            <CardTitle className="text-base sm:text-lg">העלאת קבלה לאישור</CardTitle>
            <CardDescription>
              הזיני סכום וקישור לתמונה/קובץ של הקבלה. המטה יאשרו והתקציב יתעדכן.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
          <BudgetForm />
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm">
        <CardHeader className="px-3 py-3 sm:px-6 sm:py-4">
          <CardTitle className="text-base sm:text-lg">קבלות ששולחו</CardTitle>
          <CardDescription>סטטוס אישור במשרד</CardDescription>
        </CardHeader>
        <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
          {!receipts?.length ? (
            <p className="text-muted-foreground text-sm">עדיין לא הועלו קבלות.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {receipts.map((r) => (
                <li
                  key={r.id}
                  className="border-border flex min-w-0 flex-col gap-2 rounded-lg border px-3 py-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{formatCurrency(Number(r.amount))}</p>
                    {r.description && (
                      <p className="text-muted-foreground text-sm">{r.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        r.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : r.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {STATUS_LABELS[r.status] ?? r.status}
                    </span>
                    {r.receipt_url && (
                      <a
                        href={r.receipt_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-sm underline"
                      >
                        צפייה
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
