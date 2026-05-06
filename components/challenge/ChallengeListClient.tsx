"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Bell, Search, Trophy, Zap } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { listenToPublicChallenges } from "@/lib/challenges";
import type { Challenge, ChallengeStatus } from "@/types/challenge";

const tabs: Array<Exclude<ChallengeStatus, "draft">> = ["live", "upcoming", "ended"];

export function ChallengeListClient() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [activeTab, setActiveTab] = useState<Exclude<ChallengeStatus, "draft">>("live");
  const [search, setSearch] = useState("");

  useEffect(() => listenToPublicChallenges(setChallenges), []);

  const filtered = useMemo(
    () =>
      challenges.filter((challenge) => {
        const matchesTab = challenge.status === activeTab;
        const haystack = `${challenge.title} ${challenge.theme} ${challenge.category}`.toLowerCase();
        return matchesTab && haystack.includes(search.toLowerCase());
      }),
    [activeTab, challenges, search]
  );

  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={activeTab === tab ? "rounded-lg bg-ekalo-gold px-4 py-2 font-bold capitalize text-black" : "rounded-lg border border-white/10 px-4 py-2 font-semibold capitalize text-white/70"}>
              {tab}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white/70">
          <Search className="h-4 w-4" aria-hidden="true" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search challenges" className="bg-transparent outline-none placeholder:text-white/35" />
        </label>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {filtered.map((challenge) => <ChallengeListCard key={challenge.id} challenge={challenge} />)}
      </div>
      {!filtered.length ? <p className="rounded-lg border border-ekalo-line bg-black/40 p-5 text-white/60">No {activeTab} challenges yet.</p> : null}
    </div>
  );
}

function ChallengeListCard({ challenge }: { challenge: Challenge }) {
  const image = challenge.coverImageUrl || challenge.thumbnailUrl;
  const href = `/challenge/${challenge.slug || challenge.id}`;
  const entryFeeType = challenge.entryFeeType || challenge.entryMode;
  const entryFeeAmount = Number(challenge.entryFeeAmount ?? challenge.paidEntryAmount ?? 0);
  const cta = challenge.status === "live" ? (entryFeeType === "paid" ? `Pay ₹${entryFeeAmount} & Join` : "Join Free") : challenge.status === "upcoming" ? "Notify Me" : "View Winners";
  const icon = challenge.status === "live" ? <Zap className="h-4 w-4" /> : challenge.status === "upcoming" ? <Bell className="h-4 w-4" /> : <Trophy className="h-4 w-4" />;

  return (
    <article className="overflow-hidden rounded-lg border border-ekalo-line bg-black/45 shadow-card transition hover:border-ekalo-gold/60">
      <div className="relative aspect-video">
        {image ? <Image src={image} alt={challenge.title} fill sizes="(min-width: 1024px) 32vw, 100vw" className="object-cover opacity-80" /> : null}
      </div>
      <div className="grid gap-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-md bg-ekalo-purple px-2.5 py-1 text-xs font-bold uppercase text-white">{challenge.status}</span>
          <span className="text-sm font-semibold text-ekalo-gold">{entryFeeType === "paid" ? `₹${entryFeeAmount} Entry` : "Free Entry"}</span>
        </div>
        <h2 className="text-xl font-bold text-white">{challenge.title}</h2>
        <p className="text-sm text-white/65">{challenge.theme}</p>
        <div className="flex justify-between text-sm text-white/70">
          <span>{challenge.prizeCurrency} {challenge.prizePoolAmount}</span>
          <span>{challenge.stats.entriesCount} entries</span>
        </div>
        <LinkButton href={href} size="sm" icon={icon}>{cta}</LinkButton>
      </div>
    </article>
  );
}
