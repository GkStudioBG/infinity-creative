"use client";

import Link from "next/link";
import { Container } from "./container";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  showCta?: boolean;
}

export function Header({ showCta = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/#how-it-works"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              How it Works
            </Link>
            <Link
              href="/#pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              href="/#portfolio"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Portfolio
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Track Order
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {showCta && (
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <Link href="/order">Order Now</Link>
              </Button>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
}
