"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle, Upload, X, ChevronRight, ChevronLeft,
  Car, FileText, UserCheck, Loader2, AlertCircle,
} from "lucide-react";

type Service = "anmeldung" | "abmeldung" | "halterwechsel";

const SERVICES: { id: Service; label: string; price: string; icon: React.ReactNode }[] = [
  { id: "anmeldung", label: "Anmeldung", price: "29€", icon: <Car size={28} /> },
  { id: "abmeldung", label: "Abmeldung", price: "19€", icon: <FileText size={28} /> },
  { id: "halterwechsel", label: "Halterwechsel", price: "39€", icon: <UserCheck size={28} /> },
];

function getRequiredDocs(service: Service | null): { key: string; label: string }[] {
  const base = [
    { key: "personalausweis", label: "Personalausweis" },
    { key: "fahrzeugschein", label: "Fahrzeugschein (ZB Teil I)" },
    { key: "evb", label: "eVB-Nummer (Versicherungsnachweis)" },
  ];
  if (service === "anmeldung" || service === "halterwechsel") {
    base.push({ key: "fahrzeugbrief", label: "Fahrzeugbrief (ZB Teil II)" });
  }
  if (service === "anmeldung") {
    base.push({ key: "sepa", label: "SEPA-Lastschriftmandat" });
  }
  return base;
}

const STEPS = ["Service wählen", "Dokumente", "Kontaktdaten", "Zusammenfassung"];

interface Contact {
  vorname: string; nachname: string; email: string;
  telefon: string; adresse: string; plz: string; ort: string;
}

export default function AntragPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [service, setService] = useState<Service | null>(null);
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [contact, setContact] = useState<Contact>({
    vorname: "", nachname: "", email: "",
    telefon: "", adresse: "", plz: "", ort: "",
  });
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const requiredDocs = getRequiredDocs(service);

  const canProceed = (): boolean => {
    if (step === 0) return service !== null;
    if (step === 1) return requiredDocs.every((d) => files[d.key]);
    if (step === 2) {
      return !!(contact.vorname && contact.nachname && contact.email &&
        contact.telefon && contact.adresse && contact.plz && contact.ort);
    }
    return true;
  };

  const handleFile = useCallback((key: string, file: File | null) => {
    if (file) setFiles((p) => ({ ...p, [key]: file }));
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, key: string) => {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(key, file);
  }, [handleFile]);

  const setContactField = (field: keyof Contact, value: string) =>
    setContact((p) => ({ ...p, [field]: value }));

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Antrag in DB anlegen
      setUploadProgress("Antrag wird angelegt…");
      const antragRes = await fetch("/api/antrag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service, ...contact }),
      });
      if (!antragRes.ok) throw new Error("Antrag konnte nicht angelegt werden.");
      const { antrag_id } = await antragRes.json();

      // 2. Dateien hochladen
      const fileEntries = Object.entries(files).filter(([, f]) => f !== null);
      for (let i = 0; i < fileEntries.length; i++) {
        const [typ, file] = fileEntries[i];
        setUploadProgress(`Dokument ${i + 1} von ${fileEntries.length} wird hochgeladen…`);
        const fd = new FormData();
        fd.append("file", file!);
        fd.append("antrag_id", antrag_id);
        fd.append("typ", typ);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
        if (!uploadRes.ok) throw new Error(`Upload fehlgeschlagen: ${typ}`);
      }

      // 3. Stripe Checkout Session erstellen
      setUploadProgress("Weiterleitung zur Zahlung…");
      const checkoutRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service, antrag_id }),
      });
      if (!checkoutRes.ok) throw new Error("Zahlung konnte nicht initiiert werden.");
      const { url } = await checkoutRes.json();
      window.location.href = url;

    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler. Bitte versuchen Sie es erneut.");
      setLoading(false);
      setUploadProgress("");
    }
  };

  const selectedService = SERVICES.find((s) => s.id === service);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/" className="font-bold text-lg tracking-tight">
            KFZ<span className="text-[#2563eb]">-Docs</span>
          </a>
          <span className="text-sm text-gray-400">Sicher & verschlüsselt</span>
        </div>
      </header>

      {/* Fortschrittsbalken */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-1">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-1 flex-1">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    i <= step ? "bg-[#2563eb] text-white" : "bg-gray-100 text-gray-400"
                  }`}>
                    {i < step ? <CheckCircle size={14} /> : i + 1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block truncate ${
                    i === step ? "text-[#2563eb]" : i < step ? "text-gray-700" : "text-gray-400"
                  }`}>{label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-px flex-1 mx-2 ${i < step ? "bg-[#2563eb]" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Schritt 1 */}
        {step === 0 && (
          <div>
            <h1 className="text-2xl font-bold text-[#111111] mb-2">Welchen Service benötigen Sie?</h1>
            <p className="text-gray-500 mb-8">Wählen Sie Ihren gewünschten Zulassungsservice.</p>
            <div className="grid gap-4">
              {SERVICES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setService(s.id)}
                  className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all text-left ${
                    service === s.id
                      ? "border-[#2563eb] bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      service === s.id ? "bg-[#2563eb] text-white" : "bg-gray-100 text-gray-500"
                    }`}>{s.icon}</div>
                    <div>
                      <div className="font-bold text-[#111111] text-lg">{s.label}</div>
                      <div className="text-gray-500 text-sm">Fahrzeug {s.label.toLowerCase()}</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-[#2563eb]">{s.price}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Schritt 2 */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-bold text-[#111111] mb-2">Dokumente hochladen</h1>
            <p className="text-gray-500 mb-8">Erlaubte Formate: PDF, JPG, PNG. Max. 10 MB pro Datei.</p>
            <div className="space-y-4">
              {requiredDocs.map((doc) => {
                const uploaded = files[doc.key];
                const isDragging = dragOver === doc.key;
                return (
                  <div key={doc.key}>
                    <label className="block text-sm font-medium text-[#111111] mb-2">
                      {doc.label} <span className="text-red-500">*</span>
                    </label>
                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragOver(doc.key); }}
                      onDragLeave={() => setDragOver(null)}
                      onDrop={(e) => handleDrop(e, doc.key)}
                      className={`border-2 border-dashed rounded-xl p-5 transition-colors ${
                        isDragging ? "border-[#2563eb] bg-blue-50"
                          : uploaded ? "border-green-400 bg-green-50"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      {uploaded ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CheckCircle size={20} className="text-green-500 shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-800">{uploaded.name}</p>
                              <p className="text-xs text-gray-400">{(uploaded.size / 1024).toFixed(0)} KB</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setFiles((p) => ({ ...p, [doc.key]: null }))}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center gap-2 cursor-pointer">
                          <Upload size={24} className="text-gray-400" />
                          <span className="text-sm text-gray-500">
                            Datei hierher ziehen oder{" "}
                            <span className="text-[#2563eb] font-medium">auswählen</span>
                          </span>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={(e) => handleFile(doc.key, e.target.files?.[0] ?? null)}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Schritt 3 */}
        {step === 2 && (
          <div>
            <h1 className="text-2xl font-bold text-[#111111] mb-2">Ihre Kontaktdaten</h1>
            <p className="text-gray-500 mb-8">Für die Bearbeitung und Rückmeldung benötigen wir Ihre Daten.</p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {(["vorname", "nachname"] as const).map((f) => (
                  <div key={f}>
                    <label className="block text-sm font-medium text-[#111111] mb-1 capitalize">
                      {f === "vorname" ? "Vorname" : "Nachname"} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={contact[f]}
                      onChange={(e) => setContactField(f, e.target.value)}
                      placeholder={f === "vorname" ? "Max" : "Mustermann"}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
              {([
                { key: "email", label: "E-Mail-Adresse", placeholder: "max@beispiel.de", type: "email" },
                { key: "telefon", label: "Telefonnummer", placeholder: "+49 1234 567890", type: "tel" },
                { key: "adresse", label: "Straße und Hausnummer", placeholder: "Musterstraße 1", type: "text" },
              ] as const).map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-[#111111] mb-1">
                    {f.label} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={f.type}
                    value={contact[f.key]}
                    onChange={(e) => setContactField(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                  />
                </div>
              ))}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#111111] mb-1">PLZ <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={contact.plz}
                    onChange={(e) => setContactField("plz", e.target.value)}
                    placeholder="12345"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-[#111111] mb-1">Ort <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={contact.ort}
                    onChange={(e) => setContactField("ort", e.target.value)}
                    placeholder="Musterstadt"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Schritt 4 */}
        {step === 3 && (
          <div>
            <h1 className="text-2xl font-bold text-[#111111] mb-2">Zusammenfassung & Bezahlung</h1>
            <p className="text-gray-500 mb-8">Prüfen Sie Ihre Angaben und schließen Sie den Auftrag ab.</p>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5 mb-6">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Service</h3>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#111111]">{selectedService?.label}</span>
                  <span className="text-2xl font-bold text-[#2563eb]">{selectedService?.price}</span>
                </div>
              </div>
              <hr className="border-gray-100" />
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Dokumente</h3>
                <div className="space-y-1">
                  {requiredDocs.map((doc) => (
                    <div key={doc.key} className="flex items-center gap-2 text-sm">
                      <CheckCircle size={14} className="text-green-500" />
                      <span className="text-gray-600">{doc.label}</span>
                      <span className="text-gray-400 text-xs ml-auto">{files[doc.key]?.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <hr className="border-gray-100" />
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Kontakt</h3>
                <p className="text-sm text-gray-700">{contact.vorname} {contact.nachname}</p>
                <p className="text-sm text-gray-500">{contact.email} · {contact.telefon}</p>
                <p className="text-sm text-gray-500">{contact.adresse}, {contact.plz} {contact.ort}</p>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            {loading && (
              <div className="flex items-center gap-3 bg-blue-50 text-[#2563eb] rounded-xl px-4 py-3 mb-5 text-sm">
                <Loader2 size={16} className="animate-spin shrink-0" />
                {uploadProgress}
              </div>
            )}

            <p className="text-xs text-gray-400 mb-5 text-center">
              Mit dem Klick auf "Jetzt bezahlen" stimmen Sie unseren AGB zu.
              Behördengebühren werden separat berechnet.
            </p>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-[#2563eb] text-white font-bold py-4 rounded-xl text-lg hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading
                ? <><Loader2 size={20} className="animate-spin" /> Bitte warten…</>
                : `Jetzt bezahlen — ${selectedService?.price}`
              }
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-10">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || loading}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={18} /> Zurück
          </button>
          {step < 3 && (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-2 bg-[#2563eb] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-40 transition-colors"
            >
              Weiter <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
