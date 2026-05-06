import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdminShell } from "@/components/admin/dashboard/AdminShell";
import { AdminPlaceholderSection } from "@/components/admin/dashboard/AdminPlaceholderSection";

export default function AdminUsersPage() {
  return (
    <div className="min-h-screen bg-ekalo-black">
      <Navbar />
      <main className="mx-auto max-w-[1320px] px-5 py-10 sm:px-8 lg:px-10">
        <AdminShell title="Users" description="Search users, review account status, block or unblock accounts, and manage role assignments." active="Users">
          <AdminPlaceholderSection title="User Management" items={["View and search users", "Block or unblock suspicious accounts", "Set role user/admin", "Review device and account history"]} />
        </AdminShell>
      </main>
      <Footer />
    </div>
  );
}
