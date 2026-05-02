"use client";

import { motion } from "framer-motion";

export const templates = [
  "கருவறை கடந்தும் தொடரும் அன்பு!",
  "என் முதல் ஆசான் என் அம்மா!",
  "வலிகள் போக்கும் என் மருந்து!",
  "The one who fed me love as food!",
  "The root that holds me so I never fall!",
  "The medicine that heals all my pain!",
] as const;

export function TemplateSelector({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (next: string) => void;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-[color:var(--surface-text)]">
            Template Selection
          </div>
          <div className="text-xs text-[color:var(--surface-text-faint)]">
            Choose one premium line for your mom.
          </div>
        </div>
        <div className="text-xs text-[color:var(--surface-text-faint)]">
          {value ? "Selected" : "Required"}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {templates.map((t) => {
          const selected = t === value;
          return (
            <motion.button
              key={t}
              type="button"
              onClick={() => onChange(t)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.99 }}
              className={`group text-left rounded-3xl border p-4 transition-colors ${
                selected
                  ? "border-[color:var(--gold)]/70 bg-[rgba(255,225,10,0.12)]"
                  : "border-[color:var(--line-soft)] bg-white/45 hover:border-[color:var(--gold)]/35"
              }`}
            >
              <div className="text-sm leading-6 text-[color:var(--surface-text)]">{t}</div>
              <div
                className={`mt-3 h-1.5 w-10 rounded-full transition-colors ${
                  selected
                    ? "bg-[color:var(--gold)]"
                    : "bg-[color:var(--line-soft)] group-hover:bg-[color:var(--foreground-muted)]"
                }`}
              />
            </motion.button>
          );
        })}
      </div>

      {error ? <div className="text-xs text-[color:var(--danger-text)]">{error}</div> : null}
    </div>
  );
}
