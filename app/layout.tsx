import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://kfz.qr-docs.de"),
  title: {
    default: "KFZ Zulassung online NRW ✓ Ohne Termin — ab 39€ | KFZ-Docs",
    template: "%s | KFZ-Docs — Online Zulassung NRW",
  },
  description:
    "KFZ Zulassung online in NRW — Anmeldung ab 49€, Abmeldung ab 39€. Ohne Termin, ohne Warteschlange. DSGVO-konform. Essen, Dortmund, Köln, Düsseldorf. 24h Service.",
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
              <div className="flex gap-2 mt-1">
                <a
                  href="https://facebook.com/kfzdocs"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#1877F2] text-white hover:opacity-90 transition-opacity"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="https://tiktok.com/@kfzdocs"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-black text-white hover:opacity-80 transition-opacity"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.78a4.85 4.85 0 01-1.02-.09z"/>
                  </svg>
                </a>
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

