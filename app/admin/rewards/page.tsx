import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdminShell } from "@/components/admin/dashboard/AdminShell";
import { AdminRewardForm } from "@/components/admin/AdminRewardForm";
import { AdminRewardsList } from "@/components/admin/AdminRewardsList";

export default function AdminRewardsPage() {
  return (
    <div className="min-h-screen bg-ekalo-black">
      <Navbar />
      <main className="mx-auto max-w-[1320px] px-5 py-10 sm:px-8 lg:px-10">
        <AdminShell title="Rewards" description="Create official winning records, update manual payout status, add paid dates, and store payment notes." active="Rewards">
          <div className="grid gap-6">
            <AdminRewardForm />
            <AdminRewardsList />
          </div>
        </AdminShell>
      </main>
      <Footer />
    </div>
  );
}
