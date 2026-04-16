"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import {
  CheckCircle, Upload, X, ChevronRight, ChevronLeft,
  Car, FileText, UserCheck, Loader2, AlertCircle, Sparkles, Info,
} from "lucide-react";

type Service = "anmeldung" | "abmeldung" | "halterwechsel";

const SERVICES: { id: Service; label: string; price: string; icon: React.ReactNode }[] = [
  { id: "anmeldung",    label: "Anmeldung",    price: "29€", icon: <Car size={28} /> },
  { id: "abmeldung",   label: "Abmeldung",    price: "19€", icon: <FileText size={28} /> },
  { id: "halterwechsel",label: "Halterwechsel",price: "39€", icon: <UserCheck size={28} /> },
];

interface DocDef { key: string; label: string; optional?: boolean }

function getRequiredDocs(service: Service | null): DocDef[] {
  const base: DocDef[] = [
    { key: "personalausweis", label: "Personalausweis" },
    { key: "fahrzeugschein",  label: "Fahrzeugschein (ZB Teil I)" },
  ];
  if (service === "anmeldung") {
    base.push({ key: "evb",           label: "eVB-Nummer (Versicherungsnachweis)", optional: true });
    base.push({ key: "fahrzeugbrief", label: "Fahrzeugbrief (ZB Teil II)" });
    base.push({ key: "sepa",          label: "SEPA-Lastschriftmandat" });
  }
  if (service === "halterwechsel") {
    base.push({ key: "evb",           label: "eVB-Nummer (Versicherungsnachweis)" });
    base.push({ key: "fahrzeugbrief", label: "Fahrzeugbrief (ZB Teil II)" });
  }
  return base;
}

// Info-Tooltip Komponente
function InfoButton({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative inline-flex" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-gray-400 hover:text-[#2563eb] transition-colors ml-1 align-middle"
        aria-label="Info"
      >
        <Info size={14} />
      </button>
      {open && (
        <div className="absolute z-50 left-6 top-0 w-72 bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs text-gray-600 leading-relaxed">
          {text}
        </div>
      )}
    </div>
  );
}

const STEPS = ["Service wählen", "Dokumente", "Kontaktdaten", "Zusammenfassung"];

interface Contact {
  vorname: string; nachname: string; email: string;
  telefon: string; adresse: string; plz: string; ort: string;
  evb_nummer: string;
  kennzeichen: string;
  sicherheitscode_vorne: string;
  sicherheitscode_hinten: string;
}

export default function AntragPage() {
  const [step, setStep] = useState(0);
  const [service, setService] = useState<Service | null>(null);
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [contact, setContact] = useState<Contact>({
    vorname: "", nachname: "", email: "",
    telefon: "", adresse: "", plz: "", ort: "",
    evb_nummer: "",
    kennzeichen: "",
    sicherheitscode_vorne: "",
    sicherheitscode_hinten: "",
  });
  const [dragOver, setDragOver] = useState<string | null>(null);

  // Upload & Scan State
  const [antragId, setAntragId] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState("");
  const [autoFilled, setAutoFilled] = useState<Set<string>>(new Set());
  const [scanError, setScanError] = useState<string | null>(null);

  // Checkout State
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [error, setError] = useState<string | null>(null);

  const requiredDocs = getRequiredDocs(service);

  const canProceed = (): boolean => {
    if (step === 0) return service !== null;
    if (step === 1) {
      const docsOk = requiredDocs.filter((d) => !d.optional).every((d) => files[d.key]);
      if (!docsOk) return false;
      if (service === "abmeldung") {
        return !!(contact.kennzeichen && contact.sicherheitscode_vorne && contact.sicherheitscode_hinten);
      }
      return true;
    }
    if (step === 2) {
      const base = !!(contact.vorname && contact.nachname && contact.email &&
        contact.telefon && contact.adresse && contact.plz && contact.ort);
      if (service === "anmeldung" && !files["evb"] && !contact.evb_nummer) return false;
      return base;
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

  const handleUploadAndScan = async () => {
    setScanning(true);
    setScanError(null);
    setAutoFilled(new Set());

    try {
      setScanProgress("Antrag wird vorbereitet…");
      const antragRes = await fetch("/api/antrag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service }),
      });
      const antragJson = await antragRes.json();
      if (!antragRes.ok) throw new Error(antragJson.error ?? "Antrag konnte nicht angelegt werden.");
      const { antrag_id } = antragJson;
      setAntragId(antrag_id);

      const fileEntries = Object.entries(files).filter(([, f]) => f !== null);
      const filledFields = new Set<string>();

      for (let i = 0; i < fileEntries.length; i++) {
        const [typ, file] = fileEntries[i];
        setScanProgress(`KI scannt ${i + 1} von ${fileEntries.length}: ${typ.replace("_", " ")}…`);

        const fd = new FormData();
        fd.append("file", file!);
        fd.append("antrag_id", antrag_id);
        fd.append("typ", typ);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });

        if (!uploadRes.ok) {
          const { error: uploadErr } = await uploadRes.json().catch(() => ({ error: null }));
          throw new Error(uploadErr ?? `Upload fehlgeschlagen: ${typ}`);
        }

        const { ki_daten } = await uploadRes.json();

        if (ki_daten && typ === "personalausweis") {
          const mapping: Partial<Record<keyof Contact, string>> = {
            vorname:  ki_daten.vorname,
            nachname: ki_daten.nachname,
            adresse:  ki_daten.adresse,
            plz:      ki_daten.plz,
            ort:      ki_daten.ort,
          };
          setContact((prev) => {
            const updated = { ...prev };
            for (const [field, value] of Object.entries(mapping)) {
              if (value && !prev[field as keyof Contact]) {
                updated[field as keyof Contact] = value;
                filledFields.add(field);
              }
            }
            return updated;
          });
          setAutoFilled(new Set(filledFields));
        }
      }

      setScanProgress("");
      setScanning(false);
      setStep(2);
    } catch (err) {
      setScanError(err instanceof Error ? err.message : "Fehler beim Scannen.");
      setScanning(false);
      setScanProgress("");
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      setUploadProgress("Daten werden gespeichert…");
      if (antragId) {
        const patchRes = await fetch(`/api/antrag/${antragId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(contact),
        });
        if (!patchRes.ok) {
          const { error } = await patchRes.json();
          throw new Error(error ?? "Kontaktdaten konnten nicht gespeichert werden.");
        }
      }

      setUploadProgress("Weiterleitung zur Zahlung…");
      const checkoutRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service, antrag_id: antragId }),
      });
      if (!checkoutRes.ok) throw new Error("Zahlung konnte nicht initiiert werden.");
      const { url, error: checkoutError } = await checkoutRes.json();
      if (!url) throw new Error(checkoutError ?? "Stripe URL fehlt.");
      window.location.href = url;

    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler.");
      setLoading(false);
      setUploadProgress("");
    }
  };

  const selectedService = SERVICES.find((s) => s.id === service);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/"><Image src="/logo.svg" alt="KFZ-Docs Logo" width={140} height={32} priority /></a>
          <span className="text-sm text-gray-400">Sicher &amp; verschlüsselt</span>
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

        {/* Schritt 1 — Service wählen */}
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

        {/* Schritt 2 — Dokumente hochladen */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-bold text-[#111111] mb-2">Dokumente hochladen</h1>
            <div className="flex items-center gap-2 bg-blue-50 text-[#2563eb] text-xs font-medium px-3 py-2 rounded-lg mb-6 w-fit">
              <Sparkles size={14} />
              KI erkennt Ihre Daten automatisch nach dem Upload
            </div>

            {scanError && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">
                <AlertCircle size={16} className="shrink-0" />
                {scanError}
              </div>
            )}

            <div className="space-y-4">
              {requiredDocs.map((doc) => {
                const uploaded = files[doc.key];
                const isDragging = dragOver === doc.key;
                return (
                  <div key={doc.key}>
                    <label className="block text-sm font-medium text-[#111111] mb-2">
                      {doc.label}{" "}
                      {doc.optional
                        ? <span className="text-gray-400 font-normal">(optional — oder Nummer im nächsten Schritt)</span>
                        : <span className="text-red-500">*</span>
                      }
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

              {/* Zusatzfelder nur bei Abmeldung */}
              {service === "abmeldung" && (
                <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
                  <h2 className="text-sm font-bold text-[#111111] uppercase tracking-wider text-gray-500">
                    Fahrzeugdaten
                  </h2>

                  {/* Kennzeichen */}
                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-1 flex items-center">
                      Kennzeichen <span className="text-red-500 ml-0.5">*</span>
                      <InfoButton text="Das Kennzeichen finden Sie auf Ihrem Fahrzeugschein (Feld A) oder direkt auf dem Nummernschild Ihres Fahrzeugs." />
                    </label>
                    <input
                      type="text"
                      value={contact.kennzeichen}
                      onChange={(e) => setContactField("kennzeichen", e.target.value.toUpperCase())}
                      placeholder="z.B. E-AB 1234"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent font-mono tracking-wider"
                    />
                  </div>

                  {/* Sicherheitscode Vorderseite */}
                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-1 flex items-center">
                      Sicherheitscode (Vorderseite) <span className="text-red-500 ml-0.5">*</span>
                      <InfoButton text="Den Sicherheitscode finden Sie auf der Zulassungsbescheinigung Teil I (Fahrzeugschein) — ein aufgedruckter Code, der beim Kauf abgekratzt wird. Er befindet sich unten rechts auf dem Dokument." />
                    </label>
                    <input
                      type="text"
                      value={contact.sicherheitscode_vorne}
                      onChange={(e) => setContactField("sicherheitscode_vorne", e.target.value.toUpperCase())}
                      placeholder="z.B. 123ABC"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent font-mono tracking-widest"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Zulassungsbescheinigung Teil I — unten rechts, Rubbelfeld
                    </p>
                  </div>

                  {/* Sicherheitscode Rückseite */}
                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-1 flex items-center">
                      Sicherheitscode (Rückseite / Teil II) <span className="text-red-500 ml-0.5">*</span>
                      <InfoButton text="Den Code finden Sie auf der Zulassungsbescheinigung Teil II (Fahrzeugbrief) — ebenfalls ein aufgedruckter Code unten rechts." />
                    </label>
                    <input
                      type="text"
                      value={contact.sicherheitscode_hinten}
                      onChange={(e) => setContactField("sicherheitscode_hinten", e.target.value.toUpperCase())}
                      placeholder="z.B. XYZ789"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent font-mono tracking-widest"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Zulassungsbescheinigung Teil II — unten rechts, Rubbelfeld
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Schritt 3 — Kontaktdaten */}
        {step === 2 && (
          <div>
            <h1 className="text-2xl font-bold text-[#111111] mb-2">Ihre Kontaktdaten</h1>
            {autoFilled.size > 0 && (
              <div className="flex items-center gap-2 bg-green-50 text-green-700 text-xs font-medium px-3 py-2 rounded-lg mb-6 w-fit">
                <Sparkles size={14} />
                KI hat {autoFilled.size} Felder aus dem Personalausweis ausgefüllt — bitte prüfen
              </div>
            )}
            <p className="text-gray-500 mb-8">Bitte prüfen und fehlende Felder ergänzen.</p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {(["vorname", "nachname"] as const).map((f) => (
                  <div key={f}>
                    <label className="block text-sm font-medium text-[#111111] mb-1 flex items-center gap-1">
                      {f === "vorname" ? "Vorname" : "Nachname"} <span className="text-red-500">*</span>
                      {autoFilled.has(f) && <Sparkles size={12} className="text-green-500 ml-1" />}
                    </label>
                    <input
                      type="text"
                      value={contact[f]}
                      onChange={(e) => setContactField(f, e.target.value)}
                      placeholder={f === "vorname" ? "Max" : "Mustermann"}
                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent ${
                        autoFilled.has(f) ? "border-green-300 bg-green-50" : "border-gray-200"
                      }`}
                    />
                  </div>
                ))}
              </div>
              {([
                { key: "email",   label: "E-Mail-Adresse",       placeholder: "max@beispiel.de",   type: "email" },
                { key: "telefon", label: "Telefonnummer",         placeholder: "+49 1234 567890",   type: "tel" },
                { key: "adresse", label: "Straße und Hausnummer", placeholder: "Musterstraße 1",    type: "text" },
              ] as const).map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-[#111111] mb-1 flex items-center gap-1">
                    {f.label} <span className="text-red-500">*</span>
                    {autoFilled.has(f.key) && <Sparkles size={12} className="text-green-500 ml-1" />}
                  </label>
                  <input
                    type={f.type}
                    value={contact[f.key]}
                    onChange={(e) => setContactField(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent ${
                      autoFilled.has(f.key) ? "border-green-300 bg-green-50" : "border-gray-200"
                    }`}
                  />
                </div>
              ))}
              <div className="grid grid-cols-3 gap-4">
                {(["plz", "ort"] as const).map((f) => (
                  <div key={f} className={f === "ort" ? "col-span-2" : ""}>
                    <label className="block text-sm font-medium text-[#111111] mb-1 flex items-center gap-1">
                      {f === "plz" ? "PLZ" : "Ort"} <span className="text-red-500">*</span>
                      {autoFilled.has(f) && <Sparkles size={12} className="text-green-500 ml-1" />}
                    </label>
                    <input
                      type="text"
                      value={contact[f]}
                      onChange={(e) => setContactField(f, e.target.value)}
                      placeholder={f === "plz" ? "12345" : "Musterstadt"}
                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent ${
                        autoFilled.has(f) ? "border-green-300 bg-green-50" : "border-gray-200"
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* eVB-Nummer — Anmeldung ohne evb-Dokument */}
              {service === "anmeldung" && !files["evb"] && (
                <div>
                  <label className="block text-sm font-medium text-[#111111] mb-1">
                    eVB-Nummer (Versicherungsnachweis) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={contact.evb_nummer}
                    onChange={(e) => setContactField("evb_nummer", e.target.value.toUpperCase())}
                    placeholder="z.B. A1B2C3D"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent font-mono tracking-widest"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    7-stelliger Code von Ihrer Kfz-Versicherung. Alternativ: eVB-Dokument in Schritt 2 hochladen.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Schritt 4 — Zusammenfassung */}
        {step === 3 && (
          <div>
            <h1 className="text-2xl font-bold text-[#111111] mb-2">Zusammenfassung &amp; Bezahlung</h1>
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
                  {requiredDocs.filter((d) => files[d.key]).map((doc) => (
                    <div key={doc.key} className="flex items-center gap-2 text-sm">
                      <CheckCircle size={14} className="text-green-500" />
                      <span className="text-gray-600">{doc.label}</span>
                      <span className="text-gray-400 text-xs ml-auto truncate max-w-32">{files[doc.key]?.name}</span>
                    </div>
                  ))}
                  {service === "anmeldung" && contact.evb_nummer && !files["evb"] && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle size={14} className="text-green-500" />
                      <span className="text-gray-600">eVB-Nummer</span>
                      <span className="text-gray-400 text-xs ml-auto font-mono">{contact.evb_nummer}</span>
                    </div>
                  )}
                </div>
              </div>
              <hr className="border-gray-100" />
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Kontakt</h3>
                <p className="text-sm text-gray-700">{contact.vorname} {contact.nachname}</p>
                <p className="text-sm text-gray-500">{contact.email} · {contact.telefon}</p>
                <p className="text-sm text-gray-500">{contact.adresse}, {contact.plz} {contact.ort}</p>
              </div>
              {service === "abmeldung" && (contact.kennzeichen || contact.sicherheitscode_vorne) && (
                <>
                  <hr className="border-gray-100" />
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Fahrzeugdaten</h3>
                    {contact.kennzeichen && (
                      <p className="text-sm text-gray-700">Kennzeichen: <span className="font-mono font-semibold">{contact.kennzeichen}</span></p>
                    )}
                    {contact.sicherheitscode_vorne && (
                      <p className="text-sm text-gray-500">Code Teil I: <span className="font-mono">{contact.sicherheitscode_vorne}</span></p>
                    )}
                    {contact.sicherheitscode_hinten && (
                      <p className="text-sm text-gray-500">Code Teil II: <span className="font-mono">{contact.sicherheitscode_hinten}</span></p>
                    )}
                  </div>
                </>
              )}
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
              Mit dem Klick auf &quot;Jetzt bezahlen&quot; stimmen Sie unseren AGB zu.
              Behördengebühren werden separat berechnet.
            </p>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-[#2563eb] text-white font-bold py-4 rounded-xl text-lg hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading
                ? <><Loader2 size={20} className="animate-spin" /> Bitte warten…</>
                : `Jetzt bezahlen — ${selectedService?.price}`}
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-10">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || loading || scanning}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={18} /> Zurück
          </button>

          {step === 1 && (
            <button
              onClick={handleUploadAndScan}
              disabled={!canProceed() || scanning}
              className="flex items-center gap-2 bg-[#2563eb] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-40 transition-colors"
            >
              {scanning ? (
                <><Loader2 size={16} className="animate-spin" /> {scanProgress || "KI scannt…"}</>
              ) : (
                <><Sparkles size={16} /> KI scannen &amp; weiter</>
              )}
            </button>
          )}

          {step < 3 && step !== 1 && (
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
