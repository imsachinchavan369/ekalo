import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { CoinsPageClient } from "@/components/coins/CoinsPageClient";

export default function CoinsPage() {
  return (
    <div className="min-h-screen bg-ekalo-black">
      <Navbar />
      <main className="mx-auto max-w-[1320px] px-5 py-10 sm:px-8 lg:px-10">
        <div className="mb-8">
          <p className="text-ekalo-gold">Coin Shop</p>
          <h1 className="mt-2 text-4xl font-extrabold text-white">EKALO Coins</h1>
          <p className="mt-3 max-w-3xl text-white/65">Prepare for future boosts and premium visibility. Payments are not enabled yet.</p>
        </div>
        <CoinsPageClient />
      </main>
      <Footer />
    </div>
  );
}
