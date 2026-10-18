"use client";

import Link from "next/link";
import Script from "next/script";
import { CircleCheck, CircleAlert, Loader2, Phone } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  enquirySchema,
  TIME_OPTIONS,
  OTHER_SERVICE,
  todayInIndia,
  type EnquiryFieldErrors,
  type EnquiryInput,
  type EnquiryResponse,
} from "@/lib/enquiry";
import { buttonClass } from "./ui/button";
import { cn } from "@/lib/utils";

type ServiceOption = { slug: string; title: string };

type Props = {
  services: ServiceOption[];
  phoneDisplay: string;
  telHref: string;
  defaultService?: string;
  headingId?: string;
};

type Status = "idle" | "submitting" | "success" | "error";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: { sitekey: string; callback: (t: string) => void; "expired-callback": () => void }) => string;
      reset: (id?: string) => void;
    };
  }
}

const TURNSTILE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const fieldOrder: (keyof EnquiryInput)[] = ["fullName", "mobile", "preferredDate", "preferredTime", "service", "message", "consent"];

export function EnquiryForm({ services, phoneDisplay, telHref, defaultService, headingId }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState<EnquiryFieldErrors>({});
  const [minDate, setMinDate] = useState("");
  const [service, setService] = useState(defaultService ?? "");
  const [token, setToken] = useState("");
  const startedAt = useRef<number>(0);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileId = useRef<string | null>(null);

  useEffect(() => {
    startedAt.current = Date.now();
    setMinDate(todayInIndia());
    const slug = new URLSearchParams(window.location.search).get("service");
    const match = services.find((s) => s.slug === slug);
    if (match) setService(match.title);
  }, [services]);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  function renderTurnstile() {
    if (!TURNSTILE_KEY || !window.turnstile || !turnstileRef.current || turnstileId.current) return;
    turnstileId.current = window.turnstile.render(turnstileRef.current, {
      sitekey: TURNSTILE_KEY,
      callback: (t) => setToken(t),
      "expired-callback": () => setToken(""),
    });
  }

  function focusFirstError(errs: EnquiryFieldErrors) {
    const first = fieldOrder.find((k) => errs[k]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    const fd = new FormData(e.currentTarget);
    const values = {
      fullName: String(fd.get("fullName") ?? ""),
      mobile: String(fd.get("mobile") ?? ""),
      preferredDate: String(fd.get("preferredDate") ?? ""),
      preferredTime: String(fd.get("preferredTime") ?? ""),
      service: String(fd.get("service") ?? ""),
      message: String(fd.get("message") ?? ""),
      consent: fd.get("consent") === "on",
    };

    const parsed = enquirySchema.safeParse(values);
    if (!parsed.success) {
      const errs: EnquiryFieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof EnquiryFieldErrors;
        if (key && !errs[key]) errs[key] = issue.message;
      }
      setErrors(errs);
      setFormError("Please correct the highlighted fields.");
      setStatus("error");
      focusFirstError(errs);
      return;
    }
    if (TURNSTILE_KEY && !token) {
      setErrors({});
      setFormError("Please complete the security check below, then send again.");
      setStatus("error");
      return;
    }

    setErrors({});
    setFormError("");
    setStatus("submitting");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          website: String(fd.get("website") ?? ""),
          startedAt: startedAt.current,
          turnstileToken: token,
        }),
      });
      const data = (await res.json().catch(() => null)) as EnquiryResponse | null;
      if (res.ok && data?.ok) {
        setStatus("success");
        return;
      }
      const failure = data && !data.ok ? data : null;
      setErrors(failure?.fieldErrors ?? {});
      setFormError(failure?.error ?? `We could not send your request. Please call us on ${phoneDisplay}.`);
      setStatus("error");
      if (failure?.fieldErrors) focusFirstError(failure.fieldErrors);
      if (TURNSTILE_KEY && window.turnstile && turnstileId.current) {
        window.turnstile.reset(turnstileId.current);
        setToken("");
      }
    } catch {
      setFormError(`We could not reach the clinic's system. Check your internet connection, or call us on ${phoneDisplay}.`);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-[var(--radius-panel)] bg-mint-soft p-7 md:p-10" role="status">
        <CircleCheck className="size-10 text-teal" aria-hidden="true" />
        <h3 ref={successRef} tabIndex={-1} className="mt-4 font-display text-2xl font-extrabold md:text-[1.75rem] focus:outline-none">
          Thank you. Your request has been received.
        </h3>
        <p className="mt-3 text-lg text-navy">Our team will contact you to confirm availability.</p>
        <p className="mt-4 rounded-xl bg-white/70 p-4 text-[0.9875rem] text-navy">
          Your appointment is not confirmed until a member of our team calls you. If you need help sooner, please call us.
        </p>
        <a href={telHref} className={buttonClass("primary", "lg", "mt-6")}>
          <Phone className="size-5" aria-hidden="true" />
          Call {phoneDisplay}
        </a>
      </div>
    );
  }

  const options = [...services.map((s) => s.title), OTHER_SERVICE];
  const submitting = status === "submitting";

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-labelledby={headingId} aria-busy={submitting} className="space-y-6">
      {formError && (
        <div role="alert" className="flex gap-3 rounded-xl border border-[#E7B4AE] bg-[#FDF1EF] p-4 text-[#8A2C20]">
          <CircleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <p className="font-medium">{formError}</p>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Full name" name="fullName" error={errors.fullName}>
          <input id="fullName" name="fullName" type="text" autoComplete="name" required maxLength={80} className={inputCls(errors.fullName)} {...describe("fullName", errors.fullName)} />
        </Field>
        <Field label="Mobile number" name="mobile" error={errors.mobile} hint="10-digit Indian mobile number">
          <input id="mobile" name="mobile" type="tel" inputMode="tel" autoComplete="tel" required placeholder="98765 43210" className={inputCls(errors.mobile)} {...describe("mobile", errors.mobile, true)} />
        </Field>
        <Field label="Preferred date" name="preferredDate" error={errors.preferredDate}>
          <input id="preferredDate" name="preferredDate" type="date" required min={minDate || undefined} className={inputCls(errors.preferredDate)} {...describe("preferredDate", errors.preferredDate)} />
        </Field>
        <Field label="Preferred time" name="preferredTime" error={errors.preferredTime}>
          <select id="preferredTime" name="preferredTime" required defaultValue="" className={inputCls(errors.preferredTime)} {...describe("preferredTime", errors.preferredTime)}>
            <option value="" disabled>
              Choose a time of day
            </option>
            {TIME_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Service required" name="service" error={errors.service}>
        <select
          id="service"
          name="service"
          required
          value={service}
          onChange={(e) => setService(e.target.value)}
          className={inputCls(errors.service)}
          {...describe("service", errors.service)}
        >
          <option value="" disabled>
            Choose a service
          </option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Message (optional)" name="message" error={errors.message} hint="Please do not include detailed medical history. The doctor will discuss this with you.">
        <textarea id="message" name="message" rows={4} maxLength={500} className={cn(inputCls(errors.message), "min-h-28 py-3")} {...describe("message", errors.message, true)} />
      </Field>

      {/* Honeypot: hidden from people and assistive technology. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <div className="flex gap-3">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            required
            className="mt-1 size-6 shrink-0 cursor-pointer rounded accent-teal"
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? "consent-error" : undefined}
          />
          <label htmlFor="consent" className="cursor-pointer text-[0.9875rem] leading-relaxed text-navy">
            I agree that the clinic may use these details to contact me about my appointment request, as described in the{" "}
            <Link href="/privacy-policy" className="font-semibold text-teal underline underline-offset-4">
              privacy policy
            </Link>
            .
          </label>
        </div>
        {errors.consent && (
          <p id="consent-error" className="mt-2 pl-9 text-[0.9375rem] font-medium text-[#B3261E]">
            {errors.consent}
          </p>
        )}
      </div>

      {TURNSTILE_KEY && (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="lazyOnload" onReady={renderTurnstile} />
          <div ref={turnstileRef} />
        </>
      )}

      <div className="space-y-4 border-t border-line pt-6">
        <p className="text-[0.9375rem] text-slate">
          This sends a request only. Your appointment is confirmed when our team calls you back.
        </p>
        <button type="submit" disabled={submitting} className={buttonClass("primary", "lg", "w-full sm:w-auto")}>
          {submitting ? (
            <>
              <Loader2 className="size-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
              Sending request
            </>
          ) : (
            "Send appointment request"
          )}
        </button>
        <span className="sr-only" aria-live="polite">
          {submitting ? "Sending your request" : ""}
        </span>
      </div>
    </form>
  );
}

function inputCls(error?: string) {
  return cn(
    "block w-full min-h-14 rounded-[var(--radius-control)] border-2 bg-white px-4 text-[1.0625rem] text-navy placeholder:text-slate/70 transition-colors focus:border-teal focus:outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-navy",
    error ? "border-[#B3261E]" : "border-line hover:border-sky-deep",
  );
}

function describe(name: string, error?: string, hasHint = false) {
  const ids = [hasHint ? `${name}-hint` : "", error ? `${name}-error` : ""].filter(Boolean).join(" ");
  return { "aria-invalid": Boolean(error), "aria-describedby": ids || undefined };
}

function Field({ label, name, error, hint, children }: { label: string; name: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block font-display text-base font-bold text-navy">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${name}-hint`} className="mt-2 text-[0.9375rem] text-slate">
          {hint}
        </p>
      )}
      {hint && error && <span id={`${name}-hint`} className="sr-only">{hint}</span>}
      {error && (
        <p id={`${name}-error`} className="mt-2 text-[0.9375rem] font-medium text-[#B3261E]">
          {error}
        </p>
      )}
    </div>
  );
}
