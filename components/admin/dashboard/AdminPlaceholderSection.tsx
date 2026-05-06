import { Button } from "@/components/ui/Button";

export function AdminPlaceholderSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="grid gap-5">
      <div className="rounded-lg border border-ekalo-line bg-black/45 p-5 shadow-card">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="mt-2 text-white/60">This section is scaffolded and ready for deeper workflow implementation.</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <div key={item} className="rounded-lg border border-white/10 bg-black/35 p-4 text-white/75">
              {item}
            </div>
          ))}
        </div>
        <Button type="button" disabled className="mt-5">Advanced controls coming soon</Button>
      </div>
    </div>
  );
}
