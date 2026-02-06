"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Check, Zap, Clock, FileCode, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/layout/container";
import {
  fadeIn,
  staggerContainer,
  cardEntrance,
  viewportTrigger,
  springHover,
} from "@/lib/animations";
import { PRICING, DELIVERY_TIMES, REVISIONS_INCLUDED } from "@/lib/constants";

export function PricingTable() {
  const t = useTranslations("pricing");
  const tCommon = useTranslations("common");

  const packages = [
    {
      nameKey: "singleDesign",
      descriptionKey: "singleDesignDescription",
      price: PRICING.singleDesign,
      popular: false,
      featureKeys: [
        "standardDelivery",
        "revisionsIncluded",
        "allFormats",
        "commercialRights",
      ],
    },
    {
      nameKey: "packOfFive",
      descriptionKey: "packOfFiveDescription",
      price: PRICING.packOfFive,
      popular: true,
      savings: PRICING.singleDesign * 5 - PRICING.packOfFive,
      featureKeys: [
        "expressDeliveryPer",
        "revisionsPerDesign",
        "allFormats",
        "commercialRights",
        "prioritySupport",
      ],
    },
  ];

  const addOns = [
    {
      icon: Zap,
      nameKey: "expressDelivery",
      descriptionKey: "expressDeliveryDesc",
      price: PRICING.expressFee,
    },
    {
      icon: FileCode,
      nameKey: "sourceFiles",
      descriptionKey: "sourceFilesDesc",
      price: PRICING.sourceFilesFee,
    },
  ];

  return (
    <section id="pricing" className="py-20 sm:py-28">
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportTrigger}
        >
          {/* Section header */}
          <motion.div variants={fadeIn} className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {t("title")}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {t("subtitle")}
            </p>
          </motion.div>

          {/* Pricing cards */}
          <div className="mx-auto mb-16 grid max-w-4xl gap-8 md:grid-cols-2">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.nameKey}
                variants={cardEntrance}
                custom={index}
              >
                <Card
                  className={`relative flex h-full flex-col ${
                    pkg.popular
                      ? "border-primary shadow-lg shadow-primary/10"
                      : ""
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary px-3 py-1 text-sm">
                        {t("mostPopular")}
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl">{t(pkg.nameKey)}</CardTitle>
                    <CardDescription>{t(pkg.descriptionKey)}</CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <div className="mb-6">
                      <span className="text-4xl font-bold">
                        {PRICING.currency === "EUR" ? "€" : "$"}
                        {pkg.price}
                      </span>
                      {pkg.savings && (
                        <span className="ml-2 text-sm text-green-500">
                          {t("save")} €{pkg.savings}
                        </span>
                      )}
                    </div>

                    <ul className="space-y-3">
                      {pkg.featureKeys.map((featureKey) => (
                        <li
                          key={featureKey}
                          className="flex items-start gap-3 text-sm"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span>{t(featureKey)}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter>
                    <motion.div {...springHover} className="w-full">
                      <Button
                        asChild
                        className="w-full"
                        variant={pkg.popular ? "default" : "outline"}
                        size="lg"
                      >
                        <Link href="/order">
                          {tCommon("orderNow")}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </motion.div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Add-ons section */}
          <motion.div variants={fadeIn}>
            <div className="mx-auto max-w-2xl">
              <h3 className="mb-6 text-center text-lg font-semibold">
                {t("optionalAddons")}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {addOns.map((addon) => (
                  <div
                    key={addon.nameKey}
                    className="flex items-center gap-4 rounded-lg border border-border/60 bg-card/50 p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <addon.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{t(addon.nameKey)}</div>
                      <div className="text-sm text-muted-foreground">
                        {t(addon.descriptionKey)}
                      </div>
                    </div>
                    <div className="text-lg font-semibold">
                      +€{addon.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Additional info */}
          <motion.div variants={fadeIn} className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              <Clock className="mr-1 inline-block h-4 w-4" />
              {t("priceNote")} €{PRICING.additionalRevisionRate}{t("perHour")}.
            </p>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
