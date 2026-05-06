import { CreatorProfileClient } from "@/components/creator/CreatorProfileClient";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default async function CreatorPage({ params }: { params: Promise<{ creatorId: string }> }) {
  const { creatorId } = await params;

  return (
    <div className="min-h-screen bg-ekalo-black">
      <Navbar />
      <main className="mx-auto max-w-[1320px] px-5 py-10 sm:px-8 lg:px-10">
        <CreatorProfileClient creatorId={creatorId} />
      </main>
      <Footer />
    </div>
  );
}
