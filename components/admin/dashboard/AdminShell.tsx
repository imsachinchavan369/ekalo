"use client";

import { BarChart3, FileText, Flag, FolderTree, Gift, Home, LayoutDashboard, Settings, ShieldAlert, Trophy, UsersRound } from "lucide-react";
import { AdminGuard } from "@/components/admin/AdminGuard";

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Competitions", href: "/admin/competitions", icon: Trophy },
  { label: "Challenges", href: "/admin/challenges", icon: Trophy },
  { label: "Entries Review", href: "/admin/entries", icon: FileText },
  { label: "Winners", href: "/admin/winners", icon: Flag },
  { label: "Rewards", href: "/admin/rewards", icon: Gift },
  { label: "Users", href: "/admin/users", icon: UsersRound },
  { label: "Reports / Fraud", href: "/admin/reports", icon: ShieldAlert },
  { label: "Homepage Content", href: "/admin/homepage", icon: Home },
  { label: "Settings", href: "/admin/settings", icon: Settings }
];

export function AdminShell({ title, description, active, children }: { title: string; description: string; active: string; children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-lg border border-ekalo-line bg-black/45 p-4 shadow-card lg:sticky lg:top-28 lg:h-fit">
          <div className="mb-5 flex items-center gap-3 rounded-lg border border-ekalo-gold/30 bg-ekalo-gold/10 p-3">
            <BarChart3 className="h-5 w-5 text-ekalo-gold" aria-hidden="true" />
            <div>
              <p className="text-sm font-bold text-white">EKALO Admin</p>
              <p className="text-xs text-white/55">Control center</p>
            </div>
          </div>
          <nav className="grid gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={
                  active === item.label
                    ? "flex items-center gap-3 rounded-lg border border-ekalo-gold/40 bg-ekalo-gold/15 px-3 py-2.5 text-sm font-semibold text-ekalo-gold"
                    : "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-white/65 transition hover:bg-white/5 hover:text-white"
                }
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </a>
            ))}
          </nav>
        </aside>
        <section className="min-w-0">
          <div className="mb-6">
            <p className="text-ekalo-gold">{active}</p>
            <h1 className="mt-2 text-4xl font-extrabold text-white">{title}</h1>
            <p className="mt-3 max-w-3xl text-white/65">{description}</p>
          </div>
          {children}
        </section>
      </div>
    </AdminGuard>
  );
}
