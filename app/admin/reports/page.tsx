import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdminShell } from "@/components/admin/dashboard/AdminShell";
import { AdminPlaceholderSection } from "@/components/admin/dashboard/AdminPlaceholderSection";

export default function AdminReportsPage() {
  return (
    <div className="min-h-screen bg-ekalo-black">
      <Navbar />
      <main className="mx-auto max-w-[1320px] px-5 py-10 sm:px-8 lg:px-10">
        <AdminShell title="Reports / Fraud" description="Review reported entries, monitor suspicious voting activity, and resolve fraud reports." active="Reports / Fraud">
          <AdminPlaceholderSection title="Fraud Operations" items={["View reported entries", "Inspect suspicious voting activity", "Mark reports resolved", "Escalate repeat offenders"]} />
        </AdminShell>
      </main>
      <Footer />
    </div>
  );
}
