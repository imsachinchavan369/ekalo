"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAdmin, useSiteContent } from "@/components/providers/AppProviders";

export function InitializeHomepageContent() {
  const { isAdmin } = useAdmin();
  const { contentExists, initializeContent } = useSiteContent();
  const [isSaving, setIsSaving] = useState(false);

  if (!isAdmin || contentExists) {
    return null;
  }

  async function handleInitialize() {
    setIsSaving(true);
    try {
      await initializeContent();
      alert("Homepage content initialized.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Homepage content could not be initialized.";
      alert(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mb-5 rounded-lg border border-ekalo-gold/40 bg-black/65 p-4 shadow-gold">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-white">Firestore homepage content is not initialized yet.</p>
        <Button type="button" size="sm" onClick={handleInitialize} disabled={isSaving}>
          {isSaving ? "Initializing..." : "Initialize Homepage Content"}
        </Button>
      </div>
    </div>
  );
}
