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

export default function Home() {
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
