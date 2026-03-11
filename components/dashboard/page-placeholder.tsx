interface PagePlaceholderProps {
  title: string;
  description?: string;
}

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-primary text-2xl font-bold">{title}</h1>
      {description && (
        <p className="text-muted-foreground">{description}</p>
      )}
      <p className="text-muted-foreground text-sm">
        המסך יושלם בשלב הבא. שלד הניווט מוכן.
      </p>
    </div>
  );
}
