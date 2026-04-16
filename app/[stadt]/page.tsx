import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle, ChevronRight, Clock, Shield, Zap } from "lucide-react";

const STAEDTE = [
  { slug: "essen",         name: "Essen",         bundesland: "NRW",                    kfz: "E"  },
  { slug: "dortmund",      name: "Dortmund",       bundesland: "NRW",                    kfz: "DO" },
  { slug: "koeln",         name: "Köln",           bundesland: "NRW",                    kfz: "K"  },
  { slug: "duesseldorf",   name: "Düsseldorf",     bundesland: "NRW",                    kfz: "D"  },
  { slug: "bochum",        name: "Bochum",         bundesland: "NRW",                    kfz: "BO" },
  { slug: "wuppertal",     name: "Wuppertal",      bundesland: "NRW",                    kfz: "W"  },
  { slug: "bielefeld",     name: "Bielefeld",      bundesland: "NRW",                    kfz: "BI" },
  { slug: "bonn",          name: "Bonn",           bundesland: "NRW",                    kfz: "BN" },
  { slug: "muenster",      name: "Münster",        bundesland: "NRW",                    kfz: "MS" },
  { slug: "gelsenkirchen", name: "Gelsenkirchen",  bundesland: "NRW",                    kfz: "GE" },
  { slug: "aachen",        name: "Aachen",         bundesland: "NRW",                    kfz: "AC" },
  { slug: "berlin",        name: "Berlin",         bundesland: "Berlin",                 kfz: "B"  },
  { slug: "hamburg",       name: "Hamburg",        bundesland: "Hamburg",                kfz: "HH" },
  { slug: "muenchen",      name: "München",        bundesland: "Bayern",                 kfz: "M"  },
  { slug: "frankfurt",     name: "Frankfurt",      bundesland: "Hessen",                 kfz: "F"  },
  { slug: "stuttgart",     name: "Stuttgart",      bundesland: "Baden-Württemberg",      kfz: "S"  },
  { slug: "leipzig",       name: "Leipzig",        bundesland: "Sachsen",                kfz: "L"  },
  { slug: "bremen",        name: "Bremen",         bundesland: "Bremen",                 kfz: "HB" },
  { slug: "hannover",      name: "Hannover",       bundesland: "Niedersachsen",          kfz: "H"  },
  { slug: "nuernberg",     name: "Nürnberg",       bundesland: "Bayern",                 kfz: "N"  },
  { slug: "dresden",       name: "Dresden",        bundesland: "Sachsen",                kfz: "DD" },
  { slug: "mannheim",      name: "Mannheim",       bundesland: "Baden-Württemberg",      kfz: "MA" },
  { slug: "karlsruhe",     name: "Karlsruhe",      bundesland: "Baden-Württemberg",      kfz: "KA" },
  { slug: "augsburg",      name: "Augsburg",       bundesland: "Bayern",                 kfz: "A"  },
  { slug: "wiesbaden",     name: "Wiesbaden",      bundesland: "Hessen",                 kfz: "WI" },
  { slug: "braunschweig",  name: "Braunschweig",   bundesland: "Niedersachsen",          kfz: "BS" },
  { slug: "kiel",          name: "Kiel",           bundesland: "Schleswig-Holstein",     kfz: "KI" },
  { slug: "chemnitz",      name: "Chemnitz",       bundesland: "Sachsen",                kfz: "C"  },
  { slug: "halle",         name: "Halle",          bundesland: "Sachsen-Anhalt",         kfz: "HAL"},
  { slug: "magdeburg",     name: "Magdeburg",      bundesland: "Sachsen-Anhalt",         kfz: "MD" },
];

export async function generateStaticParams() {
  return STAEDTE.map((s) => ({ stadt: s.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ stadt: string }> }
): Promise<Metadata> {
  const { stadt: slug } = await params;
  const stadt = STAEDTE.find((s) => s.slug === slug);
  if (!stadt) return {};
  return {
    title: `KFZ Zulassung ${stadt.name} online — ohne Termin`,
    description: `KFZ Zulassung ${stadt.name} online: Auto anmelden, abmelden oder Halterwechsel — ohne Termin, ohne Behördengang. Ab 19€. 24h Service.`,
    alternates: { canonical: `https://kfz.qr-docs.de/${stadt.slug}` },
  };
}

export default async function StadtPage(
  { params }: { params: Promise<{ stadt: string }> }
) {
  const { stadt: slug } = await params;
  const stadt = STAEDTE.find((s) => s.slug === slug);
  if (!stadt) notFound();

  const faq = [
    {
      q: `Muss ich zur Zulassungsstelle ${stadt.name}?`,
      a: `Nein. Mit KFZ-Docs erledigen Sie alles online — wir kümmern uns um die Behördengänge in ${stadt.name} für Sie.`,
    },
    {
      q: `Wie lange dauert die KFZ Zulassung in ${stadt.name}?`,
      a: "Nach Eingang Ihrer Dokumente bearbeiten wir den Antrag innerhalb von 24 Stunden.",
    },
    {
      q: `Was kostet die KFZ Anmeldung in ${stadt.name}?`,
      a: `Unsere Servicepauschale beträgt ab 29€. Dazu kommen die regulären Behördengebühren der Zulassungsstelle ${stadt.name}.`,
    },
    {
      q: `Kann ich ein ${stadt.kfz}-Kennzeichen online beantragen?`,
      a: `Ja, wir beantragen das ${stadt.kfz}-Kennzeichen für Sie bei der Zulassungsstelle ${stadt.name}.`,
    },
    {
      q: `Welche Dokumente brauche ich für die Zulassung in ${stadt.name}?`,
      a: "Personalausweis, Fahrzeugschein (ZB I), Fahrzeugbrief (ZB II), eVB-Nummer und SEPA-Mandat.",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `KFZ Zulassung ${stadt.name} online`,
    description: `Fahrzeug in ${stadt.name} online anmelden, abmelden oder Halterwechsel — ohne Termin`,
    url: `https://kfz.qr-docs.de/${stadt.slug}`,
    provider: { "@type": "Organization", name: "KFZ-Docs", url: "https://kfz.qr-docs.de" },
    areaServed: { "@type": "City", name: stadt.name },
    offers: [
      { "@type": "Offer", name: "Anmeldung",    price: "29", priceCurrency: "EUR" },
      { "@type": "Offer", name: "Abmeldung",    price: "19", priceCurrency: "EUR" },
      { "@type": "Offer", name: "Halterwechsel",price: "39", priceCurrency: "EUR" },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

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
          <Link href="/" className="hover:text-gray-600">Startseite</Link> › KFZ Zulassung {stadt.name}
        </div>
        <h1 className="text-4xl font-bold text-[#111111] mb-4">
          KFZ Zulassung {stadt.name} online — ohne Termin
        </h1>
        <p className="text-xl text-gray-500 mb-10">
          Fahrzeug in {stadt.name} anmelden, abmelden oder Halterwechsel —
          komplett online, ohne Warteschlange bei der Zulassungsstelle.
        </p>

        {/* Preiskacheln */}
        <div className="grid sm:grid-cols-3 gap-4 mb-14">
          {[
            { title: `Anmeldung ${stadt.name}`,    price: "ab 29€", href: "/antrag?service=anmeldung" },
            { title: `Abmeldung ${stadt.name}`,    price: "ab 19€", href: "/antrag?service=abmeldung" },
            { title: `Halterwechsel ${stadt.name}`,price: "ab 39€", href: "/antrag?service=halterwechsel" },
          ].map((s) => (
            <Link key={s.title} href={s.href}
              className="border-2 border-gray-200 hover:border-[#2563eb] rounded-2xl p-5 transition-all group">
              <div className="font-bold text-[#111111] mb-1 group-hover:text-[#2563eb] text-sm">{s.title}</div>
              <div className="text-2xl font-bold text-[#2563eb]">{s.price}</div>
            </Link>
          ))}
        </div>

        {/* Vorteile */}
        <div className="grid sm:grid-cols-3 gap-6 mb-14">
          {[
            { icon: <Zap size={22} />, titel: "24h Service",    text: `Anmeldung in ${stadt.name} innerhalb von 24 Stunden.` },
            { icon: <Clock size={22} />, titel: "Kein Termin",  text: "Keine Wartezeiten. Kein Gang zur Zulassungsstelle." },
            { icon: <Shield size={22} />, titel: "DSGVO-konform", text: "Sicher verschlüsselt und DSGVO-konform verarbeitet." },
          ].map((f) => (
            <div key={f.titel} className="bg-gray-50 rounded-2xl p-5">
              <div className="text-[#2563eb] mb-2">{f.icon}</div>
              <div className="font-bold text-[#111111] mb-1 text-sm">{f.titel}</div>
              <div className="text-xs text-gray-500">{f.text}</div>
            </div>
          ))}
        </div>

        {/* Fließtext */}
        <div className="mb-14">
          <h2 className="text-2xl font-bold text-[#111111] mb-4">KFZ Zulassung {stadt.name} — so einfach geht&apos;s</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Die Zulassungsstelle {stadt.name} ist oft ausgelastet — lange Wartezeiten und volle
            Terminkalender sind keine Seltenheit. Mit KFZ-Docs umgehen Sie dieses Problem vollständig:
            Laden Sie Ihre Dokumente bequem von zu Hause hoch, und wir kümmern uns um den Rest.
            Ihr Fahrzeug wird innerhalb von 24 Stunden zugelassen.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Egal in welchem Stadtteil von {stadt.name} Sie wohnhaft sind —
            unser Service steht allen Bürgern offen.
            Das {stadt.kfz}-Kennzeichen wird direkt bei der zuständigen Zulassungsstelle {stadt.name} für Sie beantragt.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Unser KI-gestütztes System prüft Ihre Dokumente automatisch auf Vollständigkeit.
            Der gesamte Prozess ist DSGVO-konform, sicher verschlüsselt und von zertifizierten
            Fachleuten begleitet.
          </p>
        </div>

        {/* Dokumente */}
        <div className="mb-14">
          <h2 className="text-2xl font-bold text-[#111111] mb-4">Benötigte Dokumente</h2>
          <div className="bg-gray-50 rounded-2xl p-6">
            <ul className="space-y-2">
              {[
                "Personalausweis (Foto oder Scan)",
                "Fahrzeugschein — Zulassungsbescheinigung Teil I",
                "Fahrzeugbrief — Zulassungsbescheinigung Teil II (bei Anmeldung/Halterwechsel)",
                "eVB-Nummer Ihrer Kfz-Versicherung",
                "SEPA-Lastschriftmandat (nur bei Anmeldung)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle size={15} className="text-green-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-blue-50 rounded-2xl p-8 mb-12 text-center">
          <h2 className="text-2xl font-bold text-[#111111] mb-2">
            Jetzt KFZ Zulassung {stadt.name} starten
          </h2>
          <p className="text-gray-500 mb-6">In 5 Minuten erledigt — fertig in 24h</p>
          <Link href="/antrag"
            className="inline-flex items-center gap-2 bg-[#2563eb] text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors text-lg">
            Antrag stellen <ChevronRight size={20} />
          </Link>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-bold text-[#111111] mb-6">
            Häufige Fragen — KFZ Zulassung {stadt.name}
          </h2>
          <div className="space-y-4">
            {faq.map((f) => (
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
