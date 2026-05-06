import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { LevelsPageClient } from "@/components/levels/LevelsPageClient";

export default function LevelsPage() {
  return (
    <div className="min-h-screen bg-ekalo-black">
      <Navbar />
      <main className="mx-auto max-w-[1320px] px-5 py-10 sm:px-8 lg:px-10">
        <div className="mb-8">
          <p className="text-ekalo-gold">Level System</p>
          <h1 className="mt-2 text-4xl font-extrabold text-white">Creator Levels</h1>
          <p className="mt-3 max-w-3xl text-white/65">Only valid votes count. Each level unlocks coins and keeps the next milestone in sight.</p>
        </div>
        <LevelsPageClient />
      </main>
      <Footer />
    </div>
  );
}
