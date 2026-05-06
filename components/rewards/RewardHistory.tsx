import { formatRewardAmount, formatRewardDate } from "@/lib/rewards";
import type { Reward } from "@/types/reward";
import { RewardStatusBadge } from "@/components/rewards/RewardStatusBadge";

type RewardHistoryProps = {
  rewards: Reward[];
};

export function RewardHistory({ rewards }: RewardHistoryProps) {
  if (!rewards.length) {
    return (
      <div className="rounded-lg border border-ekalo-line bg-black/40 p-6 text-center shadow-card">
        <h2 className="text-xl font-semibold text-white">No rewards yet</h2>
        <p className="mt-2 text-white/60">Your official EKALO winning records will appear here after admin announces winners.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-ekalo-line bg-black/40 shadow-card">
      <div className="border-b border-white/10 p-5">
        <h2 className="text-xl font-semibold text-white">Reward History</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[780px] w-full text-left">
          <thead className="border-b border-white/10 text-sm uppercase tracking-normal text-white/50">
            <tr>
              <th className="px-5 py-4 font-semibold">Challenge</th>
              <th className="px-5 py-4 font-semibold">Rank</th>
              <th className="px-5 py-4 font-semibold">Amount</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4 font-semibold">Paid Date</th>
              <th className="px-5 py-4 font-semibold">Payment Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rewards.map((reward) => (
              <tr key={reward.id} className="text-white">
                <td className="px-5 py-4">
                  <p className="font-semibold">{reward.challengeTitle}</p>
                  <p className="mt-1 text-xs text-white/45">{reward.challengeId}</p>
                </td>
                <td className="px-5 py-4">#{reward.rank}</td>
                <td className="px-5 py-4 font-bold text-ekalo-gold">{formatRewardAmount(reward.amount)}</td>
                <td className="px-5 py-4"><RewardStatusBadge status={reward.status} /></td>
                <td className="px-5 py-4 text-white/75">{formatRewardDate(reward.paidAt)}</td>
                <td className="max-w-[220px] px-5 py-4 text-white/70">{reward.paymentNote || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
