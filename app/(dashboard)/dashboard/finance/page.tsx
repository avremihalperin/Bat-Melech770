import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AllocateBudgetForm } from "./allocate-budget-form";
import { ReceiptsPendingList } from "./receipts-pending-list";

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export default async function FinancePage() {
  await requireRole(["secretary", "admin"]);
  const supabase = await createClient();

  const [
    { data: branches },
    { data: pendingReceipts },
  ] = await Promise.all([
    supabase.from("branches").select("id, name").order("name"),
    supabase
      .from("receipts")
      .select("id, branch_id, amount, receipt_url, description, created_at, branch:branches(name)")
      .eq("status", "pending")
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-primary text-2xl font-bold">ניהול כספים</h1>
      <p className="text-muted-foreground">
        הזנת תקציבים לסניפים, קבלת חשבוניות ואישורן.
      </p>

      <Card className="border-primary/20 bg-gradient-to-br from-primary-50/40 to-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">הזנת תקציב לסניף</CardTitle>
          <CardDescription>
            הוסיפי הקצאה תקציבית לסניף. היתרה של הסניף תעלה בהתאם.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AllocateBudgetForm branches={branches ?? []} />
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary-50/20 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">קבלות הממתינות לאישור המשרד</CardTitle>
          <CardDescription>
            אשרי או דחי קבלות שהסניפים העלו. באישור — יתרת הסניף תקטן.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!pendingReceipts?.length ? (
            <p className="text-muted-foreground">אין קבלות ממתינות.</p>
          ) : (
            <ReceiptsPendingList receipts={pendingReceipts} formatCurrency={formatCurrency} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
