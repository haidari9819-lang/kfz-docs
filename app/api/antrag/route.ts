import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { service, vorname, nachname, email, telefon, adresse, plz, ort } = body;

  if (!service || !email) {
    return NextResponse.json({ error: "service und email erforderlich" }, { status: 400 });
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
