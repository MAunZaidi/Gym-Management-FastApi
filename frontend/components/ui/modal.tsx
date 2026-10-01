"use client";

import { useEffect, useId, useRef } from "react";
import gsap from "gsap";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDialogFocus } from "@/hooks/use-dialog-focus";
import { HolographicSurface } from "@/components/ui/holographic-surface";

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
  const titleId = useId();
  const descriptionId = useId();
  useDialogFocus(open, panelRef, onClose);

  useEffect(() => {
    if (!open || !panelRef.current) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.fromTo(panelRef.current, { opacity: 0, y: 18, scale: 0.985 }, { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: "power3.out" });
      }, panelRef);
      return () => context.revert();
    });
    return () => media.revert();
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-3 backdrop-blur-sm sm:p-6" onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          "adapt-panel max-h-[calc(100dvh-2rem)] w-full overflow-auto overscroll-contain rounded-adapt border border-adapt-muted bg-adapt-surface p-5 shadow-adapt sm:p-6",
          size === "md" && "max-w-xl",
          size === "lg" && "max-w-3xl",
          size === "xl" && "max-w-5xl"
        )}
      >
        <HolographicSurface quiet />
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="text-lg font-medium text-adapt-text">{title}</h2>
            {description ? <p id={descriptionId} className="mt-1 text-sm text-adapt-subtle">{description}</p> : null}
          </div>
          <Button variant="ghost" icon={<X className="h-4 w-4" />} onClick={onClose} aria-label="Close modal" />
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
