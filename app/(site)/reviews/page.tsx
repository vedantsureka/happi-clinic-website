import { PageHero } from "@/components/page-hero";
import { CtaBanner } from "@/components/cta-banner";
import { RatingPanel } from "@/components/sections";
import { ReviewCard } from "@/components/review-card";
import { JsonLd } from "@/components/json-ld";
import { getClinic, getReviews } from "@/lib/content";
import { telHref, formatRating } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = pageMetadata({
  title: "Patient Reviews",
  description:
    "Read what patients say about HAPPI CLINIC AND DIAGNOSTICS, Alwal, Secunderabad, rated on Google by local patients.",
  path: "/reviews",
});

export default async function ReviewsPage() {
  const [clinic, reviews] = await Promise.all([getClinic(), getReviews()]);
  return (
    <>
      <PageHero
        title="Patient Reviews"
        intro={`Rated ${formatRating(clinic.rating)} out of 5 from ${clinic.reviewCount ?? 0} reviews on our Google listing. Here are a few things patients have said.`}
      />
      <section className="section" aria-labelledby="all-reviews-heading">
        <div className="container-site">
          <h2 id="all-reviews-heading" className="sr-only">
            Reviews
          </h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <RatingPanel clinic={clinic} />
            {reviews.map((r, i) => (
              <ReviewCard key={i} review={r} featured={i === 0} />
            ))}
          </div>
          <p className="prose-measure mt-10 text-[0.9375rem] text-slate">
            Excerpts are reproduced as written in reviews on our Google listing. For the full and current set of reviews,
            please visit Google.
          </p>
        </div>
      </section>
      <CtaBanner phoneDisplay={clinic.phoneDisplay} telHref={telHref(clinic)} />
      <JsonLd data={breadcrumbSchema("Patient Reviews", "/reviews")} />
    </>
  );
}
