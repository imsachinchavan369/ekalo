"use client";

import { Trophy } from "lucide-react";
import { getLevelProgress } from "@/constants/levels";
import { cn } from "@/lib/utils";
import type { EkaloUser } from "@/types/user";

export function LevelProgressBar({ user, className }: { user: Partial<EkaloUser>; className?: string }) {
  const progress = getLevelProgress(user);

  return (
    <a href="/levels" className={cn("block rounded-lg border border-sky-300/15 bg-slate-950/50 p-4 transition hover:border-sky-300/60", className)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-white/60">Level Progress</p>
          <p className="mt-1 text-xl font-extrabold text-white">Lvl {progress.currentLevel}</p>
        </div>
        <Trophy className="h-7 w-7 text-sky-300" aria-hidden="true" />
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-300 transition-all" style={{ width: `${progress.progressPercent}%` }} />
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="font-semibold text-white">Progress: {progress.currentVotes} / {progress.requiredVotes} votes</span>
        <span className="text-sky-200">Level {progress.nextLevel}</span>
      </div>
      <p className="mt-2 text-sm text-white/60">{progress.remainingVotes} more votes to reach Level {progress.nextLevel}</p>
    </a>
  );
}
