"use client";

import { motion } from "framer-motion";

export const templates = [
  "The silent architect of my dreams.",
  "Our family's unshakable foundation.",
  "The gold standard of unconditional love.",
  "The anchor that keeps us grounded.",
  "A heart as resilient and timeless as gold.",
  "To the woman who is the flavor of my childhood.",
  "The secret ingredient in every happy memory.",
  "The keeper of our most cherished family traditions.",
  "The heartbeat of our kitchen and our home.",
  "The master chef who nourishes my soul.",
  "My compassionate guide through every stage of life.",
  "The fierce protector of our family's happiness.",
  "Her wisdom is more valuable than any fortune.",
  "A guardian angel who walks beside us daily.",
  "The North Star that always leads me home.",
  "The ultimate role model for a life well-lived.",
  "She believed in me long before I believed in myself.",
  "An inspiring spirit with boundless energy.",
  "Changing the world through small acts of love.",
  "Every win I have is a reflection of your support.",
  "The best friend I was lucky enough to be born with.",
  "Her laughter is the brightest light in our house.",
  "The golden thread that connects all our hearts.",
  "An endless listener who always has time for my stories.",
  "The perfect definition of grace and a golden heart.",
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
