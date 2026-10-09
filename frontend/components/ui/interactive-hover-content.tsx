export const interactiveHoverActionClasses =
  "btn-magnetic relative isolate inline-flex min-h-12 cursor-pointer items-center justify-center overflow-hidden text-center font-semibold";

export function InteractiveHoverContent({ text }: { text: string }) {
  return <span className="relative z-10 inline-flex items-center justify-center">{text}</span>;
}
