import { setRequestLocale, getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FormWrapper } from "@/components/order-form";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.order" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function OrderPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <FormWrapper />
      <Footer />
    </>
  );
}
