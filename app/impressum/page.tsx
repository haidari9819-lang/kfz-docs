import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: false, follow: false },
};

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 mb-8 inline-block">
          ← Zurück
        </Link>

        <h1 className="text-3xl font-bold text-[#111111] mb-10">Impressum</h1>

        <section className="space-y-8 text-sm text-gray-700 leading-relaxed">
          <div>
            <h2 className="font-semibold text-[#111111] mb-2">Angaben gemäß § 5 TMG</h2>
            <p>
              Mirwais Haidari<br />
              Alte Kirchstr. 7<br />
              45327 Essen
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-[#111111] mb-2">Kontakt</h2>
            <p>
              Telefon: <a href="tel:+4917680822282" className="text-[#2563eb] hover:underline">0176 80822282</a><br />
              E-Mail: <a href="mailto:info@qr-docs.de" className="text-[#2563eb] hover:underline">info@qr-docs.de</a>
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-[#111111] mb-2">Umsatzsteuer-ID</h2>
            <p>
              Gemäß § 19 UStG wird keine Umsatzsteuer berechnet (Kleinunternehmerregelung).
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-[#111111] mb-2">Berufsbezeichnung und berufsrechtliche Regelungen</h2>
            <p>
              KFZ-Docs ist ein gewerblicher Dienstleistungsanbieter für die Unterstützung bei
              Kfz-Zulassungsverfahren. Wir handeln im Auftrag des Kunden als Bevollmächtigte
              gegenüber der Zulassungsbehörde.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-[#111111] mb-2">Streitschlichtung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2563eb] hover:underline"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
              .<br />
              Unsere E-Mail-Adresse finden Sie oben im Impressum.<br /><br />
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-[#111111] mb-2">Haftung für Inhalte</h2>
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten
              nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
              Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
              Informationen zu überwachen.
            </p>
          </div>
        </section>
      </div>

      <footer className="border-t border-gray-100 py-6 mt-8">
        <div className="max-w-2xl mx-auto px-6 flex gap-6 text-xs text-gray-400">
          <Link href="/impressum" className="hover:text-gray-600">Impressum</Link>
          <Link href="/datenschutz" className="hover:text-gray-600">Datenschutz</Link>
          <Link href="/agb" className="hover:text-gray-600">AGB</Link>
        </div>
      </footer>
    </div>
  );
}
