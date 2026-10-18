import { Phone, ClipboardCheck } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { EnquiryForm } from "@/components/enquiry-form";
import { ContactDetails } from "@/components/sections";
import { ButtonLink } from "@/components/ui/button";
import { Faq } from "@/components/ui/accordion";
import { JsonLd } from "@/components/json-ld";
import { getClinic, getDiagnostics, getFaqs, getHours, getServices } from "@/lib/content";
import { telHref } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";

export const metadata = pageMetadata({
  title: "Diagnostic Services in Alwal, Secunderabad",
  description:
    "Enquire about diagnostic test availability at HAPPI CLINIC AND DIAGNOSTICS, Golnaka, Alwal. Our team confirms availability and preparation before you visit.",
  path: "/diagnostics",
});

export default async function DiagnosticsPage() {
  const [clinic, hours, services, diagnostics, faqs] = await Promise.all([getClinic(), getHours(), getServices(), getDiagnostics(), getFaqs()]);
  const confirmedTests = diagnostics.publishCatalogue ? diagnostics.tests.filter((t) => t.confirmed) : [];
  const grouped = confirmedTests.reduce<Record<string, typeof confirmedTests>>((acc, t) => {
    const key = t.category || "Other tests";
    (acc[key] ||= []).push(t);
    return acc;
  }, {});
  const diagnosticService = services.find((s) => s.slug === "diagnostics");

  const steps = [
    { title: "Tell us which test you need", text: `Call ${clinic.phoneDisplay} or send the form below with the name of the test. Have your prescription ready if you have one.` },
    { title: "We confirm availability and preparation", text: "Our team will let you know whether the test is available and exactly how to prepare." },
    { title: "Visit at the agreed time", text: "Come to the clinic at the time our team confirms with you, following any preparation instructions." },
  ];

  return (
    <>
      <PageHero
        title="Diagnostic Services for Your Healthcare Needs"
        intro="Ask us whether the test you need is available. Our team confirms availability and any preparation before you visit, so you do not make a wasted trip."
      >
        <ButtonLink href={telHref(clinic)} size="lg">
          <Phone className="size-5" aria-hidden="true" />
          Call {clinic.phoneDisplay}
        </ButtonLink>
      </PageHero>

      <section className="section" aria-labelledby="overview-heading">
        <div className="container-site grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 id="overview-heading" className="h-section">
              Overview
            </h2>
            <div className="prose-measure mt-6 space-y-4 text-navy/90">
              <p>
                Diagnostic tests help your doctor understand what is happening and decide on the right care. If a doctor
                has advised a test, or you would like to know whether a test can be done here, our team can help.
              </p>
              <p>
                Because availability can change, we confirm each test individually when you enquire. We do not publish a
                test list until each item has been confirmed by the clinic.
              </p>
            </div>
          </div>
          <div>
            <h2 className="font-display text-[1.75rem] font-extrabold md:text-[2rem]">How to enquire</h2>
            <ol className="mt-8 space-y-8">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-teal font-display text-lg font-extrabold text-white">{i + 1}</span>
                  <div>
                    <h3 className="font-display text-lg font-extrabold">{s.title}</h3>
                    <p className="mt-1.5 text-slate">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-sky py-12 md:py-14" aria-labelledby="prep-heading">
        <div className="container-site flex flex-col gap-5 md:flex-row md:items-start">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white text-teal">
            <ClipboardCheck className="size-7" aria-hidden="true" />
          </span>
          <div className="prose-measure">
            <h2 id="prep-heading" className="font-display text-2xl font-extrabold">Test preparation</h2>
            <p className="mt-2 text-navy/90">
              Some tests need preparation, and instructions differ from test to test. Please follow the instructions our
              staff give you when they confirm your test, and ask if anything is unclear.
            </p>
          </div>
        </div>
      </section>

      {confirmedTests.length > 0 && (
        <section className="section" aria-labelledby="catalogue-heading">
          <div className="container-site">
            <h2 id="catalogue-heading" className="h-section">
              Tests available at the clinic
            </h2>
            <p className="lede prose-measure mt-4">Please call to book. Our team will confirm timings and preparation.</p>
            <div className="mt-10 grid gap-10 md:grid-cols-2">
              {Object.entries(grouped).map(([category, tests]) => (
                <div key={category}>
                  <h3 className="font-display text-xl font-extrabold">{category}</h3>
                  <ul className="mt-4 divide-y divide-line border-y border-line">
                    {tests.map((t) => (
                      <li key={t.name} className="py-4">
                        <p className="font-semibold text-navy">{t.name}</p>
                        {t.preparation && <p className="mt-1 text-[0.9375rem] text-slate">Preparation: {t.preparation}</p>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="appointment" className="section" aria-labelledby="diag-form-heading">
        <div className="container-site grid gap-14 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <div>
            <h2 id="diag-form-heading" className="h-section">
              Send a diagnostic enquiry
            </h2>
            <p className="lede prose-measure mt-4 mb-10">Tell us the test you need in the message box. We will call you to confirm.</p>
            <EnquiryForm
              services={services.map((s) => ({ slug: s.slug, title: s.title }))}
              defaultService={diagnosticService?.title}
              phoneDisplay={clinic.phoneDisplay}
              telHref={telHref(clinic)}
              headingId="diag-form-heading"
            />
          </div>
          <aside aria-label="Contact details" className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[var(--radius-panel)] bg-sky p-7 md:p-9">
              <ContactDetails clinic={clinic} hours={hours} />
            </div>
          </aside>
        </div>
      </section>

      <section className="section bg-sky" aria-labelledby="diag-faq-heading">
        <div className="container-site grid gap-10 lg:grid-cols-[0.9fr_1.6fr] lg:gap-20">
          <h2 id="diag-faq-heading" className="h-section">
            Diagnostic FAQs
          </h2>
          <Faq items={faqs.diagnostics} idPrefix="diagnostics" />
        </div>
      </section>

      <JsonLd data={faqSchema(faqs.diagnostics)} />
      <JsonLd data={breadcrumbSchema("Diagnostics", "/diagnostics")} />
    </>
  );
}
