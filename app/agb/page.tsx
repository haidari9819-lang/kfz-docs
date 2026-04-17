import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Allgemeine Geschäftsbedingungen",
  robots: { index: false, follow: false },
};

function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-semibold text-[#111111] text-base mb-3">§ {num} {title}</h2>
      <div className="text-sm text-gray-700 leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

export default function AgbPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 mb-8 inline-block">
          ← Zurück
        </Link>

        <h1 className="text-3xl font-bold text-[#111111] mb-2">
          Allgemeine Geschäftsbedingungen
        </h1>
        <p className="text-sm text-gray-400 mb-10">
          KFZ-Docs — Mirwais Haidari · Stand: April 2026
        </p>

        <div className="space-y-10">
          <Section num="1" title="Geltungsbereich">
            <p>
              Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge zwischen
              Mirwais Haidari (nachfolgend „KFZ-Docs") und dem Kunden über die Erbringung
              von Dienstleistungen im Bereich der Kfz-Zulassung über die Plattform
              kfz.qr-docs.de.
            </p>
            <p>
              Abweichende Bedingungen des Kunden finden keine Anwendung, es sei denn,
              KFZ-Docs stimmt ihrer Geltung ausdrücklich schriftlich zu.
            </p>
          </Section>

          <Section num="2" title="Leistungsbeschreibung">
            <p>
              KFZ-Docs erbringt im Auftrag des Kunden folgende Dienstleistungen:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                <strong>Fahrzeuganmeldung</strong> — Beantragung der Zulassung eines Fahrzeugs bei der
                zuständigen Zulassungsbehörde im Namen des Kunden
              </li>
              <li>
                <strong>Fahrzeugabmeldung</strong> — Außerbetriebsetzung eines Fahrzeugs bei der
                zuständigen Zulassungsbehörde
              </li>
              <li>
                <strong>Halterwechsel</strong> — Ummeldung eines Fahrzeugs bei Eigentümerwechsel
              </li>
            </ul>
            <p>
              KFZ-Docs handelt als Bevollmächtigter des Kunden. Der Kunde erteilt hierzu eine
              Vollmacht, die Teil des Vertragsschlusses ist. Die eigentliche Zulassungsentscheidung
              trifft die Behörde; KFZ-Docs übernimmt keine Garantie für behördliche Entscheidungen.
            </p>
          </Section>

          <Section num="3" title="Preise und Behördengebühren">
            <p>
              Die Servicegebühren von KFZ-Docs betragen:
            </p>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between">
                <span>Anmeldung</span>
                <span className="font-semibold">49,00 €</span>
              </div>
              <div className="flex justify-between">
                <span>Abmeldung</span>
                <span className="font-semibold">39,00 €</span>
              </div>
              <div className="flex justify-between">
                <span>Halterwechsel</span>
                <span className="font-semibold">69,00 €</span>
              </div>
            </div>
            <p>
              <strong>Hinweis zu Behördengebühren:</strong> Zusätzlich zur Servicegebühr fallen
              Behördengebühren der Zulassungsstelle an (in der Regel 10–30 € je nach Vorgang
              und Gemeinde). Diese Gebühren sind nicht im Servicepreis enthalten und werden
              separat in Rechnung gestellt bzw. direkt bei der Behörde entrichtet.
            </p>
            <p>
              Alle Preise sind Endpreise. Gemäß § 19 UStG wird als Kleinunternehmer keine
              Umsatzsteuer berechnet.
            </p>
          </Section>

          <Section num="4" title="Vertragsschluss und Zahlung">
            <p>
              Der Vertrag kommt mit Absenden des Antragsformulars und Bestätigung durch
              KFZ-Docs zustande. Die Zahlung erfolgt per Kreditkarte oder SEPA-Lastschrift
              über den Zahlungsdienstleister Stripe.
            </p>
            <p>
              Die Leistungserbringung beginnt nach erfolgreicher Zahlung und vollständiger
              Übermittlung aller erforderlichen Dokumente.
            </p>
          </Section>

          <Section num="5" title="Widerrufsrecht">
            <p className="font-medium text-[#111111]">Widerrufsbelehrung</p>
            <p>
              Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag
              zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des
              Vertragsschlusses.
            </p>
            <p>
              Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (Mirwais Haidari, Alte Kirchstr. 7,
              45327 Essen, E-Mail: info@qr-docs.de) mittels einer eindeutigen Erklärung über
              Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.
            </p>
            <p className="font-medium text-[#111111]">Erlöschen des Widerrufsrechts</p>
            <p>
              Das Widerrufsrecht erlischt bei Verträgen zur Erbringung von Dienstleistungen,
              wenn KFZ-Docs die Dienstleistung vollständig erbracht hat und mit der Ausführung
              erst begonnen hat, nachdem der Kunde hierzu seine ausdrückliche Zustimmung gegeben
              hat und gleichzeitig bestätigt hat, dass er sein Widerrufsrecht verliert, sobald
              KFZ-Docs die Dienstleistung vollständig erbracht hat.
            </p>
            <p>
              Mit Absenden des Antrags stimmen Sie zu, dass KFZ-Docs sofort mit der
              Leistungserbringung beginnt, und bestätigen Ihr Wissen über das Erlöschen des
              Widerrufsrechts nach vollständiger Leistungserbringung.
            </p>
          </Section>

          <Section num="6" title="Mitwirkungspflichten des Kunden">
            <p>
              Der Kunde ist verpflichtet:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>vollständige und korrekte Angaben im Antragsformular zu machen</li>
              <li>alle erforderlichen Originaldokumente rechtzeitig zu übermitteln</li>
              <li>die Vollmacht zu unterzeichnen und zu übersenden</li>
              <li>KFZ-Docs unverzüglich über Änderungen zu informieren</li>
            </ul>
            <p>
              Bei unvollständigen oder unrichtigen Angaben kann KFZ-Docs die Leistung
              verweigern oder verzögert erbringen, ohne dass dem Kunden hieraus Ansprüche entstehen.
            </p>
          </Section>

          <Section num="7" title="Haftungsausschluss">
            <p>
              KFZ-Docs haftet unbeschränkt für Schäden aus der Verletzung des Lebens, des Körpers
              oder der Gesundheit sowie bei Vorsatz und grober Fahrlässigkeit.
            </p>
            <p>
              Im Übrigen haftet KFZ-Docs nur bei Verletzung einer wesentlichen Vertragspflicht
              (Kardinalpflicht) und in diesem Fall nur für den vertragstypisch vorhersehbaren Schaden.
            </p>
            <p>
              KFZ-Docs übernimmt keine Haftung für:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Ablehnungen durch Behörden aufgrund fehlerhafter Kundenangaben</li>
              <li>Verzögerungen durch behördliche Bearbeitungszeiten</li>
              <li>Technische Ausfälle des i-Kfz-Systems der Behörden</li>
              <li>Schäden durch höhere Gewalt</li>
            </ul>
          </Section>

          <Section num="8" title="Datenschutz">
            <p>
              Informationen zur Verarbeitung personenbezogener Daten finden Sie in unserer{" "}
              <Link href="/datenschutz" className="text-[#2563eb] hover:underline">
                Datenschutzerklärung
              </Link>.
            </p>
          </Section>

          <Section num="9" title="Schlussbestimmungen">
            <p>
              Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts.
              Gerichtsstand ist Essen, soweit der Kunde Kaufmann ist.
            </p>
            <p>
              Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit
              der übrigen Bestimmungen unberührt.
            </p>
          </Section>
        </div>
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
