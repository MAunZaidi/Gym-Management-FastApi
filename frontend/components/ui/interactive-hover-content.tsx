import { ArrowRight } from "lucide-react";

export const interactiveHoverActionClasses =
  "interactive-hover-action group relative isolate inline-flex min-h-12 cursor-pointer items-center justify-center overflow-hidden text-center font-semibold";

export function InteractiveHoverContent({ text }: { text: string }) {
  return <>
    <span className="relative z-10 inline-block translate-x-1 transition-all duration-[180ms] group-hover:translate-x-12 group-hover:opacity-0 group-focus-visible:translate-x-12 group-focus-visible:opacity-0 motion-reduce:duration-0">
      {text}
    </span>
    <span
      aria-hidden="true"
      className="absolute inset-0 z-10 flex translate-x-12 items-center justify-center gap-2 text-[var(--interactive-hover-text,#03060a)] opacity-0 transition-all duration-[180ms] group-hover:-translate-x-1 group-hover:opacity-100 group-focus-visible:-translate-x-1 group-focus-visible:opacity-100 motion-reduce:duration-0"
    >
      <span>{text}</span>
      <ArrowRight size={18} />
    </span>
    <span
      aria-hidden="true"
      data-hover-fill
      className="absolute left-2 top-1/2 h-2 w-2 -translate-y-1/2 scale-100 rounded-lg bg-[var(--interactive-fill,#00e5ff)] transition-all duration-[180ms] group-hover:left-0 group-hover:top-0 group-hover:h-full group-hover:w-full group-hover:translate-y-0 group-hover:scale-[1.8] group-focus-visible:left-0 group-focus-visible:top-0 group-focus-visible:h-full group-focus-visible:w-full group-focus-visible:translate-y-0 group-focus-visible:scale-[1.8] motion-reduce:duration-0"
    />
  </>;
}
