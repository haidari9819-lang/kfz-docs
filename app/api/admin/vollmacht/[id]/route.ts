import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { PDFDocument, rgb, StandardFonts, PDFFont, PDFPage } from "pdf-lib";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Bevollmächtigter — KFZ-Docs
const BEAUFTRAGTE = {
  name:    "KFZ-Docs — Mirwais Haidari",
  strasse: "Musterstraße 1",        // ← hier eigene Adresse eintragen
  plzOrt:  "45000 Essen",           // ← hier eigene Stadt eintragen
};

// Zeichnet eine Checkbox (checked oder leer)
function drawCheckbox(
  page: PDFPage, x: number, y: number,
  checked: boolean, font: PDFFont, size = 10
) {
  page.drawRectangle({ x, y, width: size, height: size, borderColor: rgb(0, 0, 0), borderWidth: 1 });
  if (checked) {
    page.drawText("✓", { x: x + 1, y: y + 1, size: size - 2, font, color: rgb(0, 0, 0) });
  }
}

// Zeichnet eine Linie
function drawLine(page: PDFPage, x1: number, y1: number, x2: number, y2: number) {
  page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness: 0.5, color: rgb(0.3, 0.3, 0.3) });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (req.headers.get("x-admin-password") !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = getServiceClient();

  const { data: antrag, error } = await supabase
    .from("antraege")
    .select("vorname, nachname, strasse, plz, ort, service, kennzeichen, evb_nummer, sicherheitscode_vorne, sicherheitscode_hinten")
    .eq("id", id)
    .single();

  if (error || !antrag) {
    return NextResponse.json({ error: "Antrag nicht gefunden" }, { status: 404 });
  }

  // PDF erstellen
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]); // A4
  const { height } = page.getSize();

  const fontBold    = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);

  const L = 50;   // linker Rand
  const R = 545;  // rechter Rand
  let y = height - 50;

  const text = (
    str: string, x: number, yPos: number,
    opts: { size?: number; bold?: boolean; color?: [number, number, number] } = {}
  ) => {
    const { size = 10, bold = false, color = [0, 0, 0] } = opts;
    page.drawText(str, {
      x, y: yPos,
      size,
      font: bold ? fontBold : fontRegular,
      color: rgb(color[0], color[1], color[2]),
    });
  };

  // ── KOPF ──────────────────────────────────────────────────────────
  text("VOLLMACHT", L, y, { size: 20, bold: true });
  text("zur Fahrzeugzulassung", L, y - 22, { size: 12, color: [0.3, 0.3, 0.3] });
  text("Zulassungsstelle Essen", R - 120, y, { size: 9, color: [0.4, 0.4, 0.4] });
  drawLine(page, L, y - 32, R, y - 32);
  y -= 55;

  // ── ANTRAGSTELLER ────────────────────────────────────────────────
  text("VOLLMACHTGEBER (Antragsteller)", L, y, { size: 9, bold: true, color: [0.4, 0.4, 0.4] });
  y -= 18;

  const name = `${antrag.vorname ?? ""} ${antrag.nachname ?? ""}`.trim() || "—";
  const strasse = antrag.strasse ?? "—";
  const plzOrt  = `${antrag.plz ?? ""} ${antrag.ort ?? ""}`.trim() || "—";

  text("Name:", L, y, { size: 9, color: [0.5, 0.5, 0.5] });
  text(name, L + 70, y, { size: 11, bold: true });
  y -= 18;

  text("Straße:", L, y, { size: 9, color: [0.5, 0.5, 0.5] });
  text(strasse, L + 70, y, { size: 11 });
  y -= 18;

  text("PLZ / Ort:", L, y, { size: 9, color: [0.5, 0.5, 0.5] });
  text(plzOrt, L + 70, y, { size: 11 });
  y -= 30;

  // ── BEVOLLMÄCHTIGTE/R ────────────────────────────────────────────
  page.drawRectangle({ x: L - 4, y: y - 4, width: R - L + 8, height: 68, color: rgb(0.95, 0.97, 1) });
  text("BEVOLLMÄCHTIGTE/R", L, y + 50, { size: 9, bold: true, color: [0.2, 0.4, 0.8] });

  text("Name:", L, y + 32, { size: 9, color: [0.5, 0.5, 0.5] });
  text(BEAUFTRAGTE.name, L + 70, y + 32, { size: 11, bold: true });

  text("Straße:", L, y + 14, { size: 9, color: [0.5, 0.5, 0.5] });
  text(BEAUFTRAGTE.strasse, L + 70, y + 14, { size: 11 });

  text("PLZ / Ort:", L, y - 4, { size: 9, color: [0.5, 0.5, 0.5] });
  text(BEAUFTRAGTE.plzOrt, L + 70, y - 4, { size: 11 });
  y -= 50;

  drawLine(page, L, y, R, y);
  y -= 25;

  // ── VOLLMACHT TEXT ───────────────────────────────────────────────
  text("Hiermit erteile ich dem/der oben genannten Bevollmächtigten Vollmacht, folgende Handlungen", L, y, { size: 10 });
  y -= 16;
  text("bei der Kfz-Zulassungsstelle Essen für mich und in meinem Namen vorzunehmen:", L, y, { size: 10 });
  y -= 28;

  // ── CHECKBOXEN ───────────────────────────────────────────────────
  const isAnmeldung    = antrag.service === "anmeldung";
  const isAbmeldung    = antrag.service === "abmeldung";
  const isHalterwechsel = antrag.service === "halterwechsel";

  const cbY = y;
  drawCheckbox(page, L, cbY, isAnmeldung, fontBold);
  text("Erstzulassung / Anmeldung eines Fahrzeugs", L + 16, cbY + 1, { size: 10 });

  drawCheckbox(page, L, cbY - 22, isAbmeldung, fontBold);
  text("Abmeldung / Außerbetriebsetzung eines Fahrzeugs", L + 16, cbY - 21, { size: 10 });

  drawCheckbox(page, L, cbY - 44, isHalterwechsel, fontBold);
  text("Umschreibung / Halterwechsel eines Fahrzeugs", L + 16, cbY - 43, { size: 10 });

  drawCheckbox(page, L, cbY - 66, true, fontBold);
  text("Beantragung / Nutzung des eVB-Nachweises", L + 16, cbY - 65, { size: 10 });
  y -= 90;

  drawLine(page, L, y, R, y);
  y -= 25;

  // ── FAHRZEUGDATEN ────────────────────────────────────────────────
  text("FAHRZEUGDATEN", L, y, { size: 9, bold: true, color: [0.4, 0.4, 0.4] });
  y -= 18;

  if (antrag.kennzeichen) {
    text("Kennzeichen:", L, y, { size: 9, color: [0.5, 0.5, 0.5] });
    text(antrag.kennzeichen, L + 90, y, { size: 11, bold: true });
    y -= 18;
  }
  if (antrag.evb_nummer) {
    text("eVB-Nummer:", L, y, { size: 9, color: [0.5, 0.5, 0.5] });
    text(antrag.evb_nummer, L + 90, y, { size: 11 });
    y -= 18;
  }
  if (antrag.sicherheitscode_vorne) {
    text("Sicherheitscode (ZB I):", L, y, { size: 9, color: [0.5, 0.5, 0.5] });
    text(antrag.sicherheitscode_vorne, L + 120, y, { size: 11 });
    y -= 18;
  }
  if (antrag.sicherheitscode_hinten) {
    text("Sicherheitscode (ZB II):", L, y, { size: 9, color: [0.5, 0.5, 0.5] });
    text(antrag.sicherheitscode_hinten, L + 120, y, { size: 11 });
    y -= 18;
  }
  y -= 15;

  drawLine(page, L, y, R, y);
  y -= 25;

  // ── DATENSCHUTZ ──────────────────────────────────────────────────
  text(
    "Ich bin damit einverstanden, dass die für die Zulassung erforderlichen Daten an die",
    L, y, { size: 9, color: [0.4, 0.4, 0.4] }
  );
  y -= 14;
  text(
    "Zulassungsbehörde weitergegeben werden.",
    L, y, { size: 9, color: [0.4, 0.4, 0.4] }
  );
  y -= 40;

  // ── UNTERSCHRIFT ────────────────────────────────────────────────
  drawLine(page, L, y, L + 180, y);
  drawLine(page, R - 180, y, R, y);
  y -= 14;

  text("Ort, Datum", L + 50, y, { size: 9, color: [0.5, 0.5, 0.5] });
  text("Unterschrift Vollmachtgeber", R - 150, y, { size: 9, color: [0.5, 0.5, 0.5] });
  y -= 40;

  // ── FUSSZEILE ────────────────────────────────────────────────────
  drawLine(page, L, y, R, y);
  y -= 14;
  const today = new Date().toLocaleDateString("de-DE");
  text(`Erstellt: ${today} · Antrags-ID: ${id.substring(0, 8).toUpperCase()} · kfz.qr-docs.de`, L, y, {
    size: 8, color: [0.6, 0.6, 0.6]
  });

  const pdfBytes = await doc.save();

  const safeName = name.replace(/\s+/g, "_");
  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Vollmacht_${safeName}_${id.substring(0,8).toUpperCase()}.pdf"`,
    },
  });
}
