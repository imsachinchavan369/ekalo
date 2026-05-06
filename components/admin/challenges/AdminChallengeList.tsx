"use client";

import { useEffect, useState } from "react";
import { deleteDraftChallenge, listenToChallenges, updateChallengeStatus } from "@/lib/challenges";
import type { Challenge } from "@/types/challenge";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function AdminChallengeList({ onEdit }: { onEdit?: (challenge: Challenge) => void }) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => listenToChallenges(setChallenges), []);

  return (
    <div className="rounded-lg border border-ekalo-line bg-black/40 p-5 shadow-card lg:col-span-2">
      <h2 className="text-xl font-semibold text-white">Challenge Library</h2>
      <div className="mt-4 grid gap-3">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="grid gap-4 rounded-lg border border-white/10 p-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-semibold text-white">{challenge.title}</span>
                <Badge>{challenge.status}</Badge>
                <Badge>{challenge.challengeType}</Badge>
                <Badge>{challenge.entryMode}</Badge>
              </div>
              <p className="mt-2 text-sm text-white/55">{challenge.theme || challenge.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" variant="outline" onClick={() => onEdit?.(challenge)}>Edit</Button>
              {challenge.status !== "ended" ? <Button type="button" size="sm" variant="purpleGhost" onClick={() => updateChallengeStatus(challenge.id, "ended")}>End</Button> : null}
              {challenge.status === "draft" ? <Button type="button" size="sm" variant="outline" onClick={() => deleteDraftChallenge(challenge).catch((error) => alert(error.message))}>Delete Draft</Button> : null}
            </div>
          </div>
        ))}
        {!challenges.length ? <p className="text-white/60">No challenges created yet.</p> : null}
      </div>
    </div>
  );
}
