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
    <div className="flex min-h-screen">
      <Sidebar
        items={navItems}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex min-h-screen flex-1 flex-col">
        <Header
          subtitle={subtitle}
          notificationCount={notificationCount}
          onMenuClick={() => setSidebarOpen((o) => !o)}
          signOutAction={signOutAction}
        />
        <main className="flex-1 overflow-auto bg-gradient-to-b from-primary-50/30 to-background p-4 md:p-6">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
