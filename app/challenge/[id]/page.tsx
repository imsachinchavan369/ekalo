import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChallengeDetailClient } from "@/components/challenge/ChallengeDetailClient";

export default async function ChallengeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-ekalo-black">
      <Navbar />
      <main className="mx-auto max-w-[1320px] px-5 py-12 sm:px-8 lg:px-10">
        <ChallengeDetailClient slugOrId={id} />
      </main>
      <Footer />
    </div>
  );
}
