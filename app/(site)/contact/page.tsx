import { TriangleAlert } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { EnquiryForm } from "@/components/enquiry-form";
import { ContactDetails } from "@/components/sections";
import { LandmarkRoute } from "@/components/route";
import { MapEmbed } from "@/components/map-embed";
import { Faq } from "@/components/ui/accordion";
import { JsonLd } from "@/components/json-ld";
import { getClinic, getFaqs, getHours, getServices } from "@/lib/content";
import { mapEmbedUrl, telHref } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = pageMetadata({
  title: "Contact & Appointments",
  description:
    "Call +91 99514 71400 or request an appointment at HAPPI CLINIC AND DIAGNOSTICS, Bhatia Bakery Lane, behind Alwal Police Station, Golnaka, Secunderabad 500010.",
  path: "/contact",
});

export default async function ContactPage() {
  const [clinic, hours, services, faqs] = await Promise.all([getClinic(), getHours(), getServices(), getFaqs()]);
  return (
    <>
      <PageHero
        title="Contact & Appointments"
        intro={`The quickest way to reach us is to call ${clinic.phoneDisplay}. You can also send an appointment request and our team will call you back to confirm.`}
      />

      <section className="section" aria-labelledby="appointment-heading">
        <div className="container-site grid gap-14 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <div id="appointment" className="scroll-mt-28">
            <h2 id="appointment-heading" className="h-section">
              Request an appointment
            </h2>
            <p className="lede prose-measure mt-4 mb-10">
              Fill in your details and we will call you to confirm a time. Your appointment is not confirmed until you hear from us.
            </p>
            <EnquiryForm
              services={services.map((s) => ({ slug: s.slug, title: s.title }))}
              phoneDisplay={clinic.phoneDisplay}
              telHref={telHref(clinic)}
              headingId="appointment-heading"
            />
          </div>
          <aside aria-labelledby="details-heading" className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[var(--radius-panel)] bg-sky p-7 md:p-9">
              <h2 id="details-heading" className="mb-6 font-display text-2xl font-extrabold">
                {clinic.name}
              </h2>
              <ContactDetails clinic={clinic} hours={hours} />
            </div>
            <div className="mt-5 flex gap-3 rounded-[var(--radius-panel)] border border-[#E7B4AE] bg-[#FDF1EF] p-5 text-[#8A2C20]">
              <TriangleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
              <p className="text-[0.9875rem]">
                <strong>Medical emergency?</strong> Call 108 or go to the nearest hospital emergency department. Do not use this form.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="section bg-sky" aria-labelledby="directions-heading">
        <div className="container-site grid gap-10 lg:grid-cols-[1fr_1.8fr] lg:gap-14">
          <div>
            <h2 id="directions-heading" className="h-section">
              How to find us
            </h2>
            <p className="lede mt-4 mb-8">Landmark by landmark, from Golnaka.</p>
            <LandmarkRoute steps={clinic.directionSteps} />
          </div>
          <MapEmbed src={mapEmbedUrl(clinic)} title={`Map showing ${clinic.name}`} className="min-h-[24rem]" />
        </div>
      </section>

      <section className="section" aria-labelledby="contact-faq-heading">
        <div className="container-site grid gap-10 lg:grid-cols-[0.9fr_1.6fr] lg:gap-20">
          <h2 id="contact-faq-heading" className="h-section">
            Common questions
          </h2>
          <Faq items={faqs.general} idPrefix="contact" />
        </div>
      </section>
      <JsonLd data={breadcrumbSchema("Contact & Appointments", "/contact")} />
    </>
  );
}
