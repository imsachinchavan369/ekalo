import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdminShell } from "@/components/admin/dashboard/AdminShell";
import { AdminOverview } from "@/components/admin/dashboard/AdminOverview";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-ekalo-black">
      <Navbar />
      <main className="mx-auto max-w-[1320px] px-5 py-10 sm:px-8 lg:px-10">
        <AdminShell title="Admin Dashboard" description="Monitor EKALO operations, review creator activity, and manage platform workflows." active="Overview">
          <AdminOverview />
        </AdminShell>
      </main>
      <Footer />
    </div>
  );
}
