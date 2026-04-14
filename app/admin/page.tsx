"use client";

import { useState } from "react";
import { LogIn, Download, RefreshCw, Eye, EyeOff } from "lucide-react";

type Status = "ausstehend" | "in_bearbeitung" | "erledigt";

interface Antrag {
  id: string;
  name: string;
  service: string;
  status: Status;
  email: string;
  datum: string;
  dokumente: string[];
}

// Demo-Daten
const DEMO_ANTRAEGE: Antrag[] = [
  {
    id: "A7X2K9",
    name: "Max Mustermann",
    service: "Anmeldung",
    status: "ausstehend",
    email: "max@beispiel.de",
    datum: "2025-04-14 09:12",
    dokumente: ["personalausweis.pdf", "fahrzeugschein.pdf", "evb.pdf"],
  },
  {
    id: "B3M5R1",
    name: "Erika Musterfrau",
    service: "Abmeldung",
    status: "in_bearbeitung",
    email: "erika@beispiel.de",
    datum: "2025-04-14 08:45",
    dokumente: ["personalausweis.jpg", "fahrzeugschein.pdf"],
  },
  {
    id: "C9F6T4",
    name: "Hans Schmidt",
    service: "Halterwechsel",
    status: "erledigt",
    email: "hans@beispiel.de",
    datum: "2025-04-13 15:30",
    dokumente: ["personalausweis.pdf", "fahrzeugbrief.pdf", "fahrzeugschein.pdf"],
  },
];

const STATUS_CONFIG: Record<Status, { label: string; bg: string; text: string; next: Status | null }> = {
  ausstehend: { label: "Ausstehend", bg: "bg-yellow-100", text: "text-yellow-800", next: "in_bearbeitung" },
  in_bearbeitung: { label: "In Bearbeitung", bg: "bg-blue-100", text: "text-blue-800", next: "erledigt" },
  erledigt: { label: "Erledigt", bg: "bg-green-100", text: "text-green-800", next: null },
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [antraege, setAntraege] = useState<Antrag[]>(DEMO_ANTRAEGE);
  const [filter, setFilter] = useState<Status | "alle">("alle");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In Produktion: gegen ADMIN_PASSWORD env var prüfen via API Route
    if (password === "admin123") {
      setAuthed(true);
      setError("");
    } else {
      setError("Falsches Passwort.");
    }
  };

  const advanceStatus = (id: string) => {
    setAntraege((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const next = STATUS_CONFIG[a.status].next;
        return next ? { ...a, status: next } : a;
      })
    );
  };

  const filtered = filter === "alle" ? antraege : antraege.filter((a) => a.status === filter);

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 w-full max-w-sm shadow-sm">
          <div className="text-center mb-8">
            <div className="text-2xl font-bold mb-1">
              KFZ<span className="text-[#2563eb]">-Docs</span>
            </div>
            <p className="text-gray-500 text-sm">Admin-Bereich</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#111111] mb-1">Passwort</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Admin-Passwort"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-[#2563eb] text-white font-semibold py-3 rounded-xl text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <LogIn size={16} />
              Anmelden
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg tracking-tight">
              KFZ<span className="text-[#2563eb]">-Docs</span>
            </span>
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
              Admin
            </span>
          </div>
          <button
            onClick={() => setAuthed(false)}
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            Abmelden
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {(["alle", "ausstehend", "in_bearbeitung", "erledigt"] as const).map((s) => {
            const count = s === "alle" ? antraege.length : antraege.filter((a) => a.status === s).length;
            const cfg = s === "alle" ? null : STATUS_CONFIG[s];
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`bg-white rounded-xl border p-4 text-left transition-all ${
                  filter === s ? "border-[#2563eb] shadow-sm" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-2xl font-bold text-[#111111]">{count}</div>
                <div className="text-sm text-gray-500 capitalize mt-0.5">
                  {cfg ? cfg.label : "Gesamt"}
                </div>
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-[#111111]">
              Anträge {filter !== "alle" && `— ${STATUS_CONFIG[filter].label}`}
            </h2>
            <button
              onClick={() => setAntraege([...DEMO_ANTRAEGE])}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              <RefreshCw size={14} />
              Aktualisieren
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-left">
                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Datum</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Dokumente</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Aktion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                      Keine Anträge gefunden.
                    </td>
                  </tr>
                ) : (
                  filtered.map((antrag) => {
                    const cfg = STATUS_CONFIG[antrag.status];
                    return (
                      <tr key={antrag.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-[#2563eb]">
                          {antrag.id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-[#111111]">{antrag.name}</div>
                          <div className="text-xs text-gray-400">{antrag.email}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{antrag.service}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">
                          {antrag.datum}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {antrag.dokumente.map((dok) => (
                              <button
                                key={dok}
                                title={`Download: ${dok}`}
                                className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded-lg text-xs transition-colors"
                              >
                                <Download size={10} />
                                {dok.split(".")[0]}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {cfg.next ? (
                            <button
                              onClick={() => advanceStatus(antrag.id)}
                              className="text-xs bg-[#2563eb] text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                            >
                              → {STATUS_CONFIG[cfg.next].label}
                            </button>
                          ) : (
                            <span className="text-xs text-gray-300">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
