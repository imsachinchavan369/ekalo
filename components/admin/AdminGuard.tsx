"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAdmin } from "@/components/providers/AppProviders";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAdmin, isAuthLoading, isCheckingAdmin } = useAdmin();

  useEffect(() => {
    if (!isAuthLoading && !isCheckingAdmin && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthLoading, isCheckingAdmin, pathname, router, user]);

  if (isAuthLoading || isCheckingAdmin) {
    return (
      <div className="rounded-lg border border-ekalo-line bg-black/40 p-6 text-white/70">
        Checking admin access...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-lg border border-ekalo-line bg-black/40 p-6 text-white/70">
        Redirecting to login...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="rounded-lg border border-red-500/35 bg-red-500/10 p-6">
        <h1 className="text-2xl font-bold text-white">Access denied</h1>
        <p className="mt-2 text-white/65">This admin area is restricted to the EKALO admin account.</p>
      </div>
    );
  }

  return <>{children}</>;
}
