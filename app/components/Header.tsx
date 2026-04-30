import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--line-soft)] bg-[rgba(255,251,243,0.94)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl border border-[color:var(--card-border)] bg-[radial-gradient(circle_at_30%_20%,rgba(255,241,166,0.65),transparent_42%),linear-gradient(145deg,#ffe10a_0%,#f7b112_48%,#f36a21_100%)] shadow-[var(--button-shadow)]" />
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight text-[color:var(--surface-text)]">
              Gold Winner
            </div>
            <div className="text-[11px] text-[color:var(--surface-text-faint)]">Mother’s Day 2026</div>
          </div>
        </Link>

        <Link
          href="/form"
          className="inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--card-border)] bg-[rgba(255,225,10,0.12)] px-4 text-xs font-semibold tracking-wide text-[color:var(--surface-text)] transition-colors hover:bg-[rgba(255,225,10,0.2)]"
        >
          Create Surprise
        </Link>
      </div>
    </header>
  );
}
