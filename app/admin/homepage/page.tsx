import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdminShell } from "@/components/admin/dashboard/AdminShell";
import { HomepageContentAdmin } from "@/components/admin/dashboard/HomepageContentAdmin";

export default function AdminHomepagePage() {
  return (
    <div className="min-h-screen bg-ekalo-black">
      <Navbar />
      <main className="mx-auto max-w-[1320px] px-5 py-10 sm:px-8 lg:px-10">
        <AdminShell title="Homepage Content" description="Manage homepage content already connected to Firestore, including hero copy, images, stats, winner card, and final CTA." active="Homepage Content">
          <HomepageContentAdmin />
        </AdminShell>
      </main>
      <Footer />
    </div>
  );
}
