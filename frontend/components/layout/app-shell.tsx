"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AuthGuard } from "@/components/layout/auth-guard";
import { useAuth } from "@/components/layout/auth-provider";
import { Header } from "@/components/layout/header";
import { BeamsBackground } from "@/components/layout/beams-background";
import { Sidebar } from "@/components/layout/sidebar";
import { useGsapReveal } from "@/hooks/use-gsap-reveal";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { loading } = useAuth();
  const ref = useGsapReveal<HTMLElement>(`${pathname}:${loading}`);

  return (
    <AuthGuard>
      <div className="relative isolate min-h-screen bg-adapt-background text-adapt-text">
        <BeamsBackground className={collapsed ? "left-0 lg:left-[86px]" : "left-0 lg:left-72"} />
        <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
          <Sidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} collapsed={collapsed} mode="desktop" />
        </div>
        <Sidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} collapsed={false} mode="mobile" />
        <div className={`min-w-0 transition-[padding] duration-300 ${collapsed ? "lg:pl-[86px]" : "lg:pl-72"}`}>
          <Header onMenu={() => setDrawerOpen(true)} onToggleCollapse={() => setCollapsed((value) => !value)} collapsed={collapsed} />
          <main key={pathname} ref={ref} className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
