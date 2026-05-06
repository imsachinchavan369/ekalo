import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RewardStatus } from "@/types/reward";

const statusClasses: Record<RewardStatus, string> = {
  pending: "border-yellow-400/50 bg-yellow-400/10 text-yellow-300",
  verifying: "border-sky-400/50 bg-sky-500/10 text-sky-300",
  paid: "border-emerald-400/50 bg-emerald-500/10 text-emerald-300"
};

const labels: Record<RewardStatus, string> = {
  pending: "Pending",
  verifying: "Verifying",
  paid: "Paid"
};

export function RewardStatusBadge({ status, className }: { status: RewardStatus; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-bold uppercase tracking-normal", statusClasses[status], className)}>
      {status === "paid" ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> : null}
      {labels[status]}
    </span>
  );
}
