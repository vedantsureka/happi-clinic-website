import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { TrustStrip, WelcomeSection, ServicesGrid, WhyChoose, ReviewsSection, LocationSection } from "@/components/sections";
import { CtaBanner } from "@/components/cta-banner";
import { Faq } from "@/components/ui/accordion";
import { JsonLd } from "@/components/json-ld";
import { hoursAreComplete } from "@/components/hours";
import { getClinic, getFaqs, getHours, getReviews, getServices } from "@/lib/content";
import { directionsUrl, telHref } from "@/lib/site";
import { faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: { absolute: "HAPPI CLINIC AND DIAGNOSTICS | General Physician & Diagnostic Centre in Alwal, Secunderabad" },
  description:
    "Compassionate medical care and diagnostic services in Alwal, Secunderabad. General physician consultations near Alwal Police Station, Golnaka. Call +91 99514 71400 to book.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "HAPPI CLINIC AND DIAGNOSTICS, Alwal, Secunderabad",
    description: "General physician consultations and diagnostic enquiries in Golnaka, Alwal. Call +91 99514 71400.",
    url: "/",
    type: "website",
    siteName: "HAPPI CLINIC AND DIAGNOSTICS",
    locale: "en_IN",
  },
};

export default async function HomePage() {
  const [clinic, hours, services, reviews, faqs] = await Promise.all([getClinic(), getHours(), getServices(), getReviews(), getFaqs()]);
  const hoursText = hoursAreComplete(hours) ? "See opening hours on our Contact page." : "Timings can vary. Please call to confirm before you visit.";

  return (
    <>
      <Hero
        phoneDisplay={clinic.phoneDisplay}
        telHref={telHref(clinic)}
        directionsHref={directionsUrl(clinic)}
        rating={clinic.rating ?? 0}
        reviewCount={clinic.reviewCount ?? 0}
        hoursText={hoursText}
        areaLine={`Behind Police Station, ${clinic.locality}, ${clinic.city} ${clinic.postalCode}`}
      />
      <TrustStrip clinic={clinic} />
      <WelcomeSection clinic={clinic} />
      <ServicesGrid services={services} className="!pt-4 md:!pt-6" />
      <WhyChoose clinic={clinic} />
      <ReviewsSection clinic={clinic} reviews={reviews} />
      <CtaBanner phoneDisplay={clinic.phoneDisplay} telHref={telHref(clinic)} />
      <LocationSection clinic={clinic} hours={hours} />

      <section className="section bg-sky" aria-labelledby="faq-heading">
        <div className="container-site grid gap-10 lg:grid-cols-[0.9fr_1.6fr] lg:gap-20">
          <div>
            <h2 id="faq-heading" className="h-section">
              Common questions
            </h2>
            <p className="lede mt-4">Can&rsquo;t find your answer? Call {clinic.phoneDisplay}.</p>
          </div>
          <Faq items={faqs.general} idPrefix="home" />
        </div>
      </section>
      <JsonLd data={faqSchema(faqs.general)} />
    </>
  );
}
