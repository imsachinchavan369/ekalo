import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RewardsPageClient } from "@/components/rewards/RewardsPageClient";

export default function RewardsPage() {
  return (
    <div className="min-h-screen bg-ekalo-black">
      <Navbar />
      <main className="mx-auto grid max-w-[1320px] gap-6 px-5 py-10 sm:px-8 lg:px-10">
        <div>
          <p className="text-ekalo-gold">My Rewards</p>
          <h1 className="mt-2 text-4xl font-extrabold text-white">Winning Records</h1>
          <p className="mt-3 max-w-3xl text-white/65">
            Rewards shown here are official EKALO winning records. In V1, payouts are manually verified and paid via UPI by EKALO admin.
          </p>
        </div>
        <RewardsPageClient />
      </main>
      <Footer />
    </div>
  );
}
