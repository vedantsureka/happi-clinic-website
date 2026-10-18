import { PageHero } from "@/components/page-hero";
import { CtaBanner } from "@/components/cta-banner";
import { LocationSection } from "@/components/sections";
import { MeetOurDoctors } from "@/components/doctors";
import { ReviewCard } from "@/components/review-card";
import { ClinicIllustration } from "@/components/clinic-illustration";
import { JsonLd } from "@/components/json-ld";
import Image from "next/image";
import { getClinic, getDoctors, getHours, getReviews } from "@/lib/content";
import { telHref } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = pageMetadata({
  title: "About Us",
  description:
    "Learn about HAPPI CLINIC AND DIAGNOSTICS, a neighbourhood clinic in Golnaka, Alwal, Secunderabad offering general medical consultations and diagnostic enquiries.",
  path: "/about",
});

export default async function AboutPage() {
  const [clinic, hours, doctors, reviews] = await Promise.all([getClinic(), getHours(), getDoctors(), getReviews()]);

  const blocks = [
    {
      id: "approach",
      title: "Our approach to patient care",
      body: [
        "Good care begins with a conversation. Our doctor takes time to hear what is troubling you, asks the questions that matter, and explains findings and advice in plain language.",
        "If you need tests or further care, we will tell you why and help you understand the next step. You are always welcome to ask questions.",
      ],
    },
    {
      id: "accessible",
      title: "Our commitment to accessible healthcare",
      body: [
        "Healthcare should be easy to reach. Being a short distance from home matters, especially for older family members and anyone who is unwell.",
        "We keep things simple: one phone number to call, clear directions using local landmarks, and a team who will confirm your visit before you travel.",
      ],
    },
  ];

  return (
    <>
      <PageHero
        title="About HAPPI CLINIC AND DIAGNOSTICS"
        intro="A neighbourhood clinic in Golnaka, Alwal, offering general medical consultations and help with diagnostic enquiries."
      />

      <section className="section" aria-labelledby="who-heading">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 id="who-heading" className="h-section">
              Who we are
            </h2>
            <div className="prose-measure mt-6 space-y-4 text-navy/90">
              <p>
                HAPPI CLINIC AND DIAGNOSTICS is a general practitioner clinic and diagnostic centre serving Alwal,
                Secunderabad and the surrounding neighbourhoods.
              </p>
              <p>
                People come to us for everyday health concerns, routine check-ups and questions about diagnostic tests.
                Our aim is simple: to make good, respectful care easy to reach for every family nearby.
              </p>
            </div>
          </div>
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
      </section>

      <section className="section bg-sky" aria-label="How we work">
        <div className="container-site grid gap-14 md:grid-cols-2 md:gap-16">
          {blocks.map((b) => (
            <div key={b.id}>
              <h2 className="font-display text-[1.75rem] font-extrabold md:text-[2rem]">{b.title}</h2>
              <div className="mt-5 space-y-4 text-navy/90">
                {b.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="experience-heading">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20">
          <div>
            <h2 id="experience-heading" className="h-section">
              Patient experience
            </h2>
            <div className="prose-measure mt-6 space-y-4 text-navy/90">
              <p>
                We want every visit to feel calm and respectful, from the moment you call to the moment you leave.
                Patients have shared kind words about our doctor and the care shown by our staff.
              </p>
              <p>We welcome feedback. If something could be better, please tell us when you visit or call.</p>
            </div>
          </div>
          {reviews[0] && <ReviewCard review={reviews[0]} featured />}
        </div>
      </section>

      <MeetOurDoctors doctors={doctors} />

      <div className="bg-sky">
        <LocationSection clinic={clinic} hours={hours} title="Our clinic location" />
      </div>
      <CtaBanner phoneDisplay={clinic.phoneDisplay} telHref={telHref(clinic)} />
      <JsonLd data={breadcrumbSchema("About Us", "/about")} />
    </>
  );
}
