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

  // Preis aus Supabase laden — niemals hardcoded
  const supabase = getServiceClient();
  const { data: preis, error: preisError } = await supabase
    .from("preise")
    .select("betrag, name, beschreibung")
    .eq("service", service)
    .eq("aktiv", true)
    .single();

  if (preisError || !preis) {
    return NextResponse.json({ error: "Preis nicht gefunden" }, { status: 404 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "sepa_debit"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: preis.betrag,
          product_data: {
            name: preis.name,
            description: preis.beschreibung ?? undefined,
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

  return NextResponse.json({ url: session.url });
}
