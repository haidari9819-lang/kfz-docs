import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://kfz.qr-docs.de"),
  title: {
    default: "KFZ Zulassung online NRW — ohne Termin | KFZ-Docs",
    template: "%s | KFZ-Docs",
  },
  description:
    "Fahrzeug online anmelden, abmelden oder Halterwechsel — ohne Behördengang. KI-gestützt, DSGVO-konform, 24h Service in NRW.",
  keywords: [
    "kfz zulassung online",
    "auto anmelden nrw",
    "fahrzeug abmelden online",
    "halterwechsel ohne termin",
    "kfz zulassung essen",
    "kfz zulassung dortmund",
    "kfz zulassung köln",
    "auto ummelden nrw",
    "ohne Behördengang",
  ],
  alternates: {
    canonical: "https://kfz.qr-docs.de",
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://kfz.qr-docs.de",
    siteName: "KFZ-Docs",
    title: "KFZ Zulassung online NRW — ohne Termin | KFZ-Docs",
    description:
      "Fahrzeug online anmelden, abmelden oder Halterwechsel — ohne Behördengang. KI-gestützt, DSGVO-konform, 24h Service in NRW.",
  },
  robots: { index: true, follow: true },
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
