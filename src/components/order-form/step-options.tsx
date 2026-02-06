"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Zap, FileCode, Mail, ArrowRight, ArrowLeft, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useOrderStore } from "@/hooks/use-order-store";
import { step4Schema, type Step4Data } from "@/schemas/order.schema";
import { PRICING, DELIVERY_TIMES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function StepOptions() {
  const { formData, updateFormData, nextStep, prevStep } = useOrderStore();
  const t = useTranslations("orderForm.step4");
  const tCommon = useTranslations("common");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<Step4Data>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      isExpress: formData.isExpress,
      includeSourceFiles: formData.includeSourceFiles,
      email: formData.email,
    },
    mode: "onChange",
  });

  const isExpress = watch("isExpress");
  const includeSourceFiles = watch("includeSourceFiles");

  const onSubmit = (data: Step4Data) => {
    updateFormData(data);
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

      <div className="space-y-6">
        {/* Express Delivery Option */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn(
            "relative flex cursor-pointer items-start gap-4 rounded-lg border-2 p-4 transition-all duration-200",
            isExpress
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          )}
          onClick={() => setValue("isExpress", !isExpress, { shouldValidate: true })}
        >
          <Checkbox
            checked={isExpress}
            onCheckedChange={(checked) =>
              setValue("isExpress", checked === true, { shouldValidate: true })
            }
            className="mt-1"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Zap className={cn("h-5 w-5", isExpress ? "text-primary" : "text-muted-foreground")} />
              <span className="font-semibold">{t("expressDelivery")}</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                +{PRICING.expressFee}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("expressDescription")}
            </p>
            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{t("expressGuarantee")}</span>
            </div>
          </div>
        </motion.div>

        {/* Source Files Option */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "relative flex cursor-pointer items-start gap-4 rounded-lg border-2 p-4 transition-all duration-200",
            includeSourceFiles
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          )}
          onClick={() =>
            setValue("includeSourceFiles", !includeSourceFiles, { shouldValidate: true })
          }
        >
          <Checkbox
            checked={includeSourceFiles}
            onCheckedChange={(checked) =>
              setValue("includeSourceFiles", checked === true, { shouldValidate: true })
            }
            className="mt-1"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <FileCode
                className={cn(
                  "h-5 w-5",
                  includeSourceFiles ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span className="font-semibold">{t("sourceFiles")}</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                +{PRICING.sourceFilesFee}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("sourceFilesDescription")}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {["PSD", "AI", "Figma"].map((format) => (
                <span
                  key={format}
                  className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {format}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Email Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Mail className="h-4 w-4 text-primary" />
            {t("emailLabel")}
            <span className="text-destructive">{tCommon("required")}</span>
          </label>
          <Input
            {...register("email")}
            type="email"
            placeholder={t("emailPlaceholder")}
            className={cn(errors.email && "border-destructive")}
          />
          {errors.email ? (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              {t("emailHint")}
            </p>
          )}
        </motion.div>

        {/* Order Summary Preview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-lg border border-border bg-muted/50 p-4"
        >
          <h3 className="mb-3 text-sm font-medium">{t("selectedAddons")}</h3>
          <div className="space-y-2 text-sm">
            {isExpress ? (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  {t("expressDelivery")}
                </span>
                <span className="font-medium">+{PRICING.expressFee}</span>
              </div>
            ) : null}
            {includeSourceFiles ? (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-primary" />
                  {t("sourceFiles")}
                </span>
                <span className="font-medium">+{PRICING.sourceFilesFee}</span>
              </div>
            ) : null}
            {!isExpress && !includeSourceFiles && (
              <p className="text-muted-foreground">{t("noAddons")}</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <Button type="button" variant="outline" onClick={prevStep}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {tCommon("back")}
        </Button>
        <Button type="submit" size="lg" disabled={!isValid} className="min-w-[140px]">
          {tCommon("continue")}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
