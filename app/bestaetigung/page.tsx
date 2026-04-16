import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Clock, Search, FileCheck, Mail } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

export const metadata: Metadata = {
  title: "Antrag eingegangen",
  description: "Ihr KFZ-Antrag wurde erfolgreich eingereicht.",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ session_id?: string; antrag_id?: string }>;
}

const SERVICE_LABELS: Record<string, string> = {
  anmeldung: "Fahrzeuganmeldung",
  abmeldung: "Fahrzeugabmeldung",
  halterwechsel: "Halterwechsel",
};

const TIMELINE = [
  { time: "Jetzt",        title: "Antrag eingegangen", desc: "Ihr Antrag wurde erfolgreich übermittelt.",                          done: true  },
  { time: "In ~5 Min",   title: "KI-Prüfung",         desc: "Unsere KI prüft Ihre Unterlagen auf Vollständigkeit.",               done: false },
  { time: "Innerhalb 2h",title: "Bearbeitung",         desc: "Unser Team reicht Ihren Antrag bei der Zulassungsstelle ein.",       done: false },
  { time: "24h",          title: "Bestätigung",        desc: "Sie erhalten die Bestätigung per E-Mail.",                           done: false },
];

const TIMELINE_ICONS = [
  <CheckCircle key="0" size={20} className="text-green-500" />,
  <Search      key="1" size={20} className="text-[#2563eb]" />,
  <FileCheck   key="2" size={20} className="text-gray-400" />,
  <Mail        key="3" size={20} className="text-gray-400" />,
];

async function getAntrag(antrag_id: string) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data } = await supabase
      .from("antraege")
      .select("service, vorname, nachname")
      .eq("id", antrag_id)
      .single();
    return data;
  } catch {
    return null;
  }
}

export default async function BestaetigungPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const antrag_id = params.antrag_id ?? "";
  // Kurze Anzeige-ID aus antrag_id ableiten (erste 8 Zeichen, Großbuchstaben)
  const displayId = antrag_id
    ? antrag_id.replace(/-/g, "").substring(0, 8).toUpperCase()
    : "UNBEKANNT";

  const antrag = antrag_id ? await getAntrag(antrag_id) : null;
  const serviceLabel = SERVICE_LABELS[antrag?.service ?? ""] ?? "KFZ-Service";
  const name = antrag ? `${antrag.vorname} ${antrag.nachname}` : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center">
          <a href="/"><Image src="/logo.svg" alt="KFZ-Docs Logo" width={140} height={32} priority /></a>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-[#111111] mb-3">Antrag eingegangen!</h1>
          <p className="text-gray-500 text-lg">
            {name ? `Danke, ${antrag?.vorname}! ` : ""}
            Wir melden uns innerhalb von 2 Stunden bei Ihnen.
          </p>
        </div>

        {/* Auftragsnummer */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 text-center">
          <p className="text-sm text-gray-400 mb-1">Ihre Auftragsnummer</p>
          <p className="text-3xl font-bold text-[#2563eb] tracking-widest font-mono">{displayId}</p>
          <p className="text-sm text-gray-400 mt-2">{serviceLabel}</p>
          <p className="text-xs text-gray-400 mt-3">Bitte notieren Sie diese Nummer für Rückfragen.</p>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <h2 className="font-bold text-[#111111] mb-6">Was passiert jetzt?</h2>
          <div className="space-y-6">
            {TIMELINE.map((item, i) => (
              <div key={item.title} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.done ? "bg-green-50" : "bg-gray-50"}`}>
                    {TIMELINE_ICONS[i]}
                  </div>
                  {i < TIMELINE.length - 1 && (
                    <div className={`w-px flex-1 mt-2 ${item.done ? "bg-green-200" : "bg-gray-100"}`} style={{ minHeight: "24px" }} />
                  )}
                </div>
                <div className="pb-4">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm text-[#111111]">{item.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${item.done ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {item.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 rounded-2xl p-5 mb-8 flex gap-3">
          <Clock size={20} className="text-[#2563eb] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[#2563eb] mb-1">Servicezeiten</p>
            <p className="text-sm text-blue-700">
              Wir bearbeiten Anträge montags bis freitags von 8–18 Uhr.
              Anträge außerhalb dieser Zeiten werden am nächsten Werktag bearbeitet.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="inline-block text-sm text-gray-500 hover:text-gray-800 transition-colors">
            ← Zurück zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
}
