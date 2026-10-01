"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  icon?: ReactNode;
};

export function Button({ className, variant = "primary", icon, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-adapt px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-adapt-primary text-white shadow-panel hover:bg-[#7B6EFF]",
        variant === "secondary" && "border border-adapt-muted bg-adapt-surface text-adapt-text hover:border-adapt-primary/50",
        variant === "ghost" && "text-adapt-subtle hover:bg-white/5 hover:text-adapt-text",
        variant === "danger" && "bg-adapt-danger text-white hover:bg-rose-400",
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
