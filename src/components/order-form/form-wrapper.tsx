"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowLeft, XCircle, Loader2 } from "lucide-react";
import { useOrderStore } from "@/hooks/use-order-store";
import { StepIndicator } from "./step-indicator";
import { StepProjectType } from "./step-project-type";
import { StepContent } from "./step-content";
import { StepReferences } from "./step-references";
import { StepOptions } from "./step-options";
import { StepSummary } from "./step-summary";
import { Container } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { slideLeft, slideRight } from "@/lib/animations";

const TOTAL_STEPS = 5;

function FormWrapperContent() {
  const { currentStep, prevStep: goToPrevStep, getDirection } = useOrderStore();
  const searchParams = useSearchParams();
  const t = useTranslations("orderForm");
  const [showCancelNotice, setShowCancelNotice] = useState(false);

  const stepTitles = [
    t("stepTitles.projectType"),
    t("stepTitles.contentDetails"),
    t("stepTitles.visualReferences"),
    t("stepTitles.additionalOptions"),
    t("stepTitles.summaryPayment"),
  ];

  const direction = getDirection();
  const variants = direction === "forward" ? slideLeft : slideRight;

  useEffect(() => {
    // Check if user returned from canceled checkout
    const canceled = searchParams.get("canceled");
    if (canceled === "true") {
      setShowCancelNotice(true);
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowCancelNotice(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepProjectType />;
      case 2:
        return <StepContent />;
      case 3:
        return <StepReferences />;
      case 4:
        return <StepOptions />;
      case 5:
        return <StepSummary />;
      default:
        return <StepProjectType />;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 md:py-12">
      <Container className="max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t("pageTitle")}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t("pageSubtitle")}
          </p>
        </div>

        {/* Cancellation Notice */}
        <AnimatePresence>
          {showCancelNotice && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 flex items-center gap-3 rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4"
            >
              <XCircle className="h-5 w-5 text-yellow-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">{t("paymentCanceled")}</p>
                <p className="text-xs text-muted-foreground">
                  {t("paymentCanceledMessage")}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCancelNotice(false)}
                className="h-auto p-1"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <StepIndicator
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          stepTitles={stepTitles}
        />

        <div className="mt-8 overflow-hidden rounded-lg border bg-card p-6 shadow-sm md:p-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentStep}
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Back button - only show if not on first step */}
        {currentStep > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4"
          >
            <Button
              variant="ghost"
              onClick={goToPrevStep}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("backTo")} {stepTitles[currentStep - 2]}
            </Button>
          </motion.div>
        )}
      </Container>
    </div>
  );
}

function FormWrapperFallback() {
  const t = useTranslations("orderForm");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">{t("loadingForm")}</p>
      </div>
    </div>
  );
}

export function FormWrapper() {
  return (
    <Suspense fallback={<FormWrapperFallback />}>
      <FormWrapperContent />
    </Suspense>
  );
}

