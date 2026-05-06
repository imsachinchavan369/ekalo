"use client";

import type { ChallengeInput, EntryMode } from "@/types/challenge";
import { FieldLabel, ToggleField, inputClass } from "@/components/admin/challenges/fields";

type Props = { challenge: ChallengeInput; onChange: (challenge: ChallengeInput) => void };

export function ChallengeEntrySettings({ challenge, onChange }: Props) {
  function set<K extends keyof ChallengeInput>(key: K, value: ChallengeInput[K]) {
    onChange({ ...challenge, [key]: value });
  }

  return (
    <section className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-3">
        <FieldLabel label="Entry mode">
          <select value={challenge.entryMode} onChange={(event) => set("entryMode", event.target.value as EntryMode)} className={inputClass}>
            <option value="free">free</option>
            <option value="paid">paid</option>
          </select>
        </FieldLabel>
        <FieldLabel label="Free entries per user">
          <input type="number" min="0" value={challenge.freeEntriesPerUser} onChange={(event) => set("freeEntriesPerUser", Number(event.target.value))} className={inputClass} />
        </FieldLabel>
        <FieldLabel label="Max entries per user">
          <input type="number" min="1" value={challenge.maxEntriesPerUser} onChange={(event) => set("maxEntriesPerUser", Number(event.target.value))} className={inputClass} />
        </FieldLabel>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <ToggleField label="Allow multiple entries" checked={challenge.allowMultipleEntries} onChange={(checked) => set("allowMultipleEntries", checked)} />
        <ToggleField label="Paid entry enabled" checked={challenge.paidEntryEnabled} onChange={(checked) => set("paidEntryEnabled", checked)} />
      </div>
      {challenge.entryMode === "paid" ? (
        <div className="grid gap-4 rounded-lg border border-ekalo-gold/35 bg-ekalo-gold/5 p-4 md:grid-cols-2">
          <FieldLabel label="Paid entry amount">
            <input type="number" min="1" required value={challenge.paidEntryAmount} onChange={(event) => set("paidEntryAmount", Number(event.target.value))} className={inputClass} />
          </FieldLabel>
          <FieldLabel label="Paid entry currency">
            <input value={challenge.paidEntryCurrency} onChange={(event) => set("paidEntryCurrency", event.target.value)} className={inputClass} />
          </FieldLabel>
          <p className="text-sm font-semibold text-ekalo-gold md:col-span-2">Payment verification must be completed before entry submission.</p>
        </div>
      ) : null}
      <div className="grid gap-4 md:grid-cols-3">
        <ToggleField label="Require login" checked={challenge.participation.requireLogin} onChange={(checked) => onChange({ ...challenge, participation: { ...challenge.participation, requireLogin: checked } })} />
        <ToggleField label="Require caption" checked={challenge.participation.requireCaption} onChange={(checked) => onChange({ ...challenge, participation: { ...challenge.participation, requireCaption: checked } })} />
        <ToggleField label="Allow comments" checked={challenge.participation.allowComments} onChange={(checked) => onChange({ ...challenge, participation: { ...challenge.participation, allowComments: checked } })} />
        <ToggleField label="Allow likes" checked={challenge.participation.allowLikes} onChange={(checked) => onChange({ ...challenge, participation: { ...challenge.participation, allowLikes: checked } })} />
        <ToggleField label="Allow votes" checked={challenge.participation.allowVotes} onChange={(checked) => onChange({ ...challenge, participation: { ...challenge.participation, allowVotes: checked } })} />
        <FieldLabel label="Max votes per user">
          <input type="number" min="1" value={challenge.participation.maxVotesPerUser} onChange={(event) => onChange({ ...challenge, participation: { ...challenge.participation, maxVotesPerUser: Number(event.target.value) } })} className={inputClass} />
        </FieldLabel>
      </div>
      {challenge.challengeType === "image" ? (
        <div className="grid gap-4 md:grid-cols-3">
          <ToggleField label="Require before image" checked={challenge.uploadRules.requireBeforeImage} onChange={(checked) => onChange({ ...challenge, uploadRules: { ...challenge.uploadRules, requireBeforeImage: checked } })} />
          <ToggleField label="Require after image" checked={challenge.uploadRules.requireAfterImage} onChange={(checked) => onChange({ ...challenge, uploadRules: { ...challenge.uploadRules, requireAfterImage: checked } })} />
          <FieldLabel label="Max image size MB">
            <input type="number" min="1" value={challenge.uploadRules.maxImageSizeMB} onChange={(event) => onChange({ ...challenge, uploadRules: { ...challenge.uploadRules, maxImageSizeMB: Number(event.target.value) } })} className={inputClass} />
          </FieldLabel>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <ToggleField label="Require video" checked={challenge.uploadRules.requireVideo} onChange={(checked) => onChange({ ...challenge, uploadRules: { ...challenge.uploadRules, requireVideo: checked } })} />
          <ToggleField label="Require before/after images" checked={challenge.participation.requireBeforeAfter} onChange={(checked) => onChange({ ...challenge, participation: { ...challenge.participation, requireBeforeAfter: checked }, uploadRules: { ...challenge.uploadRules, requireBeforeImage: checked, requireAfterImage: checked } })} />
          <FieldLabel label="Max video duration seconds">
            <input type="number" min="1" value={challenge.uploadRules.maxVideoDurationSeconds} onChange={(event) => onChange({ ...challenge, uploadRules: { ...challenge.uploadRules, maxVideoDurationSeconds: Number(event.target.value) } })} className={inputClass} />
          </FieldLabel>
          <FieldLabel label="Max video size MB">
            <input type="number" min="1" value={challenge.uploadRules.maxVideoSizeMB} onChange={(event) => onChange({ ...challenge, uploadRules: { ...challenge.uploadRules, maxVideoSizeMB: Number(event.target.value) } })} className={inputClass} />
          </FieldLabel>
        </div>
      )}
    </section>
  );
}
