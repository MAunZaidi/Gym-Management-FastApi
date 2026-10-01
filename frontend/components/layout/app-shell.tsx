"use client";

import { useState } from "react";
import { AuthGuard } from "@/components/layout/auth-guard";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-adapt-background text-adapt-text">
        <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
          <Sidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} collapsed={collapsed} mode="desktop" />
        </div>
        <Sidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} collapsed={false} mode="mobile" />
        <div className={collapsed ? "lg:pl-[86px]" : "lg:pl-72"}>
          <Header onMenu={() => setDrawerOpen(true)} onToggleCollapse={() => setCollapsed((value) => !value)} collapsed={collapsed} />
          <main className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
