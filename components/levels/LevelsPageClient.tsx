"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Lock, Trophy } from "lucide-react";
import { getNextLevelDefinition, getVisibleLevels } from "@/constants/levels";
import { Button } from "@/components/ui/Button";
import { LevelProgressBar } from "@/components/profile/LevelProgressBar";
import { listenToCurrentUser, signInWithGoogle } from "@/lib/auth";
import { listenToEkaloUser } from "@/lib/levels";
import type { EkaloUser } from "@/types/user";

export function LevelsPageClient() {
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

  if (isAuthLoading) return <div className="rounded-lg border border-ekalo-line bg-black/40 p-6 text-white/70">Loading levels...</div>;

  if (!userId) {
    return (
      <div className="rounded-lg border border-ekalo-line bg-black/40 p-6 shadow-card">
        <h2 className="text-2xl font-bold text-white">Log in to view levels</h2>
        <p className="mt-2 text-white/65">Valid votes received unlock levels and coin rewards.</p>
        <Button type="button" onClick={handleLogin} disabled={isLoginPending} className="mt-5">{isLoginPending ? "Opening..." : "Log In"}</Button>
      </div>
    );
  }

  if (!profile) return <div className="rounded-lg border border-ekalo-line bg-black/40 p-6 text-white/70">Loading progression...</div>;

  const currentLevel = profile.currentLevel ?? profile.level ?? 0;
  const nextLevel = getNextLevelDefinition(currentLevel);
  const visibleLevels = getVisibleLevels(Math.max(1, currentLevel));

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="grid gap-4">
        <div className="rounded-lg border border-ekalo-gold/25 bg-ekalo-gold/10 p-6 shadow-card">
          <Trophy className="h-9 w-9 text-ekalo-gold" aria-hidden="true" />
          <p className="mt-5 text-white/65">Current level</p>
          <h2 className="mt-2 text-5xl font-extrabold text-white">Level {currentLevel}</h2>
          <p className="mt-4 text-sm text-white/60">Tier: {profile.currentTier ?? "No tier yet"}</p>
          <p className="mt-2 text-sm text-white/60">Next reward: {nextLevel.rewardCoins} coins at {nextLevel.votesRequired} valid votes.</p>
        </div>
        <LevelProgressBar user={profile} />
      </section>
      <section className="grid gap-4">
        {visibleLevels.map((level) => {
          const isCurrent = level.level === currentLevel || (currentLevel === 0 && level.level === 1);
          const isUnlocked = currentLevel >= level.level;
          return (
            <div key={level.level} className="rounded-lg border border-white/10 bg-black/45 p-5 shadow-card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-2xl font-extrabold text-white">Level {level.level} {isCurrent ? "(current)" : ""}</p>
                  <p className="mt-2 text-white/60">Target: {level.votesRequired} valid votes</p>
                  <p className="mt-1 text-ekalo-gold">Reward: {level.rewardCoins} coins</p>
                  {level.tier ? <p className="mt-1 text-sm font-semibold text-white/75">Tier unlock: {level.tier}</p> : null}
                </div>
                {isUnlocked ? <CheckCircle2 className="h-6 w-6 text-emerald-400" aria-hidden="true" /> : <Lock className="h-6 w-6 text-white/45" aria-hidden="true" />}
              </div>
            </div>
          );
        })}
        <div className="rounded-lg border border-dashed border-white/10 bg-white/[0.02] p-5 text-center text-white/55">Higher levels stay hidden until you progress.</div>
      </section>
    </div>
  );
}
