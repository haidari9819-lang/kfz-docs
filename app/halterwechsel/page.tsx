import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ChevronRight, Clock, Shield, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Halterwechsel online NRW — einfach & schnell",
  description: "Halterwechsel online in NRW — Fahrzeughalter ohne Termin wechseln. Dokumente hochladen, wir erledigen den Rest. Ab 39€. Fertig in 24h.",
  alternates: { canonical: "https://kfz.qr-docs.de/halterwechsel" },
};

const SCHRITTE = [
  { nr: "1", titel: "Service wählen", text: "Wählen Sie \"Halterwechsel\" und laden Sie alle Dokumente hoch." },
  { nr: "2", titel: "KI-Prüfung", text: "Unsere KI prüft alle Dokumente automatisch auf Vollständigkeit." },
  { nr: "3", titel: "Bezahlen", text: "Servicepauschale sicher online bezahlen." },
  { nr: "4", titel: "Fertig", text: "Wir führen den Halterwechsel durch. Bestätigung per E-Mail innerhalb 24h." },
];

const FAQ = [
  {
    q: "Was brauche ich für den Halterwechsel?",
    a: "Personalausweis (neuer Halter), Fahrzeugschein (ZB I), Fahrzeugbrief (ZB II), eVB-Nummer der neuen Versicherung.",
  },
  {
    q: "Was kostet der Halterwechsel online?",
    a: "Unsere Servicepauschale beträgt 39€. Zusätzlich fallen Behördengebühren an (ca. 26–30€).",
  },
  {
    q: "Muss der alte Halter anwesend sein?",
    a: "Nein. Sie benötigen lediglich die Fahrzeugpapiere (ZB I und ZB II) sowie eine neue eVB-Nummer.",
  },
  {
    q: "Was passiert mit dem alten Kennzeichen?",
    a: "Das Kennzeichen kann übernommen werden oder Sie beantragen ein neues. Bitte teilen Sie uns Ihren Wunsch mit.",
  },
  {
    q: "Wie lange dauert der Halterwechsel?",
    a: "Nach vollständigem Eingang aller Dokumente und Zahlung führen wir den Halterwechsel innerhalb von 24 Stunden durch.",
  },
];

export default function HalterwechselPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg tracking-tight">KFZ<span className="text-[#2563eb]">-Docs</span></Link>
          <Link href="/antrag?service=halterwechsel" className="bg-[#2563eb] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Jetzt starten
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-3 text-sm text-gray-400">
          <Link href="/" className="hover:text-gray-600">Startseite</Link> › Halterwechsel online
        </div>
        <h1 className="text-4xl font-bold text-[#111111] mb-4">
          Halterwechsel online NRW — einfach &amp; schnell
        </h1>
        <p className="text-xl text-gray-500 mb-10">
          Fahrzeughalter in Nordrhein-Westfalen online wechseln — ohne Termin, ohne Behördengang.
          Dokumente hochladen, wir erledigen den Rest. Fertig in 24 Stunden.
        </p>

        <div className="grid sm:grid-cols-3 gap-6 mb-14">
          {[
            { icon: <Zap size={24} />, titel: "24h Service", text: "Halterwechsel innerhalb von 24 Stunden nach Eingang der Dokumente." },
            { icon: <Clock size={24} />, titel: "Kein Termin", text: "Keine Wartezeiten. Kein Gang zur Zulassungsstelle." },
            { icon: <Shield size={24} />, titel: "DSGVO-konform", text: "Alle Daten verschlüsselt, sicher und DSGVO-konform verarbeitet." },
          ].map((f) => (
            <div key={f.titel} className="bg-gray-50 rounded-2xl p-6">
              <div className="text-[#2563eb] mb-3">{f.icon}</div>
              <div className="font-bold text-[#111111] mb-1">{f.titel}</div>
              <div className="text-sm text-gray-500">{f.text}</div>
            </div>
          ))}
        </div>

        <div className="mb-14">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">So funktioniert der Online-Halterwechsel</h2>
          <div className="grid sm:grid-cols-4 gap-4">
            {SCHRITTE.map((s) => (
              <div key={s.nr} className="text-center">
                <div className="w-10 h-10 rounded-full bg-[#2563eb] text-white font-bold flex items-center justify-center mx-auto mb-3">{s.nr}</div>
                <div className="font-semibold text-[#111111] mb-1">{s.titel}</div>
                <div className="text-sm text-gray-500">{s.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-14">
          <h2 className="text-2xl font-bold text-[#111111] mb-4">Benötigte Dokumente</h2>
          <div className="bg-gray-50 rounded-2xl p-6">
            <ul className="space-y-3">
              {[
                { dok: "Personalausweis (neuer Halter)", info: "Vorder- und Rückseite als Foto oder Scan" },
                { dok: "Fahrzeugschein (ZB Teil I)", info: "Zulassungsbescheinigung Teil I des Fahrzeugs" },
                { dok: "Fahrzeugbrief (ZB Teil II)", info: "Zulassungsbescheinigung Teil II — Eigentumsnachweis" },
                { dok: "eVB-Nummer", info: "7-stelliger Code der neuen Kfz-Versicherung" },
              ].map((d) => (
                <li key={d.dok} className="flex items-start gap-3">
                  <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium text-[#111111]">{d.dok}</span>
                    <span className="text-gray-500 text-sm ml-2">— {d.info}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-blue-50 rounded-2xl p-8 mb-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-bold text-[#111111] text-xl mb-1">Halterwechsel online</div>
            <div className="text-gray-500">Servicepauschale</div>
            <div className="text-4xl font-bold text-[#2563eb] mt-1">39€</div>
            <div className="text-xs text-gray-400 mt-1">zzgl. Behördengebühren ca. 26–30€</div>
          </div>
          <Link href="/antrag?service=halterwechsel"
            className="inline-flex items-center gap-2 bg-[#2563eb] text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors text-lg whitespace-nowrap">
            Jetzt starten <ChevronRight size={20} />
          </Link>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Häufige Fragen zum Halterwechsel</h2>
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
