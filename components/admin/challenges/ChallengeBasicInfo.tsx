"use client";

import type { ChallengeInput, ChallengeStatus, ChallengeType } from "@/types/challenge";
import { applyChallengeTypeDefaults, slugify } from "@/lib/challenges";
import { FieldLabel, inputClass } from "@/components/admin/challenges/fields";

type Props = {
  challenge: ChallengeInput;
  onChange: (challenge: ChallengeInput) => void;
};

export function ChallengeBasicInfo({ challenge, onChange }: Props) {
  function set<K extends keyof ChallengeInput>(key: K, value: ChallengeInput[K]) {
    onChange({ ...challenge, [key]: value });
  }

  return (
    <section className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FieldLabel label="Title">
          <input value={challenge.title} onChange={(event) => onChange({ ...challenge, title: event.target.value, slug: slugify(event.target.value) })} className={inputClass} required />
        </FieldLabel>
        <FieldLabel label="Slug">
          <input value={challenge.slug} onChange={(event) => set("slug", slugify(event.target.value))} className={inputClass} required />
        </FieldLabel>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <FieldLabel label="Category">
          <input value={challenge.category} onChange={(event) => set("category", event.target.value)} className={inputClass} required />
        </FieldLabel>
        <FieldLabel label="Challenge type">
          <select value={challenge.challengeType} onChange={(event) => onChange(applyChallengeTypeDefaults(challenge, event.target.value as ChallengeType))} className={inputClass}>
            <option value="image">image</option>
            <option value="video">video</option>
          </select>
        </FieldLabel>
        <FieldLabel label="Status">
          <select value={challenge.status} onChange={(event) => set("status", event.target.value as ChallengeStatus)} className={inputClass}>
            <option value="draft">draft</option>
            <option value="upcoming">upcoming</option>
            <option value="live">live</option>
            <option value="ended">ended</option>
          </select>
        </FieldLabel>
      </div>
      <FieldLabel label="Theme">
        <input value={challenge.theme} onChange={(event) => set("theme", event.target.value)} className={inputClass} />
      </FieldLabel>
      <FieldLabel label="Description">
        <textarea value={challenge.description} onChange={(event) => set("description", event.target.value)} rows={4} className={inputClass} />
      </FieldLabel>
      <div className="grid gap-4 md:grid-cols-2">
        <FieldLabel label="Prize pool amount">
          <input type="number" min="0" value={challenge.prizePoolAmount} onChange={(event) => set("prizePoolAmount", Number(event.target.value))} className={inputClass} />
        </FieldLabel>
        <FieldLabel label="Prize currency">
          <input value={challenge.prizeCurrency} onChange={(event) => set("prizeCurrency", event.target.value)} className={inputClass} />
        </FieldLabel>
      </div>
    </section>
  );
}
