import type { Metadata } from "next";
import { notFound } from "next/navigation";
import KeystaticApp from "./keystatic";
import { adminEnabled } from "@/lib/admin";

export const metadata: Metadata = { title: "Website content admin", robots: { index: false, follow: false } };

export default function KeystaticLayout() {
  if (!adminEnabled()) notFound();
  return (
    <html lang="en">
      <body>
        <KeystaticApp />
      </body>
    </html>
  );
}
