import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "@/keystatic.config";
import { cache } from "react";

const reader = createReader(process.cwd(), keystaticConfig);

async function required<T>(label: string, read: () => Promise<T | null>): Promise<T> {
  const value = await read();
  if (value === null) {
    throw new Error(`Content file for "${label}" is missing. Check the /content folder.`);
  }
  return value;
}

export const getClinic = cache(() => required("clinic", () => reader.singletons.clinic.read()));
export const getHours = cache(() => required("hours", () => reader.singletons.hours.read()));
export const getServices = cache(async () => (await required("services", () => reader.singletons.services.read())).items);
export const getDiagnostics = cache(() => required("diagnostics", () => reader.singletons.diagnostics.read()));
export const getDoctors = cache(() => required("doctors", () => reader.singletons.doctors.read()));
export const getReviews = cache(async () => (await required("reviews", () => reader.singletons.reviews.read())).items);
export const getFaqs = cache(() => required("faqs", () => reader.singletons.faqs.read()));

export type Clinic = Awaited<ReturnType<typeof getClinic>>;
export type Hours = Awaited<ReturnType<typeof getHours>>;
export type Service = Awaited<ReturnType<typeof getServices>>[number];
export type Review = Awaited<ReturnType<typeof getReviews>>[number];
export type Faq = Awaited<ReturnType<typeof getFaqs>>["general"][number];
