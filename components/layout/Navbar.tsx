"use client";

import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { BookOpen, ChevronDown, Gift, LayoutDashboard, LogOut, Menu, Mic2, Sparkles, Trophy, UserCircle, Wallet, X } from "lucide-react";
import { AuthActions } from "@/components/layout/AuthActions";
import { InlineEditButton } from "@/components/admin/InlineEditButton";
import { useAdmin, useSiteContent } from "@/components/providers/AppProviders";
import { logout } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { defaultCategories, listenToCategories } from "@/lib/categories";
import type { Category } from "@/types/category";
import { useEffect } from "react";

const navLinks = [
  { label: "Rap Battles", href: "/#battles" },
  { label: "Rappers", href: "/#leaderboard" },
  { label: "Winners", href: "/winners" },
  { label: "Leaderboard", href: "/#leaderboard" },
  { label: "How It Works", href: "/#how-it-works" }
];

const accountLinks = [
  { label: "Profile", href: "/profile", icon: UserCircle },
  { label: "My Entries", href: "/entries", icon: Trophy },
  { label: "My Rewards", href: "/rewards", icon: Gift },
  { label: "Wallet", href: "/coins", icon: Wallet },
  { label: "Leaderboard", href: "/winners", icon: Trophy },
  { label: "Help & Rules", href: "/#how-it-works", icon: BookOpen }
];

export function Navbar() {
  const { content } = useSiteContent();
  const { user, isAdmin } = useAdmin();
  const pathname = usePathname();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const isProfilePage = pathname === "/profile";

  useEffect(() => {
    try {
      return listenToCategories(setCategories);
    } catch {
      setCategories(defaultCategories.filter((item) => item.isVisible && item.status !== "hidden"));
      return () => undefined;
    }
  }, []);

  async function handleLogout() {
    try {
      await logout();
      setIsMobileDrawerOpen(false);
      setIsProfileDrawerOpen(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Logout failed.");
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-2xl">
      <nav className="relative mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
        <InlineEditButton
          title="Navbar"
          fields={[
            { name: "logoText", label: "Logo text", value: content.navbar.logoText },
            { name: "tagline", label: "Tagline", value: content.navbar.tagline }
          ]}
          buildUpdates={(values) => ({
            "navbar.logoText": values.logoText,
            "navbar.tagline": values.tagline
          })}
          className="right-16 top-2"
        />
        <a href="/" className="flex shrink-0 items-center gap-3" aria-label="EKALO home">
          <span className="relative h-11 w-11 overflow-hidden rounded-lg border border-sky-300/20 bg-black shadow-[0_0_24px_rgba(33,167,255,0.2)]">
            <Image src="/images/brand/ekalo-logo.png" alt="" fill sizes="44px" className="object-cover" priority />
          </span>
          <span>
            <span className="block text-3xl font-extrabold leading-none text-white">{content.navbar.logoText}</span>
            <span className="mt-1 hidden text-sm text-white/80 sm:block">{content.navbar.tagline}</span>
          </span>
        </a>

        <div className="hidden items-center gap-12 lg:flex">
          <div className="flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === "/" && link.href.startsWith("/#");
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "pb-2 font-semibold transition hover:text-ekalo-gold",
                    isActive && link.href === "/#battles" ? "border-b-2 border-ekalo-gold text-white" : "text-white/85"
                  )}
                >
                  {link.label}
                </a>
              );
            })}
          </div>
          <div className="relative flex rounded-lg border border-white/10 bg-white/[0.04] p-1">
            <a href="/" className={cn("inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-black transition", pathname === "/" ? "bg-ekalo-gold text-black" : "text-white/70 hover:bg-white/8 hover:text-white")}>
              <Mic2 className="h-4 w-4" aria-hidden="true" />
              Rap
            </a>
            <button type="button" onClick={() => setIsCategoryMenuOpen((value) => !value)} className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-black text-white/70 transition hover:bg-white/8 hover:text-white" aria-expanded={isCategoryMenuOpen}>
              More / Categories
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </button>
            {isCategoryMenuOpen ? (
              <CategoryMenu categories={categories} pathname={pathname} onClose={() => setIsCategoryMenuOpen(false)} />
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <AuthActions />
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={isProfilePage ? isProfileDrawerOpen : isMobileDrawerOpen}
            onClick={() => {
              if (isProfilePage) {
                setIsProfileDrawerOpen(true);
                return;
              }
              setIsMobileDrawerOpen(true);
            }}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition hover:border-sky-300/50 hover:bg-sky-400/10 lg:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </nav>
      {isMobileDrawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsMobileDrawerOpen(false)} />
          <aside className="absolute right-0 top-0 flex h-dvh w-[min(22rem,88vw)] flex-col border-l border-sky-300/15 bg-[#030812]/95 p-5 shadow-[0_0_70px_rgba(14,165,233,0.22)]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="relative h-10 w-10 overflow-hidden rounded-lg border border-sky-300/20 bg-black">
                  <Image src="/images/brand/ekalo-logo.png" alt="" fill sizes="40px" className="object-cover" />
                </span>
                <div>
                  <p className="font-black text-white">EKALO</p>
                  <p className="text-xs text-sky-200">Create. Compete. Conquer.</p>
                </div>
              </div>
              <button type="button" aria-label="Close menu" onClick={() => setIsMobileDrawerOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <nav className="mt-7 grid gap-2">
              {categories.map((item) => {
                const href = categoryHref(item);
                const isActive = href === "/" ? pathname === "/" : pathname === href;
                return (
                  <a
                    key={item.slug}
                    href={href}
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border px-4 py-3 font-semibold transition",
                      isActive
                        ? "border-ekalo-gold/60 bg-ekalo-gold text-black"
                        : "border-white/10 bg-white/[0.04] text-white/78 hover:border-ekalo-gold/45 hover:bg-ekalo-gold/10 hover:text-white"
                    )}
                  >
                    {item.slug === "rap" ? <Mic2 className="h-5 w-5" aria-hidden="true" /> : <BookOpen className="h-5 w-5" aria-hidden="true" />}
                    <span className="min-w-0 flex-1">{item.name}</span>
                    {item.status === "upcoming" ? <span className="rounded bg-white/10 px-2 py-0.5 text-xs">Upcoming</span> : null}
                  </a>
                );
              })}
              {accountLinks.map((item) => {
                const Icon = item.icon;
                const isActive = item.href !== "/" && pathname === item.href;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border px-4 py-3 font-semibold transition",
                      isActive
                        ? "border-sky-300/50 bg-sky-400/15 text-sky-100 shadow-[0_0_28px_rgba(14,165,233,0.18)]"
                        : "border-white/10 bg-white/[0.04] text-white/78 hover:border-sky-300/35 hover:bg-sky-400/10 hover:text-white"
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
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="flex items-center gap-3 rounded-lg border border-ekalo-gold/35 bg-ekalo-gold/10 px-4 py-3 font-semibold text-ekalo-gold transition hover:bg-ekalo-gold hover:text-black"
                >
                  <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
                  Admin Dashboard
                </a>
              ) : null}
            </nav>

            <div className="mt-auto pt-5">
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
        </div>
      ) : null}
      {isProfileDrawerOpen ? (
        <ProfileNavigationDrawer
          pathname={pathname}
          user={user}
          isAdmin={isAdmin}
          onClose={() => setIsProfileDrawerOpen(false)}
          onLogout={handleLogout}
        />
      ) : null}
    </header>
  );
}

function categoryHref(category: Category) {
  return category.slug === "rap" ? "/" : `/categories/${category.slug}`;
}

function CategoryMenu({ categories, pathname, onClose }: { categories: Category[]; pathname: string; onClose: () => void }) {
  return (
    <div className="absolute right-0 top-12 z-50 w-[min(34rem,calc(100vw-2rem))] rounded-lg border border-ekalo-gold/25 bg-[#05070d]/95 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
      <div className="grid gap-2 sm:grid-cols-2">
        {categories.map((category) => {
          const href = categoryHref(category);
          const isActive = href === "/" ? pathname === "/" : pathname === href;
          return (
            <a key={category.slug} href={href} onClick={onClose} className={cn("flex min-h-14 items-center gap-3 rounded-lg border px-3 py-2 transition", isActive ? "border-ekalo-gold bg-ekalo-gold text-black" : "border-white/10 bg-white/[0.04] text-white hover:border-ekalo-gold/50 hover:bg-ekalo-gold/10")}>
              {category.slug === "rap" ? <Mic2 className="h-5 w-5 shrink-0" aria-hidden="true" /> : <Sparkles className="h-5 w-5 shrink-0" aria-hidden="true" />}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-black">{category.name}</span>
                {category.description ? <span className={cn("mt-0.5 block truncate text-xs", isActive ? "text-black/70" : "text-white/45")}>{category.description}</span> : null}
              </span>
              {category.status === "upcoming" ? <span className={cn("rounded px-2 py-1 text-[10px] font-black uppercase", isActive ? "bg-black/10 text-black" : "bg-white/10 text-white/72")}>Upcoming</span> : null}
            </a>
          );
        })}
      </div>
    </div>
  );
}

function ProfileNavigationDrawer({
  pathname,
  user,
  isAdmin,
  onClose,
  onLogout
}: {
  pathname: string;
  user: { displayName?: string | null; email?: string | null; photoURL?: string | null } | null;
  isAdmin: boolean;
  onClose: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button type="button" aria-label="Close profile menu" className="absolute inset-0 bg-black/72 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute right-0 top-0 flex h-dvh w-[min(22rem,88vw)] flex-col border-l border-sky-300/15 bg-[#030812]/96 p-5 shadow-[0_0_70px_rgba(14,165,233,0.24)]">
        <div className="flex items-center justify-between gap-3">
          <a href="/" onClick={onClose} className="flex items-center gap-3" aria-label="EKALO home">
            <span className="relative h-10 w-10 overflow-hidden rounded-lg border border-sky-300/20 bg-black">
              <Image src="/images/brand/ekalo-logo.png" alt="" fill sizes="40px" className="object-cover" />
            </span>
            <span>
              <span className="block font-black tracking-[0.18em] text-white">EKALO</span>
              <span className="text-xs text-sky-200">One Gem. One Winner.</span>
            </span>
          </a>
          <button type="button" aria-label="Close profile menu" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-lg border border-sky-300/15 bg-sky-400/10 p-3">
          <span className="relative h-12 w-12 overflow-hidden rounded-full border border-sky-300/35 bg-slate-950">
            {user?.photoURL ? <Image src={user.photoURL} alt="" fill sizes="48px" className="object-cover" /> : null}
          </span>
          <span className="min-w-0">
            <span className="block truncate font-black text-white">{user?.displayName || "EKALO Creator"}</span>
            <span className="block truncate text-xs text-white/55">{user?.email || "Creator account"}</span>
          </span>
        </div>

        <nav className="mt-6 grid gap-2">
          {accountLinks.map((item) => {
            const Icon = item.icon;
            const isActive = item.href !== "/" && pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg border px-4 py-3 font-semibold transition",
                  isActive
                    ? "border-sky-300/55 bg-sky-400/15 text-sky-100 shadow-[0_0_32px_rgba(14,165,233,0.2)]"
                    : "border-white/10 bg-white/[0.04] text-white/78 hover:border-sky-300/35 hover:bg-sky-400/10 hover:text-white"
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
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg border border-ekalo-gold/35 bg-ekalo-gold/10 px-4 py-3 font-semibold text-ekalo-gold transition hover:bg-ekalo-gold hover:text-black"
            >
              <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
              Admin Dashboard
            </a>
          ) : null}
        </nav>

        <div className="mt-auto pt-5">
          {user ? (
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-3 rounded-lg border border-red-400/25 bg-red-500/10 px-4 py-3 font-semibold text-red-200 transition hover:border-red-300/60 hover:bg-red-500/20"
            >
              <LogOut className="h-5 w-5" aria-hidden="true" />
              Logout
            </button>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
