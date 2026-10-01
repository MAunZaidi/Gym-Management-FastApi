import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div data-reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="flex items-center gap-2 font-mono text-[11px] text-adapt-subtle"><span className="h-1.5 w-1.5 rounded-full bg-adapt-accent" /> ADAPT / OPERATIONS</p>
        <h1 className="mt-3 text-2xl font-medium text-adapt-text sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-adapt-subtle">{description}</p>
      </div>
      {action}
    </div>
  );
}
