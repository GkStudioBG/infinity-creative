import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Extract order details from session metadata
    const orderDetails = {
      sessionId: session.id,
      email: session.customer_email || session.customer_details?.email || "",
      projectType: session.metadata?.projectType || "",
      isExpress: session.metadata?.isExpress === "true",
      totalPrice: session.metadata?.totalPrice || "0",
      deliveryTime: session.metadata?.deliveryTime || "48",
      orderId: session.metadata?.orderId, // Will be set by webhook later
      paymentStatus: session.payment_status,
    };

    return NextResponse.json(orderDetails);
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    return NextResponse.json(
      { error: "Failed to retrieve session details" },
      { status: 500 }
    );
  }
}
