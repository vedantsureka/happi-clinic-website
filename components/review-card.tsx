import { Quote } from "lucide-react";
import type { Review } from "@/lib/content";

export function ReviewCard({ review, featured = false }: { review: Review; featured?: boolean }) {
  return (
    <figure className={featured ? "flex h-full flex-col justify-between rounded-[var(--radius-panel)] bg-teal p-7 text-white md:p-9" : "flex h-full flex-col justify-between rounded-[var(--radius-panel)] border border-line bg-white p-7 md:p-8"}>
      <div>
        <Quote aria-hidden="true" className={featured ? "size-10 text-mint" : "size-9 text-mint"} fill="currentColor" strokeWidth={0} />
        <blockquote className={featured ? "mt-4 font-display text-2xl font-bold leading-snug tracking-[-0.01em] text-white md:text-[1.75rem]" : "mt-4 font-display text-xl font-semibold leading-snug tracking-[-0.01em] text-navy"}>
          <p>{review.quote}</p>
        </blockquote>
      </div>
      <figcaption className={featured ? "mt-8 flex items-center justify-between gap-3 text-white/85" : "mt-8 flex items-center justify-between gap-3 text-slate"}>
        <span className="text-[0.9375rem] font-semibold">
          {review.reviewerName ? `${review.reviewerName}, ${review.source || "Google Review"}` : review.source || "Google Review"}
        </span>
        <GoogleG />
      </figcaption>
    </figure>
  );
}

function GoogleG() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 shrink-0" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.27c0-.82-.07-1.6-.2-2.36H12v4.47h6.46a5.53 5.53 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.56-5.17 3.56-8.73Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.88-3a7.2 7.2 0 0 1-10.73-3.78H1.32v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.33 14.32a7.2 7.2 0 0 1 0-4.64v-3.1H1.32a12 12 0 0 0 0 10.84l4.01-3.1Z" />
      <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.6 4.59 1.8l3.44-3.44A12 12 0 0 0 1.32 6.58l4.01 3.1A7.15 7.15 0 0 1 12 4.75Z" />
    </svg>
  );
}
