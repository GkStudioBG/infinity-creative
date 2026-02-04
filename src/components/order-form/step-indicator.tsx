"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export function StepIndicator({
  currentStep,
  totalSteps,
  stepTitles,
}: StepIndicatorProps) {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full">
      {/* Mobile view - simplified progress bar */}
      <div className="md:hidden">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-muted-foreground">{stepTitles[currentStep - 1]}</span>
        </div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
          <motion.div
            className="absolute inset-y-0 left-0 bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Desktop view - step dots with labels */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Background line */}
          <div className="absolute left-0 top-4 h-0.5 w-full bg-secondary" />

          {/* Progress line */}
          <motion.div
            className="absolute left-0 top-4 h-0.5 bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />

          {/* Step dots */}
          <div className="relative flex justify-between">
            {stepTitles.map((title, index) => {
              const stepNumber = index + 1;
              const isCompleted = stepNumber < currentStep;
              const isCurrent = stepNumber === currentStep;
              const isUpcoming = stepNumber > currentStep;

              return (
                <div
                  key={stepNumber}
                  className="flex flex-col items-center"
                >
                  {/* Step circle */}
                  <motion.div
                    className={cn(
                      "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors duration-300",
                      isCompleted && "border-primary bg-primary text-primary-foreground",
                      isCurrent && "border-primary bg-background text-primary",
                      isUpcoming && "border-muted bg-background text-muted-foreground"
                    )}
                    initial={false}
                    animate={{
                      scale: isCurrent ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Check className="h-4 w-4" />
                      </motion.div>
                    ) : (
                      stepNumber
                    )}
                  </motion.div>

                  {/* Step label */}
                  <span
                    className={cn(
                      "mt-2 text-xs font-medium transition-colors duration-300",
                      isCompleted && "text-primary",
                      isCurrent && "text-foreground",
                      isUpcoming && "text-muted-foreground"
                    )}
                  >
                    {title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
