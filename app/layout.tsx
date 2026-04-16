import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://kfz.qr-docs.de"),
  title: {
    default: "KFZ Zulassung online NRW ✓ Ohne Termin | Sofort | KFZ-Docs",
    template: "%s | KFZ-Docs — Online Zulassung NRW",
  },
  description:
    "✓ KFZ Zulassung online in NRW — Anmeldung ab 29€, Abmeldung ab 19€. Ohne Termin, ohne Warteschlange. KI-gestützt, DSGVO-konform. Essen, Dortmund, Köln, Düsseldorf. 24h Service.",
  keywords: [
    "kfz zulassung online",
    "auto anmelden online nrw",
    "fahrzeug abmelden online",
    "halterwechsel ohne termin",
    "kfz zulassung ohne termin",
    "auto ummelden nrw",
    "kfz zulassung essen",
    "kfz zulassung dortmund",
    "kfz zulassung köln",
    "kfz zulassung düsseldorf",
    "auto anmelden ohne behördengang",
    "fahrzeug anmelden online nrw",
    "zulassungsstelle online",
    "i-kfz online",
    "auto abmelden ohne termin nrw",
    "kfz ummelden nrw",
    "fahrzeugzulassung online",
    "auto zulassung ohne warteschlange",
  ],
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://kfz.qr-docs.de",
    title: "KFZ Zulassung online NRW ✓ Ohne Termin — ab 19€",
    description:
      "Fahrzeug online anmelden, abmelden oder Halterwechsel. Ohne Behördengang, ohne Termin. KI-gestützt. 24h Service in ganz NRW.",
    siteName: "KFZ-Docs",
    images: [
      {
        url: "https://kfz.qr-docs.de/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "KFZ Zulassung online NRW",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KFZ Zulassung online NRW ✓ Ohne Termin",
    description: "Anmelden, Abmelden, Halterwechsel — ohne Behördengang. Ab 19€.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://kfz.qr-docs.de" },
  icons: {
    icon: [
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.svg",    type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className="h-full">
      <body className="min-h-full flex flex-col bg-white text-[#111111]">
        {children}
      </body>
    </html>
  );
}
