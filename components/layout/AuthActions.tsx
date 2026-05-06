"use client";

import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { listenToCurrentUser, signInWithGoogle } from "@/lib/auth";
import { listenToEkaloUser } from "@/lib/levels";
import { Button } from "@/components/ui/Button";
import type { EkaloUser } from "@/types/user";

export function AuthActions() {
  const [isPending, setIsPending] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<EkaloUser | null>(null);

  useEffect(() => {
    return listenToCurrentUser((currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setProfile(null);
      }
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    return listenToEkaloUser(user.uid, setProfile);
  }, [user]);

  async function handleLogin() {
    setIsPending(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Google login could not be started.";
      alert(message);
    } finally {
      setIsPending(false);
    }
  }

  if (user) {
    const displayName = user.displayName || "EKALO Creator";
    const email = user.email || "No email available";
    const initial = displayName.trim().charAt(0).toUpperCase() || email.charAt(0).toUpperCase() || "E";
    const coins = profile?.totalCoins ?? profile?.coins ?? 0;
    const level = profile?.currentLevel ?? profile?.level ?? 0;

    return (
      <div className="flex items-center gap-2">
        <a href="/coins" className="hidden rounded-full border border-ekalo-gold/25 bg-ekalo-gold/10 px-3 py-2 text-sm font-bold text-ekalo-gold transition hover:border-ekalo-gold sm:inline-flex">
          Coins: {coins}
        </a>
        <a href="/levels" className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold text-white transition hover:border-ekalo-gold hover:text-ekalo-gold sm:inline-flex">
          Level: {level}
        </a>
        <a
          href="/profile"
          aria-label="Open Profile"
          className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-ekalo-gold/60 bg-ekalo-gold/15 text-sm font-bold text-ekalo-gold shadow-gold transition hover:border-ekalo-gold"
        >
          {user.photoURL ? (
            <img src={user.photoURL} alt={displayName} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <span>{initial}</span>
          )}
        </a>
      </div>
    );
  }

  return (
    <Button type="button" variant="outline" size="md" onClick={handleLogin} disabled={isPending} className="min-w-24">
      {isPending ? "Opening..." : "Log In"}
    </Button>
  );
}
