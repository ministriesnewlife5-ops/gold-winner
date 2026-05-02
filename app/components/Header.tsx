import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--line-soft)] bg-[rgba(255,251,243,0.94)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Gold Winner" width={44} height={44} className="h-11 w-11 object-contain" />
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight text-[color:var(--surface-text)]">
              Gold Winner
            </div>
            <div className="text-[11px] text-[color:var(--surface-text-faint)]">Mother’s Day 2026</div>
          </div>
        </Link>

      </div>
    </header>
  );
}
