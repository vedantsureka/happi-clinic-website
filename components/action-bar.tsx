"use client";

import Link from "next/link";
import { Phone, CalendarCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { BOOKING_HREF } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Sticky call/book bar on phones and tablets. */
export function MobileActionBar({ telHref }: { telHref: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 backdrop-blur xl:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-2 gap-2 p-2">
        <a href={telHref} className="flex min-h-14 items-center justify-center gap-2 rounded-[var(--radius-control)] bg-teal font-display text-[1.0625rem] font-bold text-white">
          <Phone className="size-5" aria-hidden="true" />
          Call Now
        </a>
        <Link
          href={BOOKING_HREF}
          className="flex min-h-14 items-center justify-center gap-2 rounded-[var(--radius-control)] bg-sky font-display text-[1.0625rem] font-bold text-teal-ink"
        >
          <CalendarCheck className="size-5" aria-hidden="true" />
          Book
        </Link>
      </div>
    </div>
  );
}

/** Discreet floating call button on desktop, shown after the first screen. */
export function FloatingCall({ telHref, phoneDisplay }: { telHref: string; phoneDisplay: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 640);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <a
      href={telHref}
      aria-label={`Call ${phoneDisplay}`}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={cn(
        "group fixed bottom-6 right-6 z-30 hidden items-center gap-3 rounded-full bg-teal py-3 pl-3 pr-5 text-white shadow-[var(--shadow-slip)] transition-all duration-200 xl:flex motion-reduce:transition-none",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <span className="grid size-10 place-items-center rounded-full bg-white/15">
        <Phone className="size-5" aria-hidden="true" />
      </span>
      <span className="font-display font-bold tabular-nums">{phoneDisplay}</span>
    </a>
  );
}
