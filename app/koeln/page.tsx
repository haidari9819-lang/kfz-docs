import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "KFZ Zulassung Köln online — ohne Termin",
  description: "KFZ Zulassung Köln online: Auto anmelden, abmelden oder Halterwechsel — ohne Termin bei der Zulassungsstelle Köln. Ab 19€. 24h Service.",
  alternates: { canonical: "https://kfz.qr-docs.de/koeln" },
};

const FAQ = [
  {
    q: "Muss ich zur Zulassungsstelle Köln?",
    a: "Nein. Mit KFZ-Docs erledigen Sie alles online — wir kümmern uns um die Behördengänge in Köln für Sie.",
  },
  {
    q: "Wie lange dauert die KFZ Zulassung in Köln?",
    a: "Nach Eingang Ihrer Dokumente bearbeiten wir den Antrag innerhalb von 24 Stunden.",
  },
  {
    q: "Was kostet die KFZ Anmeldung in Köln?",
    a: "Unsere Servicepauschale beträgt ab 29€. Dazu kommen die regulären Behördengebühren der Stadt Köln.",
  },
  {
    q: "Kann ich ein K-Kennzeichen online beantragen?",
    a: "Ja, wir beantragen das K-Kennzeichen für Sie bei der Zulassungsstelle Köln.",
  },
  {
    q: "Welche Dokumente brauche ich für die Zulassung in Köln?",
    a: "Personalausweis, Fahrzeugschein (ZB I), Fahrzeugbrief (ZB II), eVB-Nummer und SEPA-Mandat.",
  },
];

export default function KoelnPage() {
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
          <Link href="/" className="hover:text-gray-600">Startseite</Link> › KFZ Zulassung Köln
        </div>
        <h1 className="text-4xl font-bold text-[#111111] mb-4">
          KFZ Zulassung Köln online — ohne Termin
        </h1>
        <p className="text-xl text-gray-500 mb-10">
          Fahrzeug anmelden, abmelden oder Halterwechsel in Köln — komplett online, ohne Warteschlange.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {[
            { title: "Anmeldung Köln", price: "ab 29€", href: "/antrag?service=anmeldung" },
            { title: "Abmeldung Köln", price: "ab 19€", href: "/antrag?service=abmeldung" },
            { title: "Halterwechsel Köln", price: "ab 39€", href: "/antrag?service=halterwechsel" },
          ].map((s) => (
            <Link key={s.title} href={s.href}
              className="border-2 border-gray-200 hover:border-[#2563eb] rounded-2xl p-5 transition-all group">
              <div className="font-bold text-[#111111] mb-1 group-hover:text-[#2563eb]">{s.title}</div>
              <div className="text-2xl font-bold text-[#2563eb]">{s.price}</div>
            </Link>
          ))}
        </div>

        <div className="prose max-w-none mb-12">
          <h2 className="text-2xl font-bold text-[#111111] mb-4">KFZ Zulassung Köln — so einfach geht&apos;s</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Köln ist eine der bevölkerungsreichsten Städte Deutschlands — entsprechend ausgelastet ist
            die Zulassungsstelle Köln. Lange Wartezeiten und volle Terminkalender sind Alltag.
            Mit KFZ-Docs müssen Sie das nicht mehr hinnehmen: Alles läuft online, in Ihrem Tempo.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Von Köln-Innenstadt über Köln-Ehrenfeld bis Köln-Mülheim — wir bearbeiten Anträge
            aus allen Kölner Stadtteilen. Ihr K-Kennzeichen wird direkt bei der zuständigen
            Zulassungsstelle Köln beantragt.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            Unser Service ist vollständig digital, DSGVO-konform und von zertifizierten Fachleuten begleitet.
            KI-Technologie prüft Ihre Dokumente automatisch — so werden Fehler vermieden und
            der Prozess beschleunigt.
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
          <h2 className="text-2xl font-bold text-[#111111] mb-2">Jetzt KFZ Zulassung Köln starten</h2>
          <p className="text-gray-500 mb-6">In 5 Minuten erledigt — fertig in 24h</p>
          <Link href="/antrag"
            className="inline-flex items-center gap-2 bg-[#2563eb] text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors text-lg">
            Antrag stellen <ChevronRight size={20} />
          </Link>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Häufige Fragen — KFZ Zulassung Köln</h2>
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
