import type { Clinic, Hours } from "./content";
import { siteUrl, profileUrl, coordinates } from "./site";
import { hoursAreComplete } from "@/components/hours";

const dayUrl = (d: string) => `https://schema.org/${d}`;

/**
 * MedicalClinic structured data. Deliberately excludes aggregateRating:
 * Google's review-snippet guidelines do not allow a business to mark up
 * its own ratings or reviews taken from another site.
 */
export function clinicSchema(clinic: Clinic, hours: Hours): Record<string, unknown> {
  const geo = coordinates(clinic);
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": `${siteUrl}/#clinic`,
    name: clinic.name,
    url: siteUrl,
    telephone: clinic.phoneE164,
    logo: `${siteUrl}/icon.svg`,
    medicalSpecialty: "PrimaryCare",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${clinic.streetAddress}, ${clinic.landmarks}`,
      addressLocality: `${clinic.locality}, ${clinic.city}`,
      addressRegion: clinic.state,
      postalCode: clinic.postalCode,
      addressCountry: "IN",
    },
    areaServed: ["Alwal", "Secunderabad", "Hyderabad"],
    hasMap: profileUrl(clinic),
  };
  if (clinic.email) data.email = clinic.email;
  if (clinic.clinicPhoto) data.image = `${siteUrl}${clinic.clinicPhoto}`;
  if (geo) data.geo = { "@type": "GeoCoordinates", latitude: geo.latitude, longitude: geo.longitude };
  if (clinic.googleProfileUrl) data.sameAs = [clinic.googleProfileUrl];
  if (hoursAreComplete(hours)) {
    data.openingHoursSpecification = hours.schedule
      .filter((d) => !d.closed)
      .map((d) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: dayUrl(d.day), opens: d.opens, closes: d.closes }));
  }
  return data;
}

export function faqSchema(items: readonly { question: string; answer: string }[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.question, acceptedAnswer: { "@type": "Answer", text: i.answer } })),
  };
}

export function breadcrumbSchema(name: string, path: string): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name, item: `${siteUrl}${path}` },
    ],
  };
}
