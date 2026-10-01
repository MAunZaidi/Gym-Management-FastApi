import type { ReactNode } from "react";
import { ClipboardList } from "lucide-react";

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="grid place-items-center rounded-adapt border border-dashed border-adapt-muted bg-adapt-surface p-10 text-center">
      <ClipboardList className="h-9 w-9 text-adapt-primary" />
      <h3 className="mt-4 text-base font-semibold text-adapt-text">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-adapt-subtle">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
