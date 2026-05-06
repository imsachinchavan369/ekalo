import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EntryDetailClient } from "@/components/challenge/EntryDetailClient";

export default async function EntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-ekalo-black">
      <Navbar />
      <main className="mx-auto max-w-[1100px] px-5 py-12 sm:px-8 lg:px-10">
        <EntryDetailClient entryId={id} />
      </main>
      <Footer />
    </div>
  );
}
