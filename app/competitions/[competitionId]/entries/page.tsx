import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { CompetitionEntriesPageClient } from "@/components/competition/CompetitionEntriesPageClient";

export default async function CompetitionEntriesPage({ params }: { params: Promise<{ competitionId: string }> }) {
  const { competitionId } = await params;

  return (
    <div className="min-h-screen bg-ekalo-black">
      <Navbar />
      <main className="mx-auto max-w-[1320px] px-5 py-10 sm:px-8 lg:px-10">
        <CompetitionEntriesPageClient competitionId={competitionId} />
      </main>
      <Footer />
    </div>
  );
}
