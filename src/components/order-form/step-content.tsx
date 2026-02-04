"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { FileText, Ruler } from "lucide-react";

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
import { slideLeft } from "@/lib/animations";

interface StepContentProps {
  onNext: () => void;
  onBack: () => void;
}

export function StepContent({ onNext, onBack }: StepContentProps) {
  const { formData, updateFormData } = useOrderStore();

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
  const isCustomDimension =
    selectedDimension === "custom" ||
    (selectedDimension &&
      !DIMENSION_PRESETS.some((p) => p.value === selectedDimension));

  const onSubmit = (data: Step2Data) => {
    updateFormData(data);
    onNext();
  };

  const handleDimensionPreset = (value: string) => {
    if (value === "custom") {
      setValue("dimensions", "", { shouldValidate: true });
    } else {
      setValue("dimensions", value, { shouldValidate: true });
    }
  };

  return (
    <motion.div
      variants={slideLeft}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          Content Details
        </h2>
        <p className="text-muted-foreground">
          Tell us what you need. The more detail, the better the result.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Content Text */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <FileText className="h-4 w-4 text-primary" />
            Project Description
            <span className="text-destructive">*</span>
          </label>
          <Textarea
            {...register("contentText")}
            placeholder="Describe your project in detail. Include any text that should appear in the design, key messages, target audience, style preferences, and any other relevant information..."
            className="min-h-[180px] resize-none"
          />
          {errors.contentText && (
            <p className="text-sm text-destructive">
              {errors.contentText.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Minimum 10 characters. Be as specific as possible to avoid
            revisions.
          </p>
        </div>

        {/* Dimensions */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Ruler className="h-4 w-4 text-primary" />
            Dimensions / Format
          </label>

          <Select onValueChange={handleDimensionPreset}>
            <SelectTrigger>
              <SelectValue placeholder="Select a preset or enter custom" />
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
                placeholder="Enter custom dimensions (e.g., 800x600, A4, etc.)"
              />
            </motion.div>
          )}

          {!isCustomDimension && selectedDimension && (
            <p className="text-xs text-muted-foreground">
              Selected: {selectedDimension}
            </p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={!isValid}
            className="flex-1"
          >
            Continue
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
