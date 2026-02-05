import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2024-12-18.acacia",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response(
      JSON.stringify({ error: "Missing stripe-signature header" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET not configured");
      return new Response(
        JSON.stringify({ error: "Webhook secret not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    console.log(`Received event: ${event.type}`);

    // Handle checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Create Supabase client with service role key (bypasses RLS)
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      // Get the order by Stripe session ID
      const { data: order, error: fetchError } = await supabase
        .from("orders")
        .select("*")
        .eq("stripe_session_id", session.id)
        .single();

      if (fetchError || !order) {
        console.error("Order not found:", fetchError);
        return new Response(
          JSON.stringify({ error: "Order not found" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      // Calculate delivery deadline based on express option
      const now = new Date();
      const deliveryDeadlineHours = order.is_express ? 24 : 48;
      const deliveryDeadline = new Date(
        now.getTime() + deliveryDeadlineHours * 60 * 60 * 1000
      );

      // Update order with payment info and delivery deadline
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          status: "in_progress",
          paid_at: now.toISOString(),
          delivery_deadline: deliveryDeadline.toISOString(),
          updated_at: now.toISOString(),
        })
        .eq("id", order.id);

      if (updateError) {
        console.error("Failed to update order:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update order" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      // Send confirmation email using Resend
      const resendApiKey = Deno.env.get("RESEND_API_KEY");

      if (!resendApiKey) {
        console.error("RESEND_API_KEY not configured");
        // Don't fail the webhook - log and continue
      } else {
        try {
          const emailResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${resendApiKey}`,
            },
            body: JSON.stringify({
              from: "Infinity Creative <orders@infinitycreative.com>",
              to: order.email,
              subject: `Order Confirmation #${order.id.slice(0, 8).toUpperCase()}`,
              html: generateConfirmationEmail(order, deliveryDeadline),
            }),
          });

          if (!emailResponse.ok) {
            const errorData = await emailResponse.text();
            console.error("Failed to send email:", errorData);
          } else {
            console.log("Confirmation email sent successfully");
          }
        } catch (emailError) {
          console.error("Error sending confirmation email:", emailError);
        }
      }

      console.log(`Order ${order.id} updated successfully`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
});

function generateConfirmationEmail(order: any, deliveryDeadline: Date): string {
  const projectTypeLabels: Record<string, string> = {
    logo: "Logo Design",
    banner: "Banner Design",
    social: "Social Media Design",
    print: "Print Design",
    other: "Custom Design",
  };

  const projectTypeLabel = projectTypeLabels[order.project_type] || order.project_type;
  const orderId = order.id.slice(0, 8).toUpperCase();
  const formattedDeadline = new Date(deliveryDeadline).toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a; color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border-radius: 12px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #ffffff;">Infinity Creative</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 600; color: #ffffff;">Order Confirmed!</h2>

              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #a3a3a3;">
                Thank you for your order! Your payment has been received and we're excited to start working on your project.
              </p>

              <!-- Order Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; border-radius: 8px; margin: 30px 0; overflow: hidden;">
                <tr>
                  <td style="padding: 20px; border-bottom: 1px solid #2a2a2a;">
                    <p style="margin: 0; font-size: 14px; color: #737373;">Order ID</p>
                    <p style="margin: 5px 0 0; font-size: 18px; font-weight: 600; color: #0ea5e9;">#${orderId}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px; border-bottom: 1px solid #2a2a2a;">
                    <p style="margin: 0; font-size: 14px; color: #737373;">Project Type</p>
                    <p style="margin: 5px 0 0; font-size: 16px; color: #ffffff;">${projectTypeLabel}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px; border-bottom: 1px solid #2a2a2a;">
                    <p style="margin: 0; font-size: 14px; color: #737373;">Total Paid</p>
                    <p style="margin: 5px 0 0; font-size: 18px; font-weight: 600; color: #10b981;">€${(order.total_price / 100).toFixed(2)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0; font-size: 14px; color: #737373;">Expected Delivery</p>
                    <p style="margin: 5px 0 0; font-size: 16px; color: #ffffff;">${formattedDeadline}</p>
                    ${order.is_express ? '<p style="margin: 5px 0 0; font-size: 14px; color: #0ea5e9;">⚡ Express Delivery</p>' : ''}
                  </td>
                </tr>
              </table>

              <!-- What's Next -->
              <div style="background-color: #0a0a0a; border-left: 4px solid #0ea5e9; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <h3 style="margin: 0 0 15px; font-size: 18px; font-weight: 600; color: #ffffff;">What's Next?</h3>
                <ul style="margin: 0; padding-left: 20px; color: #a3a3a3; font-size: 15px; line-height: 1.8;">
                  <li>Our team will start working on your project immediately</li>
                  <li>You'll receive your design within ${order.is_express ? '24' : '48'} hours</li>
                  <li>You have ${order.revisions_included} revision rounds included</li>
                  <li>Track your order status using Order ID <strong style="color: #0ea5e9;">#${orderId}</strong></li>
                </ul>
              </div>

              <!-- Project Details -->
              <h3 style="margin: 30px 0 15px; font-size: 18px; font-weight: 600; color: #ffffff;">Your Project Details</h3>
              <div style="background-color: #0a0a0a; padding: 20px; border-radius: 8px;">
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #a3a3a3; white-space: pre-wrap;">${order.content_text}</p>
                ${order.dimensions ? `<p style="margin: 15px 0 0; font-size: 14px; color: #737373;">Dimensions: <span style="color: #ffffff;">${order.dimensions}</span></p>` : ''}
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 40px 0 20px;">
                <a href="${Deno.env.get("NEXT_PUBLIC_APP_URL")}/dashboard?order=${order.id}" style="display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">Track Your Order</a>
              </div>

              <!-- Footer Note -->
              <p style="margin: 30px 0 0; padding-top: 30px; border-top: 1px solid #2a2a2a; font-size: 14px; color: #737373; line-height: 1.6;">
                Questions? Reply to this email or contact us at <a href="mailto:support@infinitycreative.com" style="color: #0ea5e9; text-decoration: none;">support@infinitycreative.com</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0a0a0a; padding: 30px; text-align: center; border-top: 1px solid #2a2a2a;">
              <p style="margin: 0 0 10px; font-size: 14px; color: #737373;">© ${new Date().getFullYear()} Infinity Creative Ltd. All rights reserved.</p>
              <p style="margin: 0; font-size: 12px; color: #525252;">Professional design services delivered with precision.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
