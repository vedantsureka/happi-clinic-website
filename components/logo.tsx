import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={cn("size-10 shrink-0", className)}>
      <rect width="40" height="40" rx="11" fill="#087F8C" />
      <rect x="17" y="7" width="6" height="19" rx="1.6" fill="#fff" />
      <rect x="10.5" y="13.5" width="19" height="6" rx="1.6" fill="#fff" />
      <path d="M12.5 29.5 Q20 35.5 27.5 29.5" fill="none" stroke="#43BFA7" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3 rounded-lg" aria-label="HAPPI CLINIC AND DIAGNOSTICS, home">
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className={cn("font-display text-[1.375rem] font-extrabold tracking-[0.02em]", light ? "text-white" : "text-navy")}>
          HAPPI
        </span>
        <span className={cn("mt-1 whitespace-nowrap font-display text-[0.6875rem] font-bold tracking-[0.12em]", light ? "text-white/80" : "text-teal")}>
          CLINIC AND DIAGNOSTICS
        </span>
      </span>
    </Link>
  );
}
