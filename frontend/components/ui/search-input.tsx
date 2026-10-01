"use client";

import { Search } from "lucide-react";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function SearchInput({ value, onChange, placeholder = "Search" }: SearchInputProps) {
  return (
    <label className="relative block">
      <span className="sr-only">{placeholder}</span>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-adapt-subtle" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-adapt border border-adapt-muted bg-adapt-surface pl-9 pr-3 text-sm text-adapt-text outline-none transition placeholder:text-adapt-subtle focus:border-adapt-primary"
      />
    </label>
  );
}
