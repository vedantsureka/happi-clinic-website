import { Clock } from "lucide-react";
import type { Hours } from "@/lib/content";

function to12h(t: string): string {
  const m = /^(\d{1,2}):(\d{2})$/.exec(t.trim());
  if (!m) return t;
  const h = Number(m[1]);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m[2]} ${suffix}`;
}

export function hoursAreComplete(hours: Hours): boolean {
  return hours.verified && hours.schedule.length > 0 && hours.schedule.every((d) => d.closed || (d.opens && d.closes));
}

export function HoursBlock({ hours, tone = "light" }: { hours: Hours; tone?: "light" | "dark" }) {
  const muted = tone === "dark" ? "text-white/75" : "text-slate";
  const strong = tone === "dark" ? "text-white" : "text-navy";
  if (!hoursAreComplete(hours)) {
    return (
      <div className="flex gap-3">
        <Clock className={`mt-1 size-5 shrink-0 ${tone === "dark" ? "text-mint" : "text-teal"}`} aria-hidden="true" />
        <div>
          <p className={`font-semibold ${strong}`}>Please call to confirm timings</p>
          <p className={`mt-1 text-[0.9375rem] ${muted}`}>{hours.notice}</p>
        </div>
      </div>
    );
  }
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-[0.9875rem]">
      {hours.schedule.map((d) => (
        <div key={d.day} className="contents">
          <dt className={muted}>{d.day}</dt>
          <dd className={`font-medium tabular-nums ${strong}`}>{d.closed ? "Closed" : `${to12h(d.opens)} to ${to12h(d.closes)}`}</dd>
        </div>
      ))}
    </dl>
  );
}
