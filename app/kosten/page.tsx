import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "KFZ Zulassung Kosten NRW — transparente Preise",
  description: "Alle Kosten der KFZ Zulassung in NRW im Überblick: Servicepauschalen, Behördengebühren, Kennzeichenkosten. Anmeldung ab 29€, Abmeldung ab 19€.",
  alternates: { canonical: "https://kfz.qr-docs.de/kosten" },
};

const PREISE = [
  { service: "Anmeldung", servicePauschale: 29, behoerde: "26–30", gesamt: "55–59", href: "/antrag?service=anmeldung" },
  { service: "Abmeldung", servicePauschale: 19, behoerde: "6–10",  gesamt: "25–29", href: "/antrag?service=abmeldung" },
  { service: "Halterwechsel", servicePauschale: 39, behoerde: "26–30", gesamt: "65–69", href: "/antrag?service=halterwechsel" },
];

const FAQ = [
  {
    q: "Was ist in den Behördengebühren enthalten?",
    a: "Die Behördengebühren decken die amtliche Zulassung, die Kfz-Steuererfassung und bei Neukennzeichen die Prägung der Schilder ab.",
  },
  {
    q: "Werden Behördengebühren vorab bezahlt?",
    a: "Nein. Die Behördengebühren werden separat per SEPA-Lastschrift oder Überweisung von der Zulassungsstelle eingezogen.",
  },
  {
    q: "Was kostet ein neues Kennzeichen?",
    a: "Wunschkennzeichen können über die Zulassungsstelle reserviert werden und kosten je nach Stadt ca. 10–15€ extra.",
  },
  {
    q: "Gibt es versteckte Kosten?",
    a: "Nein. Unsere Servicepauschale ist fix. Es entstehen keine weiteren Kosten durch KFZ-Docs.",
  },
];

export default function KostenPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/"><Image src="/logo.svg" alt="KFZ-Docs Logo" width={140} height={32} priority /></Link>
          <Link href="/antrag" className="bg-[#2563eb] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Jetzt starten
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-3 text-sm text-gray-400">
          <Link href="/" className="hover:text-gray-600">Startseite</Link> › KFZ Zulassung Kosten
        </div>
        <h1 className="text-4xl font-bold text-[#111111] mb-4">
          KFZ Zulassung Kosten NRW — transparente Preise
        </h1>
        <p className="text-xl text-gray-500 mb-12">
          Alle Kosten auf einen Blick: Unsere Servicepauschalen plus die amtlichen Behördengebühren.
          Keine versteckten Kosten.
        </p>

        <div className="space-y-4 mb-14">
          {PREISE.map((p) => (
            <div key={p.service} className="border border-gray-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="font-bold text-[#111111] text-lg mb-2">{p.service}</div>
                <div className="flex flex-wrap gap-6 text-sm">
                  <div>
                    <div className="text-gray-400 text-xs mb-0.5">Servicepauschale</div>
                    <div className="font-bold text-[#2563eb] text-xl">{p.servicePauschale}€</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs mb-0.5">Behördengebühren</div>
                    <div className="font-semibold text-gray-600">ca. {p.behoerde}€</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs mb-0.5">Gesamt</div>
                    <div className="font-semibold text-gray-700">ca. {p.gesamt}€</div>
                  </div>
                </div>
              </div>
              <Link href={p.href}
                className="inline-flex items-center gap-2 bg-[#2563eb] text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm whitespace-nowrap">
                Jetzt starten <ChevronRight size={16} />
              </Link>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 mb-14">
          <h2 className="text-xl font-bold text-[#111111] mb-4">Was ist in unserer Servicepauschale enthalten?</h2>
          <ul className="space-y-3">
            {[
              "Vollständige Bearbeitung Ihres Zulassungsantrags",
              "KI-gestützte Prüfung Ihrer Dokumente auf Vollständigkeit",
              "Kommunikation mit der Zulassungsstelle",
              "Bestätigung per E-Mail nach erfolgreicher Zulassung",
              "Support bei Rückfragen",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-gray-600">
                <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Häufige Fragen zu den Kosten</h2>
          <div className="space-y-4">
            {FAQ.map((f) => (
              <details key={f.q} className="border border-gray-200 rounded-xl group">
                <summary className="px-6 py-4 cursor-pointer font-medium text-[#111111] flex items-center justify-between list-none">
                  {f.q}
                  <ChevronRight size={16} className="text-gray-400 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-6 pb-4 text-gray-500 text-sm leading-relaxed">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
