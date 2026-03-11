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
    <div className="flex flex-col gap-6">
      <h1 className="text-primary text-2xl font-bold">ניהול תקציב הסניף</h1>
      <p className="text-muted-foreground">
        כאן תוכלי לראות את היתרה הזמינה ולהעלות קבלות לקבלת החזרים מהמטה.
      </p>

      <Card className="border-primary/20 bg-gradient-to-br from-primary-50/40 to-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">יתרה נוכחית</CardTitle>
          <CardDescription>
            הקצאות מהמטה פחות קבלות שאושרו
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary">
            {formatCurrency(balance.balance)}
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            מתוך {formatCurrency(balance.totalAllocations)} שהוקצו • {formatCurrency(balance.totalApprovedReceipts)} אושרו בקבלות
          </p>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg">העלאת קבלה לאישור</CardTitle>
            <CardDescription>
              הזיני סכום וקישור לתמונה/קובץ של הקבלה. המטה יאשרו והתקציב יתעדכן.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <BudgetForm />
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">קבלות ששולחו</CardTitle>
          <CardDescription>סטטוס אישור במשרד</CardDescription>
        </CardHeader>
        <CardContent>
          {!receipts?.length ? (
            <p className="text-muted-foreground">עדיין לא הועלו קבלות.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {receipts.map((r) => (
                <li
                  key={r.id}
                  className="border-border flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2"
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
