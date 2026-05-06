"use client";

import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { InlineEditButton } from "@/components/admin/InlineEditButton";
import { EntryCard } from "@/components/contest/EntryCard";
import { useSiteContent } from "@/components/providers/AppProviders";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function TrendingEntriesSection() {
  const { content } = useSiteContent();

  return (
    <section id="winners" className="relative py-7">
      <InlineEditButton
        title="Trending Entries"
        fields={content.trendingEntries.flatMap((entry, index) => [
          { name: `username${index}`, label: `Entry ${index + 1} username`, value: entry.username },
          { name: `likes${index}`, label: `Entry ${index + 1} likes count`, value: entry.likes },
          { name: `image${index}`, label: `Entry ${index + 1} image`, value: entry.image, type: "image" }
        ])}
        buildUpdates={(values) => ({
          trendingEntries: content.trendingEntries.map((entry, index) => ({
            ...entry,
            username: values[`username${index}`] ?? entry.username,
            likes: values[`likes${index}`] ?? entry.likes,
            image: values[`image${index}`] ?? entry.image
          }))
        })}
      />
      <SectionHeader
        icon={<Star className="h-6 w-6 fill-orange-400 text-orange-400" aria-hidden="true" />}
        title="TRENDING ENTRIES"
        href="/entries"
        actionLabel="View All Entries"
      />
      <button
        type="button"
        aria-label="Previous entries"
        className="absolute left-0 top-1/2 z-10 hidden h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white shadow-card backdrop-blur-xl transition hover:border-ekalo-gold hover:text-ekalo-gold lg:flex"
      >
        <ArrowLeft className="h-5 w-5" aria-hidden="true" />
      </button>
      <div className="scrollbar-none flex snap-x gap-5 overflow-x-auto pb-1">
        {content.trendingEntries.map((entry) => (
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </div>
      <button
        type="button"
        aria-label="Next entries"
        className="absolute right-0 top-1/2 z-10 hidden h-11 w-11 translate-x-1/2 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white shadow-card backdrop-blur-xl transition hover:border-ekalo-gold hover:text-ekalo-gold lg:flex"
      >
        <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </button>
    </section>
  );
}
