"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, Phone, X, CalendarCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { buttonClass } from "./ui/button";
import { navLinks, BOOKING_HREF } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header({ phoneDisplay, telHref, hoursNotice }: { phoneDisplay: string; telHref: string; hoursNotice: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85 transition-shadow",
        scrolled ? "shadow-[0_1px_0_var(--color-line),0_8px_24px_-16px_rgb(23_50_77/0.25)]" : "shadow-[0_1px_0_var(--color-line)]",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>
      <div className="container-site flex h-[4.5rem] items-center justify-between gap-4 xl:h-20">
        <Logo />

        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={cn(
                    "relative whitespace-nowrap rounded-lg px-3 py-2 text-[0.9875rem] font-semibold transition-colors",
                    isActive(l.href) ? "text-teal" : "text-navy hover:text-teal",
                  )}
                >
                  {l.label}
                  {isActive(l.href) && <span aria-hidden="true" className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-mint" />}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <a href={telHref} className={buttonClass("secondary", "md", "px-4")}>
            <Phone className="size-[1.125rem]" aria-hidden="true" />
            <span>Call Now</span>
          </a>
          <Link href={BOOKING_HREF} className={buttonClass("primary", "md")}>
            Book Appointment
          </Link>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <a
            href={telHref}
            className="grid size-12 place-items-center rounded-[var(--radius-control)] bg-sky text-teal"
            aria-label={`Call ${phoneDisplay}`}
          >
            <Phone className="size-5" aria-hidden="true" />
          </a>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger className="grid size-12 place-items-center rounded-[var(--radius-control)] bg-navy text-white" aria-label="Open menu">
              <Menu className="size-6" aria-hidden="true" />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-navy/40 data-[state=open]:animate-[fade-in_150ms_ease-out]" />
              <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white shadow-2xl focus:outline-none data-[state=open]:animate-[slide-in_220ms_cubic-bezier(.2,.8,.2,1)] motion-reduce:animate-none">
                <div className="flex h-[4.5rem] items-center justify-between border-b border-line px-5">
                  <Dialog.Title className="font-display text-lg font-extrabold">Menu</Dialog.Title>
                  <Dialog.Close className="grid size-12 place-items-center rounded-[var(--radius-control)] bg-sky text-navy" aria-label="Close menu">
                    <X className="size-6" aria-hidden="true" />
                  </Dialog.Close>
                </div>
                <Dialog.Description className="sr-only">Site pages and contact options</Dialog.Description>
                <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-4">
                  <ul>
                    {navLinks.map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          aria-current={isActive(l.href) ? "page" : undefined}
                          className={cn(
                            "flex min-h-14 items-center rounded-xl px-4 font-display text-xl font-bold",
                            isActive(l.href) ? "bg-sky text-teal" : "text-navy hover:bg-sky/60",
                          )}
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="space-y-3 border-t border-line p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                  <a href={telHref} className={buttonClass("primary", "lg", "w-full")}>
                    <Phone className="size-5" aria-hidden="true" />
                    Call {phoneDisplay}
                  </a>
                  <Link href={BOOKING_HREF} className={buttonClass("secondary", "lg", "w-full")}>
                    <CalendarCheck className="size-5" aria-hidden="true" />
                    Book Appointment
                  </Link>
                  {hoursNotice && <p className="pt-1 text-center text-sm text-slate">{hoursNotice}</p>}
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
