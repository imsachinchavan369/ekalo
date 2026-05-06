import Image from "next/image";
import { CheckCircle2, Heart } from "lucide-react";
import type { TrendingEntry } from "@/data/home";

type EntryCardProps = {
  entry: TrendingEntry;
};

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

export function EntryCard({ entry }: EntryCardProps) {
  return (
    <article className="snap-start overflow-hidden rounded-lg border border-ekalo-line bg-black/50 shadow-card transition duration-300 hover:-translate-y-1 hover:border-ekalo-gold/60 hover:shadow-gold">
      <div className="relative h-40 w-[270px] overflow-hidden sm:h-44 sm:w-[300px]">
        <Image
          src={entry.image}
          alt={`${entry.username} before and after entry`}
          fill
          sizes="300px"
          className="object-cover transition duration-500 hover:scale-105"
        />
      </div>
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-white">{entry.username}</p>
          {entry.reward ? (
            <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-white/70">
              <span className="text-ekalo-gold">{formatAmount(entry.reward.amount)}</span>
              <span>•</span>
              {entry.reward.status === "paid" ? (
                <>
                  <span className="text-emerald-300">Paid</span>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
                </>
              ) : (
                <span className={entry.reward.status === "verifying" ? "text-sky-300" : "text-yellow-300"}>
                  {entry.reward.status === "verifying" ? "Pending Verification" : "Pending Verification"}
                </span>
              )}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2 text-white/84">
          <Heart className="h-5 w-5" aria-hidden="true" />
          <span className="font-medium">{entry.likes}</span>
        </div>
      </div>
    </article>
  );
}
