"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { fadeIn, staggerContainer, springHover, viewportTrigger } from "@/lib/animations";

const benefits = [
  { icon: Clock, text: "48h Delivery" },
  { icon: Shield, text: "Fixed Price" },
  { icon: Zap, text: "No Meetings" },
];

export function CTASection() {
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
              Ready to Get Your Design?
            </motion.h2>

            {/* Subheadline */}
            <motion.p
              variants={fadeIn}
              className="mb-8 text-lg text-muted-foreground"
            >
              Stop waiting weeks for a simple design. Fill out the form, pay,
              and receive your work in 48 hours or less.
            </motion.p>

            {/* Benefits */}
            <motion.div
              variants={fadeIn}
              className="mb-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
            >
              {benefits.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" />
                  <span>{text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div variants={fadeIn}>
              <motion.div {...springHover} className="inline-block">
                <Button asChild size="lg" className="h-14 px-10 text-lg">
                  <Link href="/order">
                    Start Your Order
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
              Secure payment via Stripe. 2 revisions included in every order.
            </motion.p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
