import { Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { getClinic } from "@/lib/content";
import { telHref } from "@/lib/site";

export default async function NotFound() {
  const clinic = await getClinic();
  return (
    <section className="section">
      <div className="container-site prose-measure">
        <h1 className="font-display text-[2.5rem] font-extrabold md:text-5xl">This page could not be found</h1>
        <p className="lede mt-5">The link may be old or mistyped. Go back to the home page, or call the clinic if you need help.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" size="lg">Go to home page</ButtonLink>
          <ButtonLink href={telHref(clinic)} variant="secondary" size="lg">
            <Phone className="size-5" aria-hidden="true" />
            Call the clinic
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
