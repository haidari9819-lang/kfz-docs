"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Search, FileCheck, Mail, Phone } from "lucide-react";

const TIMELINE = [
  {
    iconKey: "check",
    bg: "bg-green-50",
    label: "Zahlung eingegangen",
    desc: "Ihre Zahlung wurde erfolgreich verarbeitet.",
    time: "Jetzt",
    done: true,
  },
  {
    iconKey: "search",
    bg: "bg-blue-50",
    label: "KI prüft Dokumente",
    desc: "Unsere KI prüft Ihre Unterlagen auf Vollständigkeit.",
    time: "~5 Min",
    done: false,
  },
  {
    iconKey: "file",
    bg: "bg-gray-50",
    label: "Bearbeitung",
    desc: "Unser Team reicht Ihren Antrag bei der Zulassungsstelle ein.",
    time: "bis 24h",
    done: false,
  },
  {
    iconKey: "mail",
    bg: "bg-gray-50",
    label: "Erledigt — Sie erhalten eine E-Mail",
    desc: "Nach erfolgreicher Zulassung erhalten Sie die Bestätigung.",
    time: "24h",
    done: false,
  },
];

function TimelineIcon({ iconKey }: { iconKey: string }) {
  if (iconKey === "check") return <CheckCircle size={20} className="text-green-500" />;
  if (iconKey === "search") return <Search size={20} className="text-[#2563eb]" />;
  if (iconKey === "file") return <FileCheck size={20} className="text-gray-400" />;
  return <Mail size={20} className="text-gray-400" />;
}

function BestaetigungContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const displayId = sessionId
    ? sessionId.replace(/^cs_(test|live)_/, "").slice(-8).toUpperCase()
    : "—";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center">
          <Link href="/">
            <Image src="/logo.svg" alt="KFZ-Docs" width={220} height={48} style={{ objectFit: "contain" }} priority />
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Grünes Häkchen */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle size={52} className="text-green-500" strokeWidth={1.8} />
          </div>
          <h1 className="text-3xl font-bold text-[#111111] mb-3">
            Vielen Dank für Ihren Auftrag!
          </h1>
          <p className="text-gray-500 text-base max-w-sm mx-auto">
            Wir haben Ihren Antrag erhalten und beginnen sofort mit der Bearbeitung.
          </p>
        </div>

        {/* Auftragsnummer */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 text-center shadow-sm">
          <p className="text-sm text-gray-400 mb-1">Ihre Auftragsnummer</p>
          <p className="text-3xl font-bold text-[#2563eb] tracking-widest font-mono">{displayId}</p>
          {sessionId && (
            <p className="text-xs text-gray-300 mt-2 font-mono break-all">{sessionId}</p>
          )}
          <p className="text-xs text-gray-400 mt-3">Bitte notieren Sie diese Nummer für Rückfragen.</p>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          <h2 className="font-bold text-[#111111] mb-6">Was passiert als Nächstes?</h2>
          <div>
            {TIMELINE.map((item, i) => (
              <div key={item.iconKey} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.bg}`}>
                    <TimelineIcon iconKey={item.iconKey} />
                  </div>
                  {i < TIMELINE.length - 1 && (
                    <div className={`w-px ${item.done ? "bg-green-200" : "bg-gray-100"}`} style={{ height: "32px" }} />
                  )}
                </div>
                <div className="pb-6">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm text-[#111111]">{item.label}</span>
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

        {/* Kontakt */}
        <div className="bg-blue-50 rounded-2xl p-5 mb-8 flex gap-3 items-start">
          <Phone size={20} className="text-[#2563eb] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[#2563eb] mb-1">Bei Fragen erreichen Sie uns</p>
            <a href="tel:+4917680822282" className="text-lg font-bold text-[#111111] hover:text-[#2563eb] transition-colors">
              0176 80822282
            </a>
            <p className="text-xs text-blue-600 mt-1">Mo–Fr 8–18 Uhr · Außerhalb dieser Zeiten am nächsten Werktag.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 bg-[#111111] text-white font-semibold px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors text-sm">
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function BestaetigungPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#2563eb] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <BestaetigungContent />
    </Suspense>
  );
}
