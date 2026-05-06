import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ProfilePageClient } from "@/components/profile/ProfilePageClient";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";

export default function ProfilePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#02050b]">
      <Navbar />
      <main className="relative mx-auto max-w-[1320px] px-4 py-6 sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_50%_0%,rgba(33,167,255,0.18),transparent_34rem)]" aria-hidden="true" />
        <div className="relative mb-6">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-sky-300">Creator Profile</p>
          <h1 className="mt-2 text-4xl font-black text-white sm:text-5xl">EKALO Profile</h1>
          <p className="mt-3 max-w-3xl text-white/65">One Talent. One Gem. One Winner.</p>
        </div>
        <div className="relative flex items-start gap-6">
          <ProfileSidebar />
          <div className="min-w-0 flex-1">
            <ProfilePageClient />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
