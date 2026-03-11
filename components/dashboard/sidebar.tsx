"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/nav";

interface SidebarProps {
  items: NavItem[];
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ items, open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay במובייל */}
      <button
        type="button"
        aria-label="סגור תפריט"
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />
      {/* פאנל צד */}
      <aside
        className={cn(
          "fixed top-0 z-50 h-full w-64 border-s border-border bg-card transition-transform duration-200 ease-out md:static md:z-auto md:block md:translate-x-0 md:border-e",
          open ? "translate-x-0 start-0" : "translate-x-full start-0 md:translate-x-0"
        )}
      >
        <nav className="flex flex-col gap-1 p-3">
          {items.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
