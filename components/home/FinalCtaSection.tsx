"use client";

import Image from "next/image";
import { CheckCircle2, Zap } from "lucide-react";
import { InlineEditButton } from "@/components/admin/InlineEditButton";
import { useSiteContent } from "@/components/providers/AppProviders";
import { LinkButton } from "@/components/ui/Button";

const trustPoints = ["No Entry Fee", "No Hidden Charges", "100% Transparent"];

export function FinalCtaSection() {
  const { content } = useSiteContent();
  const finalCta = content.finalCta;
  const [headlineFirst, ...headlineRest] = finalCta.headline.split(" ");

  return (
    <section id="enter" className="relative py-5">
      <InlineEditButton
        title="Final CTA"
        fields={[
          { name: "headline", label: "Headline", value: finalCta.headline },
          { name: "subheadline", label: "Subheadline", value: finalCta.subheadline },
          { name: "buttonText", label: "Button text", value: finalCta.buttonText }
        ]}
        buildUpdates={(values) => ({
          finalCta: {
            headline: values.headline,
            subheadline: values.subheadline,
            buttonText: values.buttonText
          }
        })}
      />
      <div className="grid overflow-hidden rounded-lg border border-ekalo-gold/55 bg-black/60 shadow-gold md:grid-cols-[290px_1fr] lg:grid-cols-[300px_1fr_500px]">
        <div className="relative min-h-40 bg-ekalo-gold/5 md:min-h-full">
          <Image
            src="/images/home/final-trophy.png"
            alt="Gold trophy"
            fill
            sizes="(min-width: 1024px) 300px, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center px-6 py-7 sm:px-8">
          <h2 className="max-w-lg text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            {headlineFirst} {headlineRest.slice(0, 2).join(" ")}
            <span className="block text-ekalo-gold">{headlineRest.slice(2).join(" ")}</span>
          </h2>
          <p className="mt-3 text-xl font-semibold text-ekalo-gold">{finalCta.subheadline}</p>
        </div>
        <div className="flex flex-col justify-center gap-4 px-6 pb-7 sm:px-8 lg:py-7">
          <LinkButton
            href="/challenge/ai-photo-challenge-12"
            size="lg"
            icon={<Zap className="h-5 w-5 fill-black" aria-hidden="true" />}
            className="w-full"
          >
            {finalCta.buttonText}
          </LinkButton>
          <div className="grid gap-3 text-sm text-white/70 sm:grid-cols-3 lg:grid-cols-3">
            {trustPoints.map((point) => (
              <span key={point} className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 shrink-0 fill-emerald-500 text-white" aria-hidden="true" />
                {point}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
