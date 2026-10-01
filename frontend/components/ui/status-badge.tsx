import { cn } from "@/lib/utils";
import type { StatusTone } from "@/types";

const tones: Record<StatusTone, string> = {
  success: "border-teal-300/30 bg-teal-300/10 text-teal-200",
  warning: "border-amber-300/30 bg-amber-300/10 text-amber-200",
  danger: "border-rose-300/30 bg-rose-300/10 text-rose-200",
  info: "border-sky-300/30 bg-sky-300/10 text-sky-200",
  neutral: "border-zinc-500/30 bg-zinc-500/10 text-zinc-200"
};

export function toneForStatus(status: string): StatusTone {
  if (["Active", "Paid", "Available", "Scheduled", "Booked", "Checked In"].includes(status)) return "success";
  if (["Due", "Busy", "Waitlisted", "Full"].includes(status)) return "warning";
  if (["Expired", "Cancelled", "Inactive", "Absent"].includes(status)) return "danger";
  if (["Checked Out"].includes(status)) return "info";
  return "neutral";
}

export function StatusBadge({ label, tone = toneForStatus(label) }: { label: string; tone?: StatusTone }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold", tones[tone])}>
      {label}
    </span>
  );
}
