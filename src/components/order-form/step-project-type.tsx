"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Hexagon,
  Image,
  Share2,
  FileText,
  MoreHorizontal,
  ArrowRight,
} from "lucide-react";
import { useOrderStore } from "@/hooks/use-order-store";
import { step1Schema, type Step1Data } from "@/schemas/order.schema";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { staggerContainer, cardEntrance, springHover } from "@/lib/animations";
import type { ProjectType } from "@/types";

const PROJECT_TYPE_OPTIONS: {
  value: ProjectType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    value: "logo",
    label: "Logo",
    description: "Brand identity, logo design, and variations",
    icon: Hexagon,
  },
  {
    value: "banner",
    label: "Banner",
    description: "Web banners, ads, and promotional graphics",
    icon: Image,
  },
  {
    value: "social",
    label: "Social Media",
    description: "Posts, stories, and social content",
    icon: Share2,
  },
  {
    value: "print",
    label: "Print Materials",
    description: "Flyers, brochures, and print designs",
    icon: FileText,
  },
  {
    value: "other",
    label: "Other",
    description: "Custom design requests",
    icon: MoreHorizontal,
  },
];

export function StepProjectType() {
  const { formData, updateFormData, nextStep } = useOrderStore();

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isValid },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      projectType: formData.projectType,
    },
    mode: "onChange",
  });

  const selectedType = watch("projectType");

  const onSelectType = (type: ProjectType) => {
    setValue("projectType", type, { shouldValidate: true });
  };

  const onSubmit = (data: Step1Data) => {
    updateFormData({ projectType: data.projectType });
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">What type of design do you need?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select the category that best describes your project
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {PROJECT_TYPE_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedType === option.value;

          return (
            <motion.button
              key={option.value}
              type="button"
              variants={cardEntrance}
              {...springHover}
              onClick={() => onSelectType(option.value)}
              className={cn(
                "relative flex flex-col items-center rounded-lg border-2 p-6 text-center transition-all duration-200",
                isSelected
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border bg-background hover:border-primary/50 hover:bg-accent/50"
              )}
            >
              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  layoutId="selection-indicator"
                  className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
              )}

              <div
                className={cn(
                  "mb-3 flex h-14 w-14 items-center justify-center rounded-xl transition-colors duration-200",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                <Icon className="h-7 w-7" />
              </div>

              <h3 className="font-semibold">{option.label}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {option.description}
              </p>
            </motion.button>
          );
        })}
      </motion.div>

      <div className="mt-8 flex justify-end">
        <Button
          type="submit"
          size="lg"
          disabled={!isValid}
          className="min-w-[140px]"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
