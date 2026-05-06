import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TrendingEntriesSection } from "@/components/home/TrendingEntriesSection";

export default function WinnersPage() {
  return (
    <div className="min-h-screen bg-ekalo-black">
      <Navbar />
      <main className="mx-auto max-w-[1320px] px-5 py-10 sm:px-8 lg:px-10">
        <TrendingEntriesSection />
      </main>
      <Footer />
    </div>
  );
}
