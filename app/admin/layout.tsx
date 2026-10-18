import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Clinic Admin | HAPPI CLINIC AND DIAGNOSTICS",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}
