import { MapPin } from "lucide-react";

/**
 * Landmark-by-landmark wayfinding. Alwal addresses are found by landmarks,
 * not street numbers, so the route is the most useful thing on the page.
 */
export function LandmarkRoute({ steps }: { steps: readonly string[] }) {
  if (steps.length === 0) return null;
  const last = steps.length - 1;
  return (
    <ol className="relative" aria-label="How to find us, landmark by landmark">
      {steps.map((step, i) => (
        <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
          {i < last && (
            <span
              aria-hidden="true"
              className="absolute left-[1.0625rem] top-9 bottom-0 w-0.5 bg-[repeating-linear-gradient(to_bottom,var(--color-mint)_0_6px,transparent_6px_11px)]"
            />
          )}
          {i === last ? (
            <span className="relative z-10 grid size-9 shrink-0 place-items-center rounded-full bg-teal text-white shadow-[0_0_0_6px_var(--color-mint-soft)]">
              <MapPin className="size-5" aria-hidden="true" />
            </span>
          ) : (
            <span className="relative z-10 grid size-9 shrink-0 place-items-center rounded-full border-2 border-mint bg-white font-display text-sm font-extrabold text-teal-ink">
              {i + 1}
            </span>
          )}
          <span className={i === last ? "pt-1 font-display text-lg font-extrabold text-navy" : "pt-1 text-[1.0625rem] font-semibold text-navy"}>
            {step}
            {i === last && <span className="mt-0.5 block font-sans text-[0.9375rem] font-normal text-slate">HAPPI CLINIC AND DIAGNOSTICS</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}
