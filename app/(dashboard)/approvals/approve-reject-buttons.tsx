"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { approveUserAction, rejectUserAction, type ApprovalActionState } from "@/app/actions/approvals";

export function ApproveRejectButtons({ profileId }: { profileId: string }) {
  const [approveState, approveFormAction] = useActionState(approveUserAction, {} as ApprovalActionState);
  const [rejectState, rejectFormAction] = useActionState(rejectUserAction, {} as ApprovalActionState);
  const state = approveState?.error ? approveState : rejectState;

  return (
    <div className="flex items-center gap-2">
      <form action={approveFormAction}>
        <input type="hidden" name="profile_id" value={profileId} />
        <Button type="submit" variant="default" size="sm">
          אשרי משתמשת
        </Button>
      </form>
      <form action={rejectFormAction}>
        <input type="hidden" name="profile_id" value={profileId} />
        <Button type="submit" variant="outline" size="sm">
          דחי
        </Button>
      </form>
      {state?.error && (
        <p className="text-destructive text-xs">{state.error}</p>
      )}
    </div>
  );
}
