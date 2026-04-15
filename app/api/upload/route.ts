import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { extrahiereDokument } from "@/lib/grok";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Felder aus Personalausweis direkt in antraege übernehmen
// Format: [ki_daten Feld, DB Spalte] — DB heißt "strasse", Frontend "adresse"
const ANTRAG_FELDER_MAP: Record<string, [string, string][]> = {
  personalausweis: [
    ["vorname",  "vorname"],
    ["nachname", "nachname"],
    ["adresse",  "strasse"],   // ki_daten.adresse → DB strasse
    ["plz",      "plz"],
    ["ort",      "ort"],
  ],
};

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const antrag_id = formData.get("antrag_id") as string | null;
  const typ = formData.get("typ") as string | null;

  if (!file || !antrag_id || !typ) {
    return NextResponse.json(
      { error: "file, antrag_id und typ erforderlich" },
      { status: 400 }
    );
  }

  const supabase = getServiceClient();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePfad = `${antrag_id}/${typ}/${safeName}`;

  const bytes = await file.arrayBuffer();

  // 1. In Supabase Storage hochladen
  const { error: uploadError } = await supabase.storage
    .from("kfz-dokumente")
    .upload(storagePfad, bytes, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  // 2. Eintrag in dokumente Tabelle
  const { data: dokument, error: dbError } = await supabase
    .from("dokumente")
    .insert({ antrag_id, typ, dateiname: file.name, storage_pfad: storagePfad })
    .select("id")
    .single();

  if (dbError || !dokument) {
    return NextResponse.json({ error: dbError?.message ?? "DB Fehler" }, { status: 500 });
  }

  // 3. Grok Vision — automatisch Felder extrahieren
  let kiDaten = null;
  if (process.env.XAI_API_KEY) {
    try {
      const base64 = Buffer.from(bytes).toString("base64");
      const mimeType = file.type || "image/jpeg";

      kiDaten = await extrahiereDokument(base64, mimeType, typ);

      // KI-Daten im dokument speichern
      await supabase
        .from("dokumente")
        .update({ ki_daten: kiDaten })
        .eq("id", dokument.id);

      // Relevante Felder direkt in antraege übernehmen
      const felder = ANTRAG_FELDER_MAP[typ];
      if (felder && kiDaten) {
        const update: Record<string, string> = {};
        for (const [kiField, dbField] of felder) {
          const wert = kiDaten[kiField as keyof typeof kiDaten];
          if (wert) update[dbField] = wert as string;
        }
        if (Object.keys(update).length > 0) {
          await supabase.from("antraege").update(update).eq("id", antrag_id);
        }
      }
    } catch {
      // Vision-Fehler nicht blockierend — Upload war erfolgreich
      kiDaten = null;
    }
  }

  return NextResponse.json({ pfad: storagePfad, dokument_id: dokument.id, ki_daten: kiDaten });
}
