import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import path from "path";

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

  const { searchParams } = new URL(req.url);
  const antragId = searchParams.get("id");

  if (!antragId) {
    return NextResponse.json({ error: "id fehlt" }, { status: 400 });
  }

  const supabase = getServiceClient();
  const { data: antrag, error } = await supabase
    .from("antraege")
    .select("vorname, nachname, strasse, plz, ort, service")
    .eq("id", antragId)
    .single();

  if (error || !antrag) {
    return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  }

  const templatePath = path.join(process.cwd(), "public/vollmacht-template.pdf");

  if (!existsSync(templatePath)) {
    return NextResponse.json(
      { error: "Template-PDF fehlt. Bitte vollmacht-template.pdf in public/ ablegen." },
      { status: 500 }
    );
  }

  const templateBytes = readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(templateBytes);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const page = pages[0];

  const textOpts = { font, size: 10, color: rgb(0, 0, 0) };

  // Service ankreuzen
  if (antrag.service === "anmeldung") {
    page.drawText("X", { x: 28, y: 697, ...textOpts });
  }
  if (antrag.service === "abmeldung") {
    page.drawText("X", { x: 28, y: 683, ...textOpts });
  }
  if (antrag.service === "halterwechsel") {
    page.drawText("X", { x: 28, y: 669, ...textOpts });
  }

  // Antragsteller
  page.drawText(`${antrag.vorname ?? ""} ${antrag.nachname ?? ""}`.trim(), { x: 100, y: 565, ...textOpts });
  page.drawText(antrag.strasse ?? "", { x: 100, y: 545, ...textOpts });
  page.drawText(`${antrag.plz ?? ""} ${antrag.ort ?? ""}`.trim(), { x: 100, y: 525, ...textOpts });

  // Bevollmächtigter
  page.drawText("KFZ-Docs — Mirwais Haidari", { x: 100, y: 460, ...textOpts });
  page.drawText("Alte Kirchstr. 7", { x: 100, y: 440, ...textOpts });
  page.drawText("45327 Essen", { x: 100, y: 420, ...textOpts });

  // Datum
  const heute = new Date().toLocaleDateString("de-DE");
  page.drawText(heute, { x: 100, y: 180, ...textOpts });

  const pdfBytes = await pdfDoc.save();

  const safeName = `${antrag.vorname ?? ""}_${antrag.nachname ?? ""}`.trim().replace(/\s+/g, "_");

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Vollmacht_${safeName}.pdf"`,
    },
  });
}
