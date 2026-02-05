import { supabase } from "./client";
import { supabaseAdmin } from "./server";
import type { Order, OrderInsert, OrderUpdate } from "./types";

/**
 * Create a new order in the database
 * @param orderData - Order data to insert
 * @returns Created order or error
 */
export async function createOrder(
  orderData: OrderInsert,
): Promise<{ order?: Order; error?: string }> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .insert(orderData)
      .select()
      .single();

    if (error) {
      console.error("Create order error:", error);
      return { error: `Failed to create order: ${error.message}` };
    }

    return { order: data };
  } catch (error) {
    console.error("Create order error:", error);
    return { error: "An unexpected error occurred while creating the order" };
  }
}

/**
 * Get an order by ID
 * @param orderId - The order ID
 * @returns Order data or error
 */
export async function getOrderById(
  orderId: string,
): Promise<{ order?: Order; error?: string }> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error) {
      console.error("Get order error:", error);
      return { error: `Failed to fetch order: ${error.message}` };
    }

    return { order: data };
  } catch (error) {
    console.error("Get order error:", error);
    return { error: "An unexpected error occurred while fetching the order" };
  }
}

/**
 * Get orders by customer email
 * @param email - Customer email
 * @returns Array of orders or error
 */
export async function getOrdersByEmail(
  email: string,
): Promise<{ orders?: Order[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("customer_email", email)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get orders by email error:", error);
      return { error: `Failed to fetch orders: ${error.message}` };
    }

    return { orders: data };
  } catch (error) {
    console.error("Get orders by email error:", error);
    return { error: "An unexpected error occurred while fetching orders" };
  }
}

/**
 * Get an order by Stripe checkout session ID (server-side only)
 * @param sessionId - Stripe checkout session ID
 * @returns Order data or error
 */
export async function getOrderBySessionId(
  sessionId: string,
): Promise<{ order?: Order; error?: string }> {
  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("stripe_checkout_session_id", sessionId)
      .single();

    if (error) {
      console.error("Get order by session ID error:", error);
      return { error: `Failed to fetch order: ${error.message}` };
    }

    return { order: data };
  } catch (error) {
    console.error("Get order by session ID error:", error);
    return { error: "An unexpected error occurred while fetching the order" };
  }
}

/**
 * Update an order (server-side only, bypasses RLS)
 * @param orderId - The order ID
 * @param updates - Fields to update
 * @returns Updated order or error
 */
export async function updateOrder(
  orderId: string,
  updates: OrderUpdate,
): Promise<{ order?: Order; error?: string }> {
  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .update(updates)
      .eq("id", orderId)
      .select()
      .single();

    if (error) {
      console.error("Update order error:", error);
      return { error: `Failed to update order: ${error.message}` };
    }

    return { order: data };
  } catch (error) {
    console.error("Update order error:", error);
    return { error: "An unexpected error occurred while updating the order" };
  }
}

/**
 * Update order payment status (server-side only)
 * @param sessionId - Stripe checkout session ID
 * @param paymentId - Stripe payment intent ID
 * @returns Updated order or error
 */
export async function markOrderAsPaid(
  sessionId: string,
  paymentId: string,
): Promise<{ order?: Order; error?: string }> {
  try {
    // Calculate delivery deadline (48 hours from now, or 24 hours for express)
    const { order: existingOrder } = await getOrderBySessionId(sessionId);

    if (!existingOrder) {
      return { error: "Order not found" };
    }

    const hoursToAdd = existingOrder.express_delivery ? 24 : 48;
    const deliveryDeadline = new Date();
    deliveryDeadline.setHours(deliveryDeadline.getHours() + hoursToAdd);

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({
        payment_status: "paid",
        stripe_payment_id: paymentId,
        delivery_deadline: deliveryDeadline.toISOString(),
      })
      .eq("stripe_checkout_session_id", sessionId)
      .select()
      .single();

    if (error) {
      console.error("Mark order as paid error:", error);
      return { error: `Failed to update order status: ${error.message}` };
    }

    return { order: data };
  } catch (error) {
    console.error("Mark order as paid error:", error);
    return {
      error: "An unexpected error occurred while updating order status",
    };
  }
}

/**
 * Update order status to delivered (server-side only)
 * @param orderId - The order ID
 * @param deliveryFiles - Array of delivery file metadata
 * @returns Updated order or error
 */
export async function markOrderAsDelivered(
  orderId: string,
  deliveryFiles: any[],
): Promise<{ order?: Order; error?: string }> {
  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({
        order_status: "delivered",
        delivered_at: new Date().toISOString(),
        delivery_files: deliveryFiles,
      })
      .eq("id", orderId)
      .select()
      .single();

    if (error) {
      console.error("Mark order as delivered error:", error);
      return { error: `Failed to mark order as delivered: ${error.message}` };
    }

    return { order: data };
  } catch (error) {
    console.error("Mark order as delivered error:", error);
    return {
      error:
        "An unexpected error occurred while marking order as delivered",
    };
  }
}
