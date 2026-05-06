import { Badge } from "@/components/ui/Badge";

export function AdminChallengeList() {
  return (
    <div className="rounded-lg border border-ekalo-line bg-black/40 p-5">
      <h2 className="text-xl font-semibold text-white">Challenges</h2>
      <div className="mt-4 grid gap-3">
        {["AI Photo Challenge #12", "Logo Design Challenge", "Poster Design Challenge"].map((title, index) => (
          <div key={title} className="flex items-center justify-between rounded-lg border border-white/10 p-4">
            <span className="text-white">{title}</span>
            <Badge>{index === 0 ? "live" : "upcoming"}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
