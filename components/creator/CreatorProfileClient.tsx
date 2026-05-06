"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { listenToCurrentUser } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { followUser, listenToFollowStatus, unfollowUser } from "@/lib/followers";
import type { Entry } from "@/types/entry";
import type { EkaloUser } from "@/types/user";

export function CreatorProfileClient({ creatorId }: { creatorId: string }) {
  const [viewerId, setViewerId] = useState<string | null>(null);
  const [creator, setCreator] = useState<EkaloUser | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => listenToCurrentUser((user) => setViewerId(user?.uid ?? null)), []);
  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!db) return;
      const [userSnapshot, entrySnapshot] = await Promise.all([
        getDoc(doc(db, "users", creatorId)),
        getDocs(query(collection(db, "entries"), where("userId", "==", creatorId), where("status", "==", "approved")))
      ]);
      if (!mounted) return;
      setCreator(userSnapshot.exists() ? ({ uid: userSnapshot.id, ...userSnapshot.data() } as EkaloUser) : null);
      setEntries(entrySnapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Entry));
    }
    load();
    return () => {
      mounted = false;
    };
  }, [creatorId]);
  useEffect(() => {
    if (!viewerId || viewerId === creatorId) {
      setIsFollowing(false);
      return;
    }
    return listenToFollowStatus(creatorId, viewerId, setIsFollowing);
  }, [creatorId, viewerId]);

  async function toggleFollow() {
    if (!viewerId) {
      window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    if (viewerId === creatorId) return;
    if (isFollowing) await unfollowUser(creatorId, viewerId);
    else await followUser(creatorId, viewerId);
  }

  if (!creator) return <div className="rounded-lg border border-ekalo-line bg-black/40 p-6 text-white/70">Loading creator profile...</div>;

  return (
    <div className="grid gap-6">
      <section className="rounded-lg border border-sky-300/15 bg-slate-950/70 p-6 shadow-card">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <span className="relative h-28 w-28 overflow-hidden rounded-full border border-ekalo-gold/35 bg-ekalo-charcoal">
            {creator.photoURL ? <Image src={creator.photoURL} alt="" fill sizes="112px" className="object-cover" /> : null}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-4xl font-black text-white">{creator.displayName || "EKALO Creator"}</h1>
            <p className="mt-2 text-white/60">{creator.followersCount ?? 0} followers</p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/72">
              <span className="rounded-lg border border-white/10 px-3 py-2">Tier: {String(creator.currentTier || "Rising")}</span>
              <span className="rounded-lg border border-white/10 px-3 py-2">Level {creator.currentLevel ?? creator.level ?? 0}</span>
              <span className="rounded-lg border border-white/10 px-3 py-2">{creator.validVotesReceived ?? creator.totalVotes ?? 0} valid votes</span>
              <span className="rounded-lg border border-white/10 px-3 py-2">{(creator as EkaloUser & { wins?: number }).wins ?? 0} wins</span>
            </div>
          </div>
          {viewerId !== creatorId ? (
            <Button type="button" variant="outline" onClick={toggleFollow} icon={<UserPlus className="h-4 w-4" />}>
              {isFollowing ? "Following" : "Follow"}
            </Button>
          ) : null}
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-black text-white">Uploads</h2>
        {entries.length ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry) => (
              <a key={entry.id} href={`/entry/${entry.id}`} className="overflow-hidden rounded-lg border border-white/12 bg-black/45 transition hover:border-ekalo-gold/50">
                <div className="relative aspect-video bg-slate-950">
                  {entry.media?.thumbnailUrl || entry.media?.afterImageUrl ? <Image src={entry.media.thumbnailUrl || entry.media.afterImageUrl} alt="" fill sizes="33vw" className="object-cover" /> : null}
                </div>
                <div className="p-4">
                  <p className="font-black text-white">{entry.title || entry.challengeTitle}</p>
                  <p className="mt-1 text-sm text-white/60">{entry.validVotesCount ?? 0} votes</p>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-lg border border-dashed border-white/15 bg-black/35 p-8 text-center text-white/60">No uploads yet.</div>
        )}
      </section>
    </div>
  );
}
