"use client";

import { useState } from "react";
import type { Challenge } from "@/types/challenge";
import { AdminChallengeForm } from "@/components/admin/challenges/AdminChallengeForm";
import { AdminChallengeList } from "@/components/admin/challenges/AdminChallengeList";

export function AdminChallengesPanel() {
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);

  return (
    <>
      <AdminChallengeForm editingChallenge={editingChallenge} onDone={() => setEditingChallenge(null)} />
      <AdminChallengeList onEdit={setEditingChallenge} />
    </>
  );
}
