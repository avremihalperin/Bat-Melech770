"use client";

/**
 * סרט זז (טיקר) עם חדשות מהארגון — טקסט רץ אופקית.
 */
interface NewsTickerProps {
  items: { id: string; title: string; body?: string }[];
}

export function NewsTicker({ items }: NewsTickerProps) {
  if (items.length === 0) return null;

  const text = items
    .map((a) => (a.body ? `${a.title} — ${a.body}` : a.title))
    .join("    •  ");

  return (
    <div className="w-full min-w-0 max-w-4xl mx-auto overflow-hidden">
      <div
        className="border-border bg-muted/50 relative overflow-hidden rounded-lg border py-2"
        aria-live="polite"
        aria-label="חדשות מהארגון"
      >
        {/* שני עותקים זהים — האנימציה מזיזה 50% ואז חוזרת, כך שנראה לופ רציף */}
        <div className="flex w-max animate-ticker gap-8 px-3 sm:gap-12 sm:px-4">
          <span className="whitespace-nowrap text-xs font-medium text-foreground sm:text-sm">
            {text}
          </span>
          <span className="whitespace-nowrap text-xs font-medium text-foreground sm:text-sm">
            {text}
          </span>
        </div>
      </div>
    </div>
  );
}
