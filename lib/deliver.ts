import type { EnquiryInput } from "./enquiry";

type Enquiry = EnquiryInput & { mobileNormalised: string; submittedAt: string; reference: string };

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

async function sendEmail(e: Enquiry): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO_EMAIL;
  const from = process.env.ENQUIRY_FROM_EMAIL;
  if (!key || !to || !from) return false;

  const rows: [string, string][] = [
    ["Reference", e.reference],
    ["Name", e.fullName],
    ["Mobile", e.mobileNormalised],
    ["Preferred date", formatDate(e.preferredDate)],
    ["Preferred time", e.preferredTime],
    ["Service", e.service],
    ["Message", e.message || "(none)"],
    ["Submitted", new Date(e.submittedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })],
  ];

  const html = `
    <h2 style="font-family:Arial,sans-serif;color:#17324D">New appointment request</h2>
    <p style="font-family:Arial,sans-serif;color:#17324D">This is a request, not a confirmed appointment. Please call the patient to confirm.</p>
    <table style="font-family:Arial,sans-serif;border-collapse:collapse">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:6px 12px 6px 0;color:#64748B;vertical-align:top">${k}</td><td style="padding:6px 0;color:#17324D;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
        )
        .join("")}
    </table>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: to.split(",").map((s) => s.trim()),
      subject: `Appointment request: ${e.fullName} (${formatDate(e.preferredDate)}, ${e.preferredTime})`,
      html,
      text,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) console.error("Enquiry email failed with status", res.status);
  return res.ok;
}

async function sendWebhook(e: Enquiry): Promise<boolean> {
  const url = process.env.ENQUIRY_WEBHOOK_URL;
  if (!url) return false;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.ENQUIRY_WEBHOOK_SECRET ? { "X-Webhook-Secret": process.env.ENQUIRY_WEBHOOK_SECRET } : {}),
    },
    body: JSON.stringify({
      reference: e.reference,
      submittedAt: e.submittedAt,
      fullName: e.fullName,
      mobile: e.mobileNormalised,
      preferredDate: e.preferredDate,
      preferredTime: e.preferredTime,
      service: e.service,
      message: e.message,
      consent: e.consent,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  // Google Apps Script cannot set status codes, so it signals a bad secret in the body.
  const text = res.ok ? (await res.text()).trim().toLowerCase() : "";
  const accepted = res.ok && text !== "forbidden";
  if (!accepted) console.error("Enquiry webhook was not accepted (status", res.status, ")");
  return accepted;
}

export function deliveryConfigured(): boolean {
  const email = Boolean(process.env.RESEND_API_KEY && process.env.ENQUIRY_TO_EMAIL && process.env.ENQUIRY_FROM_EMAIL);
  return email || Boolean(process.env.ENQUIRY_WEBHOOK_URL);
}

/** Returns true when at least one configured channel accepted the enquiry. */
export async function deliverEnquiry(e: Enquiry): Promise<boolean> {
  const results = await Promise.allSettled([sendEmail(e), sendWebhook(e)]);
  return results.some((r) => r.status === "fulfilled" && r.value === true);
}
