import React from "react";
import { cn } from "@/lib/utils";
import { InteractiveHoverContent, interactiveHoverActionClasses } from "@/components/ui/interactive-hover-content";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        interactiveHoverActionClasses,
        "min-w-44 rounded-full border border-white/25 bg-[var(--public-panel,#0b1117)] px-5 py-3 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <InteractiveHoverContent text={text} />
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
