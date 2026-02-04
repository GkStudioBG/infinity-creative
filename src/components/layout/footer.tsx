import Link from "next/link";
import { Container } from "./container";
import { Logo } from "@/components/shared/logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-card">
      <Container className="py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Professional design services delivered in 48 hours. No meetings, no scope creep.
              Just quality design at a fixed price.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/#how-it-works"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  How it Works
                </Link>
              </li>
              <li>
                <Link
                  href="/#pricing"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/#portfolio"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="/order"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Order Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Support</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/dashboard"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link
                  href="/#rules"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@infinity.design"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Infinity Creative Ltd. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            All prices exclude VAT where applicable.
          </p>
        </div>
      </Container>
    </footer>
  );
}
