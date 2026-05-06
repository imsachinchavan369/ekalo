"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatRewardAmount, formatRewardDate, getMillis, listenToRewards, updateReward } from "@/lib/rewards";
import type { Reward, RewardStatus } from "@/types/reward";
import { RewardStatusBadge } from "@/components/rewards/RewardStatusBadge";

const inputClass = "rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none focus:border-ekalo-gold";

function formatDateInput(value: unknown) {
  const millis = getMillis(value);
  if (!millis) {
    return "";
  }

  return new Date(millis).toISOString().slice(0, 10);
}

export function AdminRewardsList() {
  const [rewards, setRewards] = useState<Reward[]>([]);

  useEffect(() => listenToRewards(setRewards), []);

  if (!rewards.length) {
    return (
      <div className="rounded-lg border border-ekalo-line bg-black/40 p-5 shadow-card lg:col-span-2">
        <h2 className="text-xl font-semibold text-white">Reward Records</h2>
        <p className="mt-2 text-white/60">No reward records have been created yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-ekalo-line bg-black/40 p-5 shadow-card lg:col-span-2">
      <h2 className="text-xl font-semibold text-white">Reward Records</h2>
      <div className="mt-4 grid gap-4">
        {rewards.map((reward) => (
          <AdminRewardRow key={reward.id} reward={reward} />
        ))}
      </div>
    </div>
  );
}

function AdminRewardRow({ reward }: { reward: Reward }) {
  const [status, setStatus] = useState<RewardStatus>(reward.status);
  const [paidAt, setPaidAt] = useState(formatDateInput(reward.paidAt));
  const [paymentNote, setPaymentNote] = useState(reward.paymentNote ?? "");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    try {
      await updateReward(reward.id, {
        status,
        paidAt: paidAt ? new Date(paidAt) : null,
        paymentNote
      });
      alert("Reward record updated.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Reward could not be updated.";
      alert(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid gap-4 rounded-lg border border-white/10 p-4 xl:grid-cols-[1.4fr_0.8fr_1.3fr]">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-semibold text-white">{reward.challengeTitle}</p>
          <RewardStatusBadge status={reward.status} />
        </div>
        <div className="mt-2 grid gap-1 text-sm text-white/55">
          <span>User: {reward.userId}</span>
          <span>Entry: {reward.entryId}</span>
          <span>Challenge: {reward.challengeId}</span>
        </div>
      </div>
      <div className="grid content-start gap-1 text-white">
        <span>Rank #{reward.rank}</span>
        <span className="font-bold text-ekalo-gold">{formatRewardAmount(reward.amount)}</span>
        <span className="text-sm text-white/55">Paid: {formatRewardDate(reward.paidAt)}</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr]">
        <select value={status} onChange={(event) => setStatus(event.target.value as RewardStatus)} className={inputClass}>
          <option value="pending">pending</option>
          <option value="verifying">verifying</option>
          <option value="paid">paid</option>
        </select>
        <input type="date" value={paidAt} onChange={(event) => setPaidAt(event.target.value)} className={inputClass} />
        <input value={paymentNote} onChange={(event) => setPaymentNote(event.target.value)} placeholder="Payment note" className={`${inputClass} sm:col-span-2`} />
        <Button type="button" size="sm" onClick={handleSave} disabled={isSaving} className="sm:col-span-2">
          {isSaving ? "Saving..." : "Update Reward"}
        </Button>
      </div>
    </div>
  );
}
