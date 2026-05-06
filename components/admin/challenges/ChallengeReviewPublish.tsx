"use client";

import type { ChallengeInput, ChallengeStatus } from "@/types/challenge";
import { Button } from "@/components/ui/Button";

type Props = {
  challenge: ChallengeInput;
  isSaving: boolean;
  onSave: (status?: ChallengeStatus) => void;
};

export function ChallengeReviewPublish({ challenge, isSaving, onSave }: Props) {
  return (
    <section className="grid gap-4">
      <div className="rounded-lg border border-white/10 bg-black/30 p-4">
        <h3 className="text-lg font-semibold text-white">{challenge.title || "Untitled challenge"}</h3>
        <p className="mt-2 text-white/60">{challenge.description || "No description added yet."}</p>
        <div className="mt-4 grid gap-2 text-sm text-white/70 sm:grid-cols-3">
          <span>Type: {challenge.challengeType}</span>
          <span>Entry: {challenge.entryMode}</span>
          <span>Status: {challenge.status}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button type="button" disabled={isSaving} onClick={() => onSave("draft")} variant="outline">Save Draft</Button>
        <Button type="button" disabled={isSaving} onClick={() => onSave("upcoming")} variant="purpleGhost">Publish Upcoming</Button>
        <Button type="button" disabled={isSaving} onClick={() => onSave("live")}>{isSaving ? "Saving..." : "Publish Live"}</Button>
      </div>
    </section>
  );
}
