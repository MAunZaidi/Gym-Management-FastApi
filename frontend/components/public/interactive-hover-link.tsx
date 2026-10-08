import type { ComponentProps } from "react";
import Link from "next/link";
import { InteractiveHoverContent, interactiveHoverActionClasses } from "@/components/ui/interactive-hover-content";
import { cn } from "@/lib/utils";

type InteractiveHoverLinkProps = Omit<ComponentProps<typeof Link>, "children"> & {
  text: string;
  variant?: "primary" | "outline";
};

export function InteractiveHoverLink({ text, variant = "primary", className, ...props }: InteractiveHoverLinkProps) {
  return <Link
    {...props}
    className={cn(interactiveHoverActionClasses, "public-button", variant === "outline" && "public-button--outline", className)}
  ><InteractiveHoverContent text={text} /></Link>;
}
