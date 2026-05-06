"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { BookOpen, Gift, LayoutDashboard, LogOut, Trophy, UserCircle, Wallet } from "lucide-react";
import { useAdmin } from "@/components/providers/AppProviders";
import { logout } from "@/lib/auth";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { label: "Profile", href: "/profile", icon: UserCircle },
  { label: "My Entries", href: "/entries", icon: Trophy },
  { label: "My Rewards", href: "/rewards", icon: Gift },
  { label: "Wallet", href: "/coins", icon: Wallet },
  { label: "Leaderboard", href: "/winners", icon: Trophy },
  { label: "Help & Rules", href: "/#how-it-works", icon: BookOpen }
];

export function ProfileSidebar() {
  const pathname = usePathname();
  const { user, isAdmin } = useAdmin();

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Logout failed.");
    }
  }

  return (
    <aside className="sticky top-24 hidden max-h-[calc(100vh-7rem)] w-64 shrink-0 overflow-hidden rounded-lg border border-sky-300/15 bg-[#030812]/86 shadow-[0_0_70px_rgba(14,165,233,0.12)] backdrop-blur-xl lg:flex lg:flex-col">
      <div className="border-b border-white/10 p-5">
        <a href="/" className="flex items-center gap-3" aria-label="EKALO home">
          <span className="relative h-12 w-12 overflow-hidden rounded-lg border border-sky-300/20 bg-black">
            <Image src="/images/brand/ekalo-logo.png" alt="" fill sizes="48px" className="object-cover" priority />
          </span>
          <span>
            <span className="block text-2xl font-black tracking-[0.18em] text-white">EKALO</span>
            <span className="text-xs font-semibold text-sky-200">One Gem. One Winner.</span>
          </span>
        </a>
      </div>

      <nav className="grid gap-2 p-4">
        {sidebarLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-4 py-3 font-semibold transition",
                isActive
                  ? "border-sky-300/55 bg-sky-400/15 text-sky-100 shadow-[0_0_32px_rgba(14,165,233,0.2)]"
                  : "border-transparent bg-transparent text-white/70 hover:border-sky-300/25 hover:bg-sky-400/10 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5 text-sky-300" aria-hidden="true" />
              {item.label}
            </a>
          );
        })}
        {isAdmin ? (
          <a
            href="/admin"
            className="flex items-center gap-3 rounded-lg border border-ekalo-gold/35 bg-ekalo-gold/10 px-4 py-3 font-semibold text-ekalo-gold transition hover:bg-ekalo-gold hover:text-black"
          >
            <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
            Admin Dashboard
          </a>
        ) : null}
      </nav>

      <div className="mt-auto border-t border-white/10 p-4">
        <div className="mb-4 rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <p className="text-lg font-black text-white">Keep Creating.</p>
          <p className="mt-1 text-lg font-black text-ekalo-gold">Keep Winning.</p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/55">One Talent. One Gem.</p>
        </div>
        {user ? (
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg border border-red-400/25 bg-red-500/10 px-4 py-3 font-semibold text-red-200 transition hover:border-red-300/60 hover:bg-red-500/20"
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
            Logout
          </button>
        ) : null}
      </div>
    </aside>
  );
}
