"use client";

import { useState, useEffect } from "react";
import { Save, ArrowLeft, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Preis {
  service: string;
  name: string;
  beschreibung: string;
  betrag: number;
  aktiv: boolean;
}

export default function AdminPreisePage() {
  const [preise, setPreise] = useState<Preis[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, "ok" | "error">>({});
  const [edits, setEdits] = useState<Record<string, Partial<Preis>>>({});

  useEffect(() => {
    fetch("/api/preise")
      .then((r) => r.json())
      .then((data) => {
        setPreise(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleEdit = (service: string, field: keyof Preis, value: string | number | boolean) => {
    setEdits((prev) => ({
      ...prev,
      [service]: { ...prev[service], [field]: value },
    }));
  };

  const getValue = (preis: Preis, field: keyof Preis) => {
    return edits[preis.service]?.[field] ?? preis[field];
  };

  const handleSave = async (service: string) => {
    const changes = edits[service];
    if (!changes || Object.keys(changes).length === 0) return;

    setSaving(service);
    try {
      const res = await fetch(`/api/preise/${service}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
      if (!res.ok) throw new Error();
      setFeedback((prev) => ({ ...prev, [service]: "ok" }));
      setEdits((prev) => { const next = { ...prev }; delete next[service]; return next; });
      setTimeout(() => setFeedback((prev) => { const next = { ...prev }; delete next[service]; return next; }), 3000);
    } catch {
      setFeedback((prev) => ({ ...prev, [service]: "error" }));
    } finally {
      setSaving(null);
    }
  };

  const SERVICE_LABELS: Record<string, string> = {
    anmeldung: "Anmeldung",
    abmeldung: "Abmeldung",
    halterwechsel: "Halterwechsel",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/admin" className="text-gray-400 hover:text-gray-700 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <Image src="/logo.svg" alt="KFZ-Docs Logo" width={200} height={44} style={{ objectFit: "contain" }} />
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
            Preise verwalten
          </span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <p className="text-sm text-gray-500 mb-8">
          Änderungen wirken sich sofort auf den Stripe Checkout aus — kein Redeploy nötig.
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-gray-300" />
          </div>
        ) : (
          <div className="space-y-4">
            {preise.map((preis) => {
              const hasChanges = !!(edits[preis.service] && Object.keys(edits[preis.service]).length > 0);
              const isSaving = saving === preis.service;
              const fb = feedback[preis.service];

              return (
                <div key={preis.service} className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-[#111111]">{SERVICE_LABELS[preis.service]}</h3>
                    <div className="flex items-center gap-2">
                      {fb === "ok" && (
                        <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                          <CheckCircle size={14} /> Gespeichert
                        </span>
                      )}
                      {fb === "error" && (
                        <span className="flex items-center gap-1 text-red-500 text-xs font-medium">
                          <AlertCircle size={14} /> Fehler
                        </span>
                      )}
                      <button
                        onClick={() => handleSave(preis.service)}
                        disabled={!hasChanges || isSaving}
                        className="flex items-center gap-1.5 bg-[#2563eb] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 transition-colors"
                      >
                        {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        Speichern
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Name</label>
                      <input
                        type="text"
                        value={String(getValue(preis, "name"))}
                        onChange={(e) => handleEdit(preis.service, "name", e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Beschreibung</label>
                      <input
                        type="text"
                        value={String(getValue(preis, "beschreibung"))}
                        onChange={(e) => handleEdit(preis.service, "beschreibung", e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">
                        Preis (in €)
                      </label>
                      <div className="relative w-40">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={Math.round(Number(getValue(preis, "betrag")) / 100)}
                          onChange={(e) => handleEdit(preis.service, "betrag", Math.round(parseFloat(e.target.value) * 100))}
                          className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Wird in Cent gespeichert: {Number(getValue(preis, "betrag"))} Cent
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        role="switch"
                        aria-checked={Boolean(getValue(preis, "aktiv"))}
                        onClick={() => handleEdit(preis.service, "aktiv", !getValue(preis, "aktiv"))}
                        className={`relative w-10 h-6 rounded-full transition-colors ${
                          getValue(preis, "aktiv") ? "bg-[#2563eb]" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                            getValue(preis, "aktiv") ? "translate-x-5" : "translate-x-1"
                          }`}
                        />
                      </button>
                      <span className="text-sm text-gray-600">Service aktiv</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
