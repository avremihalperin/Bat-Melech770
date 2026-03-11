import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * משלב class names מ-Tailwind בצורה נכונה (מונע דריסה).
 * בשימוש ברכיבי Shadcn UI.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
