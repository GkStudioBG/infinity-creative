"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  CheckCircle2,
  Mail,
  Clock,
  ArrowRight,
  Loader2,
  AlertCircle,
  Home,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/layout";
import { DELIVERY_TIMES } from "@/lib/constants";

interface OrderDetails {
  sessionId: string;
  email: string;
  projectType: string;
  isExpress: boolean;
  totalPrice: string;
  deliveryTime: string;
  orderId?: string;
}

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("orderSuccess");
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      setError(t("noSessionError"));
      setIsLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/checkout/session?session_id=${sessionId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }

        const data = await response.json();
        setOrderDetails(data);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError(t("fetchError"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [sessionId, t]);

  if (isLoading) {
    return (
      <Container className="flex min-h-screen items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">{t("loadingDetails")}</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="flex min-h-screen items-center justify-center py-20">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="rounded-full bg-destructive/10 p-3">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{t("errorTitle")}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{error}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => router.push("/")}>
                  <Home className="mr-2 h-4 w-4" />
                  {t("viewDashboard")}
                </Button>
                <Button onClick={() => router.push("/dashboard")}>{t("viewDashboard")}</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>
    );
  }

  const deliveryTime = orderDetails?.isExpress
    ? DELIVERY_TIMES.express
    : DELIVERY_TIMES.standard;

  return (
    <Container className="min-h-screen py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl"
      >
        {/* Success Header */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10"
          >
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </motion.div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
        </div>

        {/* Order Summary Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Order ID */}
              {orderDetails?.orderId && (
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <span className="text-sm font-medium">{t("orderId")}</span>
                  <Badge variant="secondary" className="font-mono">
                    {orderDetails.orderId}
                  </Badge>
                </div>
              )}

              {/* Email */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{t("confirmationSent")}</p>
                  <p className="text-sm text-muted-foreground">{orderDetails?.email}</p>
                </div>
              </div>

              {/* Delivery Time */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{t("expectedDelivery")}</p>
                  <p className="text-sm text-muted-foreground">
                    {deliveryTime} {t("deliveryNote")}
                    {orderDetails?.isExpress && (
                      <Badge className="ml-2" variant="default">
                        {t("express")}
                      </Badge>
                    )}
                  </p>
                </div>
              </div>

              {/* Total Amount */}
              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="font-medium">{t("totalPaid")}</span>
                <span className="text-xl font-bold text-primary">
                  €{orderDetails?.totalPrice}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <h2 className="mb-4 font-semibold">{t("whatsNext")}</h2>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  1
                </div>
                <p className="text-sm">{t("step1")}</p>
              </div>
              <div className="flex gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  2
                </div>
                <p className="text-sm">{t("step2")}</p>
              </div>
              <div className="flex gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  3
                </div>
                <p className="text-sm">{t("step3", { hours: deliveryTime })}</p>
              </div>
              <div className="flex gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  4
                </div>
                <p className="text-sm">{t("step4")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button className="flex-1" onClick={() => router.push("/dashboard")}>
            {t("viewOrderStatus")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => router.push("/")}>
            <Home className="mr-2 h-4 w-4" />
            {t("backToHome")}
          </Button>
        </div>

        {/* Support Info */}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          {t("needHelp")}{" "}
          <a href="mailto:support@infinity.com" className="font-medium text-primary hover:underline">
            support@infinity.com
          </a>
        </p>
      </motion.div>
    </Container>
  );
}

export default function SuccessPage() {
  const t = useTranslations("orderSuccess");

  return (
    <Suspense
      fallback={
        <Container className="flex min-h-screen items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">{t("loadingGeneric")}</p>
          </div>
        </Container>
      }
    >
      <SuccessPageContent />
    </Suspense>
  );
}
