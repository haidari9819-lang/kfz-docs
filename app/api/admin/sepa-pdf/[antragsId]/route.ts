import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { createClient } from "@supabase/supabase-js";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function checkAuth(req: NextRequest): boolean {
  return req.headers.get("x-admin-password") === process.env.ADMIN_PASSWORD;
}

/** Zeilenumbruch für langen Text — pdf-lib hat kein automatisches Wrapping */
function drawWrapped(
  page: ReturnType<PDFDocument["addPage"]>,
  text: string,
  opts: { x: number; y: number; maxWidth: number; size: number; font: Awaited<ReturnType<PDFDocument["embedFont"]>>; lineHeight?: number }
): number {
  const { x, y, maxWidth, size, font, lineHeight = size * 1.4 } = opts;
  const words = text.split(" ");
  let line = "";
  let curY = y;

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    const w = font.widthOfTextAtSize(test, size);
    if (w > maxWidth && line) {
      page.drawText(line, { x, y: curY, size, font, color: rgb(0, 0, 0) });
      curY -= lineHeight;
      line = word;
    } else {
      line = test;
    }
  }
  if (line) {
    page.drawText(line, { x, y: curY, size, font, color: rgb(0, 0, 0) });
    curY -= lineHeight;
  }
  return curY;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ antragsId: string }> }
) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { antragsId } = await params;
  const supabase = getServiceClient();

  const { data: antrag, error } = await supabase
    .from("antraege")
    .select("*")
    .eq("id", antragsId)
    .single();

  if (error || !antrag) {
    return NextResponse.json({ error: "Antrag nicht gefunden" }, { status: 404 });
  }

  // PDF erstellen
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const { width } = page.getSize();
  const margin = 60;
  const contentWidth = width - margin * 2;
  let y = 800;

  // ── Kopf ────────────────────────────────────────────────────────────────
  page.drawText("SEPA-LASTSCHRIFTMANDAT", {
    x: margin, y, font: bold, size: 18, color: rgb(0, 0, 0),
  });
  y -= 10;
  page.drawLine({
    start: { x: margin, y },
    end:   { x: width - margin, y },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  y -= 20;

  // ── Gläubiger ───────────────────────────────────────────────────────────
  page.drawText("Gläubiger:", { x: margin, y, font: bold, size: 10, color: rgb(0.4, 0.4, 0.4) });
  y -= 15;
  page.drawText("KFZ-Docs GmbH", { x: margin, y, font, size: 10, color: rgb(0, 0, 0) });
  y -= 13;
  page.drawText("Gläubiger-ID: DE12ZZZ00000XXXXX", { x: margin, y, font, size: 10, color: rgb(0, 0, 0) });
  y -= 13;
  page.drawText(`Mandatsreferenz: ${antrag.id}`, { x: margin, y, font, size: 10, color: rgb(0, 0, 0) });
  y -= 25;

  // ── Zahlungspflichtiger ─────────────────────────────────────────────────
  page.drawText("Zahlungspflichtiger:", { x: margin, y, font: bold, size: 10, color: rgb(0.4, 0.4, 0.4) });
  y -= 15;

  const rows: [string, string][] = [
    ["Name",          antrag.sepa_kontoinhaber ?? `${antrag.vorname} ${antrag.nachname}`],
    ["Adresse",       antrag.sepa_adresse      ?? "—"],
    ["IBAN",          antrag.sepa_iban         ?? "—"],
    ["BIC",           antrag.sepa_bic          ?? "—"],
    ["Kreditinstitut",antrag.sepa_kreditinstitut ?? "—"],
  ];

  for (const [label, value] of rows) {
    page.drawText(`${label}:`, { x: margin, y, font: bold, size: 10, color: rgb(0, 0, 0) });
    page.drawText(value, { x: margin + 110, y, font, size: 10, color: rgb(0, 0, 0) });
    y -= 15;
  }
  y -= 15;

  // ── Mandat-Text ──────────────────────────────────────────────────────────
  page.drawLine({
    start: { x: margin, y: y + 5 },
    end:   { x: width - margin, y: y + 5 },
    thickness: 0.5,
    color: rgb(0.85, 0.85, 0.85),
  });
  y -= 10;

  const mandatText =
    "Ich ermächtige KFZ-Docs GmbH, Zahlungen von meinem Konto mittels Lastschrift einzuziehen. " +
    "Zugleich weise ich mein Kreditinstitut an, die von KFZ-Docs GmbH auf mein Konto gezogenen " +
    "Lastschriften einzulösen. Hinweis: Ich kann innerhalb von acht Wochen, beginnend mit dem " +
    "Belastungsdatum, die Erstattung des belasteten Betrages verlangen.";

  y = drawWrapped(page, mandatText, { x: margin, y, maxWidth: contentWidth, size: 9, font });
  y -= 15;

  // ── Zustimmungen ─────────────────────────────────────────────────────────
  const checks: [boolean | null, string][] = [
    [antrag.agb_akzeptiert,          "AGB akzeptiert"],
    [antrag.vollmacht_erteilt,       "Vollmacht erteilt"],
    [antrag.datenschutz_akzeptiert,  "Datenschutzerklärung akzeptiert"],
  ];
  for (const [val, label] of checks) {
    page.drawText(val ? "☑" : "☐", { x: margin, y, font, size: 10, color: rgb(0, 0, 0) });
    page.drawText(label, { x: margin + 18, y, font, size: 10, color: rgb(0, 0, 0) });
    y -= 15;
  }
  y -= 20;

  // ── Datum + Unterschrift ─────────────────────────────────────────────────
  const datum = antrag.sepa_mandat_datum
    ? new Date(antrag.sepa_mandat_datum).toLocaleDateString("de-DE", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : new Date().toLocaleDateString("de-DE");

  page.drawText(`Datum: ${datum}`, { x: margin, y, font, size: 10, color: rgb(0, 0, 0) });
  y -= 25;
  page.drawText("Unterschrift:", { x: margin, y, font: bold, size: 10, color: rgb(0, 0, 0) });
  y -= 10;

  // Unterschrift-Bild einbetten
  if (antrag.sepa_unterschrift_url) {
    const { data: sigBlob } = await supabase.storage
      .from("kfz-dokumente")
      .download(antrag.sepa_unterschrift_url);

    if (sigBlob) {
      const sigBytes = await sigBlob.arrayBuffer();
      const sigImage = await pdfDoc.embedPng(sigBytes);
      const sigDims = sigImage.scaleToFit(200, 75);
      page.drawImage(sigImage, {
        x: margin,
        y: y - sigDims.height,
        width: sigDims.width,
        height: sigDims.height,
      });
      y -= sigDims.height + 10;
    }
  }

  // Trennlinie unter Unterschrift
  page.drawLine({
    start: { x: margin, y },
    end:   { x: margin + 200, y },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  y -= 12;
  page.drawText(
    `${antrag.sepa_kontoinhaber ?? `${antrag.vorname} ${antrag.nachname}`}`,
    { x: margin, y, font, size: 8, color: rgb(0.4, 0.4, 0.4) }
  );

  const pdfBytes = await pdfDoc.save();

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="SEPA-Mandat_${antragsId}.pdf"`,
    },
  });
}
