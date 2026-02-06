import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const t = useTranslations("notFound");
  const tCommon = useTranslations("common");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6">
          <h1 className="mb-2 text-9xl font-bold text-primary">404</h1>
          <div className="mx-auto h-1 w-24 bg-primary" />
        </div>

        <h2 className="mb-3 text-3xl font-bold">{t("title")}</h2>
        <p className="mb-8 text-lg text-muted-foreground">{t("subtitle")}</p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/">{tCommon("goToHomepage")}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/order">{tCommon("placeAnOrder")}</Link>
          </Button>
        </div>

        <div className="mt-12 text-sm text-muted-foreground">
          <p>{t("helpText")}</p>
        </div>
      </div>
    </div>
  );
}
