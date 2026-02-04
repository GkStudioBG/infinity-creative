"use client";

import { motion } from "framer-motion";
import { AlertCircle, Clock, RefreshCw, FileText, Shield } from "lucide-react";
import { Container } from "@/components/layout/container";
import {
  fadeIn,
  staggerContainer,
  cardEntrance,
  viewportTrigger,
} from "@/lib/animations";
import { PRICING, REVISIONS_INCLUDED } from "@/lib/constants";

const rules = [
  {
    icon: Clock,
    title: "Timer Starts After Payment",
    description:
      "Your delivery countdown begins immediately after successful payment. No delays, no waiting for confirmation calls.",
  },
  {
    icon: RefreshCw,
    title: `${REVISIONS_INCLUDED} Revisions Included`,
    description:
      "Every order includes 2 rounds of minor revisions. Feedback must be clear and consolidated in one message.",
  },
  {
    icon: FileText,
    title: "No Scope Changes",
    description:
      "Changes to the original brief after work has started are treated as new requests and billed separately.",
  },
  {
    icon: Shield,
    title: "Clear Communication",
    description:
      "We deliver what you describe. The more detailed your brief, the better the result. No mind-reading required.",
  },
];

export function Rules() {
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
              Important: Please Read
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              The Rules
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Clear expectations lead to great results. Here&apos;s how we keep
              prices low and delivery fast.
            </p>
          </motion.div>

          {/* Rules grid */}
          <div className="mb-12 grid gap-6 md:grid-cols-2">
            {rules.map((rule, index) => (
              <motion.div
                key={rule.title}
                variants={cardEntrance}
                custom={index}
                className="flex gap-4 rounded-lg border border-border/60 bg-card p-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <rule.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">{rule.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {rule.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Policy statement */}
          <motion.div variants={fadeIn}>
            <div className="mx-auto max-w-3xl rounded-lg border border-border/60 bg-background p-6 sm:p-8">
              <h3 className="mb-4 text-lg font-semibold">Our Policy</h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  We value your time and our own. To maintain competitive prices
                  and fast delivery, we operate on a fixed process.
                </p>
                <p>
                  Every order includes{" "}
                  <span className="font-medium text-foreground">
                    {REVISIONS_INCLUDED} rounds of minor revisions
                  </span>
                  . Revisions must address small adjustments (color tweaks, text
                  changes, minor repositioning) — not fundamental redesigns.
                </p>
                <p>
                  Changes to the brief after work has started, or additional
                  revision rounds beyond the included{" "}
                  {REVISIONS_INCLUDED}, are billed at{" "}
                  <span className="font-medium text-foreground">
                    €{PRICING.additionalRevisionRate}/hour
                  </span>
                  .
                </p>
                <p className="border-t border-border/60 pt-4 text-xs">
                  By placing an order, you agree to these terms. Questions?
                  Email us before ordering.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
