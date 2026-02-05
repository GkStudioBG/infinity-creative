"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./status-badge";
import { CountdownTimer } from "./countdown-timer";
import type { Order } from "@/types";
import { Download, FileText, Package } from "lucide-react";
import { PROJECT_TYPES, PRICING } from "@/lib/constants";
import { format } from "date-fns";

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const projectTypeLabel = PROJECT_TYPES.find((t) => t.value === order.projectType)?.label || order.projectType;
  const hasDeliveryFiles = order.deliveryFiles && order.deliveryFiles.length > 0;
  const showCountdown = order.deliveryDeadline && order.status !== "delivered" && order.status !== "completed";

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-2xl">
              <Package className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
              Order #{order.id.slice(0, 8).toUpperCase()}
            </CardTitle>
            <CardDescription className="mt-1 text-xs sm:text-sm">
              {projectTypeLabel} • Created {format(new Date(order.createdAt), "MMM d, yyyy")}
            </CardDescription>
          </div>
          <StatusBadge status={order.status} className="self-start" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Delivery Countdown */}
        {showCountdown && (
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              Estimated Delivery In:
            </p>
            <CountdownTimer deliveryDeadline={order.deliveryDeadline} />
          </div>
        )}

        {/* Order Details */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Order Details</h4>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Project Type:</span>
              <span className="font-medium text-foreground">{projectTypeLabel}</span>
            </div>
            {order.dimensions && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dimensions:</span>
                <span className="font-medium text-foreground">{order.dimensions}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery:</span>
              <span className="font-medium text-foreground">
                {order.isExpress ? "Express (24h)" : "Standard (48h)"}
              </span>
            </div>
            {order.includeSourceFiles && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Source Files:</span>
                <span className="font-medium text-foreground">Included</span>
              </div>
            )}
            <div className="flex justify-between border-t border-border pt-2">
              <span className="text-muted-foreground">Total Price:</span>
              <span className="text-lg font-bold text-foreground">
                {PRICING.currency}{order.totalPrice}
              </span>
            </div>
          </div>
        </div>

        {/* Content Brief */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Content Brief</h4>
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <p className="text-sm text-foreground/80 whitespace-pre-wrap">
              {order.contentText}
            </p>
          </div>
        </div>

        {/* Revisions Info */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Revisions</h4>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">
              {order.revisionsUsed} of {order.revisionsIncluded} included revisions used
            </span>
          </div>
          {order.revisionsUsed >= order.revisionsIncluded && (
            <p className="text-xs text-amber-600 dark:text-amber-500">
              Additional revisions are charged at €{PRICING.additionalRevisionRate}/hour
            </p>
          )}
        </div>

        {/* Delivery Files */}
        {hasDeliveryFiles && (
          <div className="space-y-3 rounded-lg border border-green-500/20 bg-green-500/5 p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600 dark:text-green-500" />
              <h4 className="text-sm font-semibold text-foreground">Your Files Are Ready!</h4>
            </div>
            <div className="space-y-2">
              {order.deliveryFiles.map((fileUrl, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start gap-2"
                  asChild
                >
                  <a href={fileUrl} download target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4" />
                    Download File {index + 1}
                  </a>
                </Button>
              ))}
            </div>
            {order.deliveredAt && (
              <p className="text-xs text-muted-foreground">
                Delivered on {format(new Date(order.deliveredAt), "MMM d, yyyy 'at' h:mm a")}
              </p>
            )}
          </div>
        )}

        {/* Payment Status */}
        {order.paymentStatus !== "paid" && (
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
            <p className="text-sm text-amber-700 dark:text-amber-400">
              {order.paymentStatus === "pending" && "Payment is pending. Please complete the payment to start your order."}
              {order.paymentStatus === "failed" && "Payment failed. Please contact support."}
              {order.paymentStatus === "refunded" && "This order has been refunded."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
