"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, limit, onSnapshot, query, where } from "firebase/firestore";
import { ArrowRight, Crown, Flame, Mic2, Play, Radio, Trophy, Users, Zap } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import type { Challenge } from "@/types/challenge";
import type { Entry } from "@/types/entry";
import type { EkaloUser } from "@/types/user";

type RankedUser = EkaloUser & { wins?: number; tier?: string };

const steps = [
  { title: "Pick a Beat", text: "Choose from live battle beats.", icon: Mic2 },
  { title: "Drop Your Verse", text: "Record and upload your rap performance.", icon: Radio },
  { title: "Get Votes", text: "The crowd votes for the best verses.", icon: Flame },
  { title: "Win Rewards", text: "Top rappers earn prizes and glory.", icon: Trophy }
];

function isRapCategory(category?: string) {
  return (category || "").toLowerCase().includes("rap");
}

function normalizeChallenge(id: string, data: Record<string, unknown>): Challenge {
  const rawStatus = String(data.status ?? "upcoming");
  return {
    id,
    title: String(data.title ?? ""),
    slug: String(data.slug ?? id),
    category: String(data.categoryName ?? data.category ?? ""),
    challengeType: data.challengeType === "video" ? "video" : "image",
    status: (rawStatus === "scheduled" ? "upcoming" : rawStatus) as Challenge["status"],
    description: String(data.description ?? ""),
    theme: String(data.theme ?? data.type ?? ""),
    rules: Array.isArray(data.rules) ? (data.rules as string[]) : [],
    prizePoolAmount: Number(String(data.prizePoolAmount ?? data.prizePool ?? 0).replace(/[^0-9.]/g, "")) || 0,
    prizeCurrency: String(data.prizeCurrency ?? "INR"),
    coverMediaType: data.coverMediaType === "video" ? "video" : "image",
    coverImageUrl: String(data.coverImageUrl ?? ""),
    coverVideoUrl: String(data.coverVideoUrl ?? ""),
    thumbnailUrl: String(data.thumbnailUrl ?? ""),
    entryMode: data.entryFeeType === "paid" || data.entryMode === "paid" || data.entryFee === "paid" ? "paid" : "free",
    entryFeeType: data.entryFeeType === "paid" || data.entryMode === "paid" || data.entryFee === "paid" ? "paid" : "free",
    entryFeeAmount: data.entryFeeType === "paid" || data.entryMode === "paid" || data.entryFee === "paid" ? Number(data.entryFeeAmount ?? data.paidEntryAmount ?? 0) : 0,
    freeEntriesPerUser: Number(data.freeEntriesPerUser ?? 1),
    paidEntryEnabled: Boolean(data.paidEntryEnabled),
    paidEntryAmount: Number(data.paidEntryAmount ?? 0),
    paidEntryCurrency: String(data.paidEntryCurrency ?? "INR"),
    maxEntriesPerUser: Number(data.maxEntriesPerUser ?? 1),
    allowMultipleEntries: Boolean(data.allowMultipleEntries),
    startAt: data.startAt ?? data.startsAt ?? null,
    endAt: data.endAt ?? data.endsAt ?? null,
    resultAnnounceAt: data.resultAnnounceAt ?? null,
    scoring: { votingWeight: 30, engagementWeight: 40, qualityWeight: 30, showScoringPublicly: true },
    participation: { requireLogin: true, requireBeforeAfter: false, requireCaption: false, allowComments: true, allowLikes: true, allowVotes: true, maxVotesPerUser: 3 },
    uploadRules: { allowedUploadTypes: [], maxImageSizeMB: 10, maxVideoSizeMB: 100, maxVideoDurationSeconds: 60, requireBeforeImage: false, requireAfterImage: false, requireVideo: true },
    adminControls: { approveEntriesManually: false, allowAdminRejectEntry: true, allowAdminMarkSuspicious: true },
    stats: {
      entriesCount: Number((data.stats as { entriesCount?: number } | undefined)?.entriesCount ?? data.entriesCount ?? 0),
      votesCount: Number((data.stats as { votesCount?: number } | undefined)?.votesCount ?? 0),
      likesCount: Number((data.stats as { likesCount?: number } | undefined)?.likesCount ?? 0),
      commentsCount: Number((data.stats as { commentsCount?: number } | undefined)?.commentsCount ?? 0),
      viewsCount: Number((data.stats as { viewsCount?: number } | undefined)?.viewsCount ?? 0)
    },
    createdBy: String(data.createdBy ?? ""),
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null
  };
}

function toMillis(value: unknown) {
  if (!value) return 0;
  if (typeof value === "object" && "toMillis" in value && typeof value.toMillis === "function") return value.toMillis();
  if (typeof value === "string") return new Date(value).getTime();
  return 0;
}

function getPrize(challenge: Challenge) {
  if (!challenge.prizePoolAmount) return "Reward TBA";
  return `${challenge.prizeCurrency} ${new Intl.NumberFormat("en-IN").format(challenge.prizePoolAmount)}`;
}

function getEntryFee(challenge: Challenge) {
  return (challenge.entryFeeType || challenge.entryMode) === "paid" ? `₹${Number(challenge.entryFeeAmount ?? challenge.paidEntryAmount ?? 0)} Entry` : "Free Entry";
}

function formatCountdown(challenge: Challenge) {
  const target = challenge.status === "upcoming" ? toMillis(challenge.startAt) : toMillis(challenge.endAt);
  if (!target) return challenge.status === "ended" ? "Ended" : "Schedule TBA";
  const remaining = target - Date.now();
  if (remaining <= 0) return challenge.status === "upcoming" ? "Starting soon" : "Ended";
  const totalMinutes = Math.floor(remaining / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `${days}d ${hours}h left`;
  return `${hours}h ${minutes}m left`;
}

function getEntryThumb(entry: Entry) {
  return entry.media?.thumbnailUrl || entry.media?.afterImageUrl || entry.media?.beforeImageUrl || "";
}

function getEntryVotes(entry: Entry) {
  return Number((entry as Entry & { validVotes?: number }).validVotes ?? entry.validVotesCount ?? 0);
}

function statusLabel(status: Challenge["status"]) {
  return status.toUpperCase();
}

function StatusBadge({ status }: { status: Challenge["status"] }) {
  const isLive = status === "live";
  return (
    <span className={cn("inline-flex w-fit items-center gap-2 rounded-md px-2.5 py-1 text-xs font-black", isLive ? "bg-red-600 text-white" : status === "ended" ? "bg-white/12 text-white/70" : "bg-ekalo-gold text-black")}>
      {isLive ? <span className="h-2 w-2 rounded-full bg-white" aria-hidden="true" /> : null}
      {statusLabel(status)}
    </span>
  );
}

function EmptyState({ children }: { children: string }) {
  return <div className="rounded-lg border border-dashed border-white/16 bg-black/32 p-6 text-center text-white/62">{children}</div>;
}

export function RapHomePage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [users, setUsers] = useState<RankedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const firestore = db;
    async function load() {
      if (!firestore) {
        setIsLoading(false);
        return;
      }
      try {
        const [entrySnapshot, userSnapshot] = await Promise.all([
          getDocs(query(collection(firestore, "entries"), where("status", "==", "approved"), limit(100))),
          getDocs(query(collection(firestore, "users"), limit(50)))
        ]);
        if (!mounted) return;
        setEntries(entrySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Entry));
        setUsers(userSnapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }) as RankedUser));
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    if (!firestore) {
      setIsLoading(false);
      return () => {
        mounted = false;
      };
    }
    const unsubscribe = onSnapshot(query(collection(firestore, "competitions"), where("categorySlug", "==", "rap"), where("isVisible", "==", true), where("status", "in", ["scheduled", "live", "ended"])), (snapshot) => {
      if (!mounted) return;
      setChallenges(snapshot.docs.map((doc) => normalizeChallenge(doc.id, doc.data())).filter((item) => item.status !== "draft" && isRapCategory(item.category)));
    });
    load();
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const liveRapIds = useMemo(() => new Set(challenges.filter((item) => item.status === "live").map((item) => item.id)), [challenges]);
  const visibleCompetitions = useMemo(
    () => [...challenges].sort((a, b) => (a.status === "live" ? -1 : 0) - (b.status === "live" ? -1 : 0) || toMillis(a.startAt) - toMillis(b.startAt)),
    [challenges]
  );
  const livePerformances = useMemo(() => entries.filter((entry) => liveRapIds.has(entry.challengeId)), [entries, liveRapIds]);
  const topRappers = useMemo(
    () =>
      users
        .filter((user) => (user.validVotesReceived ?? user.totalVotes ?? 0) > 0 || (user.wins ?? 0) > 0)
        .sort((a, b) => (b.validVotesReceived ?? b.totalVotes ?? 0) - (a.validVotesReceived ?? a.totalVotes ?? 0) || (b.wins ?? 0) - (a.wins ?? 0) || (b.currentLevel ?? b.level ?? 0) - (a.currentLevel ?? a.level ?? 0))
        .slice(0, 5),
    [users]
  );
  const heroBattle = visibleCompetitions.find((item) => item.status === "live") ?? visibleCompetitions[0] ?? null;

  return (
    <div className="min-h-screen overflow-hidden bg-black text-white">
      <Navbar />
      <main className="relative mx-auto max-w-[1480px] px-5 pb-10 pt-8 sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[740px] bg-[radial-gradient(circle_at_67%_12%,rgba(14,165,233,0.28),transparent_32rem),radial-gradient(circle_at_25%_28%,rgba(250,204,21,0.15),transparent_28rem)]" />
        <section className="relative grid min-h-[500px] items-center gap-8 pb-7 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_430px]">
          <div className="relative z-10 max-w-4xl py-10">
            <span className="inline-flex items-center gap-2 rounded-md border border-ekalo-gold/30 bg-black/60 px-3 py-2 text-sm font-black uppercase text-white">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_16px_rgba(239,68,68,0.9)]" aria-hidden="true" />
              Rap Competition Arena
            </span>
            <h1 className="mt-6 max-w-4xl text-5xl font-black uppercase leading-[0.96] text-white sm:text-6xl lg:text-7xl xl:text-8xl">
              Dominate
              <span className="block text-ekalo-gold">The Rap Arena</span>
            </h1>
            <p className="mt-6 max-w-2xl text-xl font-medium leading-relaxed text-white/84 sm:text-2xl">
              Drop your verse. Compete live. Get votes. Climb ranks. Become the champion.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a href={heroBattle ? `/challenge/${heroBattle.slug || heroBattle.id}` : "/challenges"} className="inline-flex h-14 items-center justify-center gap-3 rounded-lg border border-ekalo-gold bg-ekalo-gold px-7 font-black text-black transition hover:bg-ekalo-goldSoft">
                Enter Live Battle
                <Mic2 className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href={heroBattle ? `/competitions/${heroBattle.id}/entries` : "/entries"} className="inline-flex h-14 items-center justify-center gap-3 rounded-lg border border-white/20 bg-black/50 px-7 font-bold text-white transition hover:border-sky-300/60 hover:bg-sky-400/10">
                <Play className="h-5 w-5 text-ekalo-gold" aria-hidden="true" />
                Watch Performances
              </a>
            </div>
          </div>

          <aside className="relative z-10 rounded-lg border border-ekalo-gold/55 bg-black/72 p-6 shadow-[0_0_52px_rgba(250,204,21,0.14)] backdrop-blur-xl">
            {heroBattle ? (
              <>
                <StatusBadge status={heroBattle.status} />
                <h2 className="mt-4 text-3xl font-black uppercase">{heroBattle.title}</h2>
                <p className="mt-2 text-sm font-bold uppercase text-white/70">{heroBattle.theme || heroBattle.category}</p>
                <p className="mt-6 text-xs uppercase text-white/55">Prize</p>
                <p className="mt-1 text-3xl font-black text-ekalo-gold">{getPrize(heroBattle)}</p>
                <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-white/74">
                  <span className="rounded-lg border border-white/10 bg-white/[0.04] p-3">{heroBattle.stats.entriesCount} entries</span>
                  <span className="rounded-lg border border-white/10 bg-white/[0.04] p-3">{heroBattle.stats.entriesCount} joined</span>
                  <span className="col-span-2 rounded-lg border border-white/10 bg-white/[0.04] p-3">{formatCountdown(heroBattle)}</span>
                </div>
                <a href={`/challenge/${heroBattle.slug || heroBattle.id}`} className="mt-6 inline-flex h-12 w-full items-center justify-center gap-3 rounded-md bg-ekalo-gold font-black text-black transition hover:bg-ekalo-goldSoft">
                  Join Battle
                  <Zap className="h-5 w-5 fill-black" aria-hidden="true" />
                </a>
                <a href={`/competitions/${heroBattle.id}/entries`} className="mt-4 inline-flex w-full items-center justify-center gap-2 text-sm font-bold uppercase text-white/78 transition hover:text-ekalo-gold">
                  View Entries <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </>
            ) : (
              <EmptyState>{isLoading ? "Loading live rap competitions..." : "No live competitions right now. New battles coming soon."}</EmptyState>
            )}
          </aside>
        </section>

        <div className="grid gap-5 xl:grid-cols-[1fr_390px]">
          <section id="battles" className="rounded-lg border border-white/12 bg-white/[0.035] p-4 shadow-card backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-1 pb-4">
              <h2 className="flex items-center gap-2 text-lg font-black uppercase"><Zap className="h-5 w-5 fill-ekalo-gold text-ekalo-gold" />Live & Upcoming Competitions</h2>
              <a href="/challenges" className="hidden items-center gap-2 text-sm font-bold uppercase text-white/70 hover:text-ekalo-gold sm:inline-flex">View All Battles <ArrowRight className="h-4 w-4" /></a>
            </div>
            {visibleCompetitions.length ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {visibleCompetitions.map((battle) => (
                  <a key={battle.id} href={`/challenge/${battle.slug || battle.id}`} className="group min-h-48 overflow-hidden rounded-lg border border-white/12 bg-black/42 transition hover:-translate-y-1 hover:border-ekalo-gold/60">
                    <div className="relative aspect-video bg-slate-950">
                      {battle.thumbnailUrl || battle.coverImageUrl ? <Image src={battle.thumbnailUrl || battle.coverImageUrl} alt="" fill sizes="280px" className="object-cover opacity-85" /> : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                      <div className="absolute left-3 top-3"><StatusBadge status={battle.status} /></div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-black uppercase">{battle.title}</h3>
                      <p className="mt-1 text-xs font-bold uppercase text-white/65">{battle.category}</p>
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-white/78">
                        <span><Users className="mr-1 inline h-4 w-4 text-ekalo-gold" />{battle.stats.entriesCount} joined</span>
                        <span className="font-bold text-white">{getPrize(battle)}</span>
                        <span className="w-full text-white/70">{getEntryFee(battle)}</span>
                        <span className="w-full text-ekalo-gold">{formatCountdown(battle)}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <EmptyState>{isLoading ? "Loading competitions..." : "No live competitions right now. New battles coming soon."}</EmptyState>
            )}
          </section>

          <section id="leaderboard" className="row-span-2 rounded-lg border border-white/12 bg-white/[0.035] p-5 shadow-card backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <h2 className="flex items-center gap-2 text-lg font-black uppercase"><Crown className="h-5 w-5 fill-ekalo-gold text-ekalo-gold" />Top Rappers</h2>
              <a href="/winners" className="inline-flex items-center gap-2 text-xs font-bold uppercase text-white/70 hover:text-ekalo-gold">View Leaderboard <ArrowRight className="h-4 w-4" /></a>
            </div>
            {topRappers.length ? (
              <div className="mt-5 divide-y divide-white/8 rounded-lg border border-white/8 bg-black/24">
                {topRappers.map((rapper, index) => (
                  <a key={rapper.uid} href={`/creator/${rapper.uid}`} className="grid grid-cols-[28px_44px_1fr_auto] items-center gap-3 p-3 transition hover:bg-white/[0.04]">
                    <span className="text-center text-lg font-black text-ekalo-gold">{index + 1}</span>
                    <span className="relative h-11 w-11 overflow-hidden rounded-full border border-ekalo-gold/25 bg-ekalo-charcoal">
                      {rapper.photoURL ? <Image src={rapper.photoURL} alt="" fill sizes="44px" className="object-cover" /> : null}
                    </span>
                    <span className="min-w-0"><span className="block truncate font-black">{rapper.displayName || "EKALO Creator"}</span><span className="mt-1 inline-flex rounded border border-ekalo-gold/35 px-2 py-0.5 text-[10px] font-bold text-ekalo-gold">{rapper.tier || rapper.currentTier || "Rising"}</span></span>
                    <span className="text-right"><span className="block font-black">{rapper.validVotesReceived ?? rapper.totalVotes ?? 0}</span><span className="text-xs uppercase text-white/50">Votes</span></span>
                  </a>
                ))}
              </div>
            ) : (
              <div className="mt-5"><EmptyState>Rankings will appear once creators start competing.</EmptyState></div>
            )}
          </section>

          <section id="performances" className="rounded-lg border border-white/12 bg-white/[0.035] p-4 shadow-card backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-1 pb-4">
              <h2 className="flex items-center gap-2 text-lg font-black uppercase"><span className="h-3 w-3 rounded-full bg-red-500" />Live Rap Performances</h2>
              <a href={heroBattle ? `/competitions/${heroBattle.id}/entries` : "/entries"} className="hidden items-center gap-2 text-sm font-bold uppercase text-white/70 hover:text-ekalo-gold sm:inline-flex">View All Performances <ArrowRight className="h-4 w-4" /></a>
            </div>
            {livePerformances.length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {livePerformances.map((entry) => (
                  <a key={entry.id} href={`/entry/${entry.id}`} className="group overflow-hidden rounded-lg border border-white/12 bg-black/40 transition hover:-translate-y-1 hover:border-sky-300/55">
                    <div className="relative aspect-[4/3] bg-slate-950">
                      {getEntryThumb(entry) ? <Image src={getEntryThumb(entry)} alt="" fill sizes="240px" className="object-cover opacity-86 transition group-hover:scale-105" /> : null}
                      {entry.media?.videoUrl ? <video src={entry.media.videoUrl} className="h-full w-full object-cover opacity-80" muted playsInline /> : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
                      <div className="absolute left-3 top-3"><span className="rounded-md bg-red-600 px-2 py-1 text-xs font-black">LIVE</span></div>
                      <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-black/58"><Play className="ml-1 h-6 w-6 fill-white text-white" /></span>
                      <div className="absolute inset-x-3 bottom-3">
                        <p className="truncate font-black">{entry.username}</p>
                        <div className="mt-1 flex items-center justify-between gap-2 text-xs text-white/80"><span className="truncate">{entry.challengeTitle}</span><span>{getEntryVotes(entry)} votes</span></div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <EmptyState>{isLoading ? "Loading performances..." : "No performances uploaded yet. Be the first to drop your verse."}</EmptyState>
            )}
          </section>
        </div>

        <section id="how-it-works" className="mt-5 rounded-lg border border-white/12 bg-white/[0.035] p-5 shadow-card backdrop-blur">
          <h2 className="flex items-center gap-2 text-lg font-black uppercase"><Radio className="h-5 w-5 text-ekalo-gold" />How It Works</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return <div key={step.title} className="rounded-lg border border-white/10 bg-black/26 p-5"><Icon className="h-7 w-7 text-ekalo-gold" /><p className="mt-5 text-sm font-black text-ekalo-gold">0{index + 1}</p><h3 className="mt-2 font-black uppercase">{step.title}</h3><p className="mt-2 text-sm leading-6 text-white/65">{step.text}</p></div>;
            })}
          </div>
        </section>
        <section className="mt-5 rounded-lg border border-ekalo-gold/25 bg-[radial-gradient(circle_at_80%_30%,rgba(14,165,233,0.22),transparent_24rem),rgba(255,255,255,0.035)] p-6 text-center shadow-card">
          <h2 className="text-3xl font-black text-white">Ready for the next live battle?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/65">Join a live rap competition when one is open, or check back for the next battle drop.</p>
          <a href={heroBattle ? `/challenge/${heroBattle.slug || heroBattle.id}` : "/challenges"} className="mt-5 inline-flex h-12 items-center justify-center rounded-lg bg-ekalo-gold px-6 font-black text-black hover:bg-ekalo-goldSoft">
            View Competitions
          </a>
        </section>
      </main>
      <Footer />
    </div>
  );
}
