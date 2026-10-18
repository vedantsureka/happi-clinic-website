import { config, fields, singleton } from "@keystatic/core";

/**
 * Admin-editable content for the clinic website.
 *
 * Editors open /keystatic. In development, edits are written to the local
 * /content folder. In production, set NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO
 * (and the GitHub app variables in .env.example) so each save becomes a
 * commit, which triggers a fresh Vercel deployment.
 */

const githubRepo = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO;

const storage = githubRepo
  ? ({ kind: "github", repo: githubRepo as `${string}/${string}` } as const)
  : ({ kind: "local" } as const);

const serviceIconOptions = [
  { label: "Stethoscope (consultation)", value: "stethoscope" },
  { label: "Clipboard (check-up)", value: "clipboard" },
  { label: "Microscope (diagnostics)", value: "microscope" },
  { label: "Pill (pharmacy)", value: "pill" },
  { label: "Heart pulse", value: "heart" },
] as const;

const availabilityOptions = [
  { label: "Confirmed offering", value: "confirmed" },
  { label: "Enquiry category (availability to be confirmed by staff)", value: "enquiry" },
  { label: "Subject to confirmation", value: "unconfirmed" },
] as const;

const dayOptions = [
  { label: "Monday", value: "Monday" },
  { label: "Tuesday", value: "Tuesday" },
  { label: "Wednesday", value: "Wednesday" },
  { label: "Thursday", value: "Thursday" },
  { label: "Friday", value: "Friday" },
  { label: "Saturday", value: "Saturday" },
  { label: "Sunday", value: "Sunday" },
] as const;

const faqItem = fields.object({
  question: fields.text({ label: "Question", validation: { isRequired: true } }),
  answer: fields.text({ label: "Answer", multiline: true, validation: { isRequired: true } }),
});

export default config({
  storage,
  ui: {
    brand: { name: "HAPPI Clinic — Website content" },
    navigation: {
      Clinic: ["clinic", "hours"],
      Pages: ["services", "diagnostics", "doctors", "reviews", "faqs"],
    },
  },
  singletons: {
    clinic: singleton({
      label: "Clinic details",
      path: "content/clinic",
      format: { data: "json" },
      schema: {
        name: fields.text({ label: "Business name", validation: { isRequired: true } }),
        phoneDisplay: fields.text({
          label: "Phone (as displayed)",
          description: "Example: +91 99514 71400",
          validation: { isRequired: true },
        }),
        phoneE164: fields.text({
          label: "Phone (for call links)",
          description: "Digits with country code and no spaces. Example: +919951471400",
          validation: { isRequired: true },
        }),
        whatsappVerified: fields.checkbox({
          label: "WhatsApp is available on this number",
          description: "Tick only after confirming. The WhatsApp button stays hidden until then.",
          defaultValue: false,
        }),
        email: fields.text({
          label: "Public email address (optional)",
          description: "Leave blank to hide.",
        }),
        streetAddress: fields.text({ label: "Street address", validation: { isRequired: true } }),
        landmarks: fields.text({ label: "Landmarks", validation: { isRequired: true } }),
        locality: fields.text({ label: "Locality", validation: { isRequired: true } }),
        city: fields.text({ label: "City", validation: { isRequired: true } }),
        state: fields.text({ label: "State", validation: { isRequired: true } }),
        postalCode: fields.text({ label: "PIN code", validation: { isRequired: true } }),
        directionSteps: fields.array(fields.text({ label: "Step" }), {
          label: "How to find us (in order)",
          description: "Short landmark-based steps shown on the home and contact pages.",
          itemLabel: (props) => props.value || "Step",
        }),
        locationVerified: fields.checkbox({
          label: "Map location has been verified",
          description:
            "Tick after checking the pin below against the Google Business Profile. Coordinates are only used in search-engine data once ticked.",
          defaultValue: false,
        }),
        latitude: fields.number({ label: "Latitude (optional)", step: 0.000001 }),
        longitude: fields.number({ label: "Longitude (optional)", step: 0.000001 }),
        googlePlaceId: fields.text({
          label: "Google Place ID (optional)",
          description: "Makes the Get Directions button open the exact listing.",
        }),
        googleProfileUrl: fields.text({
          label: "Google Business Profile link",
          description: "The share link from the clinic's Google listing. Leave blank to use a Google Maps search instead.",
        }),
        googleReviewsUrl: fields.text({
          label: "Google reviews link",
          description: "Leave blank to use the Business Profile link or a Google Maps search.",
        }),
        rating: fields.number({
          label: "Google rating",
          defaultValue: 4.9,
          step: 0.1,
          validation: { min: 0, max: 5 },
        }),
        reviewCount: fields.integer({ label: "Number of Google reviews", defaultValue: 146 }),
        ratingAsOf: fields.text({
          label: "Rating snapshot date",
          description: "Shown next to the rating so visitors know it is not live. Example: October 2026",
        }),
        clinicPhoto: fields.image({
          label: "Clinic photo (optional)",
          description: "A real photo of the clinic entrance or reception. Shown in the About section when provided.",
          directory: "public/images/clinic",
          publicPath: "/images/clinic/",
        }),
        clinicPhotoAlt: fields.text({ label: "Clinic photo description (alt text)" }),
      },
    }),

    hours: singleton({
      label: "Opening hours",
      path: "content/hours",
      format: { data: "json" },
      schema: {
        verified: fields.checkbox({
          label: "These hours have been confirmed by the clinic",
          description:
            "While unticked, the site shows the notice below instead of a timetable, and hours are left out of search-engine data.",
          defaultValue: false,
        }),
        notice: fields.text({
          label: "Notice shown while hours are unconfirmed",
          multiline: true,
          validation: { isRequired: true },
        }),
        schedule: fields.array(
          fields.object({
            day: fields.select({ label: "Day", options: dayOptions, defaultValue: "Monday" }),
            closed: fields.checkbox({ label: "Closed this day", defaultValue: false }),
            opens: fields.text({ label: "Opens (24h, e.g. 09:00)" }),
            closes: fields.text({ label: "Closes (24h, e.g. 23:00)" }),
          }),
          {
            label: "Weekly timetable",
            itemLabel: (props) =>
              props.fields.closed.value
                ? `${props.fields.day.value}: closed`
                : `${props.fields.day.value}: ${props.fields.opens.value || "?"} to ${props.fields.closes.value || "?"}`,
          },
        ),
      },
    }),

    services: singleton({
      label: "Services",
      path: "content/services",
      format: { data: "json" },
      schema: {
        items: fields.array(
          fields.object({
            slug: fields.text({
              label: "Page anchor",
              description: "Lowercase words joined by hyphens. Example: general-physician",
              validation: { isRequired: true },
            }),
            title: fields.text({ label: "Card title", validation: { isRequired: true } }),
            pageTitle: fields.text({ label: "Title on the Services page", validation: { isRequired: true } }),
            icon: fields.select({ label: "Icon", options: serviceIconOptions, defaultValue: "stethoscope" }),
            summary: fields.text({ label: "Short description", multiline: true, validation: { isRequired: true } }),
            details: fields.text({ label: "Longer description", multiline: true }),
            expectations: fields.array(fields.text({ label: "Point" }), {
              label: "What to expect",
              itemLabel: (props) => props.value || "Point",
            }),
            availability: fields.select({
              label: "Availability",
              options: availabilityOptions,
              defaultValue: "enquiry",
            }),
            availabilityNote: fields.text({ label: "Availability note shown to patients", multiline: true }),
          }),
          { label: "Services", itemLabel: (props) => props.fields.title.value || "Service" },
        ),
      },
    }),

    diagnostics: singleton({
      label: "Diagnostic test catalogue",
      path: "content/diagnostics",
      format: { data: "json" },
      schema: {
        publishCatalogue: fields.checkbox({
          label: "Publish the test catalogue on the website",
          description: "Leave unticked until each listed test has been confirmed by the clinic.",
          defaultValue: false,
        }),
        tests: fields.array(
          fields.object({
            name: fields.text({ label: "Test name", validation: { isRequired: true } }),
            category: fields.text({ label: "Category (e.g. Blood tests)" }),
            confirmed: fields.checkbox({
              label: "Availability confirmed by clinic",
              description: "Only confirmed tests are shown.",
              defaultValue: false,
            }),
            preparation: fields.text({
              label: "Preparation instructions (confirmed by clinic staff)",
              multiline: true,
            }),
          }),
          { label: "Tests", itemLabel: (props) => props.fields.name.value || "Test" },
        ),
      },
    }),

    doctors: singleton({
      label: "Doctors",
      path: "content/doctors",
      format: { data: "json" },
      schema: {
        showSection: fields.checkbox({
          label: "Show the Meet Our Doctors section",
          description: "Tick only once real doctor details below have been added and approved.",
          defaultValue: false,
        }),
        items: fields.array(
          fields.object({
            name: fields.text({ label: "Name", validation: { isRequired: true } }),
            qualifications: fields.text({ label: "Qualifications" }),
            registration: fields.text({ label: "Medical council registration number" }),
            role: fields.text({ label: "Role or area of practice" }),
            bio: fields.text({ label: "Short introduction", multiline: true }),
            photo: fields.image({
              label: "Photo",
              directory: "public/images/doctors",
              publicPath: "/images/doctors/",
            }),
          }),
          { label: "Doctors", itemLabel: (props) => props.fields.name.value || "Doctor" },
        ),
      },
    }),

    reviews: singleton({
      label: "Patient reviews",
      path: "content/reviews",
      format: { data: "json" },
      schema: {
        items: fields.array(
          fields.object({
            quote: fields.text({ label: "Review text (exactly as written)", multiline: true, validation: { isRequired: true } }),
            source: fields.text({ label: "Source", defaultValue: "Google Review" }),
            reviewerName: fields.text({
              label: "Reviewer name (optional)",
              description: "Only add with the reviewer's identity verified. Otherwise leave blank.",
            }),
          }),
          { label: "Reviews", itemLabel: (props) => props.fields.quote.value.slice(0, 48) || "Review" },
        ),
      },
    }),

    faqs: singleton({
      label: "FAQs",
      path: "content/faqs",
      format: { data: "json" },
      schema: {
        general: fields.array(faqItem, {
          label: "General FAQs (home and contact pages)",
          itemLabel: (props) => props.fields.question.value || "Question",
        }),
        services: fields.array(faqItem, {
          label: "Services page FAQs",
          itemLabel: (props) => props.fields.question.value || "Question",
        }),
        diagnostics: fields.array(faqItem, {
          label: "Diagnostics page FAQs",
          itemLabel: (props) => props.fields.question.value || "Question",
        }),
      },
    }),
  },
});
