import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChallengeListClient } from "@/components/challenge/ChallengeListClient";

export default function ChallengesPage() {
  return (
    <div className="min-h-screen bg-ekalo-black">
      <Navbar />
      <main className="mx-auto grid max-w-[1320px] gap-6 px-5 py-10 sm:px-8 lg:px-10">
        <div>
          <p className="text-ekalo-gold">EKALO Challenges</p>
          <h1 className="mt-2 text-4xl font-extrabold text-white">Join Creator Leagues</h1>
          <p className="mt-3 text-white/65">Submit image or video entries, get votes, get ranked, and win real rewards.</p>
        </div>
        <ChallengeListClient />
      </main>
      <Footer />
    </div>
  );
}
