import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdminShell } from "@/components/admin/dashboard/AdminShell";
import { AdminChallengesPanel } from "@/components/admin/challenges/AdminChallengesPanel";

export default function AdminChallengesPage() {
  return (
    <div className="min-h-screen bg-ekalo-black">
      <Navbar />
      <main className="mx-auto max-w-[1320px] px-5 py-10 sm:px-8 lg:px-10">
        <AdminShell title="Challenge Creation" description="Create image or video leagues, configure entry mode, upload cover media, and manage challenge lifecycle." active="Challenges">
          <div className="grid gap-6">
            <AdminChallengesPanel />
          </div>
        </AdminShell>
      </main>
      <Footer />
    </div>
  );
}
