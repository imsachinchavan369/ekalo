"use client";

export const inputClass = "rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-ekalo-gold disabled:cursor-not-allowed disabled:opacity-45";
export const labelClass = "grid gap-2 text-sm font-semibold text-white/75";

export function FieldLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className={labelClass}>
      <span>{label}</span>
      {children}
    </label>
  );
}

export function ToggleField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm font-semibold text-white/75">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-5 w-5 accent-ekalo-gold" />
    </label>
  );
}
