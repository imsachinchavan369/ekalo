import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdminShell } from "@/components/admin/dashboard/AdminShell";
import { AdminCompetitionManagement } from "@/components/admin/competitions/AdminCompetitionManagement";

export default function AdminCompetitionsPage() {
  return (
    <div className="min-h-screen bg-ekalo-black">
      <Navbar />
      <main className="mx-auto max-w-[1320px] px-5 py-10 sm:px-8 lg:px-10">
        <AdminShell title="Competition Management" description="Create, schedule, publish, feature, and end real competitions across EKALO categories." active="Competitions">
          <AdminCompetitionManagement />
        </AdminShell>
      </main>
      <Footer />
    </div>
  );
}
