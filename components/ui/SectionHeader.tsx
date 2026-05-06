import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

type SectionHeaderProps = {
  icon: ReactNode;
  title: string;
  href?: string;
  actionLabel?: string;
};

export function SectionHeader({ icon, title, href, actionLabel }: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center text-ekalo-gold">{icon}</span>
        <h2 className="text-lg font-semibold text-white sm:text-xl">{title}</h2>
      </div>
      {href && actionLabel ? (
        <a
          href={href}
          className="hidden items-center gap-2 whitespace-nowrap text-sm text-white/85 transition hover:text-ekalo-gold sm:inline-flex"
        >
          {actionLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      ) : null}
    </div>
  );
}
