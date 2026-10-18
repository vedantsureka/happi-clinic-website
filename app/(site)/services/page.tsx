import { CalendarCheck, Phone, Check } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { CtaBanner } from "@/components/cta-banner";
import { ServiceIcon } from "@/components/icons";
import { AvailabilityBadge } from "@/components/availability";
import { ButtonLink } from "@/components/ui/button";
import { Faq } from "@/components/ui/accordion";
import { JsonLd } from "@/components/json-ld";
import { bookingHref } from "@/components/sections";
import { getClinic, getFaqs, getServices } from "@/lib/content";
import { telHref } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Our Services: General Physician, Check-ups & Diagnostics",
  description:
    "General physician consultations, routine health check-ups, diagnostic service enquiries and pharmacy enquiries at HAPPI CLINIC AND DIAGNOSTICS, Alwal, Secunderabad.",
  path: "/services",
});

export default async function ServicesPage() {
  const [clinic, services, faqs] = await Promise.all([getClinic(), getServices(), getFaqs()]);

  return (
    <>
      <PageHero
        title="Our Services"
        intro="Start with a consultation, or ask our team about check-ups, diagnostic tests and pharmacy availability. We will always confirm what is available before you visit."
      >
        <nav aria-label="Services on this page">
          <ul className="flex flex-wrap gap-2 lg:max-w-sm lg:justify-end">
            {services.map((s) => (
              <li key={s.slug}>
                <a href={`#${s.slug}`} className="inline-flex min-h-11 items-center rounded-full bg-white px-4 text-[0.9375rem] font-semibold text-teal-ink ring-1 ring-line hover:ring-teal">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      {services.map((s, i) => (
        <section key={s.slug} id={s.slug} aria-labelledby={`${s.slug}-heading`} className={cn("section", i % 2 === 1 && "bg-sky")}>
          <div className="container-site grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
            <div>
              <div className="flex flex-wrap items-center gap-4">
                <span className={cn("grid size-16 place-items-center rounded-2xl text-teal", i % 2 === 1 ? "bg-white" : "bg-sky")}>
                  <ServiceIcon name={s.icon} className="size-8" />
                </span>
                <AvailabilityBadge value={s.availability} />
              </div>
              <h2 id={`${s.slug}-heading`} className="h-section mt-6">
                {s.pageTitle}
              </h2>
              <p className="lede prose-measure mt-4">{s.summary}</p>
              {s.details && <p className="prose-measure mt-5 text-navy/90">{s.details}</p>}
              {s.availabilityNote && (
                <p className="prose-measure mt-6 rounded-xl border-l-4 border-mint bg-white p-4 text-[0.9875rem] font-medium text-navy shadow-[var(--shadow-soft)]">
                  {s.availabilityNote}
                </p>
              )}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={bookingHref(s.slug)} size="lg">
                  <CalendarCheck className="size-5" aria-hidden="true" />
                  Book Enquiry
                </ButtonLink>
                <ButtonLink href={telHref(clinic)} variant="secondary" size="lg">
                  <Phone className="size-5" aria-hidden="true" />
                  Call {clinic.phoneDisplay}
                </ButtonLink>
              </div>
            </div>
            {s.expectations.length > 0 && (
              <div className="lg:pt-24">
                <h3 className="font-display text-xl font-extrabold">What to expect</h3>
                <ol className="mt-5 space-y-4">
                  {s.expectations.map((e, j) => (
                    <li key={j} className="flex gap-3.5">
                      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-mint text-white">
                        <Check className="size-4" strokeWidth={3} aria-hidden="true" />
                      </span>
                      <span className="text-navy/90">{e}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </section>
      ))}

      <section className="section" aria-labelledby="services-faq-heading">
        <div className="container-site grid gap-10 lg:grid-cols-[0.9fr_1.6fr] lg:gap-20">
          <h2 id="services-faq-heading" className="h-section">
            Questions about our services
          </h2>
          <Faq items={faqs.services} idPrefix="services" />
        </div>
      </section>

      <CtaBanner phoneDisplay={clinic.phoneDisplay} telHref={telHref(clinic)} />
      <JsonLd data={faqSchema(faqs.services)} />
      <JsonLd data={breadcrumbSchema("Our Services", "/services")} />
    </>
  );
}
