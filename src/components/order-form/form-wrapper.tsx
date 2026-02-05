"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useOrderStore } from "@/hooks/use-order-store";
import { StepIndicator } from "./step-indicator";
import { StepProjectType } from "./step-project-type";
import { StepContent } from "./step-content";
import { StepReferences } from "./step-references";
import { Container } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { slideLeft, slideRight } from "@/lib/animations";

const TOTAL_STEPS = 5;

const STEP_TITLES = [
  "Project Type",
  "Content Details",
  "Visual References",
  "Additional Options",
  "Summary & Payment",
];

export function FormWrapper() {
  const { currentStep, prevStep: goToPrevStep, getDirection } = useOrderStore();

  const direction = getDirection();
  const variants = direction === "forward" ? slideLeft : slideRight;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepProjectType />;
      case 2:
        return <StepContent />;
      case 3:
        return <StepReferences />;
      case 4:
        return <PlaceholderStep step={4} />;
      case 5:
        return <PlaceholderStep step={5} />;
      default:
        return <StepProjectType />;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 md:py-12">
      <Container className="max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Place Your Order
          </h1>
          <p className="mt-2 text-muted-foreground">
            Tell us about your project and we&apos;ll deliver within 48 hours
          </p>
        </div>

        <StepIndicator
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          stepTitles={STEP_TITLES}
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
              Back to {STEP_TITLES[currentStep - 2]}
            </Button>
          </motion.div>
        )}
      </Container>
    </div>
  );
}

// Placeholder component for steps 2-5 (to be implemented in future)
function PlaceholderStep({ step }: { step: number }) {
  const { nextStep, prevStep } = useOrderStore();

  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
      <p className="text-lg font-medium">Step {step}: {STEP_TITLES[step - 1]}</p>
      <p className="text-muted-foreground">This step will be implemented soon</p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={prevStep}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        {step < 5 && (
          <Button onClick={nextStep}>
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}

// Re-export STEP_TITLES for use in placeholder
const PlaceholderStepTitles = STEP_TITLES;
