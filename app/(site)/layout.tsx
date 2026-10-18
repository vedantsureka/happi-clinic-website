import type { Metadata, Viewport } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MobileActionBar, FloatingCall } from "@/components/action-bar";
import { MotionProvider } from "@/components/motion-provider";
import { JsonLd } from "@/components/json-ld";
import { getClinic, getHours } from "@/lib/content";
import { siteUrl, telHref } from "@/lib/site";
import { clinicSchema } from "@/lib/schema";
import { hoursAreComplete } from "@/components/hours";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "HAPPI CLINIC AND DIAGNOSTICS | General Physician & Diagnostic Centre in Alwal, Secunderabad",
    template: "%s | HAPPI CLINIC AND DIAGNOSTICS, Alwal",
  },
  description:
    "General physician consultations and diagnostic enquiries at HAPPI CLINIC AND DIAGNOSTICS, behind Alwal Police Station, Golnaka, Secunderabad. Call +91 99514 71400.",
  applicationName: "HAPPI CLINIC AND DIAGNOSTICS",
  formatDetection: { telephone: true, address: true },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#087F8C",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [clinic, hours] = await Promise.all([getClinic(), getHours()]);
  const tel = telHref(clinic);
  return (
    <MotionProvider>
          <Header phoneDisplay={clinic.phoneDisplay} telHref={tel} hoursNotice={hoursAreComplete(hours) ? "" : "Please call to confirm timings before you visit."} />
          <main id="main">{children}</main>
          <Footer clinic={clinic} hours={hours} />
          <MobileActionBar telHref={tel} />
          <FloatingCall telHref={tel} phoneDisplay={clinic.phoneDisplay} />
          <JsonLd data={clinicSchema(clinic, hours)} />
    </MotionProvider>
  );
}
