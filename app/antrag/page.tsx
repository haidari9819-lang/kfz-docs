"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Upload, X, ChevronRight, ChevronLeft, Car, FileText, UserCheck } from "lucide-react";

type Service = "anmeldung" | "abmeldung" | "halterwechsel";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

interface FormData {
  service: Service | null;
  files: Record<string, UploadedFile | null>;
  contact: {
    vorname: string;
    nachname: string;
    email: string;
    telefon: string;
    adresse: string;
    plz: string;
    ort: string;
  };
}

const SERVICES: { id: Service; label: string; price: number; icon: React.ReactNode }[] = [
  { id: "anmeldung", label: "Anmeldung", price: 29, icon: <Car size={28} /> },
  { id: "abmeldung", label: "Abmeldung", price: 19, icon: <FileText size={28} /> },
  { id: "halterwechsel", label: "Halterwechsel", price: 39, icon: <UserCheck size={28} /> },
];

function getRequiredDocs(service: Service | null): { key: string; label: string; required: boolean }[] {
  const base = [
    { key: "personalausweis", label: "Personalausweis", required: true },
    { key: "fahrzeugschein", label: "Fahrzeugschein (Zulassungsbescheinigung Teil I)", required: true },
    { key: "evb", label: "eVB-Nummer (Versicherungsnachweis)", required: true },
  ];
  if (service === "anmeldung" || service === "halterwechsel") {
    base.push({ key: "fahrzeugbrief", label: "Fahrzeugbrief (Zulassungsbescheinigung Teil II)", required: true });
  }
  if (service === "anmeldung") {
    base.push({ key: "sepa", label: "SEPA-Lastschriftmandat", required: true });
  }
  return base;
}

const STEPS = ["Service wählen", "Dokumente", "Kontaktdaten", "Zusammenfassung"];

export default function AntragPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({
    service: null,
    files: {},
    contact: {
      vorname: "",
      nachname: "",
      email: "",
      telefon: "",
      adresse: "",
      plz: "",
      ort: "",
    },
  });

  const selectedService = SERVICES.find((s) => s.id === form.service);
  const requiredDocs = getRequiredDocs(form.service);

  const canProceed = (): boolean => {
    if (step === 0) return form.service !== null;
    if (step === 1) {
      return requiredDocs.every((doc) => !doc.required || form.files[doc.key]);
    }
    if (step === 2) {
      const c = form.contact;
      return !!(c.vorname && c.nachname && c.email && c.telefon && c.adresse && c.plz && c.ort);
    }
    return true;
  };

  const handleFileChange = useCallback(
    (key: string, file: File | null) => {
      if (!file) return;
      setForm((prev) => ({
        ...prev,
        files: { ...prev.files, [key]: { name: file.name, size: file.size, type: file.type } },
      }));
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, key: string) => {
      e.preventDefault();
      setDragOver(null);
      const file = e.dataTransfer.files[0];
      if (file) handleFileChange(key, file);
    },
    [handleFileChange]
  );

  const handleCheckout = async () => {
    setLoading(true);
    // Auftragsnummer generieren und weiterleiten
    const orderId = Math.random().toString(36).substring(2, 10).toUpperCase();
    // In Produktion: Stripe Checkout Session erstellen
    setTimeout(() => {
      router.push(`/bestaetigung?order=${orderId}&service=${form.service}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/" className="font-bold text-lg tracking-tight">
            KFZ<span className="text-[#2563eb]">-Docs</span>
          </a>
          <span className="text-sm text-gray-400">Sicher & verschlüsselt</span>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-1">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-1 flex-1">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      i < step
                        ? "bg-[#2563eb] text-white"
                        : i === step
                        ? "bg-[#2563eb] text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {i < step ? <CheckCircle size={14} /> : i + 1}
                  </div>
                  <span
                    className={`text-xs font-medium hidden sm:block truncate ${
                      i === step ? "text-[#2563eb]" : i < step ? "text-gray-700" : "text-gray-400"
                    }`}
                  >
                    {label}
                  </span>
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
        {/* Schritt 1: Service wählen */}
        {step === 0 && (
          <div>
            <h1 className="text-2xl font-bold text-[#111111] mb-2">Welchen Service benötigen Sie?</h1>
            <p className="text-gray-500 mb-8">Wählen Sie Ihren gewünschten Zulassungsservice.</p>
            <div className="grid gap-4">
              {SERVICES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setForm((prev) => ({ ...prev, service: s.id }))}
                  className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all text-left ${
                    form.service === s.id
                      ? "border-[#2563eb] bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        form.service === s.id ? "bg-[#2563eb] text-white" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {s.icon}
                    </div>
                    <div>
                      <div className="font-bold text-[#111111] text-lg">{s.label}</div>
                      <div className="text-gray-500 text-sm">Fahrzeug {s.label.toLowerCase()}</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-[#2563eb]">{s.price}€</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Schritt 2: Dokumente hochladen */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-bold text-[#111111] mb-2">Dokumente hochladen</h1>
            <p className="text-gray-500 mb-8">
              Laden Sie alle erforderlichen Dokumente hoch. Erlaubte Formate: PDF, JPG, PNG.
            </p>
            <div className="space-y-4">
              {requiredDocs.map((doc) => {
                const uploaded = form.files[doc.key];
                const isDragging = dragOver === doc.key;
                return (
                  <div key={doc.key}>
                    <label className="block text-sm font-medium text-[#111111] mb-2">
                      {doc.label}
                      {doc.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragOver(doc.key); }}
                      onDragLeave={() => setDragOver(null)}
                      onDrop={(e) => handleDrop(e, doc.key)}
                      className={`border-2 border-dashed rounded-xl p-5 transition-colors ${
                        isDragging
                          ? "border-[#2563eb] bg-blue-50"
                          : uploaded
                          ? "border-green-400 bg-green-50"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      {uploaded ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CheckCircle size={20} className="text-green-500 shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-800">{uploaded.name}</p>
                              <p className="text-xs text-gray-400">
                                {(uploaded.size / 1024).toFixed(0)} KB
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                files: { ...prev.files, [doc.key]: null },
                              }))
                            }
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
                            onChange={(e) => handleFileChange(doc.key, e.target.files?.[0] ?? null)}
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

        {/* Schritt 3: Kontaktdaten */}
        {step === 2 && (
          <div>
            <h1 className="text-2xl font-bold text-[#111111] mb-2">Ihre Kontaktdaten</h1>
            <p className="text-gray-500 mb-8">Für die Bearbeitung und Rückmeldung benötigen wir Ihre Daten.</p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {(
                  [
                    { key: "vorname", label: "Vorname", placeholder: "Max" },
                    { key: "nachname", label: "Nachname", placeholder: "Mustermann" },
                  ] as const
                ).map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-[#111111] mb-1">
                      {field.label} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={form.contact[field.key]}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, [field.key]: e.target.value },
                        }))
                      }
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
              {(
                [
                  { key: "email", label: "E-Mail-Adresse", placeholder: "max@beispiel.de", type: "email" },
                  { key: "telefon", label: "Telefonnummer", placeholder: "+49 1234 567890", type: "tel" },
                  { key: "adresse", label: "Straße und Hausnummer", placeholder: "Musterstraße 1", type: "text" },
                ] as const
              ).map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-[#111111] mb-1">
                    {field.label} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form.contact[field.key]}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        contact: { ...prev.contact, [field.key]: e.target.value },
                      }))
                    }
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                  />
                </div>
              ))}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#111111] mb-1">
                    PLZ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="12345"
                    value={form.contact.plz}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        contact: { ...prev.contact, plz: e.target.value },
                      }))
                    }
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-[#111111] mb-1">
                    Ort <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Musterstadt"
                    value={form.contact.ort}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        contact: { ...prev.contact, ort: e.target.value },
                      }))
                    }
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Schritt 4: Zusammenfassung */}
        {step === 3 && (
          <div>
            <h1 className="text-2xl font-bold text-[#111111] mb-2">Zusammenfassung & Bezahlung</h1>
            <p className="text-gray-500 mb-8">Prüfen Sie Ihre Angaben und schließen Sie den Auftrag ab.</p>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5 mb-6">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Service</h3>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#111111]">{selectedService?.label}</span>
                  <span className="text-2xl font-bold text-[#2563eb]">{selectedService?.price}€</span>
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
                    </div>
                  ))}
                </div>
              </div>
              <hr className="border-gray-100" />
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Kontakt</h3>
                <p className="text-sm text-gray-700">
                  {form.contact.vorname} {form.contact.nachname}
                </p>
                <p className="text-sm text-gray-500">{form.contact.email}</p>
                <p className="text-sm text-gray-500">{form.contact.telefon}</p>
                <p className="text-sm text-gray-500">
                  {form.contact.adresse}, {form.contact.plz} {form.contact.ort}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-400 mb-5 text-center">
              Mit dem Klick auf "Jetzt bezahlen" stimmen Sie unseren AGB zu.
              Behördengebühren werden separat berechnet.
            </p>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-[#2563eb] text-white font-bold py-4 rounded-xl text-lg hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Weiterleitung...
                </>
              ) : (
                <>Jetzt bezahlen — {selectedService?.price}€</>
              )}
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-10">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={18} />
            Zurück
          </button>
          {step < 3 && (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-2 bg-[#2563eb] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-40 transition-colors"
            >
              Weiter
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
