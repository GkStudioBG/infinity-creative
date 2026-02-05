import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { PRICING, DELIVERY_TIMES, REVISIONS_INCLUDED } from "@/lib/constants";
import type { OrderFormData } from "@/types";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as OrderFormData;

    // Validate required fields
    if (!body.email || !body.contentText || !body.projectType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Calculate pricing
    let basePrice = PRICING.singleDesign;
    let expressFee = body.isExpress ? PRICING.expressFee : 0;
    let sourceFilesFee = body.includeSourceFiles ? PRICING.sourceFilesFee : 0;
    let totalPrice = basePrice + expressFee + sourceFilesFee;

    // Convert to cents for Stripe (EUR)
    const amountInCents = totalPrice * 100;

    // Get app URL from environment
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Create line items for Stripe checkout
    const lineItems: Array<{
      price_data: {
        currency: string;
        product_data: {
          name: string;
          description?: string;
        };
        unit_amount: number;
      };
      quantity: number;
    }> = [
      {
        price_data: {
          currency: PRICING.currency.toLowerCase(),
          product_data: {
            name: `${body.projectType.charAt(0).toUpperCase() + body.projectType.slice(1)} Design`,
            description: `Single design project - ${body.isExpress ? "Express" : "Standard"} delivery`,
          },
          unit_amount: basePrice * 100,
        },
        quantity: 1,
      },
    ];

    // Add express delivery as separate line item if selected
    if (body.isExpress) {
      lineItems.push({
        price_data: {
          currency: PRICING.currency.toLowerCase(),
          product_data: {
            name: "Express Delivery",
            description: `${DELIVERY_TIMES.express}h delivery`,
          },
          unit_amount: expressFee * 100,
        },
        quantity: 1,
      });
    }

    // Add source files as separate line item if selected
    if (body.includeSourceFiles) {
      lineItems.push({
        price_data: {
          currency: PRICING.currency.toLowerCase(),
          product_data: {
            name: "Source Files",
            description: "Original design files (PSD/AI/Figma)",
          },
          unit_amount: sourceFilesFee * 100,
        },
        quantity: 1,
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${appUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/order?canceled=true`,
      customer_email: body.email,
      metadata: {
        projectType: body.projectType,
        contentText: body.contentText.substring(0, 500), // Limit metadata size
        dimensions: body.dimensions || "",
        isExpress: String(body.isExpress),
        includeSourceFiles: String(body.includeSourceFiles),
        referenceLinksCount: String(body.referenceLinks.length),
        uploadedFilesCount: String(body.uploadedFiles.length),
        basePrice: String(basePrice),
        expressFee: String(expressFee),
        sourceFilesFee: String(sourceFilesFee),
        totalPrice: String(totalPrice),
        revisionsIncluded: String(REVISIONS_INCLUDED),
        deliveryTime: String(body.isExpress ? DELIVERY_TIMES.express : DELIVERY_TIMES.standard),
      },
      billing_address_collection: "auto",
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
