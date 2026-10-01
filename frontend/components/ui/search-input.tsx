"use client";

import { Search } from "lucide-react";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function SearchInput({ value, onChange, placeholder = "Search" }: SearchInputProps) {
  return (
    <label className="relative block h-11 min-w-0 w-full self-end">
      <span className="sr-only">{placeholder}</span>
      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center text-adapt-subtle">
        <Search className="h-4 w-4" />
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="block h-full w-full rounded-adapt border border-adapt-muted bg-adapt-surface pl-10 pr-3 text-sm text-adapt-text outline-none transition placeholder:text-adapt-subtle focus:border-adapt-primary"
      />
    </label>
  );
}
