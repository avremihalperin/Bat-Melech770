import { Spinner } from "@/components/ui/spinner";

/** טעינה גלובלית — מוצג בזמן טעינת דף (ניווט או טעינה ראשונית) */
export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-muted-foreground text-sm">
          טוען... רגע אחד בבקשה
        </p>
      </div>
    </div>
  );
}
