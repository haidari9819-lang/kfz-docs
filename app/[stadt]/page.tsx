import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import BewertungSection from "@/components/BewertungSection";
import { CheckCircle, ChevronRight, Clock, Shield, Zap, Star, Lock, CreditCard, MapPin } from "lucide-react";

const STAEDTE = [
  // ── NRW ──────────────────────────────────────────────────────────────────
  { slug: "essen",             name: "Essen",             bundesland: "NRW",               kfz: "E",   wartezeit: "4–6 Wochen", stadtteile: "Rüttenscheid, Steele, Kettwig",         nachbarn: ["bochum","duisburg","bottrop","oberhausen","gelsenkirchen"] },
  { slug: "dortmund",          name: "Dortmund",           bundesland: "NRW",               kfz: "DO",  wartezeit: "5–7 Wochen", stadtteile: "Hörde, Aplerbeck, Hombruch",            nachbarn: ["bochum","hagen","hamm","recklinghausen","gelsenkirchen"] },
  { slug: "koeln",             name: "Köln",               bundesland: "NRW",               kfz: "K",   wartezeit: "6–10 Wochen",stadtteile: "Ehrenfeld, Nippes, Deutz, Porz",        nachbarn: ["bonn","leverkusen","bergisch-gladbach","aachen","solingen"] },
  { slug: "duesseldorf",       name: "Düsseldorf",         bundesland: "NRW",               kfz: "D",   wartezeit: "6–8 Wochen", stadtteile: "Bilk, Gerresheim, Benrath, Pempelfort", nachbarn: ["koeln","krefeld","wuppertal","muelheim","duisburg"] },
  { slug: "bochum",            name: "Bochum",             bundesland: "NRW",               kfz: "BO",  wartezeit: "3–5 Wochen", stadtteile: "Langendreer, Wattenscheid, Wiemelhausen",nachbarn: ["essen","dortmund","recklinghausen","bottrop","hagen"] },
  { slug: "wuppertal",         name: "Wuppertal",          bundesland: "NRW",               kfz: "W",   wartezeit: "3–5 Wochen", stadtteile: "Elberfeld, Barmen, Vohwinkel",          nachbarn: ["remscheid","solingen","hagen","leverkusen","duesseldorf"] },
  { slug: "bielefeld",         name: "Bielefeld",          bundesland: "NRW",               kfz: "BI",  wartezeit: "3–4 Wochen", stadtteile: "Brackwede, Sennestadt, Jöllenbeck",     nachbarn: ["muenster","paderborn","osnabrueck","hamm","hannover"] },
  { slug: "bonn",              name: "Bonn",               bundesland: "NRW",               kfz: "BN",  wartezeit: "4–6 Wochen", stadtteile: "Bad Godesberg, Beuel, Hardtberg",       nachbarn: ["koeln","leverkusen","bergisch-gladbach","aachen","siegen"] },
  { slug: "muenster",          name: "Münster",            bundesland: "NRW",               kfz: "MS",  wartezeit: "3–5 Wochen", stadtteile: "Hiltrup, Gievenbeck, Amelsbüren",       nachbarn: ["bielefeld","osnabrueck","paderborn","recklinghausen","hamm"] },
  { slug: "gelsenkirchen",     name: "Gelsenkirchen",      bundesland: "NRW",               kfz: "GE",  wartezeit: "2–4 Wochen", stadtteile: "Buer, Horst, Erle",                    nachbarn: ["essen","bochum","dortmund","recklinghausen","bottrop"] },
  { slug: "aachen",            name: "Aachen",             bundesland: "NRW",               kfz: "AC",  wartezeit: "3–5 Wochen", stadtteile: "Laurensberg, Burtscheid, Eilendorf",    nachbarn: ["koeln","bonn","duesseldorf","krefeld","leverkusen"] },
  { slug: "duisburg",          name: "Duisburg",           bundesland: "NRW",               kfz: "DU",  wartezeit: "4–6 Wochen", stadtteile: "Rheinhausen, Homberg, Marxloh",         nachbarn: ["essen","oberhausen","muelheim","duesseldorf","krefeld"] },
  { slug: "oberhausen",        name: "Oberhausen",         bundesland: "NRW",               kfz: "OB",  wartezeit: "3–4 Wochen", stadtteile: "Sterkrade, Osterfeld, Alstaden",        nachbarn: ["essen","duisburg","bottrop","muelheim","gelsenkirchen"] },
  { slug: "krefeld",           name: "Krefeld",            bundesland: "NRW",               kfz: "KR",  wartezeit: "3–5 Wochen", stadtteile: "Uerdingen, Hüls, Fischeln",             nachbarn: ["duesseldorf","duisburg","koeln","bonn","aachen"] },
  { slug: "hagen",             name: "Hagen",              bundesland: "NRW",               kfz: "HA",  wartezeit: "2–4 Wochen", stadtteile: "Haspe, Hohenlimburg, Vorhalle",         nachbarn: ["dortmund","bochum","siegen","remscheid","wuppertal"] },
  { slug: "hamm",              name: "Hamm",               bundesland: "NRW",               kfz: "HAM", wartezeit: "2–3 Wochen", stadtteile: "Heessen, Bockum-Hövel, Pelkum",         nachbarn: ["dortmund","muenster","bielefeld","paderborn","recklinghausen"] },
  { slug: "muelheim",          name: "Mülheim",            bundesland: "NRW",               kfz: "MH",  wartezeit: "3–4 Wochen", stadtteile: "Saarn, Speldorf, Heißen",               nachbarn: ["essen","duisburg","oberhausen","duesseldorf","bochum"] },
  { slug: "solingen",          name: "Solingen",           bundesland: "NRW",               kfz: "SG",  wartezeit: "2–4 Wochen", stadtteile: "Ohligs, Wald, Gräfrath",                nachbarn: ["remscheid","wuppertal","leverkusen","bergisch-gladbach","hagen"] },
  { slug: "leverkusen",        name: "Leverkusen",         bundesland: "NRW",               kfz: "LEV", wartezeit: "3–5 Wochen", stadtteile: "Opladen, Schlebusch, Manfort",          nachbarn: ["koeln","bonn","bergisch-gladbach","solingen","wuppertal"] },
  { slug: "siegen",            name: "Siegen",             bundesland: "NRW",               kfz: "SI",  wartezeit: "2–3 Wochen", stadtteile: "Weidenau, Geisweid, Eiserfeld",         nachbarn: ["hagen","wuppertal","bonn","koeln","dortmund"] },
  { slug: "paderborn",         name: "Paderborn",          bundesland: "NRW",               kfz: "PB",  wartezeit: "2–3 Wochen", stadtteile: "Schloß Neuhaus, Elsen, Sande",          nachbarn: ["bielefeld","hamm","muenster","dortmund","hannover"] },
  { slug: "recklinghausen",    name: "Recklinghausen",     bundesland: "NRW",               kfz: "RE",  wartezeit: "2–4 Wochen", stadtteile: "Suderwich, Hochlarmark, Hillen",         nachbarn: ["gelsenkirchen","bochum","dortmund","muenster","hamm"] },
  { slug: "bottrop",           name: "Bottrop",            bundesland: "NRW",               kfz: "BOT", wartezeit: "2–3 Wochen", stadtteile: "Kirchhellen, Boy, Batenbrock",          nachbarn: ["essen","oberhausen","gelsenkirchen","duisburg","bochum"] },
  { slug: "remscheid",         name: "Remscheid",          bundesland: "NRW",               kfz: "RS",  wartezeit: "2–3 Wochen", stadtteile: "Lennep, Lüttringhausen, Hasten",        nachbarn: ["wuppertal","solingen","hagen","duesseldorf","leverkusen"] },
  { slug: "bergisch-gladbach", name: "Bergisch Gladbach",  bundesland: "NRW",               kfz: "GL",  wartezeit: "2–3 Wochen", stadtteile: "Refrath, Bensberg, Moitzfeld",          nachbarn: ["koeln","leverkusen","bonn","solingen","wuppertal"] },
  // ── Übrige Deutschland ───────────────────────────────────────────────────
  { slug: "berlin",            name: "Berlin",             bundesland: "Berlin",            kfz: "B",   wartezeit: "8–12 Wochen",stadtteile: "Mitte, Prenzlauer Berg, Kreuzberg",     nachbarn: ["potsdam","magdeburg","hannover","halle","leipzig"] },
  { slug: "hamburg",           name: "Hamburg",            bundesland: "Hamburg",           kfz: "HH",  wartezeit: "6–8 Wochen", stadtteile: "Altona, Eimsbüttel, Wandsbek",          nachbarn: ["kiel","rostock","hannover","bremen","osnabrueck"] },
  { slug: "muenchen",          name: "München",            bundesland: "Bayern",            kfz: "M",   wartezeit: "8–10 Wochen",stadtteile: "Schwabing, Maxvorstadt, Pasing",        nachbarn: ["augsburg","nuernberg","stuttgart","karlsruhe","mannheim"] },
  { slug: "frankfurt",         name: "Frankfurt",          bundesland: "Hessen",            kfz: "F",   wartezeit: "5–7 Wochen", stadtteile: "Sachsenhausen, Bornheim, Höchst",       nachbarn: ["mainz","wiesbaden","kassel","mannheim","heidelberg"] },
  { slug: "stuttgart",         name: "Stuttgart",          bundesland: "Baden-Württemberg", kfz: "S",   wartezeit: "4–6 Wochen", stadtteile: "Bad Cannstatt, Vaihingen, Zuffenhausen", nachbarn: ["karlsruhe","mannheim","freiburg","augsburg","nuernberg"] },
  { slug: "leipzig",           name: "Leipzig",            bundesland: "Sachsen",           kfz: "L",   wartezeit: "3–5 Wochen", stadtteile: "Gohlis, Connewitz, Lindenau",           nachbarn: ["halle","erfurt","chemnitz","dresden","magdeburg"] },
  { slug: "bremen",            name: "Bremen",             bundesland: "Bremen",            kfz: "HB",  wartezeit: "3–5 Wochen", stadtteile: "Schwachhausen, Findorff, Hemelingen",   nachbarn: ["hamburg","hannover","osnabrueck","kiel","braunschweig"] },
  { slug: "hannover",          name: "Hannover",           bundesland: "Niedersachsen",     kfz: "H",   wartezeit: "4–6 Wochen", stadtteile: "Linden, Bothfeld, Döhren",              nachbarn: ["bielefeld","osnabrueck","kassel","braunschweig","bremen"] },
  { slug: "nuernberg",         name: "Nürnberg",           bundesland: "Bayern",            kfz: "N",   wartezeit: "4–6 Wochen", stadtteile: "Gostenhof, Langwasser, Ziegelstein",    nachbarn: ["muenchen","augsburg","stuttgart","chemnitz","erfurt"] },
  { slug: "dresden",           name: "Dresden",            bundesland: "Sachsen",           kfz: "DD",  wartezeit: "3–5 Wochen", stadtteile: "Neustadt, Blasewitz, Leuben",           nachbarn: ["chemnitz","leipzig","halle","magdeburg","erfurt"] },
  { slug: "mannheim",          name: "Mannheim",           bundesland: "Baden-Württemberg", kfz: "MA",  wartezeit: "3–4 Wochen", stadtteile: "Neckarstadt, Käfertal, Rheinau",         nachbarn: ["heidelberg","karlsruhe","frankfurt","mainz","wiesbaden"] },
  { slug: "karlsruhe",         name: "Karlsruhe",          bundesland: "Baden-Württemberg", kfz: "KA",  wartezeit: "3–4 Wochen", stadtteile: "Durlach, Mühlburg, Neureut",            nachbarn: ["freiburg","heidelberg","mannheim","stuttgart","saarbruecken"] },
  { slug: "augsburg",          name: "Augsburg",           bundesland: "Bayern",            kfz: "A",   wartezeit: "3–5 Wochen", stadtteile: "Lechhausen, Oberhausen, Haunstetten",   nachbarn: ["muenchen","nuernberg","stuttgart","karlsruhe","freiburg"] },
  { slug: "wiesbaden",         name: "Wiesbaden",          bundesland: "Hessen",            kfz: "WI",  wartezeit: "3–5 Wochen", stadtteile: "Biebrich, Erbenheim, Sonnenberg",       nachbarn: ["mainz","frankfurt","mannheim","heidelberg","karlsruhe"] },
  { slug: "mainz",             name: "Mainz",              bundesland: "Rheinland-Pfalz",   kfz: "MZ",  wartezeit: "3–4 Wochen", stadtteile: "Hechtsheim, Bretzenheim, Gonsenheim",   nachbarn: ["wiesbaden","frankfurt","mannheim","heidelberg","saarbruecken"] },
  { slug: "freiburg",          name: "Freiburg",           bundesland: "Baden-Württemberg", kfz: "FR",  wartezeit: "3–4 Wochen", stadtteile: "Wiehre, Haslach, Zähringen",            nachbarn: ["karlsruhe","mannheim","heidelberg","stuttgart","augsburg"] },
  { slug: "erfurt",            name: "Erfurt",             bundesland: "Thüringen",         kfz: "EF",  wartezeit: "2–4 Wochen", stadtteile: "Krämpfervorstadt, Ilversgehofen, Daberstedt", nachbarn: ["halle","leipzig","chemnitz","magdeburg","kassel"] },
  { slug: "rostock",           name: "Rostock",            bundesland: "Mecklenburg-Vorp.", kfz: "HRO", wartezeit: "2–3 Wochen", stadtteile: "Evershagen, Lütten Klein, Südstadt",    nachbarn: ["kiel","hamburg","berlin","magdeburg","braunschweig"] },
  { slug: "kassel",            name: "Kassel",             bundesland: "Hessen",            kfz: "KS",  wartezeit: "2–3 Wochen", stadtteile: "Bettenhausen, Wehlheiden, Rothenditmold",nachbarn: ["bielefeld","hannover","frankfurt","paderborn","erfurt"] },
  { slug: "saarbruecken",      name: "Saarbrücken",        bundesland: "Saarland",          kfz: "SB",  wartezeit: "2–4 Wochen", stadtteile: "Malstatt, Dudweiler, Burbach",          nachbarn: ["mannheim","heidelberg","karlsruhe","frankfurt","mainz"] },
  { slug: "potsdam",           name: "Potsdam",            bundesland: "Brandenburg",       kfz: "P",   wartezeit: "3–5 Wochen", stadtteile: "Babelsberg, Drewitz, Golm",             nachbarn: ["berlin","magdeburg","hannover","halle","leipzig"] },
  { slug: "osnabrueck",        name: "Osnabrück",          bundesland: "Niedersachsen",     kfz: "OS",  wartezeit: "2–3 Wochen", stadtteile: "Schinkel, Voxtrup, Haste",              nachbarn: ["hannover","bielefeld","muenster","bremen","hamburg"] },
  { slug: "heidelberg",        name: "Heidelberg",         bundesland: "Baden-Württemberg", kfz: "HD",  wartezeit: "2–4 Wochen", stadtteile: "Rohrbach, Kirchheim, Wieblingen",       nachbarn: ["mannheim","karlsruhe","frankfurt","mainz","wiesbaden"] },
  { slug: "braunschweig",      name: "Braunschweig",       bundesland: "Niedersachsen",     kfz: "BS",  wartezeit: "3–4 Wochen", stadtteile: "Weststadt, Lehndorf, Rüningen",         nachbarn: ["hannover","magdeburg","berlin","potsdam","rostock"] },
  { slug: "kiel",              name: "Kiel",               bundesland: "Schleswig-Holstein",kfz: "KI",  wartezeit: "2–3 Wochen", stadtteile: "Gaarden, Elmschenhagen, Mettenhof",     nachbarn: ["rostock","hamburg","bremen","hannover","osnabrueck"] },
  { slug: "chemnitz",          name: "Chemnitz",           bundesland: "Sachsen",           kfz: "C",   wartezeit: "2–3 Wochen", stadtteile: "Gablenz, Bernsdorf, Helbersdorf",       nachbarn: ["dresden","leipzig","erfurt","halle","magdeburg"] },
  { slug: "halle",             name: "Halle",              bundesland: "Sachsen-Anhalt",    kfz: "HAL", wartezeit: "2–3 Wochen", stadtteile: "Neustadt, Heide-Süd, Ammendorf",        nachbarn: ["leipzig","erfurt","magdeburg","chemnitz","dresden"] },
  { slug: "magdeburg",         name: "Magdeburg",          bundesland: "Sachsen-Anhalt",    kfz: "MD",  wartezeit: "2–4 Wochen", stadtteile: "Sudenburg, Buckau, Stadtfeld",          nachbarn: ["potsdam","berlin","halle","hannover","braunschweig"] },
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
    title: `KFZ Zulassung ${stadt.name} online — ohne Termin | KFZ-Docs`,
    description: `KFZ Zulassung ${stadt.name} online — i-Kfz, Anmeldung & Abmeldung ab 39€. Ohne Termin, fertig in 24h. ${stadt.kfz}-Kennzeichen direkt beantragen.`,
    keywords: [
      `KFZ Zulassung ${stadt.name}`,
      `${stadt.name} Auto anmelden`,
      `${stadt.kfz} Kennzeichen beantragen`,
      `Zulassungsstelle ${stadt.name} online`,
      `KFZ Anmeldung ${stadt.name}`,
      `Auto abmelden ${stadt.name}`,
      `Halterwechsel ${stadt.name}`,
      `i-kfz ${stadt.name}`,
      `i-kfz online ${stadt.name}`,
      `KFZ online zulassen ${stadt.name}`,
      `auto ummelden ${stadt.name} ohne termin`,
    ],
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
      a: `Nein. Mit KFZ-Docs erledigen Sie alles online — wir kümmern uns um die Behördengänge in ${stadt.name} für Sie. Kein Termin, keine Wartezeit nötig.`,
    },
    {
      q: `Wie lange dauert die KFZ Zulassung in ${stadt.name}?`,
      a: `Nach Eingang Ihrer Dokumente bearbeiten wir den Antrag innerhalb von 24 Stunden. Kunden in ${stadt.name} erhalten in der Regel bereits am nächsten Werktag ihre Bestätigung.`,
    },
    {
      q: `Was kostet die KFZ Anmeldung in ${stadt.name}?`,
      a: `Unsere Servicepauschale beginnt ab 39€ (Abmeldung). Dazu kommen die regulären Behördengebühren der Zulassungsstelle ${stadt.name}. Alle Kosten werden vorab transparent ausgewiesen.`,
    },
    {
      q: `Kann ich ein ${stadt.kfz}-Kennzeichen online beantragen?`,
      a: `Ja, wir beantragen das ${stadt.kfz}-Kennzeichen direkt bei der Zulassungsstelle ${stadt.name}. Das Kennzeichen wird Ihnen zugeschickt oder zur Abholung bereitgestellt.`,
    },
    {
      q: `Welche Dokumente brauche ich für die Zulassung in ${stadt.name}?`,
      a: `Personalausweis, Fahrzeugschein (ZB I), Fahrzeugbrief (ZB II), eVB-Nummer und SEPA-Mandat. Unser System prüft Ihre Dokumente automatisch auf Vollständigkeit — Sie sehen sofort, ob alles stimmt.`,
    },
    {
      q: `Ist der Dienst in ${stadt.name} sicher und DSGVO-konform?`,
      a: `Ja. Alle Übertragungen sind SSL-verschlüsselt. Ihre Daten werden ausschließlich nach deutschen Datenschutzstandards (DSGVO) verarbeitet und nach Abschluss des Vorgangs gelöscht.`,
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
    description: `KFZ Zulassung ${stadt.name} online — ${stadt.kfz}-Kennzeichen ohne Termin`,
    url: `https://kfz.qr-docs.de/${stadt.slug}`,
    areaServed: stadt.name,
    priceRange: "ab 39€",
    image: "https://kfz.qr-docs.de/logo.svg",
    address: {
      "@type": "PostalAddress",
      addressLocality: stadt.name,
      addressRegion: stadt.bundesland,
      addressCountry: "DE",
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: "https://kfz.qr-docs.de" },
      { "@type": "ListItem", position: 2, name: `KFZ Zulassung ${stadt.name}`, item: `https://kfz.qr-docs.de/${stadt.slug}` },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Sticky CTA Bar */}
      <div className="sticky top-0 z-50 bg-[#2563eb] text-white py-2.5 px-4 shadow-md">
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
          <Link href="/">
            <Image src="/logo.svg" alt="KFZ-Docs Logo" width={220} height={48} style={{ objectFit: "contain" }} priority />
          </Link>
          <Link href="/antrag" className="bg-[#2563eb] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Jetzt starten
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <div className="mb-3 text-sm text-gray-400">
          <Link href="/" className="hover:text-gray-600">Startseite</Link>
          {" › "}
          KFZ Zulassung {stadt.name}
        </div>

        <h1 className="text-4xl font-bold text-[#111111] mb-4">
          KFZ Zulassung {stadt.name} online — {stadt.kfz}-Kennzeichen ohne Termin
        </h1>
        <p className="text-xl text-gray-500 mb-6">
          Fahrzeug in {stadt.name} anmelden, abmelden oder Halterwechsel —
          komplett online, ohne Warteschlange bei der Zulassungsstelle.
        </p>

        

        {/* Trust Badges */}
        <div className="flex flex-wrap gap-2 mb-10">
          {[
            { icon: <Lock size={12} />,        label: "SSL-verschlüsselt" },
            { icon: <Shield size={12} />,      label: "DSGVO-konform" },
            { icon: <CheckCircle size={12} />, label: "Geprüfter Service" },
            { icon: <CreditCard size={12} />,  label: "Sicher bezahlen mit Stripe" },
            { icon: <Clock size={12} />,       label: "24h Service" },
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

        {/* Kennzeichen-Info Box */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-14 flex items-start gap-4">
          <div className="shrink-0 bg-[#2563eb] text-white font-bold text-lg rounded-lg px-3 py-1.5 tracking-wide">
            {stadt.kfz}
          </div>
          <div>
            <div className="font-bold text-[#111111] mb-1 text-sm">
              Das {stadt.kfz}-Kennzeichen für {stadt.name}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              In {stadt.name} erhalten Sie das <strong>{stadt.kfz}</strong>-Kennzeichen.
              Dieses wird direkt bei der zuständigen Zulassungsstelle {stadt.name} für Sie beantragt —
              ohne dass Sie persönlich erscheinen müssen.
            </p>
          </div>
        </div>

        {/* Vorteile */}
        <div className="grid sm:grid-cols-3 gap-6 mb-14">
          {[
            { icon: <Zap size={22} />,    titel: "24h Service",     text: `Anmeldung in ${stadt.name} innerhalb von 24 Stunden.` },
            { icon: <Clock size={22} />,  titel: "Kein Termin",     text: "Keine Wartezeiten. Kein Gang zur Zulassungsstelle." },
            { icon: <Shield size={22} />, titel: "DSGVO-konform",   text: "Sicher verschlüsselt und DSGVO-konform verarbeitet." },
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
            Die Zulassungsstelle {stadt.name} ist aktuell stark ausgelastet —
            Wartezeiten von {stadt.wartezeit} sind keine Seltenheit.
            Mit KFZ-Docs umgehen Sie dieses Problem vollständig:
            Laden Sie Ihre Dokumente bequem von zu Hause hoch, und wir kümmern uns um den Rest.
            Ihr Fahrzeug wird innerhalb von 24 Stunden zugelassen — ohne Wartezeit.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Egal ob Sie in {stadt.stadtteile} oder einem anderen Stadtteil von {stadt.name} wohnhaft sind —
            unser Service steht allen Bürgern offen.
            Das {stadt.kfz}-Kennzeichen wird direkt bei der zuständigen Zulassungsstelle {stadt.name} für Sie beantragt,
            ohne dass Sie persönlich erscheinen müssen.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Unser KI-gestütztes System prüft Ihre Dokumente automatisch auf Vollständigkeit.
            Der gesamte Prozess ist DSGVO-konform, sicher verschlüsselt und von zertifizierten
            Fachleuten begleitet. Bezahlung erfolgt sicher über Stripe.
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

        <BewertungSection stadtSlug={stadt.slug} stadtName={stadt.name} />
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
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={16} className="text-[#2563eb]" />
              <h2 className="text-lg font-bold text-[#111111]">Auch verfügbar in Ihrer Nähe:</h2>
            </div>
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



