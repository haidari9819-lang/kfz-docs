/** Entferne Leerzeichen, Großbuchstaben, Gruppen à 4 Zeichen */
export function formatIBAN(value: string): string {
  const clean = value.replace(/\s/g, "").toUpperCase();
  return clean.match(/.{1,4}/g)?.join(" ") ?? clean;
}

/** ISO 7064 Mod-97-10 — nur deutsche IBANs (DE + 20 Ziffern = 22 Zeichen) */
export function validateIBAN(iban: string): boolean {
  const clean = iban.replace(/\s/g, "").toUpperCase();
  if (!/^DE\d{20}$/.test(clean)) return false;

  // Erste 4 Zeichen ans Ende hängen
  const rearranged = clean.slice(4) + clean.slice(0, 4);

  // Buchstaben durch Zahlen ersetzen (A=10, B=11 … Z=35)
  const numeric = rearranged.replace(/[A-Z]/g, (c) =>
    String(c.charCodeAt(0) - 55)
  );

  // Mod 97 in Blöcken (BigInt-Alternative für große Zahlen)
  let remainder = 0;
  for (const digit of numeric) {
    remainder = (remainder * 10 + parseInt(digit, 10)) % 97;
  }

  return remainder === 1;
}

/** Extrahiere BLZ aus deutscher IBAN (Stellen 4–11) */
export function getBankFromIBAN(iban: string): string {
  const clean = iban.replace(/\s/g, "").toUpperCase();
  if (clean.length < 12) return "";
  const blz = clean.slice(4, 12);
  return `BLZ: ${blz}`;
}
