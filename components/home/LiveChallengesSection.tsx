"use client";

import { Zap } from "lucide-react";
import { InlineEditButton } from "@/components/admin/InlineEditButton";
import { ChallengeCard } from "@/components/contest/ChallengeCard";
import { useSiteContent } from "@/components/providers/AppProviders";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function LiveChallengesSection() {
  const { content } = useSiteContent();

  return (
    <section id="challenges" className="relative py-3">
      <InlineEditButton
        title="Live Challenges"
        fields={content.challenges.flatMap((challenge, index) => [
          { name: `title${index}`, label: `Challenge ${index + 1} title`, value: challenge.title },
          { name: `subtitle${index}`, label: `Challenge ${index + 1} subtitle/theme`, value: challenge.subtitle },
          { name: `prize${index}`, label: `Challenge ${index + 1} prize pool`, value: challenge.prize },
          { name: `entries${index}`, label: `Challenge ${index + 1} entries count`, value: challenge.entries },
          { name: `status${index}`, label: `Challenge ${index + 1} status`, value: challenge.status },
          { name: `image${index}`, label: `Challenge ${index + 1} image`, value: challenge.image, type: "image" },
          { name: `actionLabel${index}`, label: `Challenge ${index + 1} button text`, value: challenge.actionLabel }
        ])}
        buildUpdates={(values) => ({
          challenges: content.challenges.map((challenge, index) => ({
            ...challenge,
            title: values[`title${index}`] ?? challenge.title,
            subtitle: values[`subtitle${index}`] ?? challenge.subtitle,
            prize: values[`prize${index}`] ?? challenge.prize,
            entries: values[`entries${index}`] ?? challenge.entries,
            status: (values[`status${index}`] === "UPCOMING" ? "UPCOMING" : "LIVE") as "LIVE" | "UPCOMING",
            image: values[`image${index}`] ?? challenge.image,
            actionLabel: values[`actionLabel${index}`] ?? challenge.actionLabel
          }))
        })}
      />
      <SectionHeader
        icon={<Zap className="h-6 w-6 fill-ekalo-gold" aria-hidden="true" />}
        title="LIVE CHALLENGES"
        href="/challenges"
        actionLabel="View All Challenges"
      />
      <div className="grid gap-5 lg:grid-cols-3">
        {content.challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </section>
  );
}
