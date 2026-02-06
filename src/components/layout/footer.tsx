"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Container } from "./container";
import { Logo } from "@/components/shared/logo";

export function Footer() {
  const t = useTranslations("footer");
  const tHeader = useTranslations("header");
  const tCommon = useTranslations("common");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-card">
      <Container className="py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              {t("description")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">{t("quickLinks")}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/#how-it-works"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {tHeader("howItWorks")}
                </Link>
              </li>
              <li>
                <Link
                  href="/#pricing"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {tHeader("pricing")}
                </Link>
              </li>
              <li>
                <Link
                  href="/#portfolio"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {tHeader("portfolio")}
                </Link>
              </li>
              <li>
                <Link
                  href="/order"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {tCommon("orderNow")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">{t("support")}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/dashboard"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {tHeader("trackOrder")}
                </Link>
              </li>
              <li>
                <Link
                  href="/#rules"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("termsConditions")}
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@infinity.design"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("contact")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} {t("copyright")}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("vatNote")}
          </p>
        </div>
      </Container>
    </footer>
  );
}
