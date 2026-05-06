"use client";

import { InitializeHomepageContent } from "@/components/admin/InitializeHomepageContent";
import { Button } from "@/components/ui/Button";
import { useSiteContent } from "@/components/providers/AppProviders";

export function HomepageContentAdmin() {
  const { content } = useSiteContent();

  return (
    <div className="grid gap-5">
      <InitializeHomepageContent />
      <div className="rounded-lg border border-ekalo-line bg-black/45 p-5 shadow-card">
        <h2 className="text-2xl font-bold text-white">Firestore Homepage Content</h2>
        <p className="mt-2 text-white/60">Inline edit buttons on the public homepage are already connected to this content document.</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <Info label="Hero headline" value={`${content.hero.headlineLine1} ${content.hero.headlineLine2}`} />
          <Info label="Hero challenge" value={content.hero.challengeLabel} />
          <Info label="Stats count" value={`${content.stats.length} stats`} />
          <Info label="Challenge cards" value={`${content.challenges.length} homepage cards`} />
          <Info label="Trending entries" value={`${content.trendingEntries.length} entries`} />
          <Info label="Final CTA" value={content.finalCta.buttonText} />
        </div>
        <a href="/" className="mt-5 inline-flex">
          <Button type="button">Open Homepage Editor</Button>
        </a>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/35 p-4">
      <p className="text-xs font-bold uppercase text-white/45">{label}</p>
      <p className="mt-2 truncate text-white">{value}</p>
    </div>
  );
}
