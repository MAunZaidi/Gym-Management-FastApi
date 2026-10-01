"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, X } from "lucide-react";
import { navItems } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Sidebar({
  open,
  onClose,
  collapsed,
  mode = "both"
}: {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  mode?: "desktop" | "mobile" | "both";
}) {
  const pathname = usePathname();

  const sidebarContent = (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-adapt-muted bg-adapt-surface/95 backdrop-blur-xl transition-all duration-300",
        collapsed ? "w-[86px]" : "w-72"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-adapt-muted px-4">
        <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
          <span className="grid h-10 w-10 place-items-center rounded-adapt bg-adapt-primary text-white">
            <Dumbbell className="h-5 w-5" />
          </span>
          {!collapsed ? (
            <span>
              <span className="block text-lg font-semibold text-adapt-text">ADAPT</span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.22em] text-adapt-subtle">Gym OS</span>
            </span>
          ) : null}
        </Link>
        <Button variant="ghost" className="lg:hidden" icon={<X className="h-4 w-4" />} onClick={onClose} aria-label="Close navigation" />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-adapt px-3 text-sm font-medium text-adapt-subtle transition hover:bg-white/5 hover:text-adapt-text",
                active && "bg-adapt-primary text-white shadow-panel hover:bg-adapt-primary hover:text-white",
                collapsed && "justify-center"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed ? <span>{item.label}</span> : null}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-adapt-muted p-4">
        <div className={cn("rounded-adapt border border-adapt-muted bg-[#12141A] p-3", collapsed && "hidden")}>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-adapt-primary">Today</p>
          <p className="mt-2 text-sm text-zinc-200">24 check-ins, 3 classes, 2 payments due.</p>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {mode !== "mobile" ? <div className="hidden lg:block">{sidebarContent}</div> : null}
      {mode !== "desktop" && open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 bg-black/70" aria-label="Close navigation overlay" onClick={onClose} />
          <div className="relative h-full max-w-[88vw]">{sidebarContent}</div>
        </div>
      ) : null}
    </>
  );
}
