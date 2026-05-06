import { CheckCircle2, Clock3, Trophy } from "lucide-react";
import { formatRewardAmount } from "@/lib/rewards";
import type { Reward } from "@/types/reward";

type RewardSummaryCardsProps = {
  rewards: Reward[];
};

export function RewardSummaryCards({ rewards }: RewardSummaryCardsProps) {
  const totalWon = rewards.reduce((total, reward) => total + reward.amount, 0);
  const pendingRewards = rewards.filter((reward) => reward.status !== "paid").reduce((total, reward) => total + reward.amount, 0);
  const paidRewards = rewards.filter((reward) => reward.status === "paid").reduce((total, reward) => total + reward.amount, 0);

  const cards = [
    { label: "Total Won", value: formatRewardAmount(totalWon), icon: Trophy, tone: "text-ekalo-gold" },
    { label: "Pending Rewards", value: formatRewardAmount(pendingRewards), icon: Clock3, tone: "text-yellow-300" },
    { label: "Paid Rewards", value: formatRewardAmount(paidRewards), icon: CheckCircle2, tone: "text-emerald-300" }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className="rounded-lg border border-ekalo-line bg-black/45 p-5 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold uppercase tracking-normal text-white/55">{card.label}</p>
            <card.icon className={`h-6 w-6 ${card.tone}`} aria-hidden="true" />
          </div>
          <p className="mt-4 text-3xl font-extrabold text-white">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
