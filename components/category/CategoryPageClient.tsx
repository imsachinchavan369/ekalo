"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarClock, Trophy, Users, Zap } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { defaultCategories, listenToCategories } from "@/lib/categories";
import { getCompetitionPhase, listenToPublicCompetitionsByCategory, toMillis } from "@/lib/competitions";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category";
import type { Competition, CompetitionPhase } from "@/types/competition";

function emptyMessage(category: Category | undefined, status: CompetitionPhase) {
  if (category?.slug === "ai-photo" && status === "live") return "No AI Photo competitions live right now.";
  return `No ${status} competitions right now.`;
}

function statusTone(status: CompetitionPhase) {
  if (status === "live") return "bg-red-600 text-white";
  if (status === "voting_closed") return "bg-sky-500 text-black";
  if (status === "ended") return "bg-white/12 text-white/70";
  if (status === "upcoming") return "bg-ekalo-gold text-black";
  return "bg-white/10 text-white/70";
}

function formatPrize(value: string) {
  return value || "Reward TBA";
}

function formatCountdown(competition: Competition) {
  const status = getCompetitionPhase(competition);
  const target = status === "upcoming" ? toMillis(competition.startsAt) : status === "live" ? toMillis(competition.endsAt) : status === "voting_closed" ? toMillis(competition.resultAt) || toMillis(competition.endsAt) : 0;
  if (!target) return status === "ended" ? "Ended" : "Schedule TBA";
  const remaining = target - Date.now();
  if (remaining <= 0) return status === "upcoming" ? "Starting soon" : status === "voting_closed" ? "Results soon" : "Ended";
  const minutes = Math.floor(remaining / 60000);
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const value = days > 0 ? `${days}d ${hours}h` : `${hours}h ${minutes % 60}m`;
  if (status === "upcoming") return `Starts in: ${value}`;
  if (status === "live") return `Ends in: ${value}`;
  if (status === "voting_closed") return `Results in: ${value}`;
  return "Ended";
}

function formatEntryFee(competition: Competition) {
  return competition.entryFeeType === "paid" ? `₹${competition.entryFeeAmount} Entry` : "Free Entry";
}

function CompetitionCard({ competition }: { competition: Competition }) {
  const status = getCompetitionPhase(competition);
  const href = `/challenge/${competition.id}`;
  const image = competition.thumbnailUrl || competition.coverImageUrl;
  return (
    <article className="overflow-hidden rounded-lg border border-white/12 bg-black/45 shadow-card transition hover:-translate-y-1 hover:border-ekalo-gold/55">
      <a href={href} className="block">
        <div className="relative aspect-video bg-slate-950">
          {image ? <Image src={image} alt="" fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover opacity-85" /> : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
          <span className={cn("absolute left-3 top-3 rounded-md px-2.5 py-1 text-xs font-black uppercase", statusTone(status))}>{status === "voting_closed" ? "voting closed" : status}</span>
        </div>
      </a>
      <div className="grid gap-3 p-5">
        <p className="text-xs font-black uppercase text-ekalo-gold">{competition.categoryName}</p>
        <h3 className="text-xl font-black text-white">{competition.title}</h3>
        <p className="line-clamp-2 text-sm leading-6 text-white/62">{competition.description}</p>
        <div className="grid grid-cols-2 gap-2 text-sm text-white/70">
          <span className="rounded-lg border border-white/10 bg-white/[0.03] p-2"><Users className="mr-1 inline h-4 w-4 text-ekalo-gold" />{competition.entriesCount} entries</span>
          <span className="rounded-lg border border-white/10 bg-white/[0.03] p-2"><Trophy className="mr-1 inline h-4 w-4 text-ekalo-gold" />{formatPrize(competition.prizePool)}</span>
          <span className="rounded-lg border border-white/10 bg-white/[0.03] p-2">{formatEntryFee(competition)}</span>
          <span className="rounded-lg border border-white/10 bg-white/[0.03] p-2">{formatCountdown(competition)}</span>
        </div>
        <div className="flex gap-2">
          <a href={href} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-ekalo-gold px-3 text-sm font-black text-black transition hover:bg-ekalo-goldSoft">
            {status === "live" ? "Join" : "View"}
            <Zap className="h-4 w-4" aria-hidden="true" />
          </a>
          <a href={`/competitions/${competition.id}/entries`} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-white/12 bg-white/5 px-3 text-sm font-bold text-white transition hover:border-ekalo-gold/60">
            View All
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}

function CompetitionSection({ title, status, competitions, category }: { title: string; status: CompetitionPhase; competitions: Competition[]; category?: Category }) {
  return (
    <section className="rounded-lg border border-white/12 bg-white/[0.035] p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-black uppercase text-white">
          <CalendarClock className="h-5 w-5 text-ekalo-gold" aria-hidden="true" />
          {title}
        </h2>
      </div>
      {competitions.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {competitions.map((competition) => <CompetitionCard key={competition.id} competition={competition} />)}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-white/15 bg-black/35 p-8 text-center text-white/60">{emptyMessage(category, status)}</div>
      )}
    </section>
  );
}

export function CategoryPageClient({ slug }: { slug: string }) {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      return listenToCategories(setCategories);
    } catch {
      return () => undefined;
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    try {
      return listenToPublicCompetitionsByCategory(slug, (items) => {
        setCompetitions(items);
        setIsLoading(false);
      });
    } catch {
      setIsLoading(false);
      return () => undefined;
    }
  }, [slug]);

  const category = categories.find((item) => item.slug === slug);
  const visibleCompetitions = useMemo(() => competitions.filter((item) => item.isVisible).sort((a, b) => toMillis(a.startsAt) - toMillis(b.startsAt)), [competitions]);
  const grouped = useMemo(
    () => ({
      live: visibleCompetitions.filter((item) => getCompetitionPhase(item) === "live"),
      scheduled: visibleCompetitions.filter((item) => getCompetitionPhase(item) === "upcoming"),
      votingClosed: visibleCompetitions.filter((item) => getCompetitionPhase(item) === "voting_closed"),
      ended: visibleCompetitions.filter((item) => getCompetitionPhase(item) === "ended")
    }),
    [visibleCompetitions]
  );

  if (!category || category.status === "hidden" || !category.isVisible) {
    return (
      <div className="min-h-screen bg-ekalo-black text-white">
        <Navbar />
        <main className="mx-auto max-w-[1320px] px-5 py-10 sm:px-8 lg:px-10">
          <div className="rounded-lg border border-white/12 bg-black/40 p-8 text-white/65">Category not found.</div>
        </main>
        <Footer />
      </div>
    );
  }

  const isUpcomingCategory = category.status === "upcoming";

  return (
    <div className="min-h-screen bg-ekalo-black text-white">
      <Navbar />
      <main className="mx-auto grid max-w-[1320px] gap-5 px-5 py-10 sm:px-8 lg:px-10">
        <section className="rounded-lg border border-ekalo-gold/25 bg-[radial-gradient(circle_at_82%_18%,rgba(250,204,21,0.14),transparent_24rem),rgba(255,255,255,0.035)] p-6 shadow-card">
          <span className={cn("inline-flex rounded-md px-3 py-1 text-xs font-black uppercase", isUpcomingCategory ? "bg-white/10 text-white/70" : "bg-ekalo-gold text-black")}>{isUpcomingCategory ? "Upcoming" : "Active"}</span>
          <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl">{category.name}</h1>
          <p className="mt-3 max-w-3xl text-white/66">{category.description || (isUpcomingCategory ? "This category is coming soon." : "Explore real competitions published by EKALO admins.")}</p>
        </section>

        {isUpcomingCategory ? (
          <div className="rounded-lg border border-dashed border-white/15 bg-black/35 p-10 text-center">
            <h2 className="text-2xl font-black text-white">Coming soon</h2>
            <p className="mt-2 text-white/62">This category is coming soon.</p>
          </div>
        ) : (
          <>
            {isLoading ? <div className="rounded-lg border border-white/12 bg-black/35 p-5 text-white/60">Loading competitions...</div> : null}
            <CompetitionSection title="Live Competitions" status="live" competitions={grouped.live} category={category} />
            <CompetitionSection title="Upcoming Competitions" status="upcoming" competitions={grouped.scheduled} category={category} />
            <CompetitionSection title="Voting Closed / Results Soon" status="voting_closed" competitions={grouped.votingClosed} category={category} />
            <CompetitionSection title="Ended Competitions" status="ended" competitions={grouped.ended} category={category} />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
