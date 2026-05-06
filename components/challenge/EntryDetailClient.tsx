"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Heart, MessageCircle, Share2, UserPlus } from "lucide-react";
import { getEntry } from "@/lib/entries";
import type { Entry } from "@/types/entry";
import { VoteButton } from "@/components/challenge/VoteButton";
import { Button } from "@/components/ui/Button";
import { listenToCurrentUser } from "@/lib/auth";
import { addEntryComment, listenToEntryComments, listenToEntryLike, toggleEntryLike, type EntryComment } from "@/lib/engagement";
import { followUser, listenToFollowStatus, unfollowUser } from "@/lib/followers";

export function EntryDetailClient({ entryId }: { entryId: string }) {
  const [entry, setEntry] = useState<Entry | null>(null);
  const [user, setUser] = useState<{ uid: string; displayName: string | null; photoURL: string | null } | null>(null);
  const [comments, setComments] = useState<EntryComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getEntry(entryId).then(setEntry).catch(() => setEntry(null));
  }, [entryId]);
  useEffect(() => listenToCurrentUser(setUser), []);
  useEffect(() => listenToEntryComments(entryId, setComments), [entryId]);
  useEffect(() => {
    if (!user) {
      setIsLiked(false);
      return;
    }
    return listenToEntryLike(entryId, user.uid, setIsLiked);
  }, [entryId, user]);
  useEffect(() => {
    if (!user || !entry || user.uid === entry.userId) {
      setIsFollowing(false);
      return;
    }
    return listenToFollowStatus(entry.userId, user.uid, setIsFollowing);
  }, [entry, user]);

  if (!entry) {
    return <div className="rounded-lg border border-ekalo-line bg-black/40 p-6 text-white/70">Loading entry...</div>;
  }

  const currentEntry = entry;
  const creatorPhoto = currentEntry.userPhoto || null;
  const isOwnEntry = user?.uid === currentEntry.userId;

  function requireLogin() {
    window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
  }

  async function shareEntry() {
    const url = `${window.location.origin}/entry/${entryId}`;
    const text = "View this EKALO competition entry.";
    if (navigator.share) {
      await navigator.share({ title: "EKALO Entry", text, url });
    } else {
      await navigator.clipboard.writeText(url);
      setMessage("Link copied");
    }
  }

  async function handleLike() {
    if (!user) return requireLogin();
    await toggleEntryLike(currentEntry.id, user.uid, !isLiked);
    setEntry((current) => current ? { ...current, likesCount: Math.max(0, current.likesCount + (isLiked ? -1 : 1)) } : current);
  }

  async function handleFollow() {
    if (!user) return requireLogin();
    if (isOwnEntry) return;
    if (isFollowing) await unfollowUser(currentEntry.userId, user.uid);
    else await followUser(currentEntry.userId, user.uid);
  }

  async function handleComment() {
    if (!user) return requireLogin();
    try {
      await addEntryComment({
        entryId: currentEntry.id,
        userId: user.uid,
        userName: user.displayName || "EKALO Creator",
        userAvatar: user.photoURL,
        text: commentText
      });
      setCommentText("");
      setEntry((current) => current ? { ...current, commentsCount: current.commentsCount + 1 } : current);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Comment could not be posted.");
    }
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-ekalo-gold">{entry.challengeTitle}</p>
        <h1 className="mt-2 text-4xl font-extrabold text-white">{entry.title || "Talent Entry"}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <a href={`/creator/${entry.userId}`} className="flex items-center gap-3 text-white/80 transition hover:text-ekalo-gold">
            <span className="relative h-11 w-11 overflow-hidden rounded-full border border-ekalo-gold/25 bg-ekalo-charcoal">
              {creatorPhoto ? <Image src={creatorPhoto} alt="" fill sizes="44px" className="object-cover" /> : null}
            </span>
            <span className="font-bold">{entry.username}</span>
          </a>
          {!isOwnEntry ? (
            <Button type="button" size="sm" variant="outline" onClick={handleFollow} icon={<UserPlus className="h-4 w-4" />}>
              {isFollowing ? "Following" : "Follow"}
            </Button>
          ) : null}
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border border-ekalo-line bg-black/40 shadow-card">
        {entry.challengeType === "video" ? (
          <video src={entry.media.videoUrl} poster={entry.media.thumbnailUrl || undefined} controls className="aspect-video w-full bg-black object-contain" />
        ) : (
          <div className="grid gap-px bg-ekalo-line md:grid-cols-2">
            {[entry.media.beforeImageUrl, entry.media.afterImageUrl].map((url, index) => (
              <div key={index} className="relative aspect-square bg-black">
                {url ? <Image src={url} alt={index === 0 ? "Before entry" : "After entry"} fill sizes="50vw" className="object-cover" /> : null}
                <span className="absolute left-3 top-3 rounded-md bg-black/75 px-2 py-1 text-xs font-bold text-white">{index === 0 ? "Before" : "After"}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {entry.caption ? <p className="rounded-lg border border-ekalo-line bg-black/40 p-5 text-white/75">{entry.caption}</p> : null}
      <div className="flex flex-wrap items-center gap-3">
        <VoteButton challengeId={entry.challengeId} entryId={entry.id} entryOwnerId={entry.userId} />
        <Button type="button" variant={isLiked ? "gold" : "outline"} onClick={handleLike} icon={<Heart className="h-4 w-4" />}>
          {entry.likesCount}
        </Button>
        <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-white/70"><MessageCircle className="h-4 w-4" /> {entry.commentsCount}</span>
        <Button type="button" variant="outline" onClick={shareEntry} icon={<Share2 className="h-4 w-4" />}>Share</Button>
      </div>
      {message ? <p className="text-sm text-ekalo-gold">{message}</p> : null}
      <section className="rounded-lg border border-ekalo-line bg-black/40 p-5">
        <h2 className="text-xl font-black text-white">Comments</h2>
        <div className="mt-4 flex gap-3">
          <input
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            placeholder={user ? "Add a comment" : "Log in to comment"}
            className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-ekalo-gold"
          />
          <Button type="button" onClick={handleComment}>Post</Button>
        </div>
        <div className="mt-5 grid gap-3">
          {comments.length ? comments.map((comment) => (
            <article key={comment.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
              <p className="font-bold text-white">{comment.userName}</p>
              <p className="mt-1 text-white/70">{comment.text}</p>
            </article>
          )) : <p className="rounded-lg border border-dashed border-white/15 p-4 text-center text-white/55">No comments yet. Start the conversation.</p>}
        </div>
      </section>
    </div>
  );
}
