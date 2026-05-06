"use client";

import type { ChallengeInput } from "@/types/challenge";
import { FieldLabel, ToggleField, inputClass } from "@/components/admin/challenges/fields";

export function ChallengeRulesSettings({ challenge, onChange }: { challenge: ChallengeInput; onChange: (challenge: ChallengeInput) => void }) {
  return (
    <section className="grid gap-4">
      <FieldLabel label="Rules, one per line">
        <textarea value={challenge.rules.join("\n")} onChange={(event) => onChange({ ...challenge, rules: event.target.value.split("\n").map((rule) => rule.trim()).filter(Boolean) })} rows={6} className={inputClass} />
      </FieldLabel>
      <div className="grid gap-4 md:grid-cols-3">
        <ToggleField label="Approve entries manually" checked={challenge.adminControls.approveEntriesManually} onChange={(checked) => onChange({ ...challenge, adminControls: { ...challenge.adminControls, approveEntriesManually: checked } })} />
        <ToggleField label="Allow admin reject entry" checked={challenge.adminControls.allowAdminRejectEntry} onChange={(checked) => onChange({ ...challenge, adminControls: { ...challenge.adminControls, allowAdminRejectEntry: checked } })} />
        <ToggleField label="Allow mark suspicious" checked={challenge.adminControls.allowAdminMarkSuspicious} onChange={(checked) => onChange({ ...challenge, adminControls: { ...challenge.adminControls, allowAdminMarkSuspicious: checked } })} />
      </div>
    </section>
  );
}
