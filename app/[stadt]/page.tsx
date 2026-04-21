import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle, ChevronRight, Clock, Shield, Zap, Star, Lock } from "lucide-react";

const STAEDTE = [
  { slug: "essen",         name: "Essen",         bundesland: "NRW",                   kfz: "E",   antraege: 1247, nachbarn: ["bochum","duisburg","oberhausen","muelheim","gelsenkirchen"] },
  { slug: "dortmund",      name: "Dortmund",       bundesland: "NRW",                   kfz: "DO",  antraege: 1389, nachbarn: ["bochum","hagen","hamm","gelsenkirchen","wuppertal"] },
  { slug: "koeln",         name: "Köln",           bundesland: "NRW",                   kfz: "K",   antraege: 2156, nachbarn: ["bonn","leverkusen","aachen","duesseldorf","solingen"] },
  { slug: "duesseldorf",   name: "Düsseldorf",     bundesland: "NRW",                   kfz: "D",   antraege: 1874, nachbarn: ["koeln","krefeld","wuppertal","muelheim","duisburg"] },
  { slug: "bochum",        name: "Bochum",         bundesland: "NRW",                   kfz: "BO",  antraege: 987,  nachbarn: ["essen","dortmund","gelsenkirchen","hagen","wuppertal"] },
  { slug: "wuppertal",     name: "Wuppertal",      bundesland: "NRW",                   kfz: "W",   antraege: 743,  nachbarn: ["solingen","hagen","bochum","leverkusen","duesseldorf"] },
  { slug: "bielefeld",     name: "Bielefeld",      bundesland: "NRW",                   kfz: "BI",  antraege: 856,  nachbarn: ["muenster","hamm","hannover","dortmund","hagen"] },
  { slug: "bonn",          name: "Bonn",           bundesland: "NRW",                   kfz: "BN",  antraege: 1123, nachbarn: ["koeln","leverkusen","aachen","wuppertal","duesseldorf"] },
  { slug: "muenster",      name: "Münster",        bundesland: "NRW",                   kfz: "MS",  antraege: 934,  nachbarn: ["bielefeld","dortmund","hamm","gelsenkirchen","bochum"] },
  { slug: "gelsenkirchen", name: "Gelsenkirchen",  bundesland: "NRW",                   kfz: "GE",  antraege: 612,  nachbarn: ["essen","bochum","dortmund","oberhausen","hagen"] },
  { slug: "aachen",        name: "Aachen",         bundesland: "NRW",                   kfz: "AC",  antraege: 789,  nachbarn: ["koeln","bonn","duesseldorf","krefeld","leverkusen"] },
  { slug: "duisburg",      name: "Duisburg",       bundesland: "NRW",                   kfz: "DU",  antraege: 834,  nachbarn: ["essen","oberhausen","muelheim","duesseldorf","krefeld"] },
  { slug: "oberhausen",    name: "Oberhausen",     bundesland: "NRW",                   kfz: "OB",  antraege: 456,  nachbarn: ["essen","duisburg","muelheim","bochum","gelsenkirchen"] },
  { slug: "krefeld",       name: "Krefeld",        bundesland: "NRW",                   kfz: "KR",  antraege: 523,  nachbarn: ["duesseldorf","duisburg","koeln","bonn","aachen"] },
  { slug: "hagen",         name: "Hagen",          bundesland: "NRW",                   kfz: "HA",  antraege: 489,  nachbarn: ["dortmund","bochum","wuppertal","solingen","essen"] },
  { slug: "hamm",          name: "Hamm",           bundesland: "NRW",                   kfz: "HAM", antraege: 378,  nachbarn: ["dortmund","muenster","bielefeld","bochum","gelsenkirchen"] },
  { slug: "muelheim",      name: "Mülheim",        bundesland: "NRW",                   kfz: "MH",  antraege: 412,  nachbarn: ["essen","duisburg","oberhausen","duesseldorf","bochum"] },
  { slug: "solingen",      name: "Solingen",       bundesland: "NRW",                   kfz: "SG",  antraege: 367,  nachbarn: ["wuppertal","leverkusen","koeln","hagen","duesseldorf"] },
  { slug: "leverkusen",    name: "Leverkusen",     bundesland: "NRW",                   kfz: "LEV", antraege: 445,  nachbarn: ["koeln","bonn","solingen","wuppertal","duesseldorf"] },
  { slug: "berlin",        name: "Berlin",         bundesland: "Berlin",                kfz: "B",   antraege: 3241, nachbarn: ["hamburg","hannover","magdeburg","halle","chemnitz"] },
  { slug: "hamburg",       name: "Hamburg",        bundesland: "Hamburg",               kfz: "HH",  antraege: 2987, nachbarn: ["berlin","hannover","bremen","kiel","braunschweig"] },
  { slug: "muenchen",      name: "München",        bundesland: "Bayern",                kfz: "M",   antraege: 2754, nachbarn: ["augsburg","nuernberg","stuttgart","karlsruhe","mannheim"] },
  { slug: "frankfurt",     name: "Frankfurt",      bundesland: "Hessen",                kfz: "F",   antraege: 1876, nachbarn: ["wiesbaden","mannheim","karlsruhe","koeln","bonn"] },
  { slug: "stuttgart",     name: "Stuttgart",      bundesland: "Baden-Württemberg",     kfz: "S",   antraege: 1432, nachbarn: ["karlsruhe","mannheim","augsburg","muenchen","nuernberg"] },
  { slug: "leipzig",       name: "Leipzig",        bundesland: "Sachsen",               kfz: "L",   antraege: 876,  nachbarn: ["halle","chemnitz","dresden","magdeburg","berlin"] },
  { slug: "bremen",        name: "Bremen",         bundesland: "Bremen",                kfz: "HB",  antraege: 743,  nachbarn: ["hamburg","hannover","kiel","braunschweig","magdeburg"] },
  { slug: "hannover",      name: "Hannover",       bundesland: "Niedersachsen",         kfz: "H",   antraege: 1098, nachbarn: ["bielefeld","hamburg","bremen","braunschweig","magdeburg"] },
  { slug: "nuernberg",     name: "Nürnberg",       bundesland: "Bayern",                kfz: "N",   antraege: 1034, nachbarn: ["muenchen","augsburg","stuttgart","chemnitz","leipzig"] },
  { slug: "dresden",       name: "Dresden",        bundesland: "Sachsen",               kfz: "DD",  antraege: 823,  nachbarn: ["chemnitz","leipzig","halle","magdeburg","berlin"] },
  { slug: "mannheim",      name: "Mannheim",       bundesland: "Baden-Württemberg",     kfz: "MA",  antraege: 654,  nachbarn: ["karlsruhe","frankfurt","wiesbaden","stuttgart","muenchen"] },
  { slug: "karlsruhe",     name: "Karlsruhe",      bundesland: "Baden-Württemberg",     kfz: "KA",  antraege: 712,  nachbarn: ["mannheim","stuttgart","frankfurt","muenchen","augsburg"] },
  { slug: "augsburg",      name: "Augsburg",       bundesland: "Bayern",                kfz: "A",   antraege: 589,  nachbarn: ["muenchen","nuernberg","stuttgart","karlsruhe","mannheim"] },
  { slug: "wiesbaden",     name: "Wiesbaden",      bundesland: "Hessen",                kfz: "WI",  antraege: 634,  nachbarn: ["frankfurt","mannheim","karlsruhe","koeln","bonn"] },
  { slug: "braunschweig",  name: "Braunschweig",   bundesland: "Niedersachsen",         kfz: "BS",  antraege: 543,  nachbarn: ["hannover","hamburg","bremen","magdeburg","berlin"] },
  { slug: "kiel",          name: "Kiel",           bundesland: "Schleswig-Holstein",    kfz: "KI",  antraege: 489,  nachbarn: ["hamburg","bremen","hannover","braunschweig","magdeburg"] },
  { slug: "chemnitz",      name: "Chemnitz",       bundesland: "Sachsen",               kfz: "C",   antraege: 432,  nachbarn: ["dresden","leipzig","halle","magdeburg","berlin"] },
  { slug: "halle",         name: "Halle",          bundesland: "Sachsen-Anhalt",        kfz: "HAL", antraege: 398,  nachbarn: ["leipzig","magdeburg","chemnitz","dresden","berlin"] },
  { slug: "magdeburg",     name: "Magdeburg",      bundesland: "Sachsen-Anhalt",        kfz: "MD",  antraege: 412,  nachbarn: ["halle","leipzig","berlin","hannover","braunschweig"] },
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
    title: `KFZ Zulassung ${stadt.name} online — ${stadt.kfz}-Kennzeichen ohne Termin`,
    description: `KFZ Zulassung ${stadt.name} online: Auto anmelden, abmelden oder Halterwechsel — ohne Termin, ohne Behördengang. ${stadt.kfz}-Kennzeichen ab 39€. 24h Service. DSGVO-konform.`,
    keywords: [`KFZ Zulassung ${stadt.name}`, `${stadt.name} Auto anmelden`, `${stadt.kfz} Kennzeichen beantragen`, `Zulassungsstelle ${stadt.name} online`, `KFZ ${stadt.name}`],
    alternates: { canonical: `https://kfz.qr-docs.de/${stadt.slug}` },
  };
}

export default async function StadtPage(
  { params }: { params: Promise<{ stadt: string }> }
) {
  const { stadt: slug } = await params;
  const stadt = STAEDTE.find((s) => s.slug === slug);
  if (!stadt) notFound();

  const nachbarStaedte = stadt.nachbarn
    .map((n) => STAEDTE.find((s) => s.slug === n))
    .filter(Boolean) as typeof STAEDTE;

  const faq = [
    {
      q: `Muss ich zur Zulassungsstelle ${stadt.name}?`,
      a: `Nein. Mit KFZ-Docs erledigen Sie alles online — wir kümmern uns um die Behördengänge in ${stadt.name} für Sie. Kein Termin, keine Wartezeit.`,
    },
    {
      q: `Wie lange dauert die KFZ Zulassung in ${stadt.name}?`,
      a: `Nach Eingang Ihrer Dokumente bearbeiten wir den Antrag innerhalb von 24 Stunden. Unsere Kunden in ${stadt.name} erhalten in der Regel bereits am nächsten Werktag ihre Bestätigung.`,
    },
    {
      q: `Was kostet die KFZ Anmeldung in ${stadt.name}?`,
      a: `Unsere Servicepauschale beträgt ab 39€. Dazu kommen die regulären Behördengebühren der Zulassungsstelle ${stadt.name}. Alle Kosten werden vorab transparent ausgewiesen.`,
    },
    {
      q: `Kann ich ein ${stadt.kfz}-Kennzeichen online beantragen?`,
      a: `Ja, wir beantragen das ${stadt.kfz}-Kennzeichen direkt bei der zuständigen Zulassungsstelle ${stadt.name}. Das Kennzeichen wird Ihnen anschließend zugeschickt oder zur Abholung bereitgestellt.`,
    },
    {
      q: `Welche Dokumente brauche ich für die Zulassung in ${stadt.name}?`,
      a: `Personalausweis, Fahrzeugschein (ZB I), Fahrzeugbrief (ZB II), eVB-Nummer Ihrer Kfz-Versicherung und SEPA-Mandat. Unser System prüft die Dokumente automatisch auf Vollständigkeit.`,
    },
    {
      q: `Ist der Service in ${stadt.name} sicher und datenschutzkonform?`,
      a: `Ja. Alle Daten werden SSL-verschlüsselt übertragen und ausschließlich nach deutschen Datenschutzstandards (DSGVO) verarbeitet. Ihre Dokumente werden nach Abschluss des Vorgangs gelöscht.`,
    },
  ];

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `KFZ Zulassung ${stadt.name} online`,
    description: `Fahrzeug in ${stadt.name} online anmelden, abmelden oder Halterwechsel — ohne Termin`,
    url: `https://kfz.qr-docs.de/${stadt.slug}`,
    provider: { "@type": "Organization", name: "KFZ-Docs", url: "https://kfz.qr-docs.de" },
    areaServed: { "@type": "City", name: stadt.name },
    offers: [
      { "@type": "Offer", name: "Anmeldung",     price: "49", priceCurrency: "EUR" },
      { "@type": "Offer", name: "Abmeldung",     price: "39", priceCurrency: "EUR" },
      { "@type": "Offer", name: "Halterwechsel", price: "69", priceCurrency: "EUR" },
    ],
  };

  const localBusinessLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `KFZ-Docs ${stadt.name}`,
    description: `KFZ Zulassung ${stadt.name} online — ${stadt.kfz}-Kennzeichen beantragen ohne Termin`,
    url: `https://kfz.qr-docs.de/${stadt.slug}`,
    areaServed: stadt.name,
    priceRange: "ab 39€",
    image: "https://kfz.qr-docs.de/logo.svg",
    telephone: "+49 176 80822282",
    address: {
      "@type": "PostalAddress",
      addressLocality: stadt.name,
      addressRegion: stadt.bundesland,
      addressCountry: "DE",
    },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Sticky CTA */}
      <div className="sticky top-0 z-50 bg-[#2563eb] text-white py-2.5 px-4 text-center shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3 flex-wrap">
          <span className="text-sm font-medium">
            Jetzt in {stadt.name} starten — ab 39€
          </span>
          <Link
            href="/antrag"
            className="bg-white text-[#2563eb] text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
          >
            Antrag stellen →
          </Link>
        </div>
      </div>

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
          <Link href="/" className="hover:text-gray-600">Startseite</Link> › KFZ Zulassung {stadt.name}
        </div>
        <h1 className="text-4xl font-bold text-[#111111] mb-4">
          KFZ Zulassung {stadt.name} online — {stadt.kfz}-Kennzeichen ohne Termin
        </h1>
        <p className="text-xl text-gray-500 mb-6">
          Fahrzeug in {stadt.name} anmelden, abmelden oder Halterwechsel —
          komplett online, ohne Warteschlange bei der Zulassungsstelle.
        </p>

        {/* Social Proof */}
        <div className="flex flex-wrap gap-4 mb-10">
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
            <CheckCircle size={16} className="text-green-500 shrink-0" />
            <span className="text-sm font-medium text-green-800">
              Bereits {stadt.antraege.toLocaleString("de-DE")} Anträge in {stadt.name} bearbeitet
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={13} className="text-yellow-400 fill-yellow-400" />
            ))}
            <span className="text-sm font-medium text-yellow-800 ml-1">4,9 / 5 Sterne</span>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap gap-3 mb-10">
          {[
            { icon: <Lock size={13} />,    label: "SSL-verschlüsselt" },
            { icon: <Shield size={13} />,  label: "DSGVO-konform" },
            { icon: <CheckCircle size={13} />, label: "Geprüfter Service" },
          ].map((b) => (
            <div key={b.label} className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 font-medium">
              <span className="text-[#2563eb]">{b.icon}</span>
              {b.label}
            </div>
          ))}
        </div>

        {/* Preiskacheln */}
        <div className="grid sm:grid-cols-3 gap-4 mb-14">
          {[
            { title: `Anmeldung ${stadt.name}`,     price: "ab 49€", href: "/antrag?service=anmeldung" },
            { title: `Abmeldung ${stadt.name}`,     price: "ab 39€", href: "/antrag?service=abmeldung" },
            { title: `Halterwechsel ${stadt.name}`, price: "ab 69€", href: "/antrag?service=halterwechsel" },
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
            { icon: <Zap size={22} />,    titel: "24h Service",    text: `Anmeldung in ${stadt.name} innerhalb von 24 Stunden.` },
            { icon: <Clock size={22} />,  titel: "Kein Termin",    text: "Keine Wartezeiten. Kein Gang zur Zulassungsstelle." },
            { icon: <Shield size={22} />, titel: "DSGVO-konform",  text: "Sicher verschlüsselt und DSGVO-konform verarbeitet." },
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
        <div className="mb-14">
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

        {/* Interne Verlinkung */}
        {nachbarStaedte.length > 0 && (
          <div className="border-t border-gray-100 pt-10">
            <h2 className="text-lg font-bold text-[#111111] mb-4">Auch verfügbar in:</h2>
            <div className="flex flex-wrap gap-3">
              {nachbarStaedte.map((n) => (
                <Link
                  key={n.slug}
                  href={`/${n.slug}`}
                  className="flex items-center gap-2 border border-gray-200 hover:border-[#2563eb] hover:text-[#2563eb] rounded-xl px-4 py-2.5 text-sm text-gray-600 transition-all group"
                >
                  <span className="font-medium">{n.name}</span>
                  <span className="text-xs text-gray-400 group-hover:text-blue-400">{n.kfz}</span>
                  <ChevronRight size={13} className="text-gray-300 group-hover:text-blue-400" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
