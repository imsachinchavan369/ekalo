"use client";

import { useEffect, useState } from "react";
import { createReward } from "@/lib/rewards";
import { listEntries, updateEntryAdmin } from "@/lib/entries";
import { listenToChallenges } from "@/lib/challenges";
import type { Challenge } from "@/types/challenge";
import type { Entry, EntryStatus } from "@/types/entry";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const statuses: Array<EntryStatus | "all"> = ["all", "pending", "approved", "rejected", "suspicious"];

export function AdminEntryReview() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [challengeId, setChallengeId] = useState("");
  const [status, setStatus] = useState<EntryStatus | "all">("pending");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => listenToChallenges(setChallenges), []);

  async function loadEntries() {
    setIsLoading(true);
    try {
      setEntries(await listEntries(challengeId || undefined, status === "all" ? undefined : status));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Could not load entries.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challengeId, status]);

  async function updateEntry(entry: Entry, nextStatus: EntryStatus) {
    const quality = Number(prompt("Quality score", String(entry.qualityScore || 0)) ?? entry.qualityScore ?? 0);
    const reason = nextStatus === "rejected" ? prompt("Rejection reason optional", entry.rejectionReason || "") ?? "" : "";
    await updateEntryAdmin(entry.id, nextStatus, quality, reason);
    await loadEntries();
  }

  async function createWinnerReward(entry: Entry) {
    const rank = Number(prompt("Winner rank", "1") ?? "1");
    const amount = Number(prompt("Reward amount", "500") ?? "500");
    await createReward({
      userId: entry.userId,
      challengeId: entry.challengeId,
      challengeTitle: entry.challengeTitle,
      entryId: entry.id,
      rank,
      amount,
      status: "pending",
      paidAt: null,
      paymentNote: ""
    });
    alert("Reward record created with pending status.");
  }

  return (
    <div className="rounded-lg border border-ekalo-line bg-black/40 p-5 shadow-card lg:col-span-2">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Entry Review</h2>
          <p className="mt-2 text-white/60">Approve, reject, mark suspicious, score entries, and create reward records for winners.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select value={challengeId} onChange={(event) => setChallengeId(event.target.value)} className="rounded-lg border border-white/10 bg-black px-3 py-2 text-white">
            <option value="">All challenges</option>
            {challenges.map((challenge) => <option key={challenge.id} value={challenge.id}>{challenge.title}</option>)}
          </select>
          <select value={status} onChange={(event) => setStatus(event.target.value as EntryStatus | "all")} className="rounded-lg border border-white/10 bg-black px-3 py-2 text-white">
            {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        {isLoading ? <p className="text-white/60">Loading entries...</p> : null}
        {entries.map((entry) => (
          <div key={entry.id} className="grid gap-4 rounded-lg border border-white/10 p-4 xl:grid-cols-[1fr_auto] xl:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-semibold text-white">{entry.title || entry.username}</span>
                <Badge>{entry.status}</Badge>
                <Badge>{entry.challengeType}</Badge>
              </div>
              <p className="mt-2 text-sm text-white/55">{entry.challengeTitle} • {entry.username} • score {entry.qualityScore}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" onClick={() => updateEntry(entry, "approved")}>Approve</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => updateEntry(entry, "rejected")}>Reject</Button>
              <Button type="button" size="sm" variant="purpleGhost" onClick={() => updateEntry(entry, "suspicious")}>Suspicious</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => createWinnerReward(entry)}>Select Winner</Button>
            </div>
          </div>
        ))}
        {!isLoading && !entries.length ? <p className="text-white/60">No entries match this filter.</p> : null}
      </div>
    </div>
  );
}
