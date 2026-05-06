import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { InitializeHomepageContent } from "@/components/admin/InitializeHomepageContent";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { LiveChallengesSection } from "@/components/home/LiveChallengesSection";
import { StatsStrip } from "@/components/home/StatsStrip";
import { TrendingEntriesSection } from "@/components/home/TrendingEntriesSection";

export function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-radial-gold">
      <Navbar />
      <main className="mx-auto max-w-[1320px] px-5 pb-10 pt-8 sm:px-8 lg:px-10">
        <InitializeHomepageContent />
        <HeroSection />
        <StatsStrip />
        <LiveChallengesSection />
        <TrendingEntriesSection />
        <HowItWorksSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  );
}
