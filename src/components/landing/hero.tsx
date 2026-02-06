"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight, Clock, CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { fadeIn, staggerContainer, springHover } from "@/lib/animations";

export function Hero() {
  const t = useTranslations("hero");
  const tCommon = useTranslations("common");

  return (
    <section className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[500px] w-[800px] rounded-full bg-primary/10 blur-[120px]" />
        </div>
      </div>

      <Container>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-4xl text-center"
        >
          {/* Badge */}
          <motion.div variants={fadeIn} className="mb-6 inline-flex">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-4 py-2 text-sm text-muted-foreground backdrop-blur-sm">
              <Zap className="h-4 w-4 text-primary" />
              {t("badge")}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeIn}
            className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            {t("title")}
            <br />
            <span className="text-primary">{t("titleHighlight")}</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeIn}
            className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          >
            {t("subtitle")}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeIn}
            className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <motion.div {...springHover}>
              <Button asChild size="lg" className="h-12 px-8 text-base">
                <Link href="/order">
                  {tCommon("orderNow")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
            <motion.div {...springHover}>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 px-8 text-base"
              >
                <Link href="#pricing">{tCommon("viewPricing")}</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={fadeIn}
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>{t("trust48h")}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>{t("trustRevisions")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span>{t("trustFixed")}</span>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
