import { Header } from "../components/Header";
import { HeroMotion } from "../components/HeroMotion";
import { OrderForm } from "../components/OrderForm";

export default function FormPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-56 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-[color:var(--gold-light)]/20 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(900px_550px_at_50%_0%,rgba(255,241,166,0.2),transparent_55%)]" />
          </div>

          <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
            <HeroMotion>
              <div className="mx-auto max-w-3xl">
                <div className="rounded-3xl border border-[color:var(--card-border)] bg-[linear-gradient(160deg,rgba(255,250,240,0.92),rgba(255,241,166,0.52))] p-6 shadow-[var(--shadow)] sm:p-10">
                  <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--surface-text)] sm:text-3xl">
                      Create your Mother’s Day Surprise
                    </h1>
                    <p className="text-sm leading-6 text-[color:var(--surface-text-soft)]">
                      Fill in the details below. Your photo and message will be processed under a
                      unique order ID.
                    </p>
                  </div>

                  <div className="mt-8">
                    <OrderForm />
                  </div>
                </div>

                <div className="mt-6 text-xs leading-5 text-[color:var(--surface-text-faint)]">
                  By submitting, you confirm the information is accurate and the image belongs to
                  you.
                </div>
              </div>
            </HeroMotion>
          </div>
        </section>
      </main>
    </div>
  );
}
