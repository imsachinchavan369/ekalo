"use client";

import Image from "next/image";
import { Crown } from "lucide-react";
import { useSiteContent } from "@/components/providers/AppProviders";

export function BeforeAfterMedia() {
  const { content } = useSiteContent();
  const hero = content.hero;

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-lg border border-ekalo-line shadow-gold">
        <Image
          src={hero.beforeImageUrl || "/images/home/hero-comparison.png"}
          alt="Before and after AI photo challenge edit"
          width={516}
          height={322}
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="h-auto w-full"
        />
      </div>

      <div className="mt-3 flex items-center gap-4 rounded-lg border border-ekalo-gold/55 bg-black/60 p-3 shadow-[0_0_36px_rgba(250,204,21,0.16)] backdrop-blur-xl sm:p-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-ekalo-gold/80 shadow-gold sm:h-24 sm:w-24">
          <Image
            src={hero.winnerImageUrl || "/images/home/winner-avatar.png"}
            alt="AI Photo Challenge #11 winner entry"
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase text-white sm:text-sm">
            <Crown className="h-5 w-5 fill-ekalo-gold text-ekalo-gold" aria-hidden="true" />
            {hero.winnerLabel}
          </p>
          <p className="mt-2 break-words text-2xl font-extrabold text-ekalo-gold sm:text-3xl">{hero.winnerUsername}</p>
        </div>
      </div>
    </div>
  );
}
