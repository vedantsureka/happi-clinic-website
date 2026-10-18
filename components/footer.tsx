import Link from "next/link";
import { Phone, MapPin, Navigation } from "lucide-react";
import { Logo } from "./logo";
import { HoursBlock } from "./hours";
import type { Clinic, Hours } from "@/lib/content";
import { navLinks, directionsUrl, fullAddress, telHref, BOOKING_HREF } from "@/lib/site";

export function Footer({ clinic, hours }: { clinic: Clinic; hours: Hours }) {
  const year = new Date().getFullYear();
  return (
    <footer className="on-teal bg-teal-ink text-white">
      <div className="container-site grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1.2fr_1fr] lg:py-20">
        <div className="max-w-xs">
          <Logo light />
          <p className="mt-5 text-[0.9875rem] leading-relaxed text-white/75">
            General medical consultations and diagnostic enquiries in Golnaka, Alwal, Secunderabad.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-display text-base font-bold text-white">Pages</h2>
          <ul className="mt-4 space-y-2.5 text-[0.9875rem]">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white/80 hover:text-white hover:underline underline-offset-4">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={BOOKING_HREF} className="text-white/80 hover:text-white hover:underline underline-offset-4">
                Book Appointment
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-base font-bold text-white">Visit or call</h2>
          <ul className="mt-4 space-y-4 text-[0.9875rem]">
            <li>
              <a href={telHref(clinic)} className="flex items-center gap-3 font-display text-xl font-bold tabular-nums hover:underline underline-offset-4">
                <Phone className="size-5 text-mint" aria-hidden="true" />
                {clinic.phoneDisplay}
              </a>
            </li>
            <li className="flex gap-3 text-white/80">
              <MapPin className="mt-1 size-5 shrink-0 text-mint" aria-hidden="true" />
              <address className="not-italic leading-relaxed">{fullAddress(clinic)}</address>
            </li>
            <li>
              <a
                href={directionsUrl(clinic)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 font-semibold text-white hover:underline underline-offset-4"
              >
                <Navigation className="size-5 text-mint" aria-hidden="true" />
                Open in Google Maps
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-base font-bold text-white">Opening hours</h2>
          <div className="mt-4">
            <HoursBlock hours={hours} tone="dark" />
          </div>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="container-site flex flex-col gap-3 py-6 pb-28 text-sm text-white/70 md:flex-row md:items-center md:justify-between xl:pb-6">
          <p>
            &copy; {year} {clinic.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/privacy-policy" className="hover:text-white hover:underline underline-offset-4">
              Privacy policy
            </Link>
            <span>In an emergency, call 108.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
