"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
  completeChecklistStartAction,
  completeChecklistEndAction,
  type ActivityFormState,
} from "@/app/actions/activities";

type Activity = {
  id: string;
  title: string;
  scheduled_at: string;
  status: string;
  checklist_start_completed_at: string | null;
  checklist_end_completed_at: string | null;
};

export function ActivityChecklistButtons({ activity }: { activity: Activity }) {
  const [startState, startFormAction] = useActionState(
    completeChecklistStartAction,
    {} as ActivityFormState
  );
  const [endState, endFormAction] = useActionState(
    completeChecklistEndAction,
    {} as ActivityFormState
  );

  const startDone = !!activity.checklist_start_completed_at;
  const endDone = !!activity.checklist_end_completed_at;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {!startDone ? (
        <form action={startFormAction}>
          <input type="hidden" name="activity_id" value={activity.id} />
          <Button type="submit" variant="outline" size="sm">
            📝 צ&#39;ק-ליסט תחילת פעילות
          </Button>
        </form>
      ) : (
        <span className="text-muted-foreground text-sm">✓ צ&#39;ק-ליסט התחלה בוצע</span>
      )}
      {!endDone ? (
        <form action={endFormAction}>
          <input type="hidden" name="activity_id" value={activity.id} />
          <Button type="submit" variant="outline" size="sm">
            ✅ צ&#39;ק-ליסט סיום פעילות
          </Button>
        </form>
      ) : (
        <span className="text-muted-foreground text-sm">✓ צ&#39;ק-ליסט סיום בוצע</span>
      )}
      {(startState?.error || endState?.error) && (
        <p className="text-destructive w-full text-sm">
          {startState?.error ?? endState?.error}
        </p>
      )}
    </div>
  );
}
