"use client";

import { Button } from "@/components/ui/Button";

export function AdminChallengeForm() {
  return (
    <form className="grid gap-4 rounded-lg border border-ekalo-line bg-black/40 p-5">
      {["Title", "Category", "Theme", "Description", "Prize pool", "Entry fee", "Status", "Start at", "End at", "Cover image URL", "Rules"].map((field) => (
        <input key={field} placeholder={field} className="rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-ekalo-gold" />
      ))}
      <Button type="button">Save Challenge</Button>
    </form>
  );
}
