"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { createReward } from "@/lib/rewards";
import type { RewardStatus } from "@/types/reward";

const inputClass = "rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-ekalo-gold";

export function AdminRewardForm() {
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    userId: "",
    challengeId: "",
    challengeTitle: "",
    entryId: "",
    rank: "1",
    amount: "",
    status: "pending" as RewardStatus,
    paidAt: "",
    paymentNote: ""
  });

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    try {
      await createReward({
        userId: form.userId.trim(),
        challengeId: form.challengeId.trim(),
        challengeTitle: form.challengeTitle.trim(),
        entryId: form.entryId.trim(),
        rank: Number(form.rank),
        amount: Number(form.amount),
        status: form.status,
        paidAt: form.paidAt ? new Date(form.paidAt) : null,
        paymentNote: form.paymentNote
      });
      setForm({
        userId: "",
        challengeId: "",
        challengeTitle: "",
        entryId: "",
        rank: "1",
        amount: "",
        status: "pending",
        paidAt: "",
        paymentNote: ""
      });
      alert("Reward record created.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Reward could not be created.";
      alert(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-lg border border-ekalo-line bg-black/40 p-5 shadow-card">
      <div>
        <p className="text-sm font-semibold uppercase tracking-normal text-ekalo-gold">Rewards</p>
        <h2 className="mt-1 text-xl font-semibold text-white">Create Reward Record</h2>
      </div>
      <input required value={form.userId} onChange={(event) => updateField("userId", event.target.value)} placeholder="User ID" className={inputClass} />
      <input required value={form.challengeId} onChange={(event) => updateField("challengeId", event.target.value)} placeholder="Challenge ID" className={inputClass} />
      <input required value={form.challengeTitle} onChange={(event) => updateField("challengeTitle", event.target.value)} placeholder="Challenge title" className={inputClass} />
      <input required value={form.entryId} onChange={(event) => updateField("entryId", event.target.value)} placeholder="Entry ID" className={inputClass} />
      <div className="grid gap-4 sm:grid-cols-2">
        <input required min="1" type="number" value={form.rank} onChange={(event) => updateField("rank", event.target.value)} placeholder="Rank" className={inputClass} />
        <input required min="0" type="number" value={form.amount} onChange={(event) => updateField("amount", event.target.value)} placeholder="Amount" className={inputClass} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <select value={form.status} onChange={(event) => updateField("status", event.target.value)} className={inputClass}>
          <option value="pending">pending</option>
          <option value="verifying">verifying</option>
          <option value="paid">paid</option>
        </select>
        <input type="date" value={form.paidAt} onChange={(event) => updateField("paidAt", event.target.value)} className={inputClass} />
      </div>
      <input value={form.paymentNote} onChange={(event) => updateField("paymentNote", event.target.value)} placeholder="Payment note, e.g. UPI Ref: ****4582" className={inputClass} />
      <Button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Create Reward"}</Button>
    </form>
  );
}
