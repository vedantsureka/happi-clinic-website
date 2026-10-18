import { NextResponse, type NextRequest } from "next/server";
import { randomBytes } from "node:crypto";
import { enquirySchema, normaliseMobile, type EnquiryFieldErrors, type EnquiryResponse } from "@/lib/enquiry";
import { isRateLimited } from "@/lib/rate-limit";
import { deliverEnquiry, deliveryConfigured } from "@/lib/deliver";
import { getClinic } from "@/lib/content";
import { appointmentStorageConfigured, saveAppointment } from "@/lib/appointment-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_FILL_MS = 3000;

function reply(body: EnquiryResponse, status: number) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

async function verifyTurnstile(token: unknown, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Turnstile not configured; other checks still apply.
  if (typeof token !== "string" || token.length === 0) return false;
  const form = new URLSearchParams({ secret, response: token, remoteip: ip });
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const clinic = await getClinic();
  const CALL_US = `Please call us on ${clinic.phoneDisplay}.`;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";

  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return reply({ ok: false, error: "We could not read your request. Please try again." }, 415);
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return reply({ ok: false, error: "We could not read your request. Please try again." }, 400);
  }

  if (isRateLimited(ip)) {
    return reply({ ok: false, error: `Too many requests from this device. ${CALL_US}` }, 429);
  }

  // Honeypot: real visitors never see or fill this field. Respond as a
  // failure so bots gain nothing, without telling them why.
  if (typeof body.website === "string" && body.website.length > 0) {
    return reply({ ok: false, error: `We could not send your request. ${CALL_US}` }, 400);
  }

  // Timing check: forms completed in under three seconds are almost always automated.
  const startedAt = Number(body.startedAt);
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) {
    return reply({ ok: false, error: "That was very quick. Please check your details and send again." }, 400);
  }

  if (!(await verifyTurnstile(body.turnstileToken, ip))) {
    return reply({ ok: false, error: "Please complete the security check and send again." }, 400);
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: EnquiryFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof EnquiryFieldErrors;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return reply({ ok: false, error: "Please correct the highlighted fields.", fieldErrors }, 422);
  }

  if (!deliveryConfigured() && !appointmentStorageConfigured()) {
    console.error("Enquiry received but no delivery channel is configured. See .env.example.");
    return reply({ ok: false, error: `Online requests are not available right now. ${CALL_US}` }, 503);
  }

  const enquiry = {
    ...parsed.data,
    mobileNormalised: normaliseMobile(parsed.data.mobile),
    submittedAt: new Date().toISOString(),
    reference: `HC-${randomBytes(3).toString("hex").toUpperCase()}`,
  };

  // Store a verified request before returning success. A configured database is
  // the source of truth for the clinic dashboard; email/webhook remains optional.
  if (appointmentStorageConfigured()) {
    try {
      await saveAppointment(enquiry);
    } catch (error) {
      console.error("Could not store appointment", error);
      return reply({ ok: false, error: `We could not save your request. ${CALL_US}` }, 503);
    }
    if (deliveryConfigured()) {
      try { await deliverEnquiry(enquiry); } catch (error) {
        console.error("Appointment saved, notification delivery failed", error);
      }
    }
  } else {
    try {
      const delivered = await deliverEnquiry(enquiry);
      if (!delivered) return reply({ ok: false, error: `We could not send your request. ${CALL_US}` }, 502);
    } catch {
      return reply({ ok: false, error: `We could not send your request. ${CALL_US}` }, 502);
    }
  }

  return reply({ ok: true }, 200);
}

export function GET() {
  return reply({ ok: false, error: "Method not allowed." }, 405);
}
