import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const antrag_id = formData.get("antrag_id") as string | null;
  const typ = formData.get("typ") as string | null;

  if (!file || !antrag_id || !typ) {
    return NextResponse.json({ error: "file, antrag_id und typ erforderlich" }, { status: 400 });
  }

  const supabase = getServiceClient();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePfad = `${antrag_id}/${typ}/${safeName}`;

  const bytes = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from("kfz-dokumente")
    .upload(storagePfad, bytes, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { error: dbError } = await supabase
    .from("dokumente")
    .insert({ antrag_id, typ, dateiname: file.name, storage_pfad: storagePfad });

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ pfad: storagePfad });
}
