import Image from "next/image";
import Link from "next/link";

import { HeroMotion } from "./components/HeroMotion";
import { Header } from "./components/Header";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-48 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[color:var(--gold-light)]/24 blur-3xl" />
            <div className="absolute -bottom-56 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[color:var(--gold)]/20 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(1000px_600px_at_50%_0%,rgba(255,241,166,0.22),transparent_55%)]" />
          </div>

          <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <HeroMotion>
                <div className="rounded-3xl border border-[color:var(--card-border)] bg-[linear-gradient(160deg,rgba(255,250,240,0.9),rgba(255,241,166,0.48))] p-6 shadow-[var(--shadow)] sm:p-10">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--card-border)] bg-white/55 px-4 py-2 text-xs tracking-wide text-[color:var(--surface-text)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--gold)]" />
                    Mother’s Day Campaign 2026
                  </div>

                  <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-[color:var(--surface-text)] sm:text-5xl">
                    Surprise Your Mom <span className="text-[color:var(--gold)]">❤</span>
                  </h1>
                  <p className="mt-4 max-w-xl text-base leading-7 text-[color:var(--surface-text-soft)] sm:text-lg">
                    From anywhere in the world… send a premium Mother’s Day surprise with a
                    personalized message and photo.
                  </p>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Link
                      href="/form"
                      className="group inline-flex h-12 items-center justify-center rounded-full bg-[color:var(--gold)] px-6 text-sm font-semibold text-[color:var(--text-on-gold)] shadow-[var(--button-shadow)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      Start the Surprise
                      <span className="ml-2 inline-block transition-transform group-hover:translate-x-0.5">
                        →
                      </span>
                    </Link>
                    <div className="text-sm text-[color:var(--surface-text-faint)]">
                      Takes less than 60 seconds. Mobile-first.
                    </div>
                  </div>
                </div>
              </HeroMotion>

              <HeroMotion delay={0.12}>
                <div className="relative mx-auto w-full max-w-lg">
                  <div className="absolute -inset-4 rounded-[36px] bg-[radial-gradient(circle_at_50%_40%,rgba(255,241,166,0.28),transparent_60%)] blur-2xl" />
                  <div className="relative overflow-hidden rounded-[32px] border border-[color:var(--card-border)] bg-[linear-gradient(180deg,rgba(255,250,240,0.96),rgba(255,241,166,0.62))] shadow-[var(--shadow)]">
                    <div className="relative aspect-[4/4]">
                      <Image
                        src="/mom.png"
                        alt="Mother's Day"
                        fill
                        className="object-cover opacity-100"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(255,255,255,0.08)] via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="rounded-2xl border border-[color:var(--line-soft)] bg-[rgba(255,250,240,0.82)] p-4 backdrop-blur">
                          <div className="text-xs tracking-wide text-[color:var(--surface-text-faint)]">
                            Your message will look like this
                          </div>
                          <div className="mt-2 text-base font-semibold text-[color:var(--surface-text)]">
                            “The gold standard of unconditional love.”
                          </div>
                          <div className="mt-1 text-xs text-[color:var(--surface-text-faint)]">
                            Add a photo + address — we’ll do the rest.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </HeroMotion>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-[color:var(--line-soft)] py-6">
        <div className="mx-auto w-full max-w-6xl px-5 text-xs text-black sm:px-8">
          Gold Winner &copy; 2026 All rights reserved: Designed and Developed ❤️ Athryan Tech Solution
        </div>
      </footer>
    </div>
  );
}
