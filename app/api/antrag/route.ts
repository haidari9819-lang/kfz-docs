import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Schritt 1: Draft-Antrag anlegen — nur service + status
export async function POST(req: NextRequest) {
  const { service } = await req.json();

  if (!service) {
    return NextResponse.json({ error: "service erforderlich" }, { status: 400 });
  }

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("antraege")
    .insert({ service, status: "ausstehend" })
    .select("id")
    .single();

  if (error || !data) {
    console.error("ANTRAG INSERT FEHLER:", JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: error?.message ?? "DB-Fehler" },
      { status: 500 }
    );
  }

  return NextResponse.json({ antrag_id: data.id });
}
