"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
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

const PROJECT_TYPE_ICONS: Record<ProjectType, React.ComponentType<{ className?: string }>> = {
  logo: Hexagon,
  banner: Image,
  social: Share2,
  print: FileText,
  other: MoreHorizontal,
};

export function StepProjectType() {
  const { formData, updateFormData, nextStep } = useOrderStore();
  const t = useTranslations("orderForm.step1");
  const tCommon = useTranslations("common");

  const projectTypes: ProjectType[] = ["logo", "banner", "social", "print", "other"];

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
        <h2 className="text-xl font-semibold">{t("title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {projectTypes.map((type) => {
          const Icon = PROJECT_TYPE_ICONS[type];
          const isSelected = selectedType === type;

          return (
            <motion.button
              key={type}
              type="button"
              variants={cardEntrance}
              {...springHover}
              onClick={() => onSelectType(type)}
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

              <h3 className="font-semibold">{t(`types.${type}`)}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {t(`types.${type}Desc`)}
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
          {tCommon("continue")}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
