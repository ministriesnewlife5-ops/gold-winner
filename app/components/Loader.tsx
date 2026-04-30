"use client";

import { motion } from "framer-motion";

export function Loader({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3">
      <motion.span
        className="inline-flex h-4 w-4 rounded-full border-2 border-[color:var(--gold)] border-r-transparent"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, ease: "linear", repeat: Infinity }}
      />
      {label ? <span className="text-sm text-[color:inherit] opacity-80">{label}</span> : null}
    </div>
  );
}
