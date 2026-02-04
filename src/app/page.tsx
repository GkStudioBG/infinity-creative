import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-6xl">
          Design in 48 Hours.
          <br />
          <span className="text-primary">No Meetings.</span>
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Professional design services delivered fast. No scope creep, no endless revisions. Just
          quality design at a fixed price.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/order">Order Now</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="#pricing">View Pricing</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
