"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { APP_NAME, LOGOUT, BELL_TOOLTIP } from "@/lib/copy";

interface HeaderProps {
  subtitle: string;
  notificationCount?: number;
  onMenuClick: () => void;
  signOutAction: () => void;
}

export function Header({
  subtitle,
  notificationCount = 0,
  onMenuClick,
  signOutAction,
}: HeaderProps) {
  return (
    <header className="border-border flex min-h-14 items-center justify-between gap-2 border-b bg-card px-4 py-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="פתח תפריט"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-foreground hover:bg-muted lg:hidden"
          onClick={onMenuClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
        <div className="flex min-w-0 flex-col gap-0">
          <Link
            href="/dashboard"
            className="text-primary flex items-center gap-2 font-semibold leading-tight"
          >
            <span className="flex shrink-0 items-center gap-1.5">
              <span className="flex items-center justify-center rounded bg-white px-1 py-0.5">
                <Image
                  src="/logo-bat-melech.png"
                  alt=""
                  width={52}
                  height={36}
                  className="h-9 w-[3.25rem] object-contain object-center"
                  style={{ backgroundColor: "white" }}
                />
              </span>
              <Image
                src="/logo-chabad-youth.png"
                alt=""
                width={48}
                height={36}
                className="h-9 w-12 object-contain"
              />
            </span>
            <span className="hidden lg:inline">{APP_NAME}</span>
          </Link>
          <span className="text-muted-foreground min-w-0 truncate text-xs leading-tight" title={subtitle}>
            {subtitle}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard/notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-lg text-foreground hover:bg-muted"
          title={
            notificationCount > 0
              ? `יש לך ${notificationCount} התראות חדשות שלא נקראו`
              : BELL_TOOLTIP
          }
          aria-label={
            notificationCount > 0
              ? `יש לך ${notificationCount} התראות חדשות שלא נקראו`
              : BELL_TOOLTIP
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          {notificationCount > 0 && (
            <span className="bg-accent absolute -top-0.5 -start-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-medium text-white">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </Link>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            signOutAction();
          }}
        >
          <Button type="submit" variant="ghost" size="sm">
            {LOGOUT}
          </Button>
        </form>
      </div>
    </header>
  );
}
