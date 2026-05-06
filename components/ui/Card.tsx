import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-lg border border-ekalo-line bg-[#0d0d0f]/80 shadow-card backdrop-blur-xl", className)} {...props} />;
}
