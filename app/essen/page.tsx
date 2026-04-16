import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "KFZ Zulassung Essen online — ohne Termin",
  description: "KFZ Zulassung Essen online: Auto anmelden, abmelden oder Halterwechsel — ohne Termin bei der Zulassungsstelle Essen. Ab 19€. 24h Service.",
  alternates: { canonical: "https://kfz.qr-docs.de/essen" },
};

const FAQ = [
  {
    q: "Muss ich zur Zulassungsstelle Essen?",
    a: "Nein. Mit KFZ-Docs erledigen Sie alles online — wir kümmern uns um die Behördengänge für Sie.",
  },
  {
    q: "Wie lange dauert die Zulassung in Essen?",
    a: "Nach Eingang Ihrer Dokumente bearbeiten wir den Antrag innerhalb von 24 Stunden.",
  },
  {
    q: "Was kostet die KFZ Anmeldung in Essen?",
    a: "Unsere Servicepauschale beträgt ab 29€. Zusätzlich fallen die regulären Behördengebühren der Stadt Essen an.",
  },
  {
    q: "Kann ich ein Essener Kennzeichen online beantragen?",
    a: "Ja, wir beantragen das E-Kennzeichen für Sie bei der Zulassungsstelle Essen.",
  },
  {
    q: "Welche Dokumente brauche ich für die Zulassung in Essen?",
    a: "Personalausweis, Fahrzeugschein (ZB I), Fahrzeugbrief (ZB II), eVB-Nummer und SEPA-Mandat.",
  },
];

export default function EssenPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg tracking-tight">KFZ<span className="text-[#2563eb]">-Docs</span></Link>
          <Link href="/antrag" className="bg-[#2563eb] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Jetzt starten
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-3 text-sm text-gray-400">
          <Link href="/" className="hover:text-gray-600">Startseite</Link> › KFZ Zulassung Essen
        </div>
        <h1 className="text-4xl font-bold text-[#111111] mb-4">
          KFZ Zulassung Essen online — ohne Termin
        </h1>
        <p className="text-xl text-gray-500 mb-10">
          Fahrzeug anmelden, abmelden oder Halterwechsel in Essen — komplett online, ohne Warteschlange bei der Zulassungsstelle.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {[
            { title: "Anmeldung Essen", price: "ab 29€", href: "/antrag?service=anmeldung" },
            { title: "Abmeldung Essen", price: "ab 19€", href: "/antrag?service=abmeldung" },
            { title: "Halterwechsel Essen", price: "ab 39€", href: "/antrag?service=halterwechsel" },
          ].map((s) => (
            <Link key={s.title} href={s.href}
              className="border-2 border-gray-200 hover:border-[#2563eb] rounded-2xl p-5 transition-all group">
              <div className="font-bold text-[#111111] mb-1 group-hover:text-[#2563eb]">{s.title}</div>
              <div className="text-2xl font-bold text-[#2563eb]">{s.price}</div>
            </Link>
          ))}
        </div>

        <div className="prose max-w-none mb-12">
          <h2 className="text-2xl font-bold text-[#111111] mb-4">KFZ Zulassung Essen — so einfach geht&apos;s</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Die Zulassungsstelle Essen ist bekannt für lange Wartezeiten. Mit KFZ-Docs umgehen Sie dieses Problem vollständig:
            Laden Sie Ihre Dokumente hoch, unsere KI prüft alles automatisch, und wir kümmern uns um den Rest.
            Ihr Fahrzeug wird innerhalb von 24 Stunden zugelassen — Sie müssen keinen Schritt zur Behörde gehen.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Ob Sie in Essen-Rüttenscheid, Essen-Steele, Essen-Kettwig oder einem anderen Stadtteil wohnen —
            unser Service gilt für alle Essener Bürger. Das neue Kennzeichen mit dem „E"-Kürzel wird direkt
            bei der Zulassungsstelle Essen für Sie beantragt.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            Der gesamte Prozess ist DSGVO-konform, sicher verschlüsselt und von zertifizierten Fachleuten begleitet.
            Wir haben bereits hunderte Fahrzeuge in Essen erfolgreich zugelassen — ohne dass ein Kunde
            auch nur einmal das Haus verlassen musste.
          </p>

          <h2 className="text-2xl font-bold text-[#111111] mb-4">Was wird benötigt?</h2>
          <ul className="space-y-2 mb-8">
            {[
              "Personalausweis (Foto oder Scan)",
              "Fahrzeugschein — Zulassungsbescheinigung Teil I",
              "Fahrzeugbrief — Zulassungsbescheinigung Teil II (nur bei Anmeldung/Halterwechsel)",
              "eVB-Nummer Ihrer Kfz-Versicherung",
              "SEPA-Lastschriftmandat (nur bei Anmeldung)",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-gray-600">
                <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-blue-50 rounded-2xl p-8 mb-12 text-center">
          <h2 className="text-2xl font-bold text-[#111111] mb-2">Jetzt KFZ Zulassung Essen starten</h2>
          <p className="text-gray-500 mb-6">In 5 Minuten erledigt — fertig in 24h</p>
          <Link href="/antrag"
            className="inline-flex items-center gap-2 bg-[#2563eb] text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors text-lg">
            Antrag stellen <ChevronRight size={20} />
          </Link>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Häufige Fragen — KFZ Zulassung Essen</h2>
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

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      })}} />
    </div>
  );
}
