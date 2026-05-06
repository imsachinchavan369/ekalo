"use client";

import { Clock3, Ticket, Trophy, UsersRound } from "lucide-react";
import { InlineEditButton } from "@/components/admin/InlineEditButton";
import { useSiteContent } from "@/components/providers/AppProviders";
import { GlassCard } from "@/components/ui/GlassCard";

const defaultStats = [
  {
    label: "Prize Pool Live",
    value: "Rs. 500",
    icon: Trophy
  },
  {
    label: "Entry",
    value: "FREE",
    icon: Ticket
  },
  {
    label: "Challenge Live",
    value: "48h",
    icon: Clock3
  },
  {
    label: "Active Creators",
    value: "100+",
    icon: UsersRound
  }
];

export function StatsStrip() {
  const { content } = useSiteContent();
  const stats = content.stats.map((stat, index) => ({
    ...stat,
    icon: defaultStats[index]?.icon ?? Trophy
  }));

  return (
    <GlassCard className="relative mb-8 grid gap-0 overflow-hidden p-0 sm:grid-cols-2 lg:grid-cols-4">
      <InlineEditButton
        title="Stats Strip"
        fields={content.stats.flatMap((stat, index) => [
          { name: `value${index}`, label: `Stat ${index + 1} value`, value: stat.value },
          { name: `label${index}`, label: `Stat ${index + 1} label`, value: stat.label }
        ])}
        buildUpdates={(values) => ({
          stats: content.stats.map((stat, index) => ({
            label: values[`label${index}`] ?? stat.label,
            value: values[`value${index}`] ?? stat.value
          }))
        })}
      />
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-5 border-ekalo-line px-6 py-6 sm:border-b lg:border-b-0 lg:border-l first:lg:border-l-0"
        >
          <stat.icon className="h-11 w-11 shrink-0 text-ekalo-gold" aria-hidden="true" />
          <span>
            <span className="block text-3xl font-bold text-white">{stat.value}</span>
            <span className="mt-1 block text-white/70">{stat.label}</span>
          </span>
        </div>
      ))}
    </GlassCard>
  );
}
