import { Navbar } from "@/modules/home/ui/components/navbar";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <main className="flex flex-col min-h-screen max-h-screen">
      <Navbar />
      <div
        className="absolute inset-0 -z-10 h-full w-full 
  bg-background 
  bg-[radial-gradient(rgba(57,62,74,0.3)_1px,transparent_1px)] 
  dark:bg-[radial-gradient(rgba(218,221,226,0.3)_1px,transparent_1px)] 
  [background-size:16px_16px] 
  opacity-70"
      />

      <div className="flex-1 flex flex-col px-4 pb-4 ">{children}</div>
    </main>
  );
}
