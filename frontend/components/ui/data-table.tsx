import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { HolographicSurface } from "@/components/ui/holographic-surface";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
  className?: string;
};

export function DataTable<T>({
  items,
  columns,
  getKey
}: {
  items: T[];
  columns: DataTableColumn<T>[];
  getKey: (item: T) => string;
}) {
  return (
    <div data-reveal className="adapt-panel overflow-hidden rounded-adapt border border-adapt-muted bg-adapt-surface shadow-panel">
      <HolographicSurface quiet />
      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full divide-y divide-adapt-muted">
          <thead className="bg-[#1d1d21]">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={cn("px-4 py-4 text-left font-mono text-[11px] font-medium uppercase text-adapt-subtle", column.className)}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-adapt-muted">
            {items.map((item) => (
              <tr key={getKey(item)} className="transition-colors hover:bg-white/[0.035]">
                {columns.map((column) => (
                  <td key={column.key} className={cn("px-4 py-4 text-sm text-zinc-200", column.className)}>
                    {column.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 p-3 lg:hidden">
        {items.map((item) => (
          <div key={getKey(item)} className="rounded-adapt border border-adapt-muted bg-[#12141A] p-4">
            <div className="grid gap-3">
              {columns.map((column) => (
                <div key={column.key} className="flex items-start justify-between gap-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-adapt-subtle">{column.header}</span>
                  <div className="min-w-0 text-right text-sm text-zinc-100">{column.render(item)}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
