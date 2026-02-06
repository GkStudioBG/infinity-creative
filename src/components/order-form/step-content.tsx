"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FileText, Ruler, ArrowRight, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrderStore } from "@/hooks/use-order-store";
import { step2Schema, type Step2Data } from "@/schemas/order.schema";
import { DIMENSION_PRESETS } from "@/lib/constants";

export function StepContent() {
  const { formData, updateFormData, nextStep, prevStep } = useOrderStore();
  const t = useTranslations("orderForm.step2");
  const tCommon = useTranslations("common");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      contentText: formData.contentText,
      dimensions: formData.dimensions,
    },
    mode: "onChange",
  });

  const selectedDimension = watch("dimensions");
  const contentText = watch("contentText");
  const isCustomDimension =
    selectedDimension === "custom" ||
    (selectedDimension &&
      !DIMENSION_PRESETS.some((p) => p.value === selectedDimension));

  const onSubmit = (data: Step2Data) => {
    updateFormData(data);
    nextStep();
  };

  const handleDimensionPreset = (value: string) => {
    if (value === "custom") {
      setValue("dimensions", "", { shouldValidate: true });
    } else {
      setValue("dimensions", value, { shouldValidate: true });
    }
  };

  const characterCount = contentText?.length || 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">{t("title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      <div className="space-y-6">
        {/* Content Text */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <FileText className="h-4 w-4 text-primary" />
            {t("descriptionLabel")}
            <span className="text-destructive">{tCommon("required")}</span>
          </label>
          <Textarea
            {...register("contentText")}
            placeholder={t("descriptionPlaceholder")}
            className="min-h-[180px] resize-none"
          />
          <div className="flex items-center justify-between">
            {errors.contentText ? (
              <p className="text-sm text-destructive">
                {errors.contentText.message}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                {t("descriptionHint")}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {characterCount}/5000
            </p>
          </div>
        </div>

        {/* Dimensions */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Ruler className="h-4 w-4 text-primary" />
            {t("dimensionsLabel")}
            <span className="text-xs text-muted-foreground">({tCommon("optional")})</span>
          </label>

          <Select onValueChange={handleDimensionPreset}>
            <SelectTrigger>
              <SelectValue placeholder={t("dimensionsPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {DIMENSION_PRESETS.map((preset) => (
                <SelectItem key={preset.value} value={preset.value}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {isCustomDimension && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Input
                {...register("dimensions")}
                placeholder={t("dimensionsCustomPlaceholder")}
              />
            </motion.div>
          )}

          {!isCustomDimension && selectedDimension && (
            <p className="text-xs text-muted-foreground">
              {t("selected")}: {selectedDimension}
            </p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {tCommon("back")}
        </Button>
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
