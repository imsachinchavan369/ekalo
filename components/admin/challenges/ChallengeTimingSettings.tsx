"use client";

import type { ChallengeInput } from "@/types/challenge";
import { FieldLabel, inputClass } from "@/components/admin/challenges/fields";

export function ChallengeTimingSettings({ challenge, onChange }: { challenge: ChallengeInput; onChange: (challenge: ChallengeInput) => void }) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <FieldLabel label="Start at">
        <input type="datetime-local" value={String(challenge.startAt ?? "")} onChange={(event) => onChange({ ...challenge, startAt: event.target.value })} className={inputClass} />
      </FieldLabel>
      <FieldLabel label="End at">
        <input type="datetime-local" value={String(challenge.endAt ?? "")} onChange={(event) => onChange({ ...challenge, endAt: event.target.value })} className={inputClass} />
      </FieldLabel>
      <FieldLabel label="Result announce at optional">
        <input type="datetime-local" value={String(challenge.resultAnnounceAt ?? "")} onChange={(event) => onChange({ ...challenge, resultAnnounceAt: event.target.value || null })} className={inputClass} />
      </FieldLabel>
    </section>
  );
}
