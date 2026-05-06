"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Bell, Trophy, UsersRound, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { listenToChallengeBySlugOrId } from "@/lib/challenges";
import type { Challenge } from "@/types/challenge";
import { EntryUploadForm } from "@/components/challenge/EntryUploadForm";

function toMillis(value: unknown) {
  if (!value) return 0;
  if (typeof value === "object" && "toMillis" in value && typeof value.toMillis === "function") return value.toMillis();
  if (typeof value === "string") return new Date(value).getTime();
  return 0;
}

function getChallengePhase(challenge: Challenge) {
  if (challenge.status === "draft") return "draft";
  const now = Date.now();
  const startsAt = toMillis(challenge.startAt);
  const endsAt = toMillis(challenge.endAt);
  const resultAt = toMillis(challenge.resultAt) || endsAt;
  if (startsAt && now < startsAt) return "upcoming";
  if (startsAt && endsAt && now >= startsAt && now < endsAt) return "live";
  if (endsAt && resultAt && now >= endsAt && now < resultAt) return "voting_closed";
  if (resultAt && now >= resultAt) return "ended";
  if (challenge.status === "result_pending") return "voting_closed";
  if (challenge.status === "upcoming") return "upcoming";
  return challenge.status === "live" ? "live" : "ended";
}

function formatCountdown(label: string, target: unknown) {
  const targetMs = toMillis(target);
  if (!targetMs) return "";
  const remaining = targetMs - Date.now();
  if (remaining <= 0) return "";
  const minutes = Math.floor(remaining / 60000);
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const value = days > 0 ? `${days}d ${hours}h` : `${hours}h ${minutes % 60}m`;
  return `${label}: ${value}`;
}

export function ChallengeDetailClient({ slugOrId }: { slugOrId: string }) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => listenToChallengeBySlugOrId(slugOrId, setChallenge), [slugOrId]);

  if (!challenge) {
    return <div className="rounded-lg border border-ekalo-line bg-black/40 p-6 text-white/70">Loading challenge...</div>;
  }

  const phase = getChallengePhase(challenge);
  const isLive = phase === "live";
  const isUpcoming = phase === "upcoming";
  const isVotingClosed = phase === "voting_closed";
  const isEnded = phase === "ended";
  const cover = challenge.thumbnailUrl || challenge.coverImageUrl;
  const entryFeeType = challenge.entryFeeType || challenge.entryMode;
  const entryFeeAmount = Number(challenge.entryFeeAmount ?? challenge.paidEntryAmount ?? 0);
  const entryFeeLabel = entryFeeType === "paid" ? `₹${entryFeeAmount} Entry` : "Free Entry";

  function handleJoin() {
    if (entryFeeType === "paid") {
      alert("Paid entry is coming soon.");
      return;
    }
    setShowForm(true);
  }

  return (
    <div className="grid gap-8">
      <div className="grid gap-7 lg:grid-cols-[1fr_0.85fr] lg:items-start">
        <div className="overflow-hidden rounded-lg border border-ekalo-line bg-black/40 shadow-card">
          {challenge.coverMediaType === "video" && challenge.coverVideoUrl ? (
            <video src={challenge.coverVideoUrl} poster={challenge.thumbnailUrl || undefined} controls className="aspect-video w-full bg-black object-cover" />
          ) : cover ? (
            <div className="relative aspect-video">
              <Image src={cover} alt={challenge.title} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center bg-black text-white/45">No cover image</div>
          )}
        </div>
        <div>
          <p className="text-ekalo-gold">{challenge.category}</p>
          <h1 className="mt-2 text-4xl font-extrabold text-white">{challenge.title}</h1>
          <p className="mt-3 text-white/70">{challenge.description}</p>
          <div className="mt-5 grid gap-3 text-white sm:grid-cols-2">
            <span className="rounded-lg border border-white/10 bg-black/35 p-3">Theme: {challenge.theme}</span>
            <span className="rounded-lg border border-white/10 bg-black/35 p-3">Status: {phase === "voting_closed" ? "Voting closed" : phase}</span>
            <span className="rounded-lg border border-white/10 bg-black/35 p-3">Prize: {challenge.prizeCurrency} {challenge.prizePoolAmount}</span>
            <span className="rounded-lg border border-white/10 bg-black/35 p-3">Entry: {entryFeeLabel}</span>
          </div>
          <p className="mt-4 rounded-lg border border-white/10 bg-black/35 p-3 text-sm font-semibold text-ekalo-gold">
            {isUpcoming ? formatCountdown("Starts in", challenge.startAt) : isLive ? formatCountdown("Ends in", challenge.endAt) : isVotingClosed ? formatCountdown("Results in", challenge.resultAt || challenge.endAt) || "Voting closed. Results coming soon." : "Ended"}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {isLive ? (
              <Button type="button" onClick={handleJoin} icon={<Zap className="h-4 w-4" aria-hidden="true" />}>
                {entryFeeType === "paid" ? `Pay ₹${entryFeeAmount} & Join` : "Join Free"}
              </Button>
            ) : null}
            {isUpcoming ? <Button type="button" variant="purpleGhost" disabled icon={<Bell className="h-4 w-4" aria-hidden="true" />}>Join opens soon</Button> : null}
            {isVotingClosed ? <Button type="button" variant="outline" disabled>Voting closed</Button> : null}
            {isEnded ? <Button type="button" variant="outline">View Winners</Button> : null}
          </div>
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-[0.7fr_1fr]">
        <div className="rounded-lg border border-ekalo-line bg-black/40 p-5">
          <h2 className="text-xl font-semibold text-white">Rules</h2>
          <ul className="mt-3 grid gap-2 text-white/65">
            {challenge.rules.map((rule) => <li key={rule}>• {rule}</li>)}
          </ul>
          {challenge.rulesVideoUrl ? (
            <div className="mt-5 overflow-hidden rounded-lg border border-white/10 bg-black">
              <video src={challenge.rulesVideoUrl} controls className="aspect-video w-full object-contain" />
            </div>
          ) : null}
        </div>
        <div className="rounded-lg border border-ekalo-line bg-black/40 p-5">
          <h2 className="text-xl font-semibold text-white">Scoring System</h2>
          <div className="mt-3 grid gap-3 text-white/70 sm:grid-cols-4">
            <span>Voting {challenge.scoring.votingWeight}%</span>
            <span>Engagement {challenge.scoring.engagementWeight}%</span>
            <span>Quality {challenge.scoring.qualityWeight}%</span>
            <span className="flex items-center gap-2"><UsersRound className="h-4 w-4 text-ekalo-gold" /> {challenge.stats.entriesCount} entries</span>
          </div>
        </div>
      </div>
      {isVotingClosed ? <div className="rounded-lg border border-ekalo-line bg-black/40 p-5 text-white/70">Voting closed. Results coming soon.</div> : null}
      {isEnded ? <div className="rounded-lg border border-ekalo-line bg-black/40 p-5 text-white/70"><Trophy className="mb-2 h-6 w-6 text-ekalo-gold" /> Results and winners will appear here.</div> : null}
      {showForm ? <EntryUploadForm challenge={challenge} /> : null}
    </div>
  );
}
