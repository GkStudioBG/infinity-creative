"use client";

import { motion } from "framer-motion";
import { FileText, CreditCard, Package } from "lucide-react";
import { Container } from "@/components/layout/container";
import { fadeIn, staggerContainer, cardEntrance, viewportTrigger } from "@/lib/animations";

const steps = [
  {
    icon: FileText,
    title: "1. Describe",
    description:
      "Fill out our simple form with your project details, requirements, and reference materials.",
  },
  {
    icon: CreditCard,
    title: "2. Pay",
    description:
      "Choose your package and complete payment securely. The timer starts immediately.",
  },
  {
    icon: Package,
    title: "3. Receive",
    description:
      "Get your professional design delivered to your inbox within 48 hours (or 24h with express).",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28">
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
              How it Works
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Three simple steps to get your design. No calls, no meetings, no
              hassle.
            </p>
          </motion.div>

          {/* Steps grid */}
          <div className="relative grid gap-8 md:grid-cols-3 md:gap-12">
            {/* Connection line (visible on desktop) */}
            <div className="absolute left-0 right-0 top-12 hidden h-0.5 bg-gradient-to-r from-transparent via-border to-transparent md:block" />

            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                variants={cardEntrance}
                custom={index}
                className="relative"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Icon container */}
                  <div className="relative mb-6">
                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-border/60 bg-card shadow-lg">
                      <step.icon className="h-10 w-10 text-primary" />
                    </div>
                    {/* Step number badge */}
                    <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="mb-3 text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
