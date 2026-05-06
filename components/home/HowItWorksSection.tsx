"use client";

import { ArrowRight, BarChart3, CloudUpload, Sparkles, Trophy, UsersRound } from "lucide-react";
import { InlineEditButton } from "@/components/admin/InlineEditButton";
import { useSiteContent } from "@/components/providers/AppProviders";
import { GlassCard } from "@/components/ui/GlassCard";

const defaultSteps = [
  {
    title: "Join Challenge",
    copy: "Choose any live challenge that excites you.",
    icon: UsersRound,
    tone: "purple"
  },
  {
    title: "Submit Your Entry",
    copy: "Upload your best work and showcase your talent.",
    icon: CloudUpload,
    tone: "purple"
  },
  {
    title: "Get Votes & Rank",
    copy: "Share, get votes and climb the leaderboard.",
    icon: BarChart3,
    tone: "gold"
  },
  {
    title: "Win Rewards",
    copy: "Top creators win cash rewards and recognition.",
    icon: Trophy,
    tone: "gold"
  }
];

export function HowItWorksSection() {
  const { content } = useSiteContent();
  const steps = content.howItWorks.map((step, index) => ({
    ...step,
    icon: defaultSteps[index]?.icon ?? UsersRound,
    tone: defaultSteps[index]?.tone ?? "purple"
  }));

  return (
    <section id="how-it-works" className="py-2">
      <GlassCard className="relative px-5 py-6 sm:px-7">
        <InlineEditButton
          title="How It Works"
          fields={content.howItWorks.flatMap((step, index) => [
            { name: `title${index}`, label: `Step ${index + 1} title`, value: step.title },
            { name: `copy${index}`, label: `Step ${index + 1} description`, value: step.copy, type: "textarea" }
          ])}
          buildUpdates={(values) => ({
            howItWorks: content.howItWorks.map((step, index) => ({
              title: values[`title${index}`] ?? step.title,
              copy: values[`copy${index}`] ?? step.copy
            }))
          })}
        />
        <div className="mb-5 flex items-center justify-center gap-3 text-center">
          <Sparkles className="h-5 w-5 fill-ekalo-gold text-ekalo-gold" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-white">HOW EKALO WORKS</h2>
          <Sparkles className="h-5 w-5 fill-ekalo-gold text-ekalo-gold" aria-hidden="true" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-center">
          {steps.map((step, index) => (
            <div key={step.title} className="contents">
              <div className="flex items-center gap-4">
                <div
                  className={
                    step.tone === "gold"
                      ? "relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-ekalo-gold/60 bg-ekalo-gold/10 shadow-gold"
                      : "relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-ekalo-purple/70 bg-ekalo-purple/10 shadow-purple"
                  }
                >
                  <span className="absolute right-1 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-ekalo-gold text-xs font-bold text-black">
                    {index + 1}
                  </span>
                  <step.icon
                    className={step.tone === "gold" ? "h-10 w-10 text-ekalo-gold" : "h-10 w-10 text-white"}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/65">{step.copy}</p>
                </div>
              </div>
              {index < steps.length - 1 ? (
                <ArrowRight className="hidden h-7 w-7 text-ekalo-gold lg:block" aria-hidden="true" />
              ) : null}
            </div>
          ))}
        </div>
      </GlassCard>
    </section>
  );
}
