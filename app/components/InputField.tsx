"use client";

import { useId } from "react";
import type React from "react";

export function InputField({
  label,
  value,
  onChange,
  placeholder,
  error,
  maxLength,
  inputMode,
  name,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  error?: string;
  maxLength?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  name?: string;
  autoComplete?: string;
}) {
  const id = useId();

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-[color:var(--surface-text)]">
        {label}
      </label>
      <input
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        inputMode={inputMode}
        autoComplete={autoComplete}
        className="h-12 w-full rounded-2xl border border-[color:var(--line-soft)] bg-white/72 px-4 text-sm text-[color:var(--surface-text)] outline-none ring-0 transition-colors placeholder:text-[color:var(--surface-text-faint)] focus:border-[color:var(--gold)]/60"
      />
      {error ? <div className="text-xs text-[color:var(--danger-text)]">{error}</div> : null}
    </div>
  );
}
