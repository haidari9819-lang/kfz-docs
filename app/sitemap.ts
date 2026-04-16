import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://kfz.qr-docs.de";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/antrag`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/bestaetigung`, lastModified: new Date(), changeFrequency: "never", priority: 0.3 },
  ];
}
