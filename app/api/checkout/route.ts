import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  const { service, antrag_id } = await req.json();

  if (!service || !antrag_id) {
    return NextResponse.json({ error: "service und antrag_id erforderlich" }, { status: 400 });
  }

  // Preis aus Supabase laden
  const supabase = getServiceClient();
  const { data: preis, error: preisError } = await supabase
    .from("preise")
    .select("betrag, name, beschreibung")
    .eq("service", service)
    .eq("aktiv", true)
    .single();

  const fallback: Record<string, { betrag: number; name: string }> = {
    anmeldung:    { betrag: 2900, name: "KFZ Anmeldung" },
    abmeldung:    { betrag: 1900, name: "KFZ Abmeldung" },
    halterwechsel:{ betrag: 3900, name: "Halterwechsel" },
  };

  if (preisError || !preis) {
    if (!fallback[service]) {
      console.error("PREIS FEHLER:", preisError?.message, "| service:", service);
      return NextResponse.json({ error: `Preis nicht gefunden für: ${service}` }, { status: 404 });
    }
  }

  const effektiverPreis = preis ?? fallback[service];
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: effektiverPreis.betrag,
            product_data: {
              name: effektiverPreis.name,
              description: (preis as { beschreibung?: string } | null)?.beschreibung ?? undefined,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/bestaetigung?session_id={CHECKOUT_SESSION_ID}&antrag_id=${antrag_id}`,
      cancel_url: `${baseUrl}/antrag`,
      metadata: { antrag_id, service },
      payment_intent_data: {
        metadata: { antrag_id, service },
      },
      locale: "de",
    });

    if (!session.url) {
      return NextResponse.json({ error: "Stripe Session URL fehlt" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("STRIPE FEHLER:", msg);
    return NextResponse.json({ error: `Stripe-Fehler: ${msg}` }, { status: 500 });
  }
}
