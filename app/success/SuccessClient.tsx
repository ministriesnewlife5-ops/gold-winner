"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

import { Header } from "../components/Header";

export function SuccessClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[color:var(--gold-light)]/20 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(900px_550px_at_50%_0%,rgba(255,241,166,0.2),transparent_55%)]" />
          </div>

          <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
              className="mx-auto max-w-2xl"
            >
              <div className="rounded-3xl border border-[color:var(--card-border)] bg-[linear-gradient(160deg,rgba(255,250,240,0.92),rgba(255,241,166,0.52))] p-6 shadow-[var(--shadow)] sm:p-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--card-border)] bg-white/55 px-4 py-2 text-xs tracking-wide text-[color:var(--surface-text)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--gold)]" />
                  Submission received
                </div>

                <h1 className="mt-6 text-3xl font-semibold tracking-tight text-[color:var(--surface-text)] sm:text-4xl">
                  Thank You <span className="text-[color:var(--gold)]">❤</span>
                </h1>
                <p className="mt-3 text-sm leading-6 text-[color:var(--surface-text-soft)]">
                  Your Mother’s Day surprise is now in our processing queue.
                </p>

                <div className="mt-7 rounded-2xl border border-[color:var(--line-soft)] bg-white/45 p-5">
                  <div className="text-xs text-[color:var(--surface-text-faint)]">Your Order ID</div>
                  <div className="mt-1 text-lg font-semibold tracking-wide text-[color:var(--surface-text)]">
                    {orderId || "—"}
                  </div>
                  <div className="mt-2 text-xs text-[color:var(--surface-text-faint)]">
                    Save this ID for tracking or support.
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/"
                    className="inline-flex h-12 items-center justify-center rounded-full border border-[color:var(--line-soft)] bg-white/45 px-6 text-sm font-semibold text-[color:var(--surface-text)] transition-colors hover:bg-white/60"
                  >
                    Back to Home
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      if (!orderId) return;
                      const text = `Gold Winner — Order ID: ${orderId}`;
                      void navigator.clipboard.writeText(text);
                    }}
                    className="inline-flex h-12 items-center justify-center rounded-full bg-[color:var(--gold)] px-6 text-sm font-semibold text-[color:var(--text-on-gold)] shadow-[var(--button-shadow)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Copy Order ID
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
