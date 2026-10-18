import Image from "next/image";
import { UserRound } from "lucide-react";
import type { getDoctors } from "@/lib/content";

type Doctors = Awaited<ReturnType<typeof getDoctors>>;

const showPlaceholders = process.env.NEXT_PUBLIC_SHOW_PLACEHOLDERS === "true";

/**
 * Hidden until the clinic adds real doctor details and ticks "Show the Meet
 * Our Doctors section" in the admin. For an owner preview build, set
 * NEXT_PUBLIC_SHOW_PLACEHOLDERS=true to see how the section will look.
 */
export function MeetOurDoctors({ doctors }: { doctors: Doctors }) {
  const live = doctors.showSection && doctors.items.length > 0;
  if (!live && !showPlaceholders) return null;

  const items = live
    ? doctors.items
    : [1, 2].map((n) => ({
        name: `Doctor name ${n}`,
        qualifications: "Qualifications to be added",
        registration: "",
        role: "Area of practice to be added",
        bio: "A short introduction will appear here once the clinic provides approved details.",
        photo: null as string | null,
      }));

  return (
    <section className="section" aria-labelledby="doctors-heading">
      <div className="container-site">
        <h2 id="doctors-heading" className="h-section">
          Meet Our Doctors
        </h2>
        {!live && (
          <p className="mt-4 inline-block rounded-lg bg-[#FFF4DB] px-3 py-1.5 text-sm font-semibold text-[#7A4E00]">
            Preview only. Placeholder cards are not shown on the live site.
          </p>
        )}
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((d) => (
            <li key={d.name} className="overflow-hidden rounded-[var(--radius-panel)] border border-line bg-white">
              <div className="relative aspect-[4/3] bg-sky">
                {d.photo ? (
                  <Image src={d.photo} alt={`Photo of ${d.name}`} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                ) : (
                  <UserRound className="absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 text-teal/40" aria-hidden="true" />
                )}
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-extrabold">{d.name}</h3>
                {d.qualifications && <p className="mt-1 font-semibold text-teal">{d.qualifications}</p>}
                {d.role && <p className="mt-1 text-slate">{d.role}</p>}
                {d.bio && <p className="mt-3 text-[0.9875rem] text-navy/90">{d.bio}</p>}
                {d.registration && <p className="mt-3 text-sm text-slate">Registration no. {d.registration}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
