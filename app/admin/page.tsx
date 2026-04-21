"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LogIn, Download, RefreshCw, Eye, EyeOff,
  Settings, Loader2, AlertCircle, FileText,
  ChevronDown, ChevronUp, Copy, Check,
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
  // SEPA
  sepa_kontoinhaber: string | null;
  sepa_iban: string | null;
  sepa_bic: string | null;
  sepa_kreditinstitut: string | null;
  sepa_adresse: string | null;
  sepa_unterschrift_url: string | null;
  sepa_mandat_datum: string | null;
  agb_akzeptiert: boolean | null;
  vollmacht_erteilt: boolean | null;
  datenschutz_akzeptiert: boolean | null;
}

const STATUS_CONFIG: Record<Status, { label: string; bg: string; text: string; next: Status | null }> = {
  ausstehend:    { label: "Ausstehend",     bg: "bg-yellow-100", text: "text-yellow-800", next: "in_bearbeitung" },
  in_bearbeitung:{ label: "In Bearbeitung", bg: "bg-blue-100",   text: "text-blue-800",   next: "erledigt" },
  erledigt:      { label: "Erledigt",       bg: "bg-green-100",  text: "text-green-800",  next: null },
};

const SERVICE_LABELS: Record<string, string> = {
  anmeldung: "Anmeldung",
  abmeldung: "Abmeldung",
  halterwechsel: "Halterwechsel",
};

function formatIBAN(iban: string) {
  return iban.match(/.{1,4}/g)?.join(" ") ?? iban;
}

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

  // Welche Zeile hat das SEPA-Panel offen
  const [expandedSepa, setExpandedSepa] = useState<string | null>(null);
  // Zeige Unterschrift-Modal
  const [sigModal, setSigModal] = useState<string | null>(null);
  // IBAN kopiert-Feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadAntraege = useCallback(async (pw: string) => {
    setDataLoading(true);
    setDataError("");
    try {
      const res = await fetch("/api/admin/antraege", {
        headers: { "x-admin-password": pw },
      });
      if (!res.ok) throw new Error("Fehler beim Laden");
      setAntraege(await res.json());
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
    const res = await fetch("/api/admin/antraege", {
      headers: { "x-admin-password": password },
    });
    if (res.ok) {
      setAntraege(await res.json());
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

  const downloadPdf = (endpoint: string, filename: string) => {
    fetch(endpoint, { headers: { "x-admin-password": password } })
      .then((r) => r.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      });
  };

  const copyIBAN = (iban: string, id: string) => {
    navigator.clipboard.writeText(iban);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = filter === "alle" ? antraege : antraege.filter((a) => a.status === filter);

  // ── Login ────────────────────────────────────────────────────────────────
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

  // ── Dashboard ────────────────────────────────────────────────────────────
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
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-400">Keine Anträge gefunden.</td>
                    </tr>
                  ) : filtered.map((antrag) => {
                    const cfg = STATUS_CONFIG[antrag.status];
                    const sepaOpen = expandedSepa === antrag.id;
                    const hasSepa = !!antrag.sepa_iban;

                    return (
                      <>
                        <tr key={antrag.id} className="hover:bg-gray-50 transition-colors border-b border-gray-50">
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
                              {cfg.next && (
                                <button
                                  onClick={() => advanceStatus(antrag)}
                                  disabled={updatingId === antrag.id}
                                  className="text-xs bg-[#2563eb] text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 whitespace-nowrap flex items-center gap-1"
                                >
                                  {updatingId === antrag.id
                                    ? <Loader2 size={12} className="animate-spin" />
                                    : `→ ${STATUS_CONFIG[cfg.next].label}`}
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  downloadPdf(
                                    `/api/admin/vollmacht?id=${antrag.id}`,
                                    `Vollmacht_${antrag.vorname}_${antrag.nachname}.pdf`
                                  )
                                }
                                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1"
                              >
                                <FileText size={11} /> Vollmacht
                              </button>
                              {hasSepa && (
                                <button
                                  onClick={() => setExpandedSepa(sepaOpen ? null : antrag.id)}
                                  className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1"
                                >
                                  {sepaOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                                  SEPA
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>

                        {/* ── SEPA-Detail-Panel ──────────────────────────── */}
                        {sepaOpen && hasSepa && (
                          <tr key={`${antrag.id}-sepa`}>
                            <td colSpan={7} className="bg-blue-50 border-b border-blue-100 px-6 py-5">
                              <div className="max-w-2xl">
                                <div className="flex items-center justify-between mb-3">
                                  <h3 className="font-bold text-[#111111] text-sm">SEPA-Lastschriftmandat</h3>
                                  <button
                                    onClick={() =>
                                      downloadPdf(
                                        `/api/admin/sepa-pdf/${antrag.id}`,
                                        `SEPA-Mandat_${antrag.id}.pdf`
                                      )
                                    }
                                    className="flex items-center gap-1.5 text-xs bg-[#2563eb] text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                                  >
                                    <Download size={11} /> SEPA-PDF
                                  </button>
                                </div>

                                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm mb-4">
                                  <div>
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">Kontoinhaber</span>
                                    <p className="font-medium text-[#111111]">{antrag.sepa_kontoinhaber}</p>
                                  </div>
                                  <div>
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">IBAN</span>
                                    <div className="flex items-center gap-2">
                                      <p className="font-mono font-medium text-[#111111]">
                                        {formatIBAN(antrag.sepa_iban!)}
                                      </p>
                                      <button
                                        onClick={() => copyIBAN(antrag.sepa_iban!, antrag.id)}
                                        title="IBAN kopieren"
                                        className="text-gray-400 hover:text-[#2563eb] transition-colors"
                                      >
                                        {copiedId === antrag.id
                                          ? <Check size={13} className="text-green-500" />
                                          : <Copy size={13} />}
                                      </button>
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">BIC</span>
                                    <p className="text-[#111111]">{antrag.sepa_bic || "—"}</p>
                                  </div>
                                  <div>
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">Bank</span>
                                    <p className="text-[#111111]">{antrag.sepa_kreditinstitut}</p>
                                  </div>
                                  <div>
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">Adresse</span>
                                    <p className="text-[#111111]">{antrag.sepa_adresse}</p>
                                  </div>
                                  <div>
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">Erteilt am</span>
                                    <p className="text-[#111111]">
                                      {antrag.sepa_mandat_datum
                                        ? new Date(antrag.sepa_mandat_datum).toLocaleString("de-DE", {
                                            day: "2-digit", month: "2-digit", year: "numeric",
                                            hour: "2-digit", minute: "2-digit",
                                          })
                                        : "—"}
                                    </p>
                                  </div>
                                </div>

                                {/* Zustimmungen */}
                                <div className="flex flex-wrap gap-3 mb-4">
                                  {[
                                    [antrag.agb_akzeptiert,         "AGB akzeptiert"],
                                    [antrag.vollmacht_erteilt,      "Vollmacht erteilt"],
                                    [antrag.datenschutz_akzeptiert, "Datenschutz akzeptiert"],
                                  ].map(([val, label]) => (
                                    <span
                                      key={String(label)}
                                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                        val ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                                      }`}
                                    >
                                      {val ? "✅" : "❌"} {String(label)}
                                    </span>
                                  ))}
                                </div>

                                {/* Unterschrift */}
                                {antrag.sepa_unterschrift_url && (
                                  <div>
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">Unterschrift</span>
                                    <div className="mt-1 flex gap-2">
                                      <button
                                        onClick={() => setSigModal(antrag.id)}
                                        className="text-xs bg-white border border-gray-200 hover:border-gray-300 text-gray-600 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                                      >
                                        <Eye size={11} /> Anzeigen
                                      </button>
                                      <button
                                        onClick={() =>
                                          downloadDokument(
                                            antrag.sepa_unterschrift_url!,
                                            `Unterschrift_${antrag.id}.png`
                                          )
                                        }
                                        className="text-xs bg-white border border-gray-200 hover:border-gray-300 text-gray-600 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                                      >
                                        <Download size={11} /> Download
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Unterschrift-Modal */}
      {sigModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSigModal(null)}
        >
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#111111]">Digitale Unterschrift</h3>
              <button onClick={() => setSigModal(null)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
            </div>
            <SignaturePreview
              path={antraege.find((a) => a.id === sigModal)?.sepa_unterschrift_url ?? ""}
              password={password}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/** Lädt die Unterschrift-URL via Admin-Dokument-Endpoint und zeigt sie als <img> */
function SignaturePreview({ path, password }: { path: string; password: string }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!path) return;
    fetch(`/api/admin/dokument?pfad=${encodeURIComponent(path)}`, {
      headers: { "x-admin-password": password },
    })
      .then((r) => r.json())
      .then((d) => setUrl(d.url))
      .catch(() => null);
  }, [path, password]);

  if (!url) return <div className="flex justify-center py-8"><Loader2 size={24} className="animate-spin text-gray-300" /></div>;
  return <img src={url} alt="Unterschrift" className="w-full border border-gray-100 rounded-xl" />;
}
