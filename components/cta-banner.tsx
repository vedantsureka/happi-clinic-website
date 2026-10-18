import { Phone, CalendarCheck } from "lucide-react";
import { ButtonLink } from "./ui/button";
import { BOOKING_HREF } from "@/lib/site";

export function CtaBanner({ phoneDisplay, telHref }: { phoneDisplay: string; telHref: string }) {
  return (
    <section aria-labelledby="cta-heading" className="container-site py-8 md:py-12">
      <div className="on-teal relative overflow-hidden rounded-[var(--radius-slip)] bg-teal px-6 py-12 text-white md:px-14 md:py-16">
        <svg aria-hidden="true" viewBox="0 0 400 400" className="pointer-events-none absolute -right-40 -top-44 size-[26rem] text-white/[0.07]">
          <rect x="160" y="40" width="80" height="320" rx="18" fill="currentColor" />
          <rect x="40" y="160" width="320" height="80" rx="18" fill="currentColor" />
        </svg>
        <div className="relative grid items-end gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 id="cta-heading" className="font-display text-[2rem] font-extrabold leading-tight text-white md:text-5xl">
              Need medical assistance? We&rsquo;re here to help.
            </h2>
            <p className="mt-4 max-w-xl text-lg text-white/85">
              Call the clinic to speak to our team, or send an appointment request and we will call you back to confirm.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
            <ButtonLink href={telHref} variant="light" size="lg">
              <Phone className="size-5" aria-hidden="true" />
              Call {phoneDisplay}
            </ButtonLink>
            <ButtonLink href={BOOKING_HREF} variant="outline-light" size="lg">
              <CalendarCheck className="size-5" aria-hidden="true" />
              Request Appointment
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
