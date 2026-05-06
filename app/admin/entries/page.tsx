import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdminShell } from "@/components/admin/dashboard/AdminShell";
import { AdminEntryReview } from "@/components/admin/AdminEntryReview";

export default function AdminEntriesPage() {
  return (
    <div className="min-h-screen bg-ekalo-black">
      <Navbar />
      <main className="mx-auto max-w-[1320px] px-5 py-10 sm:px-8 lg:px-10">
        <AdminShell title="Entries Review" description="Filter entries by challenge and status, approve or reject work, mark suspicious activity, and add quality scores." active="Entries Review">
          <AdminEntryReview />
        </AdminShell>
      </main>
      <Footer />
    </div>
  );
}
