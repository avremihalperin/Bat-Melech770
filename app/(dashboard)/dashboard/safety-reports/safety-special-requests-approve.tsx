"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { approveSpecialRequestSafetyAction, type SpecialRequestFormState } from "@/app/actions/special-requests";

type RequestRow = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  branch_id: string;
  branches?: { name: string } | { name: string }[] | null;
};

function ApproveButton({ requestId }: { requestId: string }) {
  const [state, formAction] = useActionState(approveSpecialRequestSafetyAction, {} as SpecialRequestFormState);
  return (
    <form action={formAction}>
      <input type="hidden" name="request_id" value={requestId} />
      <Button type="submit" size="sm">אישור בטיחות</Button>
      {state?.error && <span className="text-destructive text-sm me-2">{state.error}</span>}
    </form>
  );
}

export function SafetySpecialRequestsApprove({ requests }: { requests: RequestRow[] }) {
  if (requests.length === 0) return <p className="text-muted-foreground">אין בקשות ממתינות.</p>;

  return (
    <ul className="flex flex-col gap-2">
      {requests.map((r) => (
        <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3">
          <div>
            <p className="font-medium">{r.title}</p>
            <p className="text-muted-foreground text-sm">{r.branches ? (Array.isArray(r.branches) ? r.branches[0]?.name : r.branches.name) : ""}</p>
          </div>
          <ApproveButton requestId={r.id} />
        </li>
      ))}
    </ul>
  );
}
