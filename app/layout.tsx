import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://kfz.qr-docs.de"),
  title: {
    default: "KFZ Zulassung online NRW ✓ Ohne Termin | Sofort | KFZ-Docs",
    template: "%s | KFZ-Docs — Online Zulassung NRW",
  },
  description:
    "✓ KFZ Zulassung online in NRW — Anmeldung ab 49€, Abmeldung ab 39€. Ohne Termin, ohne Warteschlange. KI-gestützt, DSGVO-konform. Essen, Dortmund, Köln, Düsseldorf. 24h Service.",
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
    title: "KFZ Zulassung online NRW ✓ Ohne Termin — ab 39€",
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
    description: "Anmelden, Abmelden, Halterwechsel — ohne Behördengang. Ab 39€.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://kfz.qr-docs.de" },
  icons: {
    icon: [
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    other: [
      { rel: "icon", url: "/icon-192.png", sizes: "192x192" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className="h-full">
      <body className="min-h-full flex flex-col bg-white text-[#111111]">
        <div className="flex-1">{children}</div>
        <footer className="border-t border-gray-100 py-6">
          <div className="max-w-6xl mx-auto px-6 flex flex-wrap gap-6 items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400">© {new Date().getFullYear()} KFZ-Docs — Powered by QR-Docs</span>
              <div className="flex gap-4 text-xs text-gray-400">
                <a href="mailto:haidari9819@gmail.com" className="hover:text-gray-600 transition-colors">haidari9819@gmail.com</a>
                <a href="tel:+4917680822282" className="hover:text-gray-600 transition-colors">0176 80822282</a>
              </div>
            </div>
            <nav className="flex gap-6 text-xs text-gray-400">
              <Link href="/impressum" className="hover:text-gray-600 transition-colors">Impressum</Link>
              <Link href="/datenschutz" className="hover:text-gray-600 transition-colors">Datenschutz</Link>
              <Link href="/agb" className="hover:text-gray-600 transition-colors">AGB</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
