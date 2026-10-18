import Link from "next/link";
import Image from "next/image";
import { CalendarCheck, Navigation, Phone, MapPin, ExternalLink, Check, MessageCircle } from "lucide-react";
import { ServiceIcon } from "./icons";
import { AvailabilityBadge } from "./availability";
import { ReviewCard } from "./review-card";
import { Stars } from "./rating";
import { LandmarkRoute } from "./route";
import { MapEmbed } from "./map-embed";
import { HoursBlock } from "./hours";
import { ButtonLink } from "./ui/button";
import { ClinicIllustration } from "./clinic-illustration";
import type { Clinic, Hours, Review, Service } from "@/lib/content";
import { directionsUrl, fullAddress, mapEmbedUrl, reviewsUrl, telHref, whatsappHref, formatRating } from "@/lib/site";

export function bookingHref(slug?: string) {
  return slug ? `/contact?service=${encodeURIComponent(slug)}#appointment` : "/contact#appointment";
}

/* ------------------------------------------------------------------ */

export function TrustStrip({ clinic }: { clinic: Clinic }) {
  const rating = clinic.rating ?? 0;
  return (
    <section aria-label="At a glance" className="border-y border-line bg-sky">
      <ul className="container-site grid grid-cols-1 gap-x-8 gap-y-4 py-6 text-[0.9875rem] text-navy sm:grid-cols-2 lg:flex lg:justify-between lg:gap-0 [&>li]:flex [&>li]:items-center [&>li]:gap-2.5 lg:[&>li+li]:border-l lg:[&>li+li]:border-sky-deep lg:[&>li+li]:pl-6">
        <li>
          <Stars value={rating} className="text-lg" />
          <span>
            <strong className="font-display font-extrabold">{formatRating(rating)}/5</strong> Google rating
          </span>
        </li>
        <li>
          <span>
            <strong className="font-display font-extrabold">{clinic.reviewCount ?? 0}</strong> Google reviews
            {clinic.ratingAsOf ? <span className="text-slate"> (as of {clinic.ratingAsOf})</span> : null}
          </span>
        </li>
        <li>
          <ServiceIcon name="stethoscope" className="size-5 shrink-0 text-teal" />
          <span>General medical consultations</span>
        </li>
        <li>
          <MapPin className="size-5 shrink-0 text-teal" aria-hidden="true" />
          <span>Convenient Alwal location</span>
        </li>
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function WelcomeSection({ clinic }: { clinic: Clinic }) {
  return (
    <section className="section" aria-labelledby="welcome-heading">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <h2 id="welcome-heading" className="h-section">
            Healthcare with a Personal Touch
          </h2>
          <div className="prose-measure mt-6 space-y-4 text-navy/90">
            <p>
              At HAPPI CLINIC AND DIAGNOSTICS, every visit starts with listening. We want you to feel comfortable
              describing your concerns, to understand what the doctor advises, and to leave knowing what happens next.
            </p>
            <p>
              We are a neighbourhood clinic in Golnaka, Alwal, offering general medical consultations and help with
              diagnostic enquiries, so families nearby can get care without travelling far.
            </p>
          </div>
          <ButtonLink href="/about" variant="secondary" size="lg" className="mt-8">
            Learn More About Us
          </ButtonLink>
        </div>
        <div>
          {clinic.clinicPhoto ? (
            <Image
              src={clinic.clinicPhoto}
              alt={clinic.clinicPhotoAlt || "HAPPI CLINIC AND DIAGNOSTICS, Alwal"}
              width={960}
              height={800}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="h-auto w-full rounded-[var(--radius-slip)] object-cover"
            />
          ) : (
            <ClinicIllustration className="h-auto w-full" />
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function ServicesGrid({ services, className }: { services: readonly Service[]; className?: string }) {
  return (
    <section className={`section bg-white ${className ?? ""}`} aria-labelledby="services-heading">
      <div className="container-site">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 id="services-heading" className="h-section">
                Our Services
              </h2>
              <p className="lede prose-measure mt-4">
                Start with a consultation, or ask us about check-ups, diagnostic tests and pharmacy availability.
              </p>
            </div>
            <Link href="/services" className="font-display font-bold text-teal underline-offset-4 hover:underline">
              See all services
            </Link>
          </div>
        <ul className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-panel)] border border-line bg-line md:grid-cols-2">
          {services.map((s) => (
            <li key={s.slug} className="flex flex-col bg-white p-7 md:p-9">
              <div className="flex items-start justify-between gap-4">
                <span className="grid size-14 place-items-center rounded-2xl bg-sky text-teal">
                  <ServiceIcon name={s.icon} className="size-7" />
                </span>
                <AvailabilityBadge value={s.availability} />
              </div>
              <h3 className="mt-6 font-display text-[1.375rem] font-extrabold">{s.title}</h3>
              <p className="mt-2 flex-1 text-slate">{s.summary}</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                <ButtonLink href={bookingHref(s.slug)} variant="quiet" size="md">
                  <CalendarCheck className="size-[1.125rem]" aria-hidden="true" />
                  Book Enquiry
                </ButtonLink>
                <Link href={`/services#${s.slug}`} className="font-display font-bold text-teal underline-offset-4 hover:underline">
                  Learn more<span className="sr-only"> about {s.title}</span>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function WhyChoose({ clinic }: { clinic: Clinic }) {
  const points = [
    { title: "Patient-centred care", text: "We take time to understand your concerns and explain your options in plain language." },
    { title: "A friendly, supportive team", text: "Patients often mention the courtesy of our doctor and the care shown by our staff." },
    { title: "Close to home", text: "A neighbourhood clinic in Golnaka, easy to reach from Alwal and nearby areas." },
    { title: "Consultations and diagnostic enquiries in one place", text: "See the doctor and ask about tests without going elsewhere first." },
    { title: `Rated ${formatRating(clinic.rating)} on Google`, text: `From ${clinic.reviewCount ?? 0} reviews on our Google listing.` },
    { title: "Easy to find", text: "Behind Alwal Police Station, on Bhatia Bakery Lane." },
  ];
  return (
    <section className="section bg-sky" aria-labelledby="why-heading">
      <div className="container-site grid gap-12 lg:grid-cols-[0.9fr_1.6fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="why-heading" className="h-section">
            Why choose HAPPI Clinic?
          </h2>
          <p className="lede mt-4">Care that is personal, practical and close to home.</p>
        </div>
        <ul className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
          {points.map((p) => (
            <li key={p.title} className="flex gap-4">
              <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-mint text-white">
                <Check className="size-5" strokeWidth={3} aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-lg font-extrabold">{p.title}</h3>
                <p className="mt-1.5 text-slate">{p.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function RatingPanel({ clinic }: { clinic: Clinic }) {
  const rating = clinic.rating ?? 0;
  return (
    <div className="flex h-full flex-col rounded-[var(--radius-panel)] bg-sky p-7 md:p-9">
      <p className="font-display text-[4.5rem] font-extrabold leading-none tracking-[-0.04em] text-navy">{formatRating(rating)}</p>
      <Stars value={rating} className="mt-3 text-2xl" />
      <p className="mt-3 font-semibold text-navy">
        From {clinic.reviewCount ?? 0} reviews on Google
      </p>
      <p className="mt-2 text-[0.9375rem] text-slate">
        {clinic.ratingAsOf
          ? `Rating and review count as of ${clinic.ratingAsOf}. Read the latest reviews on Google.`
          : "Rating and review count from our Google listing. Read the latest reviews on Google."}
      </p>
      <div className="mt-auto pt-7">
        <ButtonLink href={reviewsUrl(clinic)} external variant="secondary" size="md" className="w-full">
          View Reviews on Google
          <ExternalLink className="size-4" aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </ButtonLink>
      </div>
    </div>
  );
}

export function ReviewsSection({ clinic, reviews, heading = "Trusted by Our Patients" }: { clinic: Clinic; reviews: readonly Review[]; heading?: string }) {
  return (
    <section className="section" aria-labelledby="reviews-heading">
      <div className="container-site">
        <h2 id="reviews-heading" className="h-section">
          {heading}
        </h2>
        <p className="lede prose-measure mt-4">In their own words, from reviews on our Google listing.</p>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-[1fr_1.35fr_1fr]">
          <RatingPanel clinic={clinic} />
          {reviews.slice(0, 1).map((r, i) => (
            <ReviewCard key={`f-${i}`} review={r} featured />
          ))}
          <div className="grid gap-5 md:col-span-2 md:grid-cols-2 lg:col-span-1 lg:grid-cols-1">
            {reviews.slice(1, 3).map((r, i) => (
              <ReviewCard key={`r-${i}`} review={r} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function ContactDetails({ clinic, hours }: { clinic: Clinic; hours: Hours }) {
  const wa = whatsappHref(clinic);
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-base font-bold text-slate">Phone</h3>
        <a href={telHref(clinic)} className="mt-1 block font-display text-[1.75rem] font-extrabold tabular-nums text-navy hover:text-teal">
          {clinic.phoneDisplay}
        </a>
      </div>
      <div>
        <h3 className="font-display text-base font-bold text-slate">Address</h3>
        <address className="mt-1 not-italic leading-relaxed text-navy">{fullAddress(clinic)}</address>
      </div>
      {clinic.email && (
        <div>
          <h3 className="font-display text-base font-bold text-slate">Email</h3>
          <a href={`mailto:${clinic.email}`} className="mt-1 block text-navy underline underline-offset-4">
            {clinic.email}
          </a>
        </div>
      )}
      <div>
        <h3 className="mb-2 font-display text-base font-bold text-slate">Timings</h3>
        <HoursBlock hours={hours} />
      </div>
      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
        <ButtonLink href={telHref(clinic)} size="lg">
          <Phone className="size-5" aria-hidden="true" />
          Call Now
        </ButtonLink>
        <ButtonLink href={directionsUrl(clinic)} external variant="secondary" size="lg">
          <Navigation className="size-5" aria-hidden="true" />
          Get Directions
        </ButtonLink>
        {wa && (
          <ButtonLink href={wa} external variant="secondary" size="lg">
            <MessageCircle className="size-5" aria-hidden="true" />
            WhatsApp
          </ButtonLink>
        )}
      </div>
    </div>
  );
}

export function LocationSection({ clinic, hours, title = "Find us in Golnaka, Alwal" }: { clinic: Clinic; hours: Hours; title?: string }) {
  return (
    <section className="section" aria-labelledby="location-heading">
      <div className="container-site">
        <h2 id="location-heading" className="h-section">
          {title}
        </h2>
        <p className="lede prose-measure mt-4">Follow the landmarks. We are just behind the police station.</p>
        <div className="mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.4fr_1fr] lg:gap-12">
          <div>
            <h3 className="mb-6 font-display text-lg font-extrabold">How to find us</h3>
            <LandmarkRoute steps={clinic.directionSteps} />
          </div>
          <MapEmbed src={mapEmbedUrl(clinic)} title={`Map showing ${clinic.name}`} className="min-h-[22rem] lg:min-h-full" />
          <ContactDetails clinic={clinic} hours={hours} />
        </div>
      </div>
    </section>
  );
}
