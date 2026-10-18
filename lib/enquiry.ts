import { z } from "zod";

export const TIME_OPTIONS = ["Morning", "Afternoon", "Evening", "Any time"] as const;
export const OTHER_SERVICE = "Not sure / other";

/** Indian mobile number: optional +91 / 0 prefix, then 10 digits starting 6-9. */
export const INDIAN_MOBILE = /^(?:\+?91[\s-]?|0)?[6-9]\d{4}[\s-]?\d{5}$/;

export function normaliseMobile(input: string): string {
  const digits = input.replace(/\D/g, "");
  return `+91${digits.slice(-10)}`;
}

/** Today's date in India, as YYYY-MM-DD. */
export function todayInIndia(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

export const enquirySchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(80, "Please keep your name under 80 characters."),
  mobile: z
    .string()
    .trim()
    .regex(INDIAN_MOBILE, "Please enter a 10-digit Indian mobile number, for example 98765 43210."),
  preferredDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a preferred date.")
    .refine((d) => d >= todayInIndia(), "Please choose today or a later date."),
  preferredTime: z.enum(TIME_OPTIONS, { message: "Please choose a preferred time." }),
  service: z.string().trim().min(1, "Please choose the service you need.").max(80),
  message: z
    .string()
    .trim()
    .max(500, "Please keep your message under 500 characters.")
    .optional()
    .default(""),
  consent: z.literal(true, { errorMap: () => ({ message: "Please agree so that our team can contact you." }) }),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export type EnquiryFieldErrors = Partial<Record<keyof EnquiryInput, string>>;

export type EnquiryResponse =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: EnquiryFieldErrors };
