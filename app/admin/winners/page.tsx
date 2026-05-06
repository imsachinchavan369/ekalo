import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdminShell } from "@/components/admin/dashboard/AdminShell";
import { AdminPlaceholderSection } from "@/components/admin/dashboard/AdminPlaceholderSection";

export default function AdminWinnersPage() {
  return (
    <div className="min-h-screen bg-ekalo-black">
      <Navbar />
      <main className="mx-auto max-w-[1320px] px-5 py-10 sm:px-8 lg:px-10">
        <AdminShell title="Winners" description="Select winners, assign ranks, lock results, and prepare published winner announcements." active="Winners">
          <AdminPlaceholderSection title="Winner Workflow" items={["Select winners from approved entries", "Assign rank and prize amount", "Lock final results", "Publish winners publicly"]} />
        </AdminShell>
      </main>
      <Footer />
    </div>
  );
}
