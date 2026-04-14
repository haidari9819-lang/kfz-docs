import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(req: NextRequest) {
  if (req.headers.get("x-admin-password") !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pfad = req.nextUrl.searchParams.get("pfad");
  if (!pfad) {
    return NextResponse.json({ error: "pfad fehlt" }, { status: 400 });
  }

  const supabase = getServiceClient();
  const { data, error } = await supabase.storage
    .from("kfz-dokumente")
    .createSignedUrl(pfad, 60); // 60 Sekunden gültig

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Fehler" }, { status: 500 });
  }

  return NextResponse.json({ url: data.signedUrl });
}
