import type { MetadataRoute } from "next";

const BASE = "https://kfz.qr-docs.de";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE,                          lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/antrag`,              lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/anmeldung`,           lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/abmeldung`,           lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/halterwechsel`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/kosten`,              lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/dokumente`,           lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/essen`,               lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/dortmund`,            lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/koeln`,               lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/duesseldorf`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];
}
