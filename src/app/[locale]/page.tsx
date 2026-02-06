import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  Hero,
  HowItWorks,
  PricingTable,
  Rules,
  PortfolioGrid,
  CTASection,
} from "@/components/landing";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Hero />
        <HowItWorks />
        <PricingTable />
        <Rules />
        <PortfolioGrid />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
