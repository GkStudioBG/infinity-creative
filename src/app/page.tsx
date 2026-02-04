import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero, HowItWorks } from "@/components/landing";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Hero />
        <HowItWorks />
        {/* Additional sections will be added in subsequent steps:
            - Pricing Table
            - Rules
            - Portfolio Grid
            - CTA Section
        */}
      </main>
      <Footer />
    </>
  );
}
