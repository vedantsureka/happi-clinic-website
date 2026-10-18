import { PageHero } from "@/components/page-hero";
import { getClinic } from "@/lib/content";
import { fullAddress } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How HAPPI CLINIC AND DIAGNOSTICS handles the personal details you share through this website.",
  path: "/privacy-policy",
});

/*
 * DRAFT for the clinic to review with its legal adviser before launch,
 * including against the Digital Personal Data Protection Act, 2023.
 */
export default async function PrivacyPolicyPage() {
  const clinic = await getClinic();
  const sections = [
    {
      h: "What we collect",
      p: [
        "When you send an appointment request, we collect your name, mobile number, preferred date and time, the service you are interested in, and any message you choose to add.",
        "We ask you not to share detailed medical history through the website. The doctor will discuss your health with you in person.",
      ],
    },
    {
      h: "Why we use it",
      p: ["We use these details only to contact you about your request and to arrange your visit. We do not use them for marketing and we do not sell them."],
    },
    {
      h: "Your consent",
      p: [
        "We process your details on the basis of the consent you give when you tick the box on the form. You can withdraw your consent at any time by calling us, and we will stop using your details for your request.",
      ],
    },
    {
      h: "Who can see it",
      p: [
        "Your request is sent to authorised clinic staff. It is delivered using trusted service providers (for example, an email service) that process it on our behalf and only for this purpose.",
      ],
    },
    {
      h: "How long we keep it",
      p: ["We keep appointment requests only as long as needed to handle them and to meet any legal obligations, and then delete them."],
    },
    {
      h: "Your rights",
      p: [
        `You can ask us to access, correct or delete the details you have shared, or raise a concern, by calling ${clinic.phoneDisplay} or writing to us at ${fullAddress(clinic)}.`,
      ],
    },
    {
      h: "Cookies",
      p: [
        "This website does not use advertising or tracking cookies. The embedded Google Map is provided by Google and is subject to Google's own privacy policy.",
      ],
    },
  ];
  return (
    <>
      <PageHero title="Privacy Policy" intro="How we handle the details you share through this website." />
      <section className="section">
        <div className="container-site">
          <div className="prose-measure space-y-10">
            {sections.map((s) => (
              <div key={s.h}>
                <h2 className="font-display text-2xl font-extrabold">{s.h}</h2>
                <div className="mt-3 space-y-3 text-navy/90">
                  {s.p.map((t, i) => (
                    <p key={i}>{t}</p>
                  ))}
                </div>
              </div>
            ))}
            <p className="text-[0.9375rem] text-slate">Data controller: {clinic.name}, {fullAddress(clinic)}.</p>
          </div>
        </div>
      </section>
    </>
  );
}
