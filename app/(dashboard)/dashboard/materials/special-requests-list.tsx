"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { approveSpecialRequestContentAction, type SpecialRequestFormState } from "@/app/actions/special-requests";

type RequestRow = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  branch_id: string;
  branches?: { name: string } | { name: string }[] | null;
};

export function SpecialRequestsList({ requests }: { requests: RequestRow[] }) {
  if (requests.length === 0) return <p className="text-muted-foreground">אין בקשות ממתינות.</p>;

  return (
    <ul className="flex flex-col gap-2">
      {requests.map((r) => (
        <SpecialRequestApproveRow key={r.id} request={r} />
      ))}
    </ul>
  );
}

function SpecialRequestApproveRow({ request }: { request: RequestRow }) {
  const [state, formAction] = useActionState(approveSpecialRequestContentAction, {} as SpecialRequestFormState);
  return (
    <li className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3">
      <div>
        <p className="font-medium">{request.title}</p>
        <p className="text-muted-foreground text-sm">{request.branches ? (Array.isArray(request.branches) ? request.branches[0]?.name : request.branches.name) : ""}</p>
      </div>
      <form action={formAction}>
        <input type="hidden" name="request_id" value={request.id} />
        <Button type="submit" size="sm">אישור תוכן</Button>
      </form>
      {state?.error && <p className="text-destructive text-sm w-full">{state.error}</p>}
    </li>
  );
}
