"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { listenToCurrentUser, signInWithGoogle } from "@/lib/auth";
import { listenToUserRewards } from "@/lib/rewards";
import type { Reward } from "@/types/reward";
import { RewardHistory } from "@/components/rewards/RewardHistory";
import { RewardSummaryCards } from "@/components/rewards/RewardSummaryCards";

export function RewardsPageClient() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLoginPending, setIsLoginPending] = useState(false);
  const [rewards, setRewards] = useState<Reward[]>([]);

  useEffect(() => {
    return listenToCurrentUser((user) => {
      setUserId(user?.uid ?? null);
      setIsAuthLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!userId) {
      setRewards([]);
      return;
    }

    return listenToUserRewards(userId, setRewards);
  }, [userId]);

  async function handleLogin() {
    setIsLoginPending(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Google login could not be started.";
      alert(message);
    } finally {
      setIsLoginPending(false);
    }
  }

  if (isAuthLoading) {
    return <div className="rounded-lg border border-ekalo-line bg-black/40 p-6 text-white/70">Loading rewards...</div>;
  }

  if (!userId) {
    return (
      <div className="rounded-lg border border-ekalo-line bg-black/40 p-6 shadow-card">
        <h2 className="text-2xl font-bold text-white">Log in to view rewards</h2>
        <p className="mt-2 max-w-2xl text-white/65">Your official EKALO winning records are private and visible only to your account.</p>
        <Button type="button" onClick={handleLogin} disabled={isLoginPending} className="mt-5">
          {isLoginPending ? "Opening..." : "Log In"}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <RewardSummaryCards rewards={rewards} />
      <RewardHistory rewards={rewards} />
    </div>
  );
}
