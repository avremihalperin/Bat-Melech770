import { Spinner } from "@/components/ui/spinner";

/** טוען מסכי התחברות — כיסוי מלא */
export default function AuthLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-muted-foreground text-sm">
          טוען את המערכת... רגע אחד בבקשה
        </p>
      </div>
    </div>
  );
}

