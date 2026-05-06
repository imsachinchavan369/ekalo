"use client";

import { useEffect, useState } from "react";
import { Coins } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { listenToCurrentUser, signInWithGoogle } from "@/lib/auth";
import { listenToEkaloUser } from "@/lib/levels";
import type { EkaloUser } from "@/types/user";

const coinPacks = [
  { price: "₹10", coins: 50 },
  { price: "₹29", coins: 150 },
  { price: "₹99", coins: 600 },
  { price: "₹199", coins: 1400 }
];

export function CoinsPageClient() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLoginPending, setIsLoginPending] = useState(false);
  const [profile, setProfile] = useState<EkaloUser | null>(null);

  useEffect(() => listenToCurrentUser((user) => {
    setUserId(user?.uid ?? null);
    setIsAuthLoading(false);
  }), []);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      return;
    }
    return listenToEkaloUser(userId, setProfile);
  }, [userId]);

  async function handleLogin() {
    setIsLoginPending(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Google login could not be started.");
    } finally {
      setIsLoginPending(false);
    }
  }

  if (isAuthLoading) return <div className="rounded-lg border border-ekalo-line bg-black/40 p-6 text-white/70">Loading coins...</div>;

  if (!userId) {
    return (
      <div className="rounded-lg border border-ekalo-line bg-black/40 p-6 shadow-card">
        <h2 className="text-2xl font-bold text-white">Log in to view coins</h2>
        <p className="mt-2 text-white/65">Coins are earned from level-up rewards. Coin purchases are coming soon.</p>
        <Button type="button" onClick={handleLogin} disabled={isLoginPending} className="mt-5">{isLoginPending ? "Opening..." : "Log In"}</Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <section className="rounded-lg border border-ekalo-gold/25 bg-ekalo-gold/10 p-6 shadow-card">
        <Coins className="h-9 w-9 text-ekalo-gold" aria-hidden="true" />
        <p className="mt-5 text-white/65">Current balance</p>
        <h2 className="mt-2 text-5xl font-extrabold text-white">Coins: {profile?.totalCoins ?? profile?.coins ?? 0}</h2>
        <p className="mt-4 text-sm text-white/60">Coins are earned only from valid vote level-ups and future admin rewards.</p>
      </section>
      <section className="grid gap-4 sm:grid-cols-2">
        {coinPacks.map((pack) => (
          <div key={pack.price} className="rounded-lg border border-white/10 bg-black/45 p-5 shadow-card">
            <p className="text-2xl font-extrabold text-white">{pack.price}</p>
            <p className="mt-2 text-ekalo-gold">{pack.coins} coins</p>
            <Button type="button" disabled variant="outline" className="mt-5 w-full">Buy Now · Coming Soon</Button>
          </div>
        ))}
      </section>
    </div>
  );
}
