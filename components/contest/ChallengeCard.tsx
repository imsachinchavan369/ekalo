"use client";

import Image from "next/image";
import { ArrowRight, Bell, Diamond, Trophy, UsersRound } from "lucide-react";
import type { Challenge } from "@/data/home";
import { LinkButton } from "@/components/ui/Button";

type ChallengeCardProps = {
  challenge: Challenge;
};

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const isLive = challenge.status === "LIVE";
  const href = isLive ? "/challenge/ai-photo-challenge-12" : "#";

  function handleNotify(event: React.MouseEvent<HTMLAnchorElement>) {
    if (isLive) {
      return;
    }

    event.preventDefault();
    alert("This challenge is coming soon.");
  }

  return (
    <article className="group relative min-h-[318px] overflow-hidden rounded-lg border border-ekalo-line bg-ekalo-charcoal shadow-card transition duration-300 hover:-translate-y-1 hover:border-ekalo-gold/60 hover:shadow-gold">
      <Image
        src={challenge.image}
        alt=""
        fill
        sizes="(min-width: 1024px) 31vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover opacity-60 transition duration-500 group-hover:scale-105 group-hover:opacity-75"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/55 to-black/90" />
      <div className="relative flex h-full min-h-[318px] flex-col justify-between p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <span
            className={
              isLive
                ? "inline-flex items-center gap-2 rounded-md bg-emerald-500 px-3 py-1 text-xs font-bold text-white"
                : "inline-flex items-center gap-2 rounded-md bg-ekalo-purple px-3 py-1 text-xs font-bold text-white"
            }
          >
            <Diamond className="h-3 w-3 fill-current" aria-hidden="true" />
            {challenge.status}
          </span>
          <span className="text-sm font-medium text-white">{challenge.timing}</span>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-white">{challenge.title}</h3>
          <p className="mt-2 text-base text-white/75">{challenge.subtitle}</p>

          <div className="mt-7 flex items-center gap-8 text-white">
            <div className="flex items-center gap-3">
              <Trophy className="h-7 w-7 text-ekalo-gold" aria-hidden="true" />
              <div>
                <p className="font-bold">{challenge.prize}</p>
                <p className="text-sm text-white/70">Prize Pool</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <UsersRound className="h-7 w-7 text-ekalo-gold" aria-hidden="true" />
              <div>
                <p className="font-bold">{challenge.entries}</p>
                <p className="text-sm text-white/70">Entries</p>
              </div>
            </div>
          </div>

          <LinkButton
            href={href}
            onClick={handleNotify}
            variant={isLive ? "gold" : "purpleGhost"}
            size="lg"
            icon={isLive ? <ArrowRight className="h-5 w-5" aria-hidden="true" /> : <Bell className="h-5 w-5" aria-hidden="true" />}
            className="mt-7 w-full"
          >
            {challenge.actionLabel}
          </LinkButton>
        </div>
      </div>
    </article>
  );
}
