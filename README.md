# HAPPI CLINIC AND DIAGNOSTICS — website

Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · Radix UI (shadcn-style components) · Lucide · Framer Motion · Keystatic (content admin).

All public pages are statically generated. The appointment form posts to a server route (`/api/enquiry`) that validates the request and delivers it by email and/or webhook.

---

## 1. Before launch: information the clinic must confirm

The site is built so that unverified details stay hidden or are clearly marked. Confirm each item and update it in the admin (`/keystatic`).

| Item | Where to update | Until confirmed, the site shows |
|---|---|---|
| Opening hours | Opening hours → fill the timetable, tick **confirmed** | "Please call to confirm timings" |
| Exact map location | Clinic details → Google Place ID and/or latitude/longitude, tick **verified** | Map and directions search by clinic name and area |
| Google Business Profile link | Clinic details → Google Business Profile link | A Google Maps search for the clinic |
| Google reviews link | Clinic details → Google reviews link | The profile link or Maps search |
| Rating and review count | Clinic details → rating, count, snapshot date | 4.9 from 146 reviews (as supplied) |
| WhatsApp on the clinic number | Clinic details → tick WhatsApp | No WhatsApp button |
| Pharmacy availability | Services → Pharmacy → availability | "Call to confirm" badge |
| Diagnostic tests | Diagnostic test catalogue → add tests, tick **confirmed** on each, then **publish** | No test list |
| Doctors | Doctors → add details, tick **show section** | Section hidden |
| Clinic photo | Clinic details → clinic photo and description | Illustration |
| Privacy policy | `app/(site)/privacy-policy/page.tsx` | Draft text; review with a legal adviser (DPDP Act 2023) |

Never add test prices, turnaround times, home collection or report delivery promises unless the clinic confirms them in writing.

---

## 2. Run locally

Requires Node.js 20.9 or later.

```bash
npm install
cp .env.example .env.local     # then fill in values (see section 4)
npm run dev                    # http://localhost:3000
```

Open `http://localhost:3000/keystatic` to edit content. In development, edits save to the `/content` folder.

Production build check:

```bash
npm run build && npm start
```

---

## 3. Deploy to Vercel

1. Push this folder to a **private** GitHub repository.
2. In Vercel: **Add New → Project**, import the repository. Framework preset: Next.js. No build settings need changing.
3. Add the environment variables from section 4 under **Settings → Environment Variables**.
4. Deploy. Then add the clinic's domain under **Settings → Domains**. Vercel issues the HTTPS certificate automatically.
5. Set `NEXT_PUBLIC_SITE_URL` to the final domain (for example `https://www.happiclinic.in`) and redeploy, so canonical URLs and the sitemap use it.
6. Submit `https://<domain>/sitemap.xml` in Google Search Console, and add the website link to the clinic's Google Business Profile.

Other hosts that run Node.js (Netlify, Render, a VPS with `npm start`) also work. The enquiry route needs a Node.js server, so a purely static export is not suitable.

---

## 4. Environment variables

See `.env.example` for the full list with comments.

### Appointment requests (required: at least one channel)

If no channel is configured, the form tells visitors to call and never shows a false confirmation.

**Option A: email via Resend**

1. Create an account at resend.com and verify the clinic's domain.
2. Set `RESEND_API_KEY`, `ENQUIRY_TO_EMAIL` (comma-separate several addresses), and `ENQUIRY_FROM_EMAIL` (an address on the verified domain).

**Option B: private Google Sheet via webhook**

1. Create a Google Sheet. Add a header row: `Reference | Submitted | Name | Mobile | Date | Time | Service | Message`.
2. **Extensions → Apps Script**, paste the script below, and replace `CHANGE_ME` with a long random secret.
3. **Deploy → New deployment → Web app**, execute as *Me*, access *Anyone*. Copy the URL.
4. Set `ENQUIRY_WEBHOOK_URL` to that URL and `ENQUIRY_WEBHOOK_SECRET` to the same secret.

```javascript
const SECRET = "CHANGE_ME";
function doPost(e) {
  // Apps Script cannot read custom headers, so the website also needs the
  // secret in the query string: set ENQUIRY_WEBHOOK_URL to <url>?key=CHANGE_ME
  if (e.parameter.key !== SECRET) return ContentService.createTextOutput("forbidden");
  const d = JSON.parse(e.postData.contents);
  SpreadsheetApp.getActiveSheet().appendRow([
    d.reference, d.submittedAt, d.fullName, d.mobile,
    d.preferredDate, d.preferredTime, d.service, d.message,
  ]);
  return ContentService.createTextOutput("ok");
}
```

Share the sheet only with clinic staff who handle appointments.

Both options can be enabled together. The request succeeds if either channel accepts it.

### Spam protection (recommended)

The form always uses server-side validation, a hidden honeypot field, a minimum fill-time check and per-device rate limiting. The rate limiter is in-memory, so on serverless hosting it is a speed bump rather than a guarantee. For stronger protection, add free Cloudflare Turnstile keys: `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`.

### Content admin in production (Keystatic GitHub mode)

In production, `/keystatic` returns 404 unless GitHub mode is configured. To enable it:

1. Set `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO=owner/repo-name` locally, run `npm run dev`, and open `/keystatic`. Keystatic walks you through creating a GitHub App and writes the remaining variables (`KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`) to `.env.local`.
2. Copy all five variables into Vercel and redeploy.
3. In the GitHub App settings, add the production callback URL: `https://<domain>/api/keystatic/github/oauth/callback`.

Editors sign in with a GitHub account that has access to the repository. Each save becomes a commit, and Vercel redeploys the site within a minute or two. Only give repository access to people who should edit the website.

### Owner preview

`NEXT_PUBLIC_SHOW_PLACEHOLDERS=true` shows placeholder doctor cards (clearly labelled "preview only") so the owner can see the section before real details exist. Never set this on the live site.

---

## 5. Project structure

```
app/
  (site)/              Public pages, layout, Open Graph image, 404
  api/enquiry/         Appointment request endpoint
  keystatic/, api/keystatic/   Content admin
  sitemap.ts, robots.ts, icon.svg
components/            Header, footer, hero, form, sections, UI primitives
content/               Editable content (JSON), managed through /keystatic
lib/
  content.ts           Reads content
  site.ts              Navigation, map/directions/phone link builders
  enquiry.ts           Form schema (shared by browser and server)
  deliver.ts           Email and webhook delivery
  schema.ts            Structured data (MedicalClinic, FAQ, breadcrumbs)
keystatic.config.ts    Admin content model
```

---

## 6. Notes on decisions

- **No rating in structured data.** Google's guidelines do not allow a business to mark up its own rating or reviews taken from Google, so `aggregateRating` is left out deliberately. The rating is shown on the page only, with a link to the live reviews.
- **Hours and coordinates in search data** are only published once marked confirmed or verified in the admin.
- **Preferred time is a time of day** (morning, afternoon, evening) rather than a clock time, because consultation hours are not yet confirmed.
- **No sensitive medical data.** The form does not request medical history and asks visitors not to include it. Request data is not logged by the server.
- **Fonts are self-hosted** (Manrope, Inter), so there are no calls to Google Fonts and no layout shift from late-loading fonts.
- **Accessibility.** The base text size is 17–18px and tap targets are at least 48px. The site has visible keyboard focus, a skip link, labelled form fields with linked error messages, and focus moved to the first error. It also respects the reduced-motion setting.
- **Dependencies.** `npm audit` reports advisories in `chokidar`/`braces`, used only by the admin's development file watcher. They do not ship to the live site and have no released fix at the time of writing. A patched `postcss` is pinned through `overrides` in `package.json`.
