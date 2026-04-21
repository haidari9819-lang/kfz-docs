import type { MetadataRoute } from "next";

const BASE = "https://kfz.qr-docs.de";

const STADT_SLUGS = [
  // NRW
  "essen", "dortmund", "koeln", "duesseldorf", "bochum", "wuppertal",
  "bielefeld", "bonn", "muenster", "gelsenkirchen", "aachen",
  "duisburg", "oberhausen", "krefeld", "hagen", "hamm", "muelheim",
  "solingen", "leverkusen", "siegen", "paderborn", "recklinghausen",
  "bottrop", "remscheid", "bergisch-gladbach",
  // Übrige Deutschland
  "berlin", "hamburg", "muenchen", "frankfurt", "stuttgart",
  "leipzig", "bremen", "hannover", "nuernberg", "dresden",
  "mannheim", "karlsruhe", "augsburg", "wiesbaden", "mainz",
  "freiburg", "erfurt", "rostock", "kassel", "saarbruecken",
  "potsdam", "osnabrueck", "heidelberg", "braunschweig", "kiel",
  "chemnitz", "halle", "magdeburg",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const stadtSeiten: MetadataRoute.Sitemap = STADT_SLUGS.map((slug) => ({
    url: `${BASE}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    { url: BASE,                     lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/antrag`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/anmeldung`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/abmeldung`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/halterwechsel`,  lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/kosten`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/dokumente`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/impressum`,      lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/datenschutz`,    lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/agb`,            lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    ...stadtSeiten,
  ];
}
