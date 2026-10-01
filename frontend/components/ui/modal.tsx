"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  title,
  description,
  children,
  onClose,
  size = "md"
}: {
  open: boolean;
  title: string;
  description?: string;
  children: React.ReactNode;
  onClose: () => void;
  size?: "md" | "lg" | "xl";
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open || !panelRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(panelRef.current, { autoAlpha: 0, y: 18, scale: 0.98 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.24, ease: "power2.out" });
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div
        ref={panelRef}
        className={cn(
          "max-h-[90vh] w-full overflow-auto rounded-adapt border border-adapt-muted bg-adapt-surface p-5 shadow-adapt",
          size === "md" && "max-w-xl",
          size === "lg" && "max-w-3xl",
          size === "xl" && "max-w-5xl"
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-adapt-text">{title}</h2>
            {description ? <p className="mt-1 text-sm text-adapt-subtle">{description}</p> : null}
          </div>
          <Button variant="ghost" icon={<X className="h-4 w-4" />} onClick={onClose} aria-label="Close modal" />
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
