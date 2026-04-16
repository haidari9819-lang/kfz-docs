import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Clock, CheckCircle, Lock, FileCheck, Zap } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

export const metadata: Metadata = {
  title: "KFZ Zulassung online NRW — ohne Termin | KFZ-Docs",
  description:
    "Fahrzeug online anmelden, abmelden oder Halterwechsel — ohne Behördengang. KI-gestützt, DSGVO-konform, 24h Service in NRW.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "KFZ Zulassung online NRW",
  description: "Fahrzeug online anmelden, abmelden oder Halterwechsel ohne Behördengang",
  url: "https://kfz.qr-docs.de",
  provider: { "@type": "Organization", name: "KFZ-Docs", url: "https://kfz.qr-docs.de" },
  areaServed: { "@type": "State", name: "Nordrhein-Westfalen" },
  offers: [
    { "@type": "Offer", name: "KFZ Anmeldung",  price: "29", priceCurrency: "EUR" },
    { "@type": "Offer", name: "KFZ Abmeldung",  price: "19", priceCurrency: "EUR" },
    { "@type": "Offer", name: "Halterwechsel",   price: "39", priceCurrency: "EUR" },
  ],
};

interface Preis {
  service: string;
  name: string;
  beschreibung: string;
  betrag: number;
}

async function getPreise(): Promise<Preis[]> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data, error } = await supabase
      .from("preise")
      .select("service, name, beschreibung, betrag")
      .eq("aktiv", true)
      .order("betrag");
    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

function formatPreis(betrag: number): string {
  return `${(betrag / 100).toFixed(0)}€`;
}

const SERVICE_ORDER = ["abmeldung", "anmeldung", "halterwechsel"];
const SERVICE_HIGHLIGHT = "anmeldung";
const SERVICE_FEATURES: Record<string, string[]> = {
  anmeldung: ["Fahrzeug anmelden", "inkl. SEPA-Einzug", "24h Service", "KI-Prüfung"],
  abmeldung: ["Fahrzeug abmelden", "Bestätigung per E-Mail", "24h Service"],
  halterwechsel: ["Besitzer wechseln", "Komplett-Service", "24h Service", "KI-Prüfung"],
};

export default async function LandingPage() {
  const preise = await getPreise();

  const sorted = SERVICE_ORDER
    .map((s) => preise.find((p) => p.service === s))
    .filter(Boolean) as Preis[];

  const guenstigster = sorted.length > 0 ? Math.min(...sorted.map((p) => p.betrag)) : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Nav */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-lg tracking-tight">
            KFZ<span className="text-[#2563eb]">-Docs</span>
          </span>
          <Link
            href="/antrag"
            className="bg-[#2563eb] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Jetzt starten
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-white py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-[#2563eb] text-sm font-medium px-3 py-1 rounded-full mb-6">
              <Zap size={14} />
              Fertig in 24 Stunden
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#111111] leading-tight mb-5">
              KFZ-Zulassung online —<br />
              ohne Termin, ohne Warteschlange
            </h1>
            <p className="text-xl text-gray-500 mb-10 max-w-xl mx-auto">
              Dokumente hochladen, wir erledigen den Rest. Fertig in 24h.
            </p>
            <Link
              href="/antrag"
              className="inline-block bg-[#2563eb] text-white text-lg font-semibold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              Jetzt starten{guenstigster ? ` — ab ${formatPreis(guenstigster)}` : ""}
            </Link>
          </div>
        </section>

        {/* Schritte */}
        <section className="bg-gray-50 py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-[#111111] mb-12">So einfach geht's</h2>
            <div className="grid sm:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Dokumente hochladen",
                  desc: "Personalausweis, Fahrzeugschein und Versicherungsnachweis — alles digital, sicher verschlüsselt.",
                  icon: <FileCheck size={28} className="text-[#2563eb]" />,
                },
                {
                  step: "2",
                  title: "KI prüft alles",
                  desc: "Unsere KI kontrolliert Ihre Unterlagen auf Vollständigkeit und Korrektheit — in Sekunden.",
                  icon: <Zap size={28} className="text-[#2563eb]" />,
                },
                {
                  step: "3",
                  title: "Wir reichen ein",
                  desc: "Unser Team übermittelt Ihren Antrag an die Zulassungsstelle. Sie erhalten eine Bestätigung per E-Mail.",
                  icon: <CheckCircle size={28} className="text-[#2563eb]" />,
                },
              ].map((item) => (
                <div key={item.step} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                    {item.icon}
                  </div>
                  <div className="text-xs font-bold text-[#2563eb] mb-2 uppercase tracking-wider">Schritt {item.step}</div>
                  <h3 className="font-bold text-[#111111] mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Preise — dynamisch aus Supabase */}
        <section className="bg-white py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-[#111111] mb-4">Transparente Preise</h2>
            <p className="text-center text-gray-500 mb-12">Keine versteckten Kosten. Behördengebühren separat.</p>

            {sorted.length === 0 ? (
              <div className="grid sm:grid-cols-3 gap-6">
                {SERVICE_ORDER.map((s) => (
                  <div key={s} className="rounded-2xl p-6 border border-gray-200 bg-white animate-pulse">
                    <div className="h-4 bg-gray-100 rounded w-1/2 mb-4" />
                    <div className="h-10 bg-gray-100 rounded w-1/3 mb-6" />
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => <div key={i} className="h-3 bg-gray-100 rounded" />)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-3 gap-6">
                {sorted.map((plan) => {
                  const highlight = plan.service === SERVICE_HIGHLIGHT;
                  const features = SERVICE_FEATURES[plan.service] ?? [];
                  return (
                    <div
                      key={plan.service}
                      className={`rounded-2xl p-6 border ${
                        highlight
                          ? "bg-[#2563eb] text-white border-[#2563eb] shadow-xl shadow-blue-200"
                          : "bg-white text-[#111111] border-gray-200"
                      }`}
                    >
                      {highlight && (
                        <div className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-3">Beliebt</div>
                      )}
                      <h3 className={`font-bold text-lg mb-1 ${highlight ? "text-white" : "text-[#111111]"}`}>
                        {plan.name}
                      </h3>
                      <div className={`text-4xl font-bold mb-6 ${highlight ? "text-white" : "text-[#111111]"}`}>
                        {formatPreis(plan.betrag)}
                      </div>
                      <ul className="space-y-2 mb-8">
                        {features.map((f) => (
                          <li key={f} className={`flex items-center gap-2 text-sm ${highlight ? "text-blue-100" : "text-gray-600"}`}>
                            <CheckCircle size={16} className={highlight ? "text-blue-200" : "text-[#2563eb]"} />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="/antrag"
                        className={`block text-center py-3 rounded-xl font-semibold text-sm transition-colors ${
                          highlight
                            ? "bg-white text-[#2563eb] hover:bg-blue-50"
                            : "bg-[#2563eb] text-white hover:bg-blue-700"
                        }`}
                      >
                        Jetzt beantragen
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Trust Badges */}
        <section className="bg-gray-50 py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              {[
                { icon: <Lock size={24} className="text-[#2563eb]" />, title: "SSL verschlüsselt", desc: "Alle Daten werden sicher übertragen und gespeichert." },
                { icon: <Shield size={24} className="text-[#2563eb]" />, title: "DSGVO konform", desc: "Ihre Daten werden nach deutschem Datenschutzrecht verarbeitet." },
                { icon: <Clock size={24} className="text-[#2563eb]" />, title: "24h Service", desc: "Werktags innerhalb von 24 Stunden erledigt." },
              ].map((badge) => (
                <div key={badge.title} className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">{badge.icon}</div>
                  <h3 className="font-semibold text-[#111111]">{badge.title}</h3>
                  <p className="text-gray-500 text-sm">{badge.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 py-8 px-4 text-center text-sm text-gray-400">
        <p>© 2025 KFZ-Docs — kfz.qr-docs.de</p>
        <p className="mt-1">Kein Behördenservice. Privatanbieter für Dokumentenservice.</p>
      </footer>
    </>
  );
}
