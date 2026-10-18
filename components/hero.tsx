"use client";

import { m as motion, type Variants } from "framer-motion";
import { CalendarCheck, Navigation, Phone, MapPin } from "lucide-react";
import { ButtonLink, buttonClass } from "./ui/button";
import { Stars } from "./rating";
import { BOOKING_HREF } from "@/lib/site";

type Props = {
  phoneDisplay: string;
  telHref: string;
  directionsHref: string;
  rating: number;
  reviewCount: number;
  hoursText: string;
  areaLine: string;
};

const ease = [0.2, 0.8, 0.2, 1] as const;

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } };
const rise: Variants = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } };
const slip: Variants = {
  hidden: { opacity: 0, x: 36, rotate: 3 },
  show: { opacity: 1, x: 0, rotate: -1.5, transition: { duration: 0.8, ease, delay: 0.35 } },
};

export function Hero({ phoneDisplay, telHref, directionsHref, rating, reviewCount, hoursText, areaLine }: Props) {
  return (
    <section className="relative overflow-hidden">
      <div className="container-site relative grid gap-12 pb-14 pt-10 md:pt-16 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-16 lg:pb-24 lg:pt-20">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.h1
            variants={rise}
            className="font-display text-[2.75rem] font-extrabold leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[4.5rem]"
          >
            Your Health, <br className="hidden sm:block" />
            Our Priority.
          </motion.h1>
          <motion.p variants={rise} className="mt-6 max-w-xl font-display text-xl font-semibold leading-snug text-teal md:text-2xl">
            Compassionate Medical Care &amp; Diagnostic Services in Alwal, Secunderabad.
          </motion.p>
          <motion.p variants={rise} className="lede mt-5 max-w-xl">
            Welcome to HAPPI CLINIC AND DIAGNOSTICS, your neighbourhood destination for general medical consultations and
            diagnostic services. We are committed to making healthcare accessible, comfortable, and convenient.
          </motion.p>
          <motion.div variants={rise} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={BOOKING_HREF} size="lg">
              <CalendarCheck className="size-5" aria-hidden="true" />
              Book an Appointment
            </ButtonLink>
            <ButtonLink href={directionsHref} external variant="secondary" size="lg">
              <Navigation className="size-5" aria-hidden="true" />
              Get Directions
            </ButtonLink>
          </motion.div>
        </motion.div>

        <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:justify-self-end">
          <div aria-hidden="true" className="absolute -inset-4 rotate-[3deg] rounded-[34px] bg-sky sm:-inset-6" />
          <motion.div variants={slip} initial="hidden" animate="show" className="on-teal relative rounded-[var(--radius-slip)] bg-teal text-white shadow-[var(--shadow-slip)]">
            <div className="px-7 pb-7 pt-8 md:px-9">
              <p className="font-display text-base font-semibold text-white/80">Speak to the clinic</p>
              <a href={telHref} className="mt-2 block font-display text-[2.125rem] font-extrabold leading-none tracking-[-0.02em] tabular-nums hover:underline underline-offset-[6px] sm:text-[2.5rem]">
                {phoneDisplay}
              </a>
              <a href={telHref} className={buttonClass("light", "lg", "mt-6 w-full")}>
                <Phone className="size-5" aria-hidden="true" />
                Call Now
              </a>
            </div>

            <div className="relative">
              <span aria-hidden="true" className="absolute -left-3.5 top-1/2 size-7 -translate-y-1/2 rounded-full bg-sky" />
              <span aria-hidden="true" className="absolute -right-3.5 top-1/2 size-7 -translate-y-1/2 rounded-full bg-sky" />
              <div className="perforation mx-6" />
            </div>

            <dl className="space-y-4 px-7 pb-8 pt-6 text-[0.9875rem] md:px-9">
              <div className="flex items-center gap-3">
                <dt className="sr-only">Google rating</dt>
                <dd className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <Stars value={rating} tone="white" className="text-lg" />
                  <span className="font-semibold">
                    {rating.toFixed(1)} on Google from {reviewCount} reviews
                  </span>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="sr-only">Timings</dt>
                <dd className="text-white/85">{hoursText}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="sr-only">Area</dt>
                <dd className="flex gap-2 text-white/85">
                  <MapPin className="mt-0.5 size-[1.125rem] shrink-0 text-mint" aria-hidden="true" />
                  {areaLine}
                </dd>
              </div>
            </dl>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
