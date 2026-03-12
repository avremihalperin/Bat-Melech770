"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import type { NavItem } from "@/lib/nav";
import { signOutAction } from "@/app/actions/auth";

interface DashboardShellProps {
  navItems: NavItem[];
  subtitle: string;
  notificationCount?: number;
  children: React.ReactNode;
}

export function DashboardShell({
  navItems,
  subtitle,
  notificationCount = 0,
  children,
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full min-w-0">
      <Sidebar
        items={navItems}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Header
          subtitle={subtitle}
          notificationCount={notificationCount}
          onMenuClick={() => setSidebarOpen((o) => !o)}
          signOutAction={signOutAction}
        />
        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-b from-primary-50/30 to-background px-3 py-4 sm:p-4 md:p-6">
          <div className="mx-auto w-full max-w-6xl min-w-0 flex flex-col gap-4 sm:gap-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
