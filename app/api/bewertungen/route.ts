import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("stadt");
  if (!slug) return NextResponse.json({ error: "Kein Stadt-Slug" }, { status: 400 });
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("bewertungen")
    .select("id, sterne, name, text, erstellt_at")
    .eq("stadt_slug", slug)
    .order("erstellt_at", { ascending: false })
    .limit(20);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { stadt_slug, sterne, name, text } = body;
  if (!stadt_slug || !sterne || !name || !text)
    return NextResponse.json({ error: "Fehlende Felder" }, { status: 400 });
  if (name.length > 60 || text.length > 500)
    return NextResponse.json({ error: "Zu lang" }, { status: 400 });
  const supabase = getServiceClient();
  const { error } = await supabase
    .from("bewertungen")
    .insert({ stadt_slug, sterne, name: name.trim(), text: text.trim() });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
