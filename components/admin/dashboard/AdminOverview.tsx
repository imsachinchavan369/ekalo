"use client";

import { AlertTriangle, Gift, Trophy, UsersRound, Vote, FileClock } from "lucide-react";

const cards = [
  { label: "Total Users", value: "Ready", icon: UsersRound },
  { label: "Active Challenges", value: "Live", icon: Trophy },
  { label: "Pending Entries", value: "Review", icon: FileClock },
  { label: "Total Votes", value: "Tracked", icon: Vote },
  { label: "Pending Rewards", value: "Queued", icon: Gift },
  { label: "Suspicious Flags", value: "Monitor", icon: AlertTriangle }
];

export function AdminOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className="rounded-lg border border-ekalo-line bg-black/45 p-5 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold uppercase tracking-normal text-white/55">{card.label}</p>
            <card.icon className="h-6 w-6 text-ekalo-gold" aria-hidden="true" />
          </div>
          <p className="mt-4 text-3xl font-extrabold text-white">{card.value}</p>
          <p className="mt-2 text-sm text-white/50">Connected dashboard metric placeholder.</p>
        </div>
      ))}
    </div>
  );
}
