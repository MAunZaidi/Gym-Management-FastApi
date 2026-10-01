import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BaseProps = {
  label: string;
  error?: string;
};

export function FormField({ label, error, className, ...props }: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium text-zinc-200">{label}</span>
      <input
        className={cn(
          "h-11 rounded-adapt border border-adapt-muted bg-[#12141A] px-3 text-sm text-adapt-text outline-none transition focus:border-adapt-primary",
          className
        )}
        {...props}
      />
      {error ? <span className="text-xs text-adapt-danger">{error}</span> : null}
    </label>
  );
}

export function SelectField({
  label,
  error,
  children,
  className,
  ...props
}: BaseProps & SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium text-zinc-200">{label}</span>
      <select
        className={cn(
          "h-11 rounded-adapt border border-adapt-muted bg-[#12141A] px-3 text-sm text-adapt-text outline-none transition focus:border-adapt-primary",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="text-xs text-adapt-danger">{error}</span> : null}
    </label>
  );
}

export function TextAreaField({ label, error, className, ...props }: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium text-zinc-200">{label}</span>
      <textarea
        className={cn(
          "min-h-24 rounded-adapt border border-adapt-muted bg-[#12141A] px-3 py-2 text-sm text-adapt-text outline-none transition focus:border-adapt-primary",
          className
        )}
        {...props}
      />
      {error ? <span className="text-xs text-adapt-danger">{error}</span> : null}
    </label>
  );
}

export function ToggleField({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-adapt border border-adapt-muted bg-[#12141A] px-3 py-3 text-sm">
      <span className="font-medium text-zinc-200">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 accent-adapt-primary"
      />
    </label>
  );
}
