"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { approveReceiptAction, rejectReceiptAction, type FinanceActionState } from "@/app/actions/finance";

type ReceiptRow = {
  id: string;
  branch_id: string;
  amount: number | string;
  receipt_url: string | null;
  description: string | null;
  created_at: string;
  branch?: { name: string } | { name: string }[] | null;
};

export function ReceiptsPendingList({
  receipts,
}: {
  receipts: ReceiptRow[];
}) {
  function formatCurrency(n: number): string {
    return new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency: "ILS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n);
  }

  return (
    <ul className="flex flex-col gap-3">
      {receipts.map((r) => {
        const branchName = Array.isArray(r.branch) ? r.branch[0]?.name : (r.branch as { name: string } | null)?.name;
        return (
          <li
            key={r.id}
            className="border-border flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
          >
            <div>
              <p className="font-medium">{formatCurrency(Number(r.amount))}</p>
              <p className="text-muted-foreground text-sm">
                {branchName ?? "סניף"} {r.description ? ` · ${r.description}` : ""}
              </p>
              {r.receipt_url && (
                <a
                  href={r.receipt_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary mt-1 inline-block text-sm underline"
                >
                  צפייה בקבלה
                </a>
              )}
            </div>
            <ReceiptActions receiptId={r.id} />
          </li>
        );
      })}
    </ul>
  );
}

function ReceiptActions({ receiptId }: { receiptId: string }) {
  const [approveState, approveFormAction] = useActionState(approveReceiptAction, {} as FinanceActionState);
  const [rejectState, rejectFormAction] = useActionState(rejectReceiptAction, {} as FinanceActionState);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const state = approveState?.error ? approveState : rejectState;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <form action={approveFormAction}>
        <input type="hidden" name="receipt_id" value={receiptId} />
        <Button type="submit" variant="default" size="sm">
          ✔️ אישור קבלה והזנת תקציב לסניף
        </Button>
      </form>
      {!showRejectReason ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowRejectReason(true)}
        >
          ❌ דחיית קבלה
        </Button>
      ) : (
        <form action={rejectFormAction} className="flex flex-wrap items-end gap-2">
          <input type="hidden" name="receipt_id" value={receiptId} />
          <label className="flex flex-col gap-1 text-sm">
            <span>סיבת דחייה (אופציונלי)</span>
            <Input name="rejection_reason" type="text" placeholder="דורש סיבה" className="min-w-[180px]" />
          </label>
          <Button type="submit" variant="destructive" size="sm">
            דחייה
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setShowRejectReason(false)}>
            ביטול
          </Button>
        </form>
      )}
      {state?.error && (
        <p className="text-destructive w-full text-sm">{state.error}</p>
      )}
    </div>
  );
}
