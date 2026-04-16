import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, ChevronRight, X } from "lucide-react";

export const metadata: Metadata = {
  title: "Welche Dokumente brauche ich für die KFZ Zulassung?",
  description: "Checkliste: Welche Dokumente brauche ich für KFZ Anmeldung, Abmeldung und Halterwechsel in NRW? Alle Unterlagen auf einen Blick.",
  alternates: { canonical: "https://kfz.qr-docs.de/dokumente" },
};

const CHECKLISTEN = [
  {
    service: "Anmeldung",
    preis: "29€",
    href: "/antrag?service=anmeldung",
    pflicht: [
      "Personalausweis (Vorder- & Rückseite)",
      "Fahrzeugschein (Zulassungsbescheinigung Teil I)",
      "Fahrzeugbrief (Zulassungsbescheinigung Teil II)",
      "eVB-Nummer (7-stelliger Code Ihrer Versicherung)",
      "SEPA-Lastschriftmandat",
    ],
    optional: [
      "Wunschkennzeichen (falls gewünscht)",
    ],
  },
  {
    service: "Abmeldung",
    preis: "19€",
    href: "/antrag?service=abmeldung",
    pflicht: [
      "Personalausweis (Vorder- & Rückseite)",
      "Fahrzeugschein (Zulassungsbescheinigung Teil I)",
      "Kennzeichen (z.B. E-AB 1234)",
      "Sicherheitscode Vorderseite (Rubbelfeld ZB Teil I)",
      "Sicherheitscode Rückseite (Rubbelfeld ZB Teil II)",
    ],
    optional: [],
  },
  {
    service: "Halterwechsel",
    preis: "39€",
    href: "/antrag?service=halterwechsel",
    pflicht: [
      "Personalausweis des neuen Halters (Vorder- & Rückseite)",
      "Fahrzeugschein (Zulassungsbescheinigung Teil I)",
      "Fahrzeugbrief (Zulassungsbescheinigung Teil II)",
      "eVB-Nummer (der neuen Kfz-Versicherung)",
    ],
    optional: [
      "Wunschkennzeichen (falls Kennzeichen geändert werden soll)",
    ],
  },
];

export default function DokumentePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/"><Image src="/logo.svg" alt="KFZ-Docs Logo" width={220} height={48} style={{ objectFit: "contain" }} priority /></Link>
          <Link href="/antrag" className="bg-[#2563eb] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Jetzt starten
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-3 text-sm text-gray-400">
          <Link href="/" className="hover:text-gray-600">Startseite</Link> › Benötigte Dokumente
        </div>
        <h1 className="text-4xl font-bold text-[#111111] mb-4">
          Welche Dokumente brauche ich für die KFZ Zulassung?
        </h1>
        <p className="text-xl text-gray-500 mb-12">
          Vollständige Checkliste für Anmeldung, Abmeldung und Halterwechsel in NRW.
          Unsere KI prüft alle Dokumente automatisch nach dem Upload.
        </p>

        <div className="space-y-8 mb-14">
          {CHECKLISTEN.map((c) => (
            <div key={c.service} className="border border-gray-200 rounded-2xl overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#111111] text-lg">{c.service}</span>
                  <span className="text-[#2563eb] font-bold ml-3">{c.preis}</span>
                </div>
                <Link href={c.href}
                  className="inline-flex items-center gap-1.5 bg-[#2563eb] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Starten <ChevronRight size={14} />
                </Link>
              </div>
              <div className="p-6">
                <div className="font-semibold text-sm text-gray-700 mb-3">Pflichtdokumente</div>
                <ul className="space-y-2 mb-4">
                  {c.pflicht.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle size={15} className="text-green-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                {c.optional.length > 0 && (
                  <>
                    <div className="font-semibold text-sm text-gray-700 mb-3">Optional</div>
                    <ul className="space-y-2">
                      {c.optional.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-gray-400">
                          <X size={15} className="text-gray-300 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-[#111111] mb-2">Alles dabei? Antrag stellen</h2>
          <p className="text-gray-500 mb-6">
            Unsere KI prüft Ihre Dokumente automatisch und füllt Formulare vor.
          </p>
          <Link href="/antrag"
            className="inline-flex items-center gap-2 bg-[#2563eb] text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors text-lg">
            Jetzt starten <ChevronRight size={20} />
          </Link>
        </div>
      </main>
    </div>
  );
}
