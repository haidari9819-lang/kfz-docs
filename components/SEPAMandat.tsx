"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import SignatureCanvas from "./SignatureCanvas";
import { formatIBAN, validateIBAN, getBankFromIBAN } from "@/lib/iban-validator";

export interface SepaData {
  vorname: string;
  nachname: string;
  strasse: string;
  plz: string;
  ort: string;
  land: string;
  iban: string;
  bic: string;
  kreditinstitut: string;
  unterschriftBase64: string;
  mandatErteiltAm: string;
  agbAkzeptiert: boolean;
  mandatAkzeptiert: boolean;
  vollmachtErteilt: boolean;
  datenschutzAkzeptiert: boolean;
}

export function isSepaValid(d: SepaData): boolean {
  return !!(
    d.vorname && d.nachname && d.strasse && d.plz && d.ort &&
    validateIBAN(d.iban) &&
    d.kreditinstitut &&
    d.unterschriftBase64 &&
    d.agbAkzeptiert && d.mandatAkzeptiert && d.vollmachtErteilt && d.datenschutzAkzeptiert
  );
}

interface Props {
  onChange: (data: SepaData) => void;
}

const EMPTY: SepaData = {
  vorname: "", nachname: "", strasse: "", plz: "", ort: "", land: "Deutschland",
  iban: "", bic: "", kreditinstitut: "", unterschriftBase64: "",
  mandatErteiltAm: new Date().toISOString(),
  agbAkzeptiert: false, mandatAkzeptiert: false,
  vollmachtErteilt: false, datenschutzAkzeptiert: false,
};

export default function SEPAMandat({ onChange }: Props) {
  const [data, setData] = useState<SepaData>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<keyof SepaData, boolean>>>({});
  const [ibanError, setIbanError] = useState("");

  function update<K extends keyof SepaData>(key: K, value: SepaData[K]) {
    setData((prev) => {
      const next = { ...prev, [key]: value };
      onChange(next);
      return next;
    });
  }

  function blur(key: keyof SepaData) {
    setTouched((p) => ({ ...p, [key]: true }));
  }

  function handleIBAN(raw: string) {
    const formatted = formatIBAN(raw);
    update("iban", formatted);
    const clean = formatted.replace(/\s/g, "");
    if (clean.length >= 22) {
      if (!validateIBAN(formatted)) {
        setIbanError("Ungültige IBAN — bitte prüfen");
      } else {
        setIbanError("");
        // BLZ als Hinweis wenn kein Kreditinstitut eingetragen
        if (!data.kreditinstitut) {
          update("kreditinstitut", getBankFromIBAN(formatted));
        }
      }
    } else {
      setIbanError("");
    }
  }

  const handleSign = useCallback((base64: string) => {
    update("unterschriftBase64", base64);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClear = useCallback(() => {
    update("unterschriftBase64", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const err = (key: keyof SepaData, msg: string) =>
    touched[key] && !data[key] ? (
      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
        <AlertCircle size={11} /> {msg}
      </p>
    ) : null;

  return (
    <div className="space-y-6 border border-gray-200 rounded-2xl p-5 bg-white mt-6">
      <h3 className="font-bold text-[#111111] text-sm uppercase tracking-wider text-gray-500">
        SEPA-Lastschriftmandat
      </h3>

      {/* Kontoinhaber */}
      <div className="grid grid-cols-2 gap-4">
        {(["vorname", "nachname"] as const).map((f) => (
          <div key={f}>
            <label className="block text-sm font-medium text-[#111111] mb-1">
              {f === "vorname" ? "Vorname" : "Nachname"} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data[f]}
              onChange={(e) => update(f, e.target.value)}
              onBlur={() => blur(f)}
              placeholder={f === "vorname" ? "Max" : "Mustermann"}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
            />
            {err(f, "Pflichtfeld")}
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-[#111111] mb-1">
          Straße und Hausnummer <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.strasse}
          onChange={(e) => update("strasse", e.target.value)}
          onBlur={() => blur("strasse")}
          placeholder="Musterstraße 1"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
        />
        {err("strasse", "Pflichtfeld")}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#111111] mb-1">
            PLZ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.plz}
            onChange={(e) => update("plz", e.target.value)}
            onBlur={() => blur("plz")}
            placeholder="45127"
            maxLength={5}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
          />
          {err("plz", "Pflichtfeld")}
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-[#111111] mb-1">
            Stadt <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.ort}
            onChange={(e) => update("ort", e.target.value)}
            onBlur={() => blur("ort")}
            placeholder="Essen"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
          />
          {err("ort", "Pflichtfeld")}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#111111] mb-1">Land</label>
        <input
          type="text"
          value={data.land}
          readOnly
          className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-500"
        />
      </div>

      {/* Bankdaten */}
      <div>
        <label className="block text-sm font-medium text-[#111111] mb-1">
          IBAN <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.iban}
          onChange={(e) => handleIBAN(e.target.value)}
          onBlur={() => blur("iban")}
          placeholder="DE12 3456 7890 1234 5678 90"
          maxLength={27}
          className={`w-full border rounded-xl px-4 py-3 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent ${
            ibanError ? "border-red-300 bg-red-50" : "border-gray-200"
          }`}
        />
        {ibanError && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <AlertCircle size={11} /> {ibanError}
          </p>
        )}
        {!ibanError && validateIBAN(data.iban) && (
          <p className="text-xs text-green-600 mt-1">✓ IBAN gültig</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#111111] mb-1">
            BIC <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={data.bic}
            onChange={(e) => update("bic", e.target.value.toUpperCase())}
            placeholder="DEUTDEDB"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#111111] mb-1">
            Kreditinstitut <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.kreditinstitut}
            onChange={(e) => update("kreditinstitut", e.target.value)}
            onBlur={() => blur("kreditinstitut")}
            placeholder="Deutsche Bank"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
          />
          {err("kreditinstitut", "Pflichtfeld")}
        </div>
      </div>

      {/* Mandat-Text */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-600 leading-relaxed space-y-2">
        <p className="font-bold text-gray-700">SEPA-Lastschriftmandat</p>
        <p>
          Ich ermächtige KFZ-Docs GmbH, Zahlungen von meinem Konto mittels Lastschrift
          einzuziehen. Zugleich weise ich mein Kreditinstitut an, die von KFZ-Docs GmbH auf
          mein Konto gezogenen Lastschriften einzulösen.
        </p>
        <p>
          <span className="font-medium">Gläubiger-ID:</span> DE12ZZZ00000XXXXX
        </p>
        <p>
          <span className="font-medium">Mandatsreferenz:</span> wird nach Auftragsbestätigung
          mitgeteilt
        </p>
      </div>

      {/* Checkboxen */}
      <div className="space-y-3">
        {[
          {
            key: "agbAkzeptiert" as const,
            label: (
              <>
                Ich habe die{" "}
                <Link href="/agb" target="_blank" className="text-[#2563eb] underline hover:no-underline">
                  AGB
                </Link>{" "}
                gelesen und stimme ihnen zu.
              </>
            ),
          },
          {
            key: "mandatAkzeptiert" as const,
            label:
              "Ich erteile das SEPA-Lastschriftmandat und bin berechtigt, über das angegebene Konto zu verfügen.",
          },
          {
            key: "vollmachtErteilt" as const,
            label:
              "Ich erteile KFZ-Docs Vollmacht, meinen Antrag bei der Zulassungsstelle einzureichen.",
          },
          {
            key: "datenschutzAkzeptiert" as const,
            label: (
              <>
                Ich habe die{" "}
                <Link href="/datenschutz" target="_blank" className="text-[#2563eb] underline hover:no-underline">
                  Datenschutzerklärung
                </Link>{" "}
                gelesen.
              </>
            ),
          },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={data[key] as boolean}
              onChange={(e) => update(key, e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-[#2563eb] focus:ring-[#2563eb] cursor-pointer"
            />
            <span className="text-sm text-gray-600 leading-relaxed">{label}</span>
          </label>
        ))}
      </div>

      {/* Digitale Unterschrift */}
      <div>
        <label className="block text-sm font-medium text-[#111111] mb-2">
          Digitale Unterschrift <span className="text-red-500">*</span>
        </label>
        <SignatureCanvas onSign={handleSign} onClear={handleClear} />
        {touched.unterschriftBase64 && !data.unterschriftBase64 && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <AlertCircle size={11} /> Bitte unterschreiben
          </p>
        )}
        {data.unterschriftBase64 && (
          <p className="text-xs text-green-600 mt-1">✓ Unterschrift vorhanden</p>
        )}
      </div>

      {/* Datum */}
      <p className="text-xs text-gray-400">
        Erteilt am: {new Date().toLocaleDateString("de-DE", {
          day: "2-digit", month: "2-digit", year: "numeric",
          hour: "2-digit", minute: "2-digit",
        })}
      </p>
    </div>
  );
}
