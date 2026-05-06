"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { collection, doc, getDoc, getDocs, limit, query, where } from "firebase/firestore";
import { Heart, MessageCircle, Share2, UserPlus } from "lucide-react";
import { db } from "@/lib/firebase";
import type { Challenge } from "@/types/challenge";
import type { Entry } from "@/types/entry";
import { Button } from "@/components/ui/Button";

function getThumb(entry: Entry) {
  return entry.media?.thumbnailUrl || entry.media?.afterImageUrl || entry.media?.beforeImageUrl || "";
}

function votes(entry: Entry) {
  return Number((entry as Entry & { validVotes?: number }).validVotes ?? entry.validVotesCount ?? 0);
}

export function CompetitionEntriesPageClient({ competitionId }: { competitionId: string }) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!db) {
        setIsLoading(false);
        return;
      }
      const [challengeSnapshot, entrySnapshot] = await Promise.all([
        getDoc(doc(db, "challenges", competitionId)),
        getDocs(query(collection(db, "entries"), where("challengeId", "==", competitionId), where("status", "==", "approved"), limit(200)))
      ]);
      if (!mounted) return;
      setChallenge(challengeSnapshot.exists() ? ({ id: challengeSnapshot.id, ...challengeSnapshot.data() } as Challenge) : null);
      setEntries(entrySnapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Entry));
      setIsLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, [competitionId]);

  const sortedEntries = useMemo(() => [...entries].sort((a, b) => votes(b) - votes(a)), [entries]);
  const isEnded = challenge?.status === "ended";
  const visibleEntries = isEnded && !showMore ? sortedEntries.slice(0, 10) : sortedEntries;

  async function shareEntry(entryId: string) {
    const url = `${window.location.origin}/entry/${entryId}`;
    if (navigator.share) await navigator.share({ title: "EKALO Entry", url });
    else {
      await navigator.clipboard.writeText(url);
      alert("Link copied");
    }
  }

  if (isLoading) return <div className="rounded-lg border border-ekalo-line bg-black/40 p-6 text-white/70">Loading entries...</div>;

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-ekalo-gold">{challenge?.category || "Competition"}</p>
        <h1 className="mt-2 text-4xl font-extrabold text-white">{challenge?.title || "Competition Entries"}</h1>
        <p className="mt-3 text-white/65">{isEnded ? "Top entries are shown first for ended competitions." : "All uploaded performances for this competition."}</p>
      </div>
      {visibleEntries.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleEntries.map((entry, index) => (
            <article key={entry.id} className="overflow-hidden rounded-lg border border-white/12 bg-black/45 shadow-card">
              <a href={`/entry/${entry.id}`} className="block">
                <div className="relative aspect-video bg-slate-950">
                  {getThumb(entry) ? <Image src={getThumb(entry)} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" /> : null}
                  {entry.media?.videoUrl && !getThumb(entry) ? <video src={entry.media.videoUrl} className="h-full w-full object-cover" muted playsInline /> : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  {isEnded && index < 10 ? <span className="absolute left-3 top-3 rounded-md bg-ekalo-gold px-2 py-1 text-xs font-black text-black">TOP {index + 1}</span> : null}
                </div>
              </a>
              <div className="p-4">
                <a href={`/creator/${entry.userId}`} className="flex items-center gap-3 text-white transition hover:text-ekalo-gold">
                  <span className="relative h-10 w-10 overflow-hidden rounded-full border border-ekalo-gold/25 bg-ekalo-charcoal">
                    {entry.userPhoto ? <Image src={entry.userPhoto} alt="" fill sizes="40px" className="object-cover" /> : null}
                  </span>
                  <span className="min-w-0 truncate font-black">{entry.username}</span>
                </a>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm text-white/70">
                  <span className="rounded-lg border border-white/10 p-2">{votes(entry)} votes</span>
                  <span className="rounded-lg border border-white/10 p-2"><Heart className="mr-1 inline h-4 w-4" />{entry.likesCount}</span>
                  <span className="rounded-lg border border-white/10 p-2"><MessageCircle className="mr-1 inline h-4 w-4" />{entry.commentsCount}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button type="button" size="sm" variant="outline" className="flex-1" icon={<Share2 className="h-4 w-4" />} onClick={() => shareEntry(entry.id)}>Share</Button>
                  <a href={`/creator/${entry.userId}`} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 text-sm font-semibold text-white hover:border-ekalo-gold">
                    <UserPlus className="h-4 w-4" /> Follow
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-white/15 bg-black/35 p-8 text-center text-white/60">No entries found.</div>
      )}
      {isEnded && sortedEntries.length > 10 && !showMore ? (
        <Button type="button" variant="outline" onClick={() => setShowMore(true)} className="mx-auto">Show More Entries</Button>
      ) : null}
    </div>
  );
}
