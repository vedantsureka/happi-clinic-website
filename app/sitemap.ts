import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/contact", priority: 0.9 },
    { path: "/services", priority: 0.8 },
    { path: "/diagnostics", priority: 0.8 },
    { path: "/about", priority: 0.6 },
    { path: "/reviews", priority: 0.6 },
    { path: "/privacy-policy", priority: 0.2 },
  ];
  const lastModified = new Date();
  return pages.map((p) => ({ url: `${siteUrl}${p.path}`, lastModified, changeFrequency: "monthly", priority: p.priority }));
}
