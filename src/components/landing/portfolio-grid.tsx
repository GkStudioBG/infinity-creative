"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Palette, Image as ImageIcon, Type, Printer, Sparkles } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { fadeIn, staggerContainer, viewportTrigger } from "@/lib/animations";
import { cn } from "@/lib/utils";

type ProjectType = "logo" | "banner" | "social" | "print" | "branding";

interface PortfolioItem {
  id: number;
  title: string;
  type: ProjectType;
  image: string;
  placeholder: boolean;
}

const typeConfig: Record<ProjectType, { label: string; icon: typeof Palette; color: string }> = {
  logo: { label: "Logo", icon: Sparkles, color: "bg-blue-500/10 text-blue-500" },
  banner: { label: "Banner", icon: ImageIcon, color: "bg-purple-500/10 text-purple-500" },
  social: { label: "Social Media", icon: ExternalLink, color: "bg-pink-500/10 text-pink-500" },
  print: { label: "Print", icon: Printer, color: "bg-orange-500/10 text-orange-500" },
  branding: { label: "Branding", icon: Type, color: "bg-green-500/10 text-green-500" },
};

const portfolioItems: PortfolioItem[] = [
  { id: 1, title: "Tech Startup Logo", type: "logo", image: "/images/portfolio/logo-1.webp", placeholder: true },
  { id: 2, title: "E-commerce Banner", type: "banner", image: "/images/portfolio/banner-1.webp", placeholder: true },
  { id: 3, title: "Instagram Campaign", type: "social", image: "/images/portfolio/social-1.webp", placeholder: true },
  { id: 4, title: "Brand Identity Kit", type: "branding", image: "/images/portfolio/branding-1.webp", placeholder: true },
  { id: 5, title: "Product Packaging", type: "print", image: "/images/portfolio/print-1.webp", placeholder: true },
  { id: 6, title: "Mobile App Icon", type: "logo", image: "/images/portfolio/logo-2.webp", placeholder: true },
  { id: 7, title: "LinkedIn Banner", type: "social", image: "/images/portfolio/social-2.webp", placeholder: true },
  { id: 8, title: "Event Flyer", type: "print", image: "/images/portfolio/print-2.webp", placeholder: true },
];

function PortfolioCard({ item, index }: { item: PortfolioItem; index: number }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const config = typeConfig[item.type];
  const Icon = config.icon;

  return (
    <motion.div
      variants={fadeIn}
      custom={index}
      className="group relative overflow-hidden rounded-xl border border-border/40 bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Image container with aspect ratio */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {item.placeholder || hasError ? (
          // Placeholder design
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <Icon className="mb-2 h-12 w-12 text-muted-foreground/30" />
            <span className="text-sm text-muted-foreground/50">{item.title}</span>
          </div>
        ) : (
          <>
            {/* Loading skeleton */}
            {!isLoaded && (
              <div className="absolute inset-0 animate-pulse bg-muted" />
            )}
            <Image
              src={item.image}
              alt={item.title}
              fill
              className={cn(
                "object-cover transition-all duration-500 group-hover:scale-105",
                isLoaded ? "opacity-100" : "opacity-0"
              )}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              loading="lazy"
              onLoad={() => setIsLoaded(true)}
              onError={() => setHasError(true)}
            />
          </>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Card content */}
      <div className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="secondary" className={cn("text-xs", config.color)}>
            <Icon className="mr-1 h-3 w-3" />
            {config.label}
          </Badge>
        </div>
        <h3 className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
          {item.title}
        </h3>
      </div>
    </motion.div>
  );
}

export function PortfolioGrid() {
  return (
    <section id="portfolio" className="py-20 sm:py-28">
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportTrigger}
        >
          {/* Section header */}
          <motion.div variants={fadeIn} className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Recent <span className="text-primary">Work</span>
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              A selection of designs delivered to satisfied clients. Same quality,
              same speed, every time.
            </p>
          </motion.div>

          {/* Portfolio grid */}
          <motion.div
            variants={staggerContainer}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {portfolioItems.map((item, index) => (
              <PortfolioCard key={item.id} item={item} index={index} />
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
