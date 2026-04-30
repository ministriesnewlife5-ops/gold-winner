"use client";

import { useId } from "react";

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  error,
  rows = 4,
  name,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  error?: string;
  rows?: number;
  name?: string;
}) {
  const id = useId();

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-[color:var(--surface-text)]">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-none rounded-2xl border border-[color:var(--line-soft)] bg-white/72 px-4 py-3 text-sm text-[color:var(--surface-text)] outline-none ring-0 transition-colors placeholder:text-[color:var(--surface-text-faint)] focus:border-[color:var(--gold)]/60"
      />
      {error ? <div className="text-xs text-[color:var(--danger-text)]">{error}</div> : null}
    </div>
  );
}
