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
const ANTRAG_FELDER_MAP: Record<string, string[]> = {
  personalausweis: ["vorname", "nachname", "adresse", "plz", "ort"],
};

export async function POST(req: NextRequest) {
  const { antrag_id, dokument_id, storage_path, dokumentTyp } = await req.json();

  if (!antrag_id || !storage_path || !dokumentTyp) {
    return NextResponse.json(
      { error: "antrag_id, storage_path und dokumentTyp erforderlich" },
      { status: 400 }
    );
  }

  const supabase = getServiceClient();

  // 1. Datei aus Supabase Storage laden
  const { data: fileData, error: downloadError } = await supabase.storage
    .from("kfz-dokumente")
    .download(storage_path);

  if (downloadError || !fileData) {
    return NextResponse.json(
      { error: `Download fehlgeschlagen: ${downloadError?.message}` },
      { status: 500 }
    );
  }

  // 2. Zu Base64 konvertieren
  const buffer = await fileData.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  const mimeType = fileData.type || "image/jpeg";

  // 3. Grok Vision aufrufen
  let kiDaten;
  try {
    kiDaten = await extrahiereDokument(base64, mimeType, dokumentTyp);
  } catch (err) {
    return NextResponse.json(
      { error: `Grok Vision Fehler: ${err instanceof Error ? err.message : "Unbekannt"}` },
      { status: 500 }
    );
  }

  // 4. KI-Daten in dokumente Tabelle speichern
  if (dokument_id) {
    await supabase
      .from("dokumente")
      .update({ ki_daten: kiDaten })
      .eq("id", dokument_id);
  }

  // 5. Relevante Felder direkt in antraege übernehmen
  const felder = ANTRAG_FELDER_MAP[dokumentTyp];
  if (felder && kiDaten) {
    const update: Record<string, string> = {};
    for (const feld of felder) {
      if (kiDaten[feld as keyof typeof kiDaten]) {
        update[feld] = kiDaten[feld as keyof typeof kiDaten] as string;
      }
    }
    if (Object.keys(update).length > 0) {
      await supabase.from("antraege").update(update).eq("id", antrag_id);
    }
  }

  return NextResponse.json({ ok: true, daten: kiDaten });
}
