"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { signInWithGoogle } from "@/lib/auth";
import { useAdmin } from "@/components/providers/AppProviders";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginShell isLoading />}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthLoading } = useAdmin();
  const [isPending, setIsPending] = useState(false);
  const nextPath = searchParams.get("next") || "/";

  useEffect(() => {
    if (!isAuthLoading && user) {
      router.replace(nextPath);
    }
  }, [isAuthLoading, nextPath, router, user]);

  async function handleLogin() {
    setIsPending(true);
    try {
      await signInWithGoogle();
      router.replace(nextPath);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Google login could not be started.";
      alert(message);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <LoginShell onLogin={handleLogin} isPending={isPending} isLoading={isAuthLoading} />
  );
}

function LoginShell({ onLogin, isPending = false, isLoading = false }: { onLogin?: () => void; isPending?: boolean; isLoading?: boolean }) {
  return (
    <div className="min-h-screen bg-ekalo-black">
      <Navbar />
      <main className="mx-auto flex max-w-xl flex-col items-center px-5 py-24 text-center">
        <h1 className="text-5xl font-extrabold text-white">Log in to EKALO</h1>
        <p className="mt-4 text-white/65">Use Google login to participate, vote, like, and comment.</p>
        <Button type="button" className="mt-8" onClick={onLogin} disabled={!onLogin || isPending || isLoading}>
          {isPending ? "Opening..." : "Continue with Google"}
        </Button>
      </main>
      <Footer />
    </div>
  );
}
