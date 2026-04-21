import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const {
    vorname, nachname, email, telefon, adresse, plz, ort,
    evb_nummer,
    kennzeichen, sicherheitscode_vorne, sicherheitscode_hinten,
    sepaData,
  } = body;

  if (!id) {
    return NextResponse.json({ error: "id erforderlich" }, { status: 400 });
  }

  const supabase = getServiceClient();

  // Unterschrift als PNG in Storage hochladen
  let unterschriftUrl: string | null = null;
  if (sepaData?.unterschriftBase64) {
    const base64 = (sepaData.unterschriftBase64 as string).replace(
      /^data:image\/png;base64,/,
      ""
    );
    const buffer = Buffer.from(base64, "base64");
    const sigPath = `signatures/${id}.png`;
    const { error: sigError } = await supabase.storage
      .from("kfz-dokumente")
      .upload(sigPath, buffer, { contentType: "image/png", upsert: true });

    if (!sigError) {
      unterschriftUrl = sigPath;
    }
  }

  const update: Record<string, unknown> = {
    vorname:               vorname               ?? "",
    nachname:              nachname              ?? "",
    email:                 email                 ?? "",
    telefon:               telefon               ?? "",
    strasse:               adresse               ?? "",
    plz:                   plz                   ?? "",
    ort:                   ort                   ?? "",
    evb_nummer:            evb_nummer            ?? null,
    kennzeichen:           kennzeichen           ?? null,
    sicherheitscode_vorne: sicherheitscode_vorne ?? null,
    sicherheitscode_hinten:sicherheitscode_hinten ?? null,
  };

  // SEPA-Felder nur eintragen wenn vorhanden
  if (sepaData) {
    update.sepa_kontoinhaber  = `${sepaData.vorname ?? ""} ${sepaData.nachname ?? ""}`.trim();
    update.sepa_iban          = (sepaData.iban as string).replace(/\s/g, "");
    update.sepa_bic           = sepaData.bic           ?? null;
    update.sepa_kreditinstitut= sepaData.kreditinstitut ?? null;
    update.sepa_adresse       = `${sepaData.strasse ?? ""}, ${sepaData.plz ?? ""} ${sepaData.ort ?? ""}`.trim();
    update.sepa_unterschrift_url = unterschriftUrl;
    update.sepa_mandat_datum  = sepaData.mandatErteiltAm ?? new Date().toISOString();
    update.agb_akzeptiert     = sepaData.agbAkzeptiert     ?? false;
    update.vollmacht_erteilt  = sepaData.vollmachtErteilt  ?? false;
    update.datenschutz_akzeptiert = sepaData.datenschutzAkzeptiert ?? false;
  }

  const { error } = await supabase.from("antraege").update(update).eq("id", id);

  if (error) {
    console.error("ANTRAG PATCH FEHLER:", JSON.stringify(error, null, 2));
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
