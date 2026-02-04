"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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

const packages = [
  {
    name: "Single Design",
    description: "Perfect for one-off projects",
    price: PRICING.singleDesign,
    popular: false,
    features: [
      `${DELIVERY_TIMES.standard}h standard delivery`,
      `${REVISIONS_INCLUDED} rounds of revisions`,
      "All major file formats",
      "Commercial usage rights",
    ],
  },
  {
    name: "Pack of 5",
    description: "Best value for multiple designs",
    price: PRICING.packOfFive,
    popular: true,
    savings: PRICING.singleDesign * 5 - PRICING.packOfFive,
    features: [
      `${DELIVERY_TIMES.standard}h delivery per design`,
      `${REVISIONS_INCLUDED} revisions per design`,
      "All major file formats",
      "Commercial usage rights",
      "Priority support",
    ],
  },
];

const addOns = [
  {
    icon: Zap,
    name: "Express Delivery",
    description: `Under ${DELIVERY_TIMES.express}h`,
    price: PRICING.expressFee,
  },
  {
    icon: FileCode,
    name: "Source Files",
    description: "PSD/AI included",
    price: PRICING.sourceFilesFee,
  },
];

export function PricingTable() {
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
              Simple, Transparent Pricing
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              No hidden fees. No hourly rates. Just flat-rate design services
              delivered on time.
            </p>
          </motion.div>

          {/* Pricing cards */}
          <div className="mx-auto mb-16 grid max-w-4xl gap-8 md:grid-cols-2">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
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
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl">{pkg.name}</CardTitle>
                    <CardDescription>{pkg.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <div className="mb-6">
                      <span className="text-4xl font-bold">
                        {PRICING.currency === "EUR" ? "€" : "$"}
                        {pkg.price}
                      </span>
                      {pkg.savings && (
                        <span className="ml-2 text-sm text-green-500">
                          Save €{pkg.savings}
                        </span>
                      )}
                    </div>

                    <ul className="space-y-3">
                      {pkg.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 text-sm"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span>{feature}</span>
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
                          Order Now
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
                Optional Add-ons
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {addOns.map((addon) => (
                  <div
                    key={addon.name}
                    className="flex items-center gap-4 rounded-lg border border-border/60 bg-card/50 p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <addon.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{addon.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {addon.description}
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
              All prices exclude VAT. Additional revisions billed at €
              {PRICING.additionalRevisionRate}/hour.
            </p>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
