import type { Clinic } from "./content";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Our Services" },
  { href: "/diagnostics", label: "Diagnostics" },
  { href: "/reviews", label: "Patient Reviews" },
  { href: "/contact", label: "Contact" },
] as const;

export const BOOKING_HREF = "/contact#appointment";

export function fullAddress(c: Clinic): string {
  return `${c.streetAddress}, ${c.landmarks}, ${c.locality}, ${c.city}, ${c.state} ${c.postalCode}`;
}

function hasCoordinates(c: Clinic): c is Clinic & { latitude: number; longitude: number } {
  return typeof c.latitude === "number" && typeof c.longitude === "number";
}

/** Query used whenever an exact verified pin is not available. */
function mapQuery(c: Clinic): string {
  return `${c.name}, ${c.locality}, ${c.city}, ${c.state} ${c.postalCode}`;
}

export function mapsSearchUrl(c: Clinic): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery(c))}`;
}

export function directionsUrl(c: Clinic): string {
  const destination = hasCoordinates(c) && c.locationVerified ? `${c.latitude},${c.longitude}` : mapQuery(c);
  const params = new URLSearchParams({ api: "1", destination });
  if (c.googlePlaceId) params.set("destination_place_id", c.googlePlaceId);
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

export function mapEmbedUrl(c: Clinic): string {
  const q = hasCoordinates(c) && c.locationVerified ? `${c.latitude},${c.longitude}` : mapQuery(c);
  return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=17&output=embed`;
}

export function profileUrl(c: Clinic): string {
  return c.googleProfileUrl || mapsSearchUrl(c);
}

export function reviewsUrl(c: Clinic): string {
  return c.googleReviewsUrl || profileUrl(c);
}

export function telHref(c: Clinic): string {
  return `tel:${c.phoneE164}`;
}

export function whatsappHref(c: Clinic): string | null {
  if (!c.whatsappVerified) return null;
  return `https://wa.me/${c.phoneE164.replace(/\D/g, "")}`;
}

export function formatRating(r: number | null): string {
  return (r ?? 0).toFixed(1);
}

export function coordinates(c: Clinic): { latitude: number; longitude: number } | null {
  return hasCoordinates(c) && c.locationVerified ? { latitude: c.latitude, longitude: c.longitude } : null;
}
