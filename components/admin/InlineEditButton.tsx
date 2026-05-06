"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { useAdmin, useSiteContent } from "@/components/providers/AppProviders";
import { EditContentModal, type EditField } from "@/components/admin/EditContentModal";

type InlineEditButtonProps = {
  title: string;
  fields: EditField[];
  buildUpdates: (values: Record<string, string>) => Record<string, unknown>;
  className?: string;
};

export function InlineEditButton({ title, fields, buildUpdates, className = "" }: InlineEditButtonProps) {
  const { isAdmin } = useAdmin();
  const { updateContent } = useSiteContent();
  const [isOpen, setIsOpen] = useState(false);

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        aria-label={`Edit ${title}`}
        onClick={() => setIsOpen(true)}
        className={`absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-ekalo-gold/60 bg-black/80 text-ekalo-gold shadow-gold transition hover:bg-ekalo-gold hover:text-black ${className}`}
      >
        <Pencil className="h-4 w-4" aria-hidden="true" />
      </button>
      <EditContentModal
        title={title}
        fields={fields}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={async (values) => {
          await updateContent(buildUpdates(values));
        }}
      />
    </>
  );
}
