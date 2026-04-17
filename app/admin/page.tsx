"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LogIn, Download, RefreshCw, Eye, EyeOff,
  Settings, Loader2, AlertCircle, FileText,
} from "lucide-react";

type Status = "ausstehend" | "in_bearbeitung" | "erledigt";

interface Dokument {
  id: string;
  typ: string;
  dateiname: string;
  storage_path: string;
}

interface Antrag {
  id: string;
  vorname: string;
  nachname: string;
  email: string;
  service: string;
  status: Status;
  bezahlt: boolean;
  betrag: number | null;
  created_at: string;
  dokumente: Dokument[];
}

const STATUS_CONFIG: Record<Status, { label: string; bg: string; text: string; next: Status | null }> = {
  ausstehend:    { label: "Ausstehend",    bg: "bg-yellow-100", text: "text-yellow-800", next: "in_bearbeitung" },
  in_bearbeitung:{ label: "In Bearbeitung",bg: "bg-blue-100",   text: "text-blue-800",   next: "erledigt" },
  erledigt:      { label: "Erledigt",      bg: "bg-green-100",  text: "text-green-800",  next: null },
};

const SERVICE_LABELS: Record<string, string> = {
  anmeldung: "Anmeldung",
  abmeldung: "Abmeldung",
  halterwechsel: "Halterwechsel",
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [antraege, setAntraege] = useState<Antrag[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState("");
  const [filter, setFilter] = useState<Status | "alle">("alle");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadAntraege = useCallback(async (pw: string) => {
    setDataLoading(true);
    setDataError("");
    try {
      const res = await fetch("/api/admin/antraege", {
        headers: { "x-admin-password": pw },
      });
      if (!res.ok) throw new Error("Fehler beim Laden");
      const data = await res.json();
      setAntraege(data);
    } catch {
      setDataError("Daten konnten nicht geladen werden.");
    } finally {
      setDataLoading(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    // Prüfung via API — Passwort verlässt nie den Client ungeprüft
    const res = await fetch("/api/admin/antraege", {
      headers: { "x-admin-password": password },
    });
    if (res.ok) {
      const data = await res.json();
      setAntraege(data);
      setAuthed(true);
    } else {
      setLoginError("Falsches Passwort.");
    }
    setLoginLoading(false);
  };

  useEffect(() => {
    if (authed) loadAntraege(password);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  const advanceStatus = async (antrag: Antrag) => {
    const next = STATUS_CONFIG[antrag.status].next;
    if (!next) return;
    setUpdatingId(antrag.id);
    await fetch(`/api/admin/antraege/${antrag.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ status: next }),
    });
    setAntraege((prev) =>
      prev.map((a) => (a.id === antrag.id ? { ...a, status: next } : a))
    );
    setUpdatingId(null);
  };

  const downloadDokument = async (pfad: string, dateiname: string) => {
    const res = await fetch(
      `/api/admin/dokument?pfad=${encodeURIComponent(pfad)}`,
      { headers: { "x-admin-password": password } }
    );
    if (!res.ok) return;
    const { url } = await res.json();
    window.open(url, "_blank");
  };

  const filtered = filter === "alle" ? antraege : antraege.filter((a) => a.status === filter);

  // Login
  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 w-full max-w-sm shadow-sm">
          <div className="text-center mb-8">
            <Image src="/logo.svg" alt="KFZ-Docs Logo" width={220} height={48} style={{ objectFit: "contain" }} priority />
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
            {loginError && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle size={14} /> {loginError}
              </p>
            )}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-[#2563eb] text-white font-semibold py-3 rounded-xl text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loginLoading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
              Anmelden
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="KFZ-Docs Logo" width={200} height={44} style={{ objectFit: "contain" }} />
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/preise" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
              <Settings size={15} /> Preise
            </Link>
            <button onClick={() => { setAuthed(false); setPassword(""); }} className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
              Abmelden
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {(["alle", "ausstehend", "in_bearbeitung", "erledigt"] as const).map((s) => {
            const count = s === "alle" ? antraege.length : antraege.filter((a) => a.status === s).length;
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`bg-white rounded-xl border p-4 text-left transition-all ${
                  filter === s ? "border-[#2563eb] shadow-sm" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-2xl font-bold text-[#111111]">{count}</div>
                <div className="text-sm text-gray-500 mt-0.5">
                  {s === "alle" ? "Gesamt" : STATUS_CONFIG[s].label}
                </div>
              </button>
            );
          })}
        </div>

        {/* Tabelle */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-[#111111]">
              Anträge {filter !== "alle" && `— ${STATUS_CONFIG[filter].label}`}
            </h2>
            <button
              onClick={() => loadAntraege(password)}
              disabled={dataLoading}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors disabled:opacity-40"
            >
              <RefreshCw size={14} className={dataLoading ? "animate-spin" : ""} />
              Aktualisieren
            </button>
          </div>

          {dataError && (
            <div className="px-6 py-4 text-sm text-red-600 flex items-center gap-2">
              <AlertCircle size={14} /> {dataError}
            </div>
          )}

          {dataLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={28} className="animate-spin text-gray-300" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-left">
                    {["Datum", "Name", "Service", "Status", "Bezahlt", "Dokumente", "Aktion"].map((h) => (
                      <th key={h} className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-400">Keine Anträge gefunden.</td>
                    </tr>
                  ) : filtered.map((antrag) => {
                    const cfg = STATUS_CONFIG[antrag.status];
                    return (
                      <tr key={antrag.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-xs text-gray-400 whitespace-nowrap">
                          {new Date(antrag.created_at).toLocaleString("de-DE", {
                            day: "2-digit", month: "2-digit", year: "2-digit",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-[#111111]">{antrag.vorname} {antrag.nachname}</div>
                          <div className="text-xs text-gray-400">{antrag.email}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {SERVICE_LABELS[antrag.service] ?? antrag.service}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-semibold ${antrag.bezahlt ? "text-green-600" : "text-gray-400"}`}>
                            {antrag.bezahlt ? `✓ ${antrag.betrag ? `${antrag.betrag / 100}€` : ""}` : "Ausstehend"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {antrag.dokumente?.map((dok) => (
                              <button
                                key={dok.id}
                                onClick={() => downloadDokument(dok.storage_path, dok.dateiname)}
                                title={dok.dateiname}
                                className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded-lg text-xs transition-colors"
                              >
                                <Download size={10} />
                                {dok.typ}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1.5">
                            {cfg.next ? (
                              <button
                                onClick={() => advanceStatus(antrag)}
                                disabled={updatingId === antrag.id}
                                className="text-xs bg-[#2563eb] text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 whitespace-nowrap flex items-center gap-1"
                              >
                                {updatingId === antrag.id
                                  ? <Loader2 size={12} className="animate-spin" />
                                  : `→ ${STATUS_CONFIG[cfg.next].label}`}
                              </button>
                            ) : (
                              <span className="text-xs text-gray-300">—</span>
                            )}
                            <a
                              href={`/api/admin/vollmacht?id=${antrag.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                e.preventDefault();
                                fetch(`/api/admin/vollmacht?id=${antrag.id}`, {
                                  headers: { "x-admin-password": password },
                                })
                                  .then((r) => r.blob())
                                  .then((blob) => {
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement("a");
                                    a.href = url;
                                    a.download = `Vollmacht_${antrag.vorname}_${antrag.nachname}.pdf`;
                                    a.click();
                                    URL.revokeObjectURL(url);
                                  });
                              }}
                              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 cursor-pointer"
                            >
                              <FileText size={11} /> Vollmacht
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
