import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses: Record<NonNullable<SpinnerProps["size"]>, string> = {
  sm: "h-5 w-5 border-2",
  md: "h-8 w-8 border-[3px]",
  lg: "h-12 w-12 border-4",
};

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <span
      className={cn(
        "inline-block animate-spin rounded-full border-primary border-t-transparent",
        sizeClasses[size],
        className,
      )}
      aria-label="טוען"
      role="status"
    />
  );
}

