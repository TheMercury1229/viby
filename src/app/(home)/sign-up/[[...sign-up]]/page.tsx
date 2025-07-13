"use client";
import { SignUp } from "@clerk/nextjs";
import { useCurrentTheme } from "@/hooks/use-current-theme";
import { dark } from "@clerk/themes";
export default function SignupPage() {
  const currentTheme = useCurrentTheme();

  return (
    <div className="flex flex-col max-w-3xl mx-auto w-full">
      <section className="space-y-6 pt-[16vh] xl:pt-[120px]">
        <div className="flex flex-col items-center">
          <SignUp
            appearance={{
              baseTheme: currentTheme === "dark" ? dark : undefined,
              elements: {
                cardBox: "border! shadow-none! rounded-lg!",
              },
            }}
          />
        </div>
      </section>
    </div>
  );
}
