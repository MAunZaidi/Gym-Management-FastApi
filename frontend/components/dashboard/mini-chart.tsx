import { cn } from "@/lib/utils";

export function MiniChart({
  title,
  values,
  labels,
  className
}: {
  title: string;
  values: number[];
  labels: string[];
  className?: string;
}) {
  const max = Math.max(...values);

  return (
    <div className={cn("rounded-adapt border border-adapt-muted bg-adapt-surface p-5 shadow-panel", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-adapt-text">{title}</h3>
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-adapt-subtle">Live mock</span>
      </div>
      <div className="mt-6 flex h-48 items-end gap-3">
        {values.map((value, index) => (
          <div key={labels[index]} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-40 w-full items-end rounded-adapt bg-[#12141A] p-1">
              <div
                className="w-full rounded-[6px] bg-gradient-to-t from-adapt-primary to-adapt-success"
                style={{ height: `${Math.max(12, (value / max) * 100)}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-adapt-subtle">{labels[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
