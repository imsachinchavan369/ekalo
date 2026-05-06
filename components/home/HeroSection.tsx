"use client";

import Image from "next/image";
import { BarChart3, Gift, Trophy, Zap } from "lucide-react";
import { InlineEditButton } from "@/components/admin/InlineEditButton";
import { BeforeAfterMedia } from "@/components/contest/BeforeAfterMedia";
import { useSiteContent } from "@/components/providers/AppProviders";
import { LinkButton } from "@/components/ui/Button";

const featureItems = [
  { icon: Trophy },
  { icon: BarChart3 },
  { icon: Gift }
];

export function HeroSection() {
  const { content } = useSiteContent();
  const hero = content.hero;

  return (
    <section className="relative grid items-center gap-8 pb-7 lg:grid-cols-[0.88fr_1fr] lg:gap-10">
      <InlineEditButton
        title="Hero Section"
        fields={[
          { name: "badge", label: "Badge text", value: hero.badge },
          { name: "challengeLabel", label: "Challenge label", value: hero.challengeLabel },
          { name: "headlineLine1", label: "Headline line 1", value: hero.headlineLine1 },
          { name: "headlineLine2", label: "Headline line 2", value: hero.headlineLine2 },
          { name: "subheadline", label: "Subheadline", value: hero.subheadline, type: "textarea" },
          { name: "feature1Title", label: "Feature 1 title", value: hero.featureChips[0]?.title ?? "" },
          { name: "feature1Subtitle", label: "Feature 1 subtitle", value: hero.featureChips[0]?.subtitle ?? "" },
          { name: "feature2Title", label: "Feature 2 title", value: hero.featureChips[1]?.title ?? "" },
          { name: "feature2Subtitle", label: "Feature 2 subtitle", value: hero.featureChips[1]?.subtitle ?? "" },
          { name: "feature3Title", label: "Feature 3 title", value: hero.featureChips[2]?.title ?? "" },
          { name: "feature3Subtitle", label: "Feature 3 subtitle", value: hero.featureChips[2]?.subtitle ?? "" },
          { name: "primaryCta", label: "Primary CTA text", value: hero.primaryCta },
          { name: "secondaryCta", label: "Secondary CTA text", value: hero.secondaryCta },
          { name: "beforeImageUrl", label: "Hero before image URL", value: hero.beforeImageUrl, type: "image" },
          { name: "afterImageUrl", label: "Hero after image URL", value: hero.afterImageUrl, type: "image" },
          { name: "winnerImageUrl", label: "Winner card image URL", value: hero.winnerImageUrl, type: "image" },
          { name: "winnerLabel", label: "Winner label", value: hero.winnerLabel },
          { name: "winnerUsername", label: "Winner username", value: hero.winnerUsername }
        ]}
        buildUpdates={(values) => ({
          hero: {
            ...hero,
            badge: values.badge,
            challengeLabel: values.challengeLabel,
            headlineLine1: values.headlineLine1,
            headlineLine2: values.headlineLine2,
            subheadline: values.subheadline,
            primaryCta: values.primaryCta,
            secondaryCta: values.secondaryCta,
            beforeImageUrl: values.beforeImageUrl,
            afterImageUrl: values.afterImageUrl,
            winnerImageUrl: values.winnerImageUrl,
            winnerLabel: values.winnerLabel,
            winnerUsername: values.winnerUsername,
            featureChips: [
              { title: values.feature1Title, subtitle: values.feature1Subtitle },
              { title: values.feature2Title, subtitle: values.feature2Subtitle },
              { title: values.feature3Title, subtitle: values.feature3Subtitle }
            ]
          }
        })}
      />
      <div>
        <div className="flex flex-wrap items-center gap-5">
          <span className="inline-flex items-center gap-2 rounded-lg border border-ekalo-gold/45 bg-black/35 px-3 py-2 text-sm font-bold text-ekalo-gold shadow-gold">
            <span className="h-3 w-3 rounded-full bg-red-500 shadow-[0_0_16px_rgba(239,68,68,0.85)]" aria-hidden="true" />
            {hero.badge}
          </span>
          <p className="text-base font-medium text-white/90 sm:text-lg">{hero.challengeLabel}</p>
        </div>

        <h1 className="mt-5 max-w-3xl text-5xl font-extrabold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
          {hero.headlineLine1}
          <span className="block gold-text">{hero.headlineLine2}</span>
        </h1>

        <p className="mt-5 max-w-2xl text-2xl font-medium text-white/80">{hero.subheadline}</p>

        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          {featureItems.map((item, index) => {
            const chip = hero.featureChips[index];
            return (
              <div key={index} className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ekalo-purple/40 shadow-purple">
                  <item.icon className="h-7 w-7 text-white" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-semibold text-white">{chip?.title}</span>
                  <span className="mt-1 block text-sm text-white/65">{chip?.subtitle}</span>
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <LinkButton href="/challenge/ai-photo-challenge-12" size="lg" icon={<Zap className="h-5 w-5 fill-black" aria-hidden="true" />} className="sm:min-w-[365px]">
            {hero.primaryCta}
          </LinkButton>
          <LinkButton href="/entries" size="lg" variant="outline" className="sm:min-w-48">
            {hero.secondaryCta}
          </LinkButton>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-4">
          <div className="flex -space-x-3">
            {[0, 1, 2, 3].map((item) => (
              <span key={item} className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white/60 bg-black">
                <Image src={hero.winnerImageUrl || "/images/home/winner-avatar.png"} alt="" fill sizes="40px" className="object-cover" style={{ filter: item % 2 ? "brightness(1.15)" : "none" }} />
              </span>
            ))}
          </div>
          <p className="text-white/75">
            <span className="font-bold text-ekalo-gold">100+</span> creators already competing
          </p>
          <p className="flex items-center gap-2 text-white/75">
            <span className="h-3 w-3 rounded-full bg-emerald-500" aria-hidden="true" />
            Join them now!
          </p>
        </div>
      </div>

      <BeforeAfterMedia />
    </section>
  );
}
