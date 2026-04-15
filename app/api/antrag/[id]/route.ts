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
  const {
    vorname, nachname, email, telefon, adresse, plz, ort,
    evb_nummer,
    kennzeichen, sicherheitscode_vorne, sicherheitscode_hinten,
  } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "id erforderlich" }, { status: 400 });
  }

  const supabase = getServiceClient();
  const { error } = await supabase
    .from("antraege")
    .update({
      vorname:               vorname               ?? "",
      nachname:              nachname              ?? "",
      email:                 email                 ?? "",
      telefon:               telefon               ?? "",
      strasse:               adresse               ?? "",   // Frontend → DB Mapping
      plz:                   plz                   ?? "",
      ort:                   ort                   ?? "",
      evb_nummer:            evb_nummer            ?? null,
      kennzeichen:           kennzeichen           ?? null,
      sicherheitscode_vorne: sicherheitscode_vorne ?? null,
      sicherheitscode_hinten:sicherheitscode_hinten ?? null,
    })
    .eq("id", id);

  if (error) {
    console.error("ANTRAG PATCH FEHLER:", JSON.stringify(error, null, 2));
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
