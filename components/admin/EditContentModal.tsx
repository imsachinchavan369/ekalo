"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

export type EditField = {
  name: string;
  label: string;
  value: string;
  type?: "text" | "textarea" | "image";
};

type EditContentModalProps = {
  title: string;
  fields: EditField[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: Record<string, string>) => Promise<void>;
};

export function EditContentModal({ title, fields, isOpen, onClose, onSave }: EditContentModalProps) {
  const [values, setValues] = useState(() => Object.fromEntries(fields.map((field) => [field.name, field.value])));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setValues(Object.fromEntries(fields.map((field) => [field.name, field.value])));
    }
  }, [fields, isOpen]);

  if (!isOpen) {
    return null;
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      await onSave(values);
      alert("Content updated.");
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Content could not be saved.";
      alert(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
      <div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-ekalo-line bg-ekalo-black p-5 shadow-gold">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-ekalo-gold">Inline edit</p>
            <h2 className="mt-1 text-2xl font-bold text-white">{title}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border border-white/10 px-3 py-1 text-white/70 transition hover:text-white">
            Close
          </button>
        </div>
        <div className="mt-5 grid gap-4">
          {fields.map((field) => (
            <label key={field.name} className="grid gap-2">
              <span className="text-sm font-semibold text-white/75">{field.label}</span>
              {field.type === "textarea" ? (
                <textarea
                  value={values[field.name] ?? ""}
                  onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                  rows={4}
                  className="rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-ekalo-gold"
                />
              ) : (
                <input
                  value={values[field.name] ?? ""}
                  onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                  placeholder={field.type === "image" ? "Image URL" : undefined}
                  className="rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-ekalo-gold"
                />
              )}
            </label>
          ))}
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="button" onClick={handleSave} disabled={isSaving}>{isSaving ? "Saving..." : "Save"}</Button>
        </div>
      </div>
    </div>
  );
}
