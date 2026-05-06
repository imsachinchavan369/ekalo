"use client";

import type { ChallengeInput } from "@/types/challenge";
import { FieldLabel, ToggleField, inputClass } from "@/components/admin/challenges/fields";

export function ChallengeScoringSettings({ challenge, onChange }: { challenge: ChallengeInput; onChange: (challenge: ChallengeInput) => void }) {
  return (
    <section className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-3">
        <FieldLabel label="Voting weight">
          <input type="number" value={challenge.scoring.votingWeight} onChange={(event) => onChange({ ...challenge, scoring: { ...challenge.scoring, votingWeight: Number(event.target.value) } })} className={inputClass} />
        </FieldLabel>
        <FieldLabel label="Engagement weight">
          <input type="number" value={challenge.scoring.engagementWeight} onChange={(event) => onChange({ ...challenge, scoring: { ...challenge.scoring, engagementWeight: Number(event.target.value) } })} className={inputClass} />
        </FieldLabel>
        <FieldLabel label="Quality weight">
          <input type="number" value={challenge.scoring.qualityWeight} onChange={(event) => onChange({ ...challenge, scoring: { ...challenge.scoring, qualityWeight: Number(event.target.value) } })} className={inputClass} />
        </FieldLabel>
      </div>
      <ToggleField label="Show scoring publicly" checked={challenge.scoring.showScoringPublicly} onChange={(checked) => onChange({ ...challenge, scoring: { ...challenge.scoring, showScoringPublicly: checked } })} />
    </section>
  );
}
