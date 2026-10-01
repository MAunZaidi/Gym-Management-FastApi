"use client";

import { Bell, LogOut, Menu, PanelLeftClose, PanelLeftOpen, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/layout/auth-provider";
import { initials } from "@/lib/utils";
import { navItems } from "@/lib/constants";

export function Header({
  onMenu,
  onToggleCollapse,
  collapsed
}: {
  onMenu: () => void;
  onToggleCollapse: () => void;
  collapsed: boolean;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const current = navItems.find((item) => item.href === pathname);

  return (
    <header className="sticky top-0 z-30 flex h-18 items-center justify-between gap-2 border-b border-adapt-muted bg-adapt-background/95 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <Button variant="ghost" icon={<Menu className="h-5 w-5" />} className="lg:hidden" onClick={onMenu} aria-label="Open navigation" />
        <Button
          variant="ghost"
          icon={collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
          className="hidden lg:inline-flex"
          onClick={onToggleCollapse}
          aria-label="Toggle navigation width"
        />
        <div>
          <p className="text-sm font-semibold text-adapt-text">{current?.label ?? "Dashboard"}</p>
          <p className="hidden font-mono text-[10px] text-adapt-subtle sm:block">ADAPT WORKSPACE</p>
        </div>
      </div>
      <div className="hidden min-w-64 max-w-sm flex-1 px-8 md:block">
        <label className="relative block h-10 min-w-0 w-full">
          <span className="sr-only">Search ADAPT</span>
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center text-adapt-subtle">
            <Search className="h-4 w-4" />
          </span>
          <input
            placeholder="Search members, plans, payments"
            className="block h-full w-full rounded-adapt border border-adapt-muted bg-adapt-surface pl-10 pr-3 text-sm text-adapt-text outline-none focus:border-adapt-primary"
          />
        </label>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" icon={<Bell className="h-5 w-5" />} aria-label="Notifications" />
        <div className="hidden items-center gap-3 border-l border-adapt-muted pl-4 sm:flex">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-adapt-accent/30 bg-adapt-primary/20 text-xs font-medium text-indigo-200">
            {initials(user?.name ?? "Admin")}
          </span>
          <div>
            <p className="text-sm font-semibold text-adapt-text">{user?.name}</p>
            <p className="text-xs text-adapt-subtle">{user?.role}</p>
          </div>
        </div>
        <Button variant="ghost" icon={<LogOut className="h-5 w-5" />} onClick={logout} aria-label="Logout" />
      </div>
    </header>
  );
}
