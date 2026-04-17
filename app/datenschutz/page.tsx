import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  robots: { index: false, follow: false },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-semibold text-[#111111] text-base mb-3">{title}</h2>
      <div className="text-sm text-gray-700 leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 mb-8 inline-block">
          ← Zurück
        </Link>

        <h1 className="text-3xl font-bold text-[#111111] mb-2">Datenschutzerklärung</h1>
        <p className="text-sm text-gray-400 mb-10">Stand: April 2026</p>

        <div className="space-y-10">
          <Section title="1. Verantwortlicher">
            <p>
              Mirwais Haidari<br />
              Alte Kirchstr. 7, 45327 Essen<br />
              E-Mail: <a href="mailto:info@qr-docs.de" className="text-[#2563eb] hover:underline">info@qr-docs.de</a><br />
              Telefon: 0176 80822282
            </p>
          </Section>

          <Section title="2. Erhobene Daten und Verarbeitungszwecke">
            <p>
              Wir erheben und verarbeiten folgende personenbezogene Daten ausschließlich zur
              Durchführung des von Ihnen beauftragten Kfz-Zulassungsservices (Art. 6 Abs. 1 lit. b DSGVO):
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Vor- und Nachname, Adresse, E-Mail-Adresse</li>
              <li>Fahrzeugdaten (Kennzeichen, FIN, Fahrzeugschein-/Fahrzeugbrief-Daten)</li>
              <li>Hochgeladene Dokumente (Personalausweis, Fahrzeugschein, Fahrzeugbrief, eVB)</li>
              <li>Zahlungsdaten (verarbeitet durch Stripe, kein Zugriff durch uns)</li>
              <li>IP-Adresse und technische Zugriffsdaten (Serverlogs)</li>
            </ul>
            <p>
              Eine Weitergabe an Dritte erfolgt ausschließlich zur Leistungserbringung (Zulassungsbehörde)
              oder aufgrund gesetzlicher Verpflichtung.
            </p>
          </Section>

          <Section title="3. KI-gestützte Dokumentenverarbeitung">
            <p>
              Zur automatischen Datenerkennung setzen wir Grok Vision (xAI) ein. Hochgeladene
              Dokumentenbilder werden zur Textextraktion temporär an die xAI-API übertragen.
              xAI verarbeitet diese Daten ausschließlich zur Erbringung des API-Dienstes.
              Es findet kein Training auf Ihren Daten statt. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.
            </p>
          </Section>

          <Section title="4. Auftragsverarbeiter">
            <p><strong>Supabase Inc.</strong> (Datenbankdienstleister)</p>
            <p>
              Supabase, 970 Toa Payoh North, Singapur. Ihre Antragsdaten und Dokumente werden
              auf Supabase-Servern in der EU (Frankfurt) gespeichert. Rechtsgrundlage:
              Art. 28 DSGVO (Auftragsverarbeitungsvertrag).
            </p>
            <p className="mt-3"><strong>Stripe Inc.</strong> (Zahlungsdienstleister)</p>
            <p>
              Stripe, 510 Townsend Street, San Francisco, CA 94103, USA. Zahlungsdaten werden
              ausschließlich durch Stripe verarbeitet; wir speichern keine Kreditkartendaten.
              Stripe ist nach dem EU-US Data Privacy Framework zertifiziert.
              Datenschutzerklärung: <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer" className="text-[#2563eb] hover:underline">stripe.com/de/privacy</a>
            </p>
            <p className="mt-3"><strong>Vercel Inc.</strong> (Hosting)</p>
            <p>
              Vercel, 340 Pine Street, San Francisco, CA 94104, USA. Hosting der Webanwendung.
              EU-US Data Privacy Framework zertifiziert.
            </p>
          </Section>

          <Section title="5. Speicherdauer">
            <p>
              Antragsdaten werden nach vollständiger Abwicklung des Auftrags und Ablauf der
              gesetzlichen Aufbewahrungsfristen (6 Jahre handelsrechtlich, 10 Jahre steuerrechtlich)
              gelöscht. Dokumente werden auf Verlangen sofort gelöscht.
            </p>
          </Section>

          <Section title="6. Cookies und Tracking">
            <p>
              Wir setzen keine Tracking- oder Werbe-Cookies ein. Technisch notwendige
              Session-Cookies dienen ausschließlich der Funktionsfähigkeit des Dienstes.
              Es werden keine Daten an Analyse- oder Werbedienste übermittelt.
            </p>
          </Section>

          <Section title="7. Ihre Rechte (Art. 15–22 DSGVO)">
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li><strong>Auskunft</strong> — Sie haben das Recht zu erfahren, welche Daten wir über Sie gespeichert haben.</li>
              <li><strong>Berichtigung</strong> — Unrichtige Daten werden auf Anfrage korrigiert.</li>
              <li><strong>Löschung</strong> — Sie können jederzeit die Löschung Ihrer Daten verlangen (soweit keine gesetzliche Aufbewahrungspflicht besteht).</li>
              <li><strong>Einschränkung</strong> — Sie können die Verarbeitung Ihrer Daten einschränken lassen.</li>
              <li><strong>Datenübertragbarkeit</strong> — Ihre Daten werden auf Anfrage in maschinenlesbarem Format bereitgestellt.</li>
              <li><strong>Widerspruch</strong> — Sie können der Verarbeitung jederzeit widersprechen.</li>
            </ul>
            <p>
              Zur Ausübung Ihrer Rechte wenden Sie sich an:{" "}
              <a href="mailto:info@qr-docs.de" className="text-[#2563eb] hover:underline">info@qr-docs.de</a>
            </p>
            <p>
              Sie haben außerdem das Recht zur Beschwerde bei der zuständigen Aufsichtsbehörde:
              Landesbeauftragte für Datenschutz und Informationsfreiheit NRW (LDI NRW),
              Kavalleriestr. 2–4, 40213 Düsseldorf.
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
