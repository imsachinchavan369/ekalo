import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdminShell } from "@/components/admin/dashboard/AdminShell";
import { AdminCategoryManagement } from "@/components/admin/categories/AdminCategoryManagement";

export default function AdminCategoriesPage() {
  return (
    <div className="min-h-screen bg-ekalo-black">
      <Navbar />
      <main className="mx-auto max-w-[1320px] px-5 py-10 sm:px-8 lg:px-10">
        <AdminShell title="Category Management" description="Add, edit, hide, unhide, activate, and schedule EKALO categories." active="Categories">
          <AdminCategoryManagement />
        </AdminShell>
      </main>
      <Footer />
    </div>
  );
}
