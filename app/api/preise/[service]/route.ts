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
  { params }: { params: Promise<{ service: string }> }
) {
  if (req.headers.get("x-admin-password") !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { service } = await params;
  const allowed = ["anmeldung", "abmeldung", "halterwechsel"];
  if (!allowed.includes(service)) {
    return NextResponse.json({ error: "Ungültiger Service" }, { status: 400 });
  }

  const body = await req.json();
  const { name, beschreibung, betrag, aktiv } = body;

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (name !== undefined) update.name = name;
  if (beschreibung !== undefined) update.beschreibung = beschreibung;
  if (betrag !== undefined) update.betrag = Number(betrag);
  if (aktiv !== undefined) update.aktiv = Boolean(aktiv);

  const supabase = getServiceClient();
  const { error } = await supabase
    .from("preise")
    .update(update)
    .eq("service", service);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
