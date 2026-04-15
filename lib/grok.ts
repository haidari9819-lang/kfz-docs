import OpenAI from "openai";

const grok = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

export interface DokumentErgebnis {
  // Personalausweis
  vorname?: string;
  nachname?: string;
  geburtsdatum?: string;
  geburtsort?: string;
  adresse?: string;
  plz?: string;
  ort?: string;
  ausweis_nr?: string;
  gueltig_bis?: string;
  // Fahrzeugschein
  kennzeichen?: string;
  fahrzeug_vin?: string;
  fahrzeug_marke?: string;
  fahrzeug_modell?: string;
  erstzulassung?: string;
  halter_name?: string;
  halter_adresse?: string;
  // Fahrzeugbrief
  schluessel_nr?: string;
  // eVB
  evb_nummer?: string;
  versicherung?: string;
  // Fehler
  fehler?: string;
}

const PROMPTS: Record<string, string> = {
  personalausweis: `Extrahiere alle Daten aus diesem deutschen Personalausweis als JSON:
{
  "vorname": "",
  "nachname": "",
  "geburtsdatum": "TT.MM.JJJJ",
  "geburtsort": "",
  "adresse": "",
  "plz": "",
  "ort": "",
  "ausweis_nr": "",
  "gueltig_bis": "TT.MM.JJJJ"
}
Wenn ein Feld nicht lesbar ist, lasse es leer. Antworte NUR mit dem JSON-Objekt.`,

  fahrzeugschein: `Extrahiere alle Daten aus diesem deutschen Fahrzeugschein (Zulassungsbescheinigung Teil I) als JSON:
{
  "kennzeichen": "",
  "fahrzeug_vin": "",
  "fahrzeug_marke": "",
  "fahrzeug_modell": "",
  "erstzulassung": "TT.MM.JJJJ",
  "halter_name": "",
  "halter_adresse": ""
}
Wenn ein Feld nicht lesbar ist, lasse es leer. Antworte NUR mit dem JSON-Objekt.`,

  fahrzeugbrief: `Extrahiere alle Daten aus diesem deutschen Fahrzeugbrief (Zulassungsbescheinigung Teil II) als JSON:
{
  "fahrzeug_vin": "",
  "fahrzeug_marke": "",
  "fahrzeug_modell": "",
  "erstzulassung": "TT.MM.JJJJ",
  "schluessel_nr": ""
}
Wenn ein Feld nicht lesbar ist, lasse es leer. Antworte NUR mit dem JSON-Objekt.`,

  evb: `Extrahiere die eVB-Nummer aus diesem Versicherungsdokument als JSON:
{
  "evb_nummer": "",
  "versicherung": "",
  "gueltig_bis": "TT.MM.JJJJ"
}
Wenn ein Feld nicht lesbar ist, lasse es leer. Antworte NUR mit dem JSON-Objekt.`,

  sepa: `Extrahiere die SEPA-Daten aus diesem Lastschriftmandat als JSON:
{
  "iban": "",
  "bic": "",
  "kontoinhaber": "",
  "bank": ""
}
Wenn ein Feld nicht lesbar ist, lasse es leer. Antworte NUR mit dem JSON-Objekt.`,
};

export async function extrahiereDokument(
  imageBase64: string,
  mimeType: string,
  dokumentTyp: string
): Promise<DokumentErgebnis> {
  const prompt = PROMPTS[dokumentTyp] ?? "Extrahiere alle relevanten Daten als JSON.";

  const response = await grok.chat.completions.create({
    model: "grok-2-vision-1212",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: { url: `data:${mimeType};base64,${imageBase64}` },
          },
          { type: "text", text: prompt },
        ],
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Leere Antwort von Grok Vision");

  return JSON.parse(content) as DokumentErgebnis;
}
