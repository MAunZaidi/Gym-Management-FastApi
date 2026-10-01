"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import { Dumbbell, LogOut, X } from "lucide-react";
import { navGroups } from "@/lib/constants";
import { cn, initials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useDialogFocus } from "@/hooks/use-dialog-focus";
import { useAuth } from "@/components/layout/auth-provider";

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
  const { user, logout } = useAuth();
  const drawerRef = useRef<HTMLDivElement>(null);
  useDialogFocus(open && mode !== "desktop", drawerRef, onClose);

  useEffect(() => {
    if (!open || mode === "desktop" || !drawerRef.current) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.fromTo("[data-drawer-panel]", { x: -32, opacity: 0 }, { x: 0, opacity: 1, duration: 0.28, ease: "power3.out" });
        gsap.fromTo("[data-drawer-overlay]", { opacity: 0 }, { opacity: 1, duration: 0.2 });
      }, drawerRef);
      return () => context.revert();
    });
    return () => media.revert();
  }, [mode, open]);

  useEffect(() => {
    if (!open || mode === "desktop") return;
    const breakpoint = window.matchMedia("(min-width: 1024px)");
    function closeOnDesktop() { if (breakpoint.matches) onClose(); }
    breakpoint.addEventListener("change", closeOnDesktop);
    return () => breakpoint.removeEventListener("change", closeOnDesktop);
  }, [mode, onClose, open]);

  const sidebarContent = (
    <aside
      className={cn(
        "adapt-sidebar flex h-dvh max-w-[88vw] flex-col border-r border-adapt-muted bg-adapt-surface transition-[width] duration-300",
        collapsed ? "w-[86px]" : "w-72"
      )}
    >
      <div className={cn("flex h-18 shrink-0 items-center justify-between gap-2 px-5", collapsed && "justify-center px-3")}>
        <Link href="/dashboard" aria-label="ADAPT dashboard" className="flex min-w-0 items-center gap-3 rounded-lg" onClick={onClose}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] border border-white/10 bg-adapt-primary text-white shadow-panel">
            <Dumbbell className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </span>
          {!collapsed ? (
            <span className="min-w-0">
              <span className="block text-xl font-semibold leading-6 text-adapt-text">ADAPT</span>
              <span className="mt-0.5 block font-mono text-[10px] text-adapt-subtle">Gym workspace</span>
            </span>
          ) : null}
        </Link>
        <Button variant="ghost" className="h-8 min-h-8 w-8 lg:hidden" icon={<X className="h-4 w-4" />} onClick={onClose} aria-label="Close navigation" />
      </div>
      <nav aria-label="Main navigation" className={cn("min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-4 pb-5 pt-4", collapsed && "space-y-3 px-3")}>
        {navGroups.map((group, groupIndex) => (
          <section key={group.label} aria-label={group.label}>
            {!collapsed ? (
              <h2 className="mb-2 px-3 font-mono text-[10px] font-medium text-adapt-subtle">{group.label}</h2>
            ) : groupIndex > 0 ? <div className="mx-auto mb-3 h-px w-5 bg-adapt-muted" /> : null}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      aria-label={collapsed ? item.label : undefined}
                      className={cn("adapt-nav-link", active && "adapt-nav-link--active", collapsed && "justify-center px-0")}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon aria-hidden="true" className="adapt-nav-icon h-[17px] w-[17px] shrink-0" strokeWidth={1.75} />
                      {!collapsed ? <span className="min-w-0 truncate">{item.label}</span> : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </nav>
      <div className={cn("mx-4 flex shrink-0 items-center gap-3 border-t border-adapt-muted py-4", collapsed && "mx-3 flex-col gap-2")}>
        <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-adapt-accent/30 bg-adapt-primary/20 text-[11px] font-semibold text-indigo-200">
          {initials(user?.name ?? "Gym Staff")}
        </span>
        {!collapsed ? <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-medium text-adapt-text">{user?.name ?? "Gym Staff"}</p><p className="mt-0.5 truncate text-[11px] text-adapt-subtle">{user?.role ?? "Staff"}</p></div> : null}
        <Button variant="ghost" className="h-8 min-h-8 w-8" icon={<LogOut className="h-4 w-4" />} aria-label="Sign out of ADAPT" onClick={() => { onClose(); void logout(); }} />
      </div>
    </aside>
  );

  return (
    <>
      {mode !== "mobile" ? <div className="hidden lg:block">{sidebarContent}</div> : null}
      {mode !== "desktop" && open ? (
        <div ref={drawerRef} role="dialog" aria-modal="true" aria-label="Navigation" tabIndex={-1} className="fixed inset-0 z-40 lg:hidden">
          <button data-drawer-overlay tabIndex={-1} className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-label="Close navigation overlay" onClick={onClose} />
          <div data-drawer-panel className="relative h-full max-w-[88vw]">{sidebarContent}</div>
        </div>
      ) : null}
    </>
  );
}
