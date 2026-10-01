"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  icon?: ReactNode;
};

export function Button({ className, variant = "primary", icon, children, ...props }: ButtonProps) {
  const iconOnly = children == null;
  const showArrow = variant === "primary" && !iconOnly;
  const leadingIcon = icon ?? (showArrow ? <Sparkles className="h-4 w-4" /> : null);

  return (
    <button
      data-variant={variant}
      className={cn(
        "adapt-button relative isolate inline-flex min-h-10 shrink-0 items-center justify-center gap-3 rounded-full border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "min-h-12 px-6 py-3.5",
        iconOnly && "h-10 w-10 gap-0 px-0 py-0",
        className
      )}
      title={props["aria-label"]}
      {...props}
    >
      <span aria-hidden="true" className="adapt-button-surface" />
      <span aria-hidden="true" className="adapt-button-sheen"><span /></span>
      {leadingIcon ? <span aria-hidden="true" className="adapt-button-icon relative z-10 inline-flex shrink-0 items-center justify-center">{leadingIcon}</span> : null}
      {children != null ? <span className="relative z-10 min-w-0 text-center leading-5">{children}</span> : null}
      {showArrow ? <ArrowRight aria-hidden="true" className="adapt-button-arrow relative z-10 h-4 w-4 shrink-0" /> : null}
    </button>
  );
}
