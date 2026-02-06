"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    // Remove current locale prefix and add new one
    const pathWithoutLocale = pathname.replace(/^\/(en|bg)/, "") || "/";
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <div className="flex items-center rounded-md border border-border/40">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => switchLocale("en")}
        className={cn(
          "h-8 rounded-r-none px-2 text-xs font-medium",
          locale === "en"
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        EN
      </Button>
      <div className="h-4 w-px bg-border/40" />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => switchLocale("bg")}
        className={cn(
          "h-8 rounded-l-none px-2 text-xs font-medium",
          locale === "bg"
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        BG
      </Button>
    </div>
  );
}
