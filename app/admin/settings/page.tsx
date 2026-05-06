import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdminShell } from "@/components/admin/dashboard/AdminShell";
import { AdminPlaceholderSection } from "@/components/admin/dashboard/AdminPlaceholderSection";

export default function AdminSettingsPage() {
  return (
    <div className="min-h-screen bg-ekalo-black">
      <Navbar />
      <main className="mx-auto max-w-[1320px] px-5 py-10 sm:px-8 lg:px-10">
        <AdminShell title="Settings" description="Prepare platform defaults for voting limits, cooldowns, currency, admin email, and community rules." active="Settings">
          <AdminPlaceholderSection title="Platform Settings" items={["Default vote limit", "Vote cooldown seconds", "Default currency", "Admin email", "Community rules"]} />
        </AdminShell>
      </main>
      <Footer />
    </div>
  );
}
