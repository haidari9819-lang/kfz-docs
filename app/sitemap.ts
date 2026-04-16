import type { MetadataRoute } from "next";

const BASE = "https://kfz.qr-docs.de";

const STADT_SLUGS = [
  "essen", "dortmund", "koeln", "duesseldorf", "bochum", "wuppertal",
  "bielefeld", "bonn", "muenster", "gelsenkirchen", "aachen",
  "berlin", "hamburg", "muenchen", "frankfurt", "stuttgart",
  "leipzig", "bremen", "hannover", "nuernberg", "dresden",
  "mannheim", "karlsruhe", "augsburg", "wiesbaden", "braunschweig",
  "kiel", "chemnitz", "halle", "magdeburg",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const stadtSeiten: MetadataRoute.Sitemap = STADT_SLUGS.map((slug) => ({
    url: `${BASE}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    { url: BASE,                    lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/antrag`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/anmeldung`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/abmeldung`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/halterwechsel`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/kosten`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/dokumente`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    ...stadtSeiten,
  ];
}
