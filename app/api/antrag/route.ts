import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Draft-Antrag anlegen (Kontaktdaten können noch leer sein)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { service, vorname, nachname, email, telefon, adresse, plz, ort } = body;

  if (!service) {
    return NextResponse.json({ error: "service erforderlich" }, { status: 400 });
  }

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("antraege")
    .insert({ service, vorname, nachname, email, telefon, adresse, plz, ort })
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Fehler" }, { status: 500 });
  }

  return NextResponse.json({ antrag_id: data.id });
}

// Kontaktdaten nachträglich aktualisieren (nach KI-Scan)
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { antrag_id, vorname, nachname, email, telefon, adresse, plz, ort } = body;

  if (!antrag_id) {
    return NextResponse.json({ error: "antrag_id erforderlich" }, { status: 400 });
  }

  const supabase = getServiceClient();
  const { error } = await supabase
    .from("antraege")
    .update({ vorname, nachname, email, telefon, adresse, plz, ort })
    .eq("id", antrag_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
