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
        "public-button min-w-44 px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50",
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
