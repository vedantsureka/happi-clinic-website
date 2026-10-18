import type { ReactNode } from "react";

export function PageHero({ title, intro, children }: { title: string; intro: string; children?: ReactNode }) {
  return (
    <section className="bg-sky">
      <div className="container-site grid gap-8 py-14 md:py-20 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div>
          <h1 className="font-display text-[2.375rem] font-extrabold leading-[1.08] md:text-[3.5rem]">{title}</h1>
          <p className="lede prose-measure mt-5">{intro}</p>
        </div>
        {children && <div className="lg:justify-self-end">{children}</div>}
      </div>
    </section>
  );
}
