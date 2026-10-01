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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-adapt-primary">ADAPT OPERATIONS</p>
        <h1 className="mt-2 text-2xl font-semibold text-adapt-text sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-adapt-subtle">{description}</p>
      </div>
      {action}
    </div>
  );
}
