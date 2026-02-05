"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CreditCard,
  Hexagon,
  Image,
  Share2,
  FileText,
  MoreHorizontal,
  Zap,
  FileCode,
  Mail,
  Ruler,
  Link2,
  Paperclip,
  Clock,
  Shield,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useOrderStore } from "@/hooks/use-order-store";
import { step5Schema, type Step5Data } from "@/schemas/order.schema";
import { PRICING, DELIVERY_TIMES, REVISIONS_INCLUDED } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ProjectType } from "@/types";

const PROJECT_TYPE_ICONS: Record<ProjectType, React.ComponentType<{ className?: string }>> = {
  logo: Hexagon,
  banner: Image,
  social: Share2,
  print: FileText,
  other: MoreHorizontal,
};

const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  logo: "Logo Design",
  banner: "Banner",
  social: "Social Media",
  print: "Print Materials",
  other: "Other",
};

export function StepSummary() {
  const { formData, prevStep, getTotalPrice } = useOrderStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { isValid },
  } = useForm<Step5Data>({
    resolver: zodResolver(step5Schema),
    defaultValues: {
      termsAccepted: false,
    },
    mode: "onChange",
  });

  const termsAccepted = watch("termsAccepted");
  const totalPrice = getTotalPrice();
  const Icon = PROJECT_TYPE_ICONS[formData.projectType];
  const deliveryTime = formData.isExpress ? DELIVERY_TIMES.express : DELIVERY_TIMES.standard;

  const onSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Create checkout session
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to proceed to checkout. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Order Summary</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Review your order before proceeding to payment
        </p>
      </div>

      <div className="space-y-6">
        {/* Project Type */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg border border-border bg-card p-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{PROJECT_TYPE_LABELS[formData.projectType]}</h3>
              <p className="text-sm text-muted-foreground">Design project</p>
            </div>
          </div>
        </motion.div>

        {/* Project Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-lg border border-border bg-card p-4"
        >
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <FileText className="h-4 w-4 text-primary" />
            Project Details
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Description</p>
              <p className="mt-1 text-sm">
                {formData.contentText.length > 150
                  ? `${formData.contentText.slice(0, 150)}...`
                  : formData.contentText}
              </p>
            </div>
            {formData.dimensions && (
              <div>
                <p className="flex items-center gap-1 text-xs uppercase text-muted-foreground">
                  <Ruler className="h-3 w-3" />
                  Dimensions
                </p>
                <p className="mt-1 text-sm">{formData.dimensions}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* References */}
        {(formData.referenceLinks.length > 0 || formData.uploadedFiles.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-lg border border-border bg-card p-4"
          >
            <h3 className="mb-3 text-sm font-semibold">References</h3>
            <div className="space-y-2 text-sm">
              {formData.referenceLinks.length > 0 && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Link2 className="h-4 w-4" />
                  <span>{formData.referenceLinks.length} reference link(s)</span>
                </div>
              )}
              {formData.uploadedFiles.length > 0 && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Paperclip className="h-4 w-4" />
                  <span>{formData.uploadedFiles.length} file(s) uploaded</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Delivery & Contact */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-lg border border-border bg-card p-4"
        >
          <h3 className="mb-3 text-sm font-semibold">Delivery</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {formData.isExpress ? (
                  <span className="text-primary font-medium">Express: {deliveryTime} hours</span>
                ) : (
                  <span>Standard: {deliveryTime} hours</span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{formData.email}</span>
            </div>
          </div>
        </motion.div>

        {/* Pricing Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4"
        >
          <h3 className="mb-4 text-sm font-semibold">Pricing</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Single Design</span>
              <span>{PRICING.singleDesign}</span>
            </div>
            {formData.isExpress && (
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  Express Delivery
                </span>
                <span>+{PRICING.expressFee}</span>
              </div>
            )}
            {formData.includeSourceFiles && (
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-primary" />
                  Source Files
                </span>
                <span>+{PRICING.sourceFilesFee}</span>
              </div>
            )}
            <div className="my-3 border-t border-border" />
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold text-primary">
                {totalPrice}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  {PRICING.currency}
                </span>
              </span>
            </div>
          </div>
        </motion.div>

        {/* What's Included */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-lg border border-border bg-muted/50 p-4"
        >
          <h3 className="mb-3 text-sm font-semibold">What&apos;s Included</h3>
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>{REVISIONS_INCLUDED} rounds of revisions</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>{deliveryTime}h delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>High-resolution files</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Commercial license</span>
            </div>
          </div>
        </motion.div>

        {/* Terms Acceptance */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-lg border-2 p-4 transition-all duration-200",
            termsAccepted
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          )}
          onClick={() => setValue("termsAccepted", !termsAccepted, { shouldValidate: true })}
        >
          <Checkbox
            checked={termsAccepted}
            onCheckedChange={(checked) =>
              setValue("termsAccepted", checked === true, { shouldValidate: true })
            }
            className="mt-0.5"
          />
          <div className="flex-1">
            <p className="text-sm">
              I accept the{" "}
              <a
                href="/terms"
                onClick={(e) => e.stopPropagation()}
                className="font-medium text-primary hover:underline"
              >
                terms and conditions
              </a>{" "}
              and understand the revision policy.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {REVISIONS_INCLUDED} minor revisions included. Additional changes: {PRICING.additionalRevisionRate}/hour.
            </p>
          </div>
        </motion.div>

        {/* Security Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
        >
          <Shield className="h-4 w-4" />
          <span>Secure payment powered by Stripe</span>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <Button type="button" variant="outline" onClick={prevStep} disabled={isSubmitting}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          type="submit"
          size="lg"
          disabled={!isValid || isSubmitting}
          className="min-w-[180px]"
        >
          {isSubmitting ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Proceed to Payment
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
