import { Spinner } from "@/components/ui/spinner";

/** טוען דף תוך־דשבורד (תקציב, חניכות וכו') — גלגל ברור */
export default function DashboardPageLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center p-8">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-muted-foreground text-sm">טוען...</p>
      </div>
    </div>
  );
}
