"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { AlertCircle, Clock, RefreshCw, FileText, Shield } from "lucide-react";
import { Container } from "@/components/layout/container";
import {
  fadeIn,
  staggerContainer,
  cardEntrance,
  viewportTrigger,
} from "@/lib/animations";
import { PRICING, REVISIONS_INCLUDED } from "@/lib/constants";

export function Rules() {
  const t = useTranslations("rules");

  const rules = [
    {
      icon: Clock,
      titleKey: "rule1Title",
      descriptionKey: "rule1Description",
    },
    {
      icon: RefreshCw,
      titleKey: "rule2Title",
      descriptionKey: "rule2Description",
    },
    {
      icon: FileText,
      titleKey: "rule3Title",
      descriptionKey: "rule3Description",
    },
    {
      icon: Shield,
      titleKey: "rule4Title",
      descriptionKey: "rule4Description",
    },
  ];

  return (
    <section id="rules" className="bg-card/30 py-20 sm:py-28">
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportTrigger}
        >
          {/* Section header */}
          <motion.div variants={fadeIn} className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-sm text-yellow-500">
              <AlertCircle className="h-4 w-4" />
              {t("importantBadge")}
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {t("title")}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {t("subtitle")}
            </p>
          </motion.div>

          {/* Rules grid */}
          <div className="mb-12 grid gap-6 md:grid-cols-2">
            {rules.map((rule, index) => (
              <motion.div
                key={rule.titleKey}
                variants={cardEntrance}
                custom={index}
                className="flex gap-4 rounded-lg border border-border/60 bg-card p-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <rule.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">{t(rule.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t(rule.descriptionKey)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Policy statement */}
          <motion.div variants={fadeIn}>
            <div className="mx-auto max-w-3xl rounded-lg border border-border/60 bg-background p-6 sm:p-8">
              <h3 className="mb-4 text-lg font-semibold">{t("policyTitle")}</h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>{t("policyText1")}</p>
                <p>
                  {t("policyText2")}{" "}
                  <span className="font-medium text-foreground">
                    {t("policyText2Highlight")}
                  </span>
                  {t("policyText2End")}
                </p>
                <p>
                  {t("policyText3")}{" "}
                  <span className="font-medium text-foreground">
                    €{PRICING.additionalRevisionRate}/hour
                  </span>
                  .
                </p>
                <p className="border-t border-border/60 pt-4 text-xs">
                  {t("policyText4")}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
