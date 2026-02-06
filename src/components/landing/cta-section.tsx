"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight, Clock, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { fadeIn, staggerContainer, springHover, viewportTrigger } from "@/lib/animations";

export function CTASection() {
  const t = useTranslations("cta");

  const benefits = [
    { icon: Clock, textKey: "benefit48h" },
    { icon: Shield, textKey: "benefitFixed" },
    { icon: Zap, textKey: "benefitNoMeetings" },
  ];

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportTrigger}
          className="relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-card via-card to-primary/5 px-6 py-16 sm:px-12 sm:py-20"
        >
          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[100px]" />
            <div className="absolute -bottom-20 -left-20 h-[200px] w-[200px] rounded-full bg-primary/5 blur-[80px]" />
          </div>

          <div className="mx-auto max-w-3xl text-center">
            {/* Headline */}
            <motion.h2
              variants={fadeIn}
              className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
            >
              {t("title")}
            </motion.h2>

            {/* Subheadline */}
            <motion.p
              variants={fadeIn}
              className="mb-8 text-lg text-muted-foreground"
            >
              {t("subtitle")}
            </motion.p>

            {/* Benefits */}
            <motion.div
              variants={fadeIn}
              className="mb-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
            >
              {benefits.map(({ icon: Icon, textKey }) => (
                <div key={textKey} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" />
                  <span>{t(textKey)}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div variants={fadeIn}>
              <motion.div {...springHover} className="inline-block">
                <Button asChild size="lg" className="h-14 px-10 text-lg">
                  <Link href="/order">
                    {t("buttonText")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Trust note */}
            <motion.p
              variants={fadeIn}
              className="mt-6 text-xs text-muted-foreground"
            >
              {t("trustNote")}
            </motion.p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
