"use client";
import Image from "next/image";

import { PricingTable } from "@clerk/nextjs";
import { useCurrentTheme } from "@/hooks/use-current-theme";
import { dark } from "@clerk/themes";

export default function PricingPage() {
  const currentTheme = useCurrentTheme();
  return (
    <div className="flex flex-col max-w-3xl mx-auto w-full">
      <section className="space-y-6 pt-[16vh] xl:pt-[120px]">
        <div className="flex flex-col items-center">
          <Image
            src="/logo.svg"
            alt="Viby Logo"
            width={50}
            height={50}
            className="hidden md:block"
          />
        </div>
        <h1 className="text-xl md:text-3xl font-bold text-center">Pricing</h1>
        <p className="text-muted-foreground text-center text-sm md:text-base">
          Choose the plan that fits your needs. Viby offers a free tier to get
          you started, with premium features available for those who need more
          power and flexibility.
        </p>
        <PricingTable
          appearance={{
            baseTheme: currentTheme === "dark" ? dark : undefined,
            elements: {
              pricingTableCards: "border! shadow-none! rounded-lg!",
            },
          }}
        />
      </section>
    </div>
  );
}
