# Admin Workflow Guide

Complete guide for managing orders in the Infinity Productized Service Platform.

## Overview

This document describes the administrative workflow for handling design orders from payment to delivery. The system is designed to minimize manual work while giving you full control over the order lifecycle.

---

## Order Lifecycle

```
1. Order Created → Client fills form (status: pending, payment_status: pending)
2. Payment Received → Webhook updates (status: pending, payment_status: paid)
3. Work Started → Admin begins work (status: in_progress)
4. Design Ready → Admin uploads files (status: review)
5. Client Approval → Client accepts or requests revision (status: review or in_progress)
6. Delivered → Files sent to client (status: delivered)
```

---

## Daily Workflow

### Morning Routine (Check New Orders)

1. **Log into Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project
   - Navigate to Table Editor > `orders`

2. **Filter for Paid Orders**
   ```sql
   SELECT *
   FROM orders
   WHERE payment_status = 'paid'
     AND status IN ('pending', 'in_progress')
   ORDER BY delivery_deadline ASC;
   ```

3. **Review Order Details**
   For each order, check:
   - **Project Type**: Logo, Banner, Social, Print, Other
   - **Content Text**: Client's description
   - **Dimensions**: Required output size
   - **Reference Links**: Client's visual inspiration
   - **Uploaded Files**: Brand assets (logo, colors, etc.)
   - **Delivery Deadline**: When it's due
   - **Options**: Express (24h) or Source Files needed

---

## Managing Orders

### 1. Download Order Assets

#### Via Supabase Dashboard

1. Open the order in Table Editor
2. Look at `uploaded_files` column (array of URLs)
3. Copy each URL and download in browser

#### Programmatically (Script)

Create a helper script to download all files:

```bash
# scripts/download-order-files.sh
#!/bin/bash

ORDER_ID=$1
SUPABASE_URL="your_supabase_url"
ANON_KEY="your_anon_key"

# Fetch order
ORDER=$(curl -X GET "${SUPABASE_URL}/rest/v1/orders?id=eq.${ORDER_ID}" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}")

echo "Order fetched. Download files from uploaded_files array."
```

### 2. Update Order Status

#### Start Working
```sql
UPDATE orders
SET status = 'in_progress',
    updated_at = NOW()
WHERE id = 'order-uuid-here';
```

#### Mark as Ready for Review
```sql
UPDATE orders
SET status = 'review',
    updated_at = NOW()
WHERE id = 'order-uuid-here';
```

#### Mark as Completed (before delivery)
```sql
UPDATE orders
SET status = 'completed',
    updated_at = NOW()
WHERE id = 'order-uuid-here';
```

### 3. Upload Delivery Files

When design is ready:

1. **Upload to Supabase Storage**
   - Go to Storage > `order-files` bucket
   - Create folder: `deliveries/{order_id}/`
   - Upload final files

2. **Get Public URLs**
   ```sql
   SELECT
     storage.url(bucket_id, name) as file_url
   FROM storage.objects
   WHERE bucket_id = 'order-files'
     AND name LIKE 'deliveries/{order_id}/%';
   ```

3. **Update Order with Delivery Files**
   ```sql
   UPDATE orders
   SET delivery_files = ARRAY[
     'https://supabase.co/storage/v1/object/public/order-files/deliveries/order-id/final-design.png',
     'https://supabase.co/storage/v1/object/public/order-files/deliveries/order-id/source-files.zip'
   ],
   status = 'delivered',
   delivered_at = NOW(),
   updated_at = NOW()
   WHERE id = 'order-uuid-here';
   ```

### 4. Notify Client

**Automated** (if configured):
- Create Supabase Edge Function to send delivery email when `status = 'delivered'`

**Manual**:
- Send email with download links from `delivery_files` array
- Include message: "Your design is ready! Download below."

---

## Handling Revisions

### Client Requests Revision

1. **Check Revisions Used**
   ```sql
   SELECT revisions_used, revisions_included
   FROM orders
   WHERE id = 'order-uuid-here';
   ```

2. **If Within Included Revisions (≤2)**
   ```sql
   UPDATE orders
   SET revisions_used = revisions_used + 1,
       status = 'in_progress',
       updated_at = NOW()
   WHERE id = 'order-uuid-here';
   ```

3. **If Extra Revisions Needed (>2)**
   - Contact client: "Additional revisions are €20/hour"
   - Create new Stripe invoice or manual payment link
   - After payment, update order

### Tracking Revision Requests

Add a `revision_notes` table (optional):

```sql
CREATE TABLE revision_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  revision_number INTEGER NOT NULL,
  client_feedback TEXT,
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
```

---

## Monitoring Deadlines

### View Orders Due Today

```sql
SELECT
  id,
  email,
  project_type,
  delivery_deadline,
  status,
  EXTRACT(EPOCH FROM (delivery_deadline - NOW())) / 3600 AS hours_remaining
FROM orders
WHERE payment_status = 'paid'
  AND status != 'delivered'
  AND delivery_deadline::date = CURRENT_DATE
ORDER BY delivery_deadline ASC;
```

### Late Orders Alert

```sql
SELECT
  id,
  email,
  project_type,
  delivery_deadline,
  status
FROM orders
WHERE payment_status = 'paid'
  AND status != 'delivered'
  AND delivery_deadline < NOW()
ORDER BY delivery_deadline ASC;
```

### Set Up Slack/Email Alerts (Optional)

Create a scheduled Supabase Edge Function:

```typescript
// supabase/functions/check-deadlines/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Get orders due in next 4 hours
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("payment_status", "paid")
    .neq("status", "delivered")
    .lte("delivery_deadline", new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString());

  if (orders && orders.length > 0) {
    // Send Slack notification or email
    console.log(`⚠️ ${orders.length} orders due soon!`);
  }

  return new Response(JSON.stringify({ checked: orders?.length || 0 }), {
    headers: { "Content-Type": "application/json" },
  });
});
```

Schedule via cron:
```bash
# Run every hour
supabase functions deploy check-deadlines --schedule "0 * * * *"
```

---

## Bulk Operations

### Export Orders to CSV

```sql
COPY (
  SELECT
    id,
    email,
    project_type,
    created_at,
    paid_at,
    delivery_deadline,
    delivered_at,
    total_price,
    status,
    payment_status
  FROM orders
  WHERE created_at >= NOW() - INTERVAL '30 days'
  ORDER BY created_at DESC
) TO '/tmp/orders_export.csv' WITH CSV HEADER;
```

### Bulk Status Update (Use with Caution)

```sql
-- Mark all completed orders as delivered
UPDATE orders
SET status = 'delivered',
    delivered_at = NOW()
WHERE status = 'completed'
  AND delivery_files IS NOT NULL
  AND array_length(delivery_files, 1) > 0;
```

---

## Analytics & Reporting

### Monthly Revenue

```sql
SELECT
  DATE_TRUNC('month', paid_at) AS month,
  COUNT(*) AS total_orders,
  SUM(total_price) AS revenue,
  AVG(total_price) AS avg_order_value
FROM orders
WHERE payment_status = 'paid'
  AND paid_at IS NOT NULL
GROUP BY month
ORDER BY month DESC;
```

### Popular Project Types

```sql
SELECT
  project_type,
  COUNT(*) AS count,
  ROUND(AVG(total_price), 2) AS avg_price
FROM orders
WHERE payment_status = 'paid'
GROUP BY project_type
ORDER BY count DESC;
```

### Delivery Performance

```sql
SELECT
  CASE
    WHEN delivered_at <= delivery_deadline THEN 'On Time'
    WHEN delivered_at IS NULL AND delivery_deadline < NOW() THEN 'Late'
    ELSE 'In Progress'
  END AS delivery_status,
  COUNT(*) AS count
FROM orders
WHERE payment_status = 'paid'
GROUP BY delivery_status;
```

### Average Turnaround Time

```sql
SELECT
  AVG(EXTRACT(EPOCH FROM (delivered_at - paid_at)) / 3600) AS avg_hours
FROM orders
WHERE payment_status = 'paid'
  AND delivered_at IS NOT NULL;
```

---

## Client Communication Templates

### Order Received (Automated)

```
Subject: Order Confirmed - Design #{{order_id}}

Hi {{client_name}},

Your design order has been confirmed! 🎉

Order Details:
- Type: {{project_type}}
- Delivery: {{delivery_deadline}}
- Order ID: {{order_id}}

We'll notify you as soon as your design is ready.

Track your order: {{dashboard_link}}

Best,
Infinity Creative Team
```

### Design Ready for Review

```
Subject: Your Design is Ready! - Order #{{order_id}}

Hi {{client_name}},

Great news! Your {{project_type}} design is ready for review.

Download your files:
{{download_links}}

You have 2 rounds of minor revisions included. Reply with any feedback.

Best,
Infinity Creative Team
```

### Revision Requested

```
Subject: Revision Request Received - Order #{{order_id}}

Hi {{client_name}},

We've received your revision request and will update the design shortly.

Revisions used: {{revisions_used}} of {{revisions_included}} included

Expected update: Within 24 hours

Best,
Infinity Creative Team
```

### Additional Revisions (Paid)

```
Subject: Additional Revision - Payment Required

Hi {{client_name}},

Your order includes 2 rounds of revisions. Additional changes are €20/hour.

Estimated time: {{hours}} hours (€{{total}})

Pay here: {{payment_link}}

Best,
Infinity Creative Team
```

---

## Troubleshooting

### Order Not Showing as Paid

**Possible Causes**:
- Webhook failed to update order
- Stripe payment succeeded but webhook didn't fire

**Solution**:
1. Check Stripe Dashboard for payment
2. If paid, manually update:
   ```sql
   UPDATE orders
   SET payment_status = 'paid',
       paid_at = NOW(),
       delivery_deadline = NOW() + INTERVAL '48 hours'
   WHERE stripe_session_id = 'cs_xxx';
   ```

### Client Can't Access Dashboard

**Check**:
1. Order exists and email matches
2. Order has been paid
3. Dashboard lookup works with both email and order ID

**Manual Fix**:
Send direct link: `https://yourdomain.com/dashboard?email={{client_email}}`

### Files Too Large for Storage

**Solution**:
1. Compress files (use ZIP for source files)
2. Optimize images (WebP, reduce resolution)
3. Use external storage (Dropbox, WeTransfer) for very large files
4. Update `delivery_files` with external links

---

## Best Practices

### ✅ DO:
- Update order status as soon as work begins
- Set realistic delivery deadlines (24h express, 48h standard)
- Download and back up all client assets immediately
- Communicate proactively if delays occur
- Track time spent on revisions

### ❌ DON'T:
- Delete orders (mark as cancelled instead)
- Manually modify payment_status without verifying payment
- Skip updating delivery_deadline when extending timeline
- Forget to upload source files when client paid for them

---

## Automation Ideas

### 1. Auto-assign Orders to Designers
If you have multiple designers:

```sql
CREATE TABLE designers (
  id UUID PRIMARY KEY,
  name TEXT,
  email TEXT,
  capacity INTEGER DEFAULT 5
);

-- Auto-assign on payment
CREATE FUNCTION assign_designer()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_status = 'paid' AND NEW.status = 'pending' THEN
    UPDATE orders
    SET assigned_to = (
      SELECT id FROM designers
      WHERE capacity > 0
      ORDER BY RANDOM()
      LIMIT 1
    )
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 2. Auto-notify on Status Change

Create Edge Function triggered on database changes.

### 3. Calendar Integration

Sync delivery deadlines to Google Calendar via Zapier or API.

---

## Quick Reference Commands

```bash
# View today's orders
supabase db query "SELECT * FROM orders WHERE delivery_deadline::date = CURRENT_DATE"

# Update order status
supabase db query "UPDATE orders SET status = 'in_progress' WHERE id = 'xxx'"

# View all pending paid orders
supabase db query "SELECT * FROM orders WHERE payment_status = 'paid' AND status != 'delivered'"

# Export orders
supabase db export orders --file orders.csv

# View logs
supabase functions logs stripe-webhook
```

---

## Support

For technical issues with the platform:
- Check logs: `supabase functions logs`
- Review Stripe Dashboard for payment issues
- Contact developer (if outsourced)

For business inquiries:
- support@infinitycreative.com

---

## Next Steps

1. ✅ Familiarize yourself with Supabase dashboard
2. ✅ Set up daily order checking routine
3. ✅ Create email templates
4. ✅ Test full order flow from payment to delivery
5. ✅ Set up deadline monitoring (alerts)
6. ✅ Document your specific design workflow

---

## Changelog

- **v1.0** (2025-02-05): Initial admin workflow guide
