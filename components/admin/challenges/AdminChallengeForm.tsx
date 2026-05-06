"use client";

import { useMemo, useState } from "react";
import { useAdmin } from "@/components/providers/AppProviders";
import { defaultChallenge, saveChallenge } from "@/lib/challenges";
import type { Challenge, ChallengeInput, ChallengeStatus } from "@/types/challenge";
import { ChallengeBasicInfo } from "@/components/admin/challenges/ChallengeBasicInfo";
import { ChallengeEntrySettings } from "@/components/admin/challenges/ChallengeEntrySettings";
import { ChallengeMediaSettings } from "@/components/admin/challenges/ChallengeMediaSettings";
import { ChallengeReviewPublish } from "@/components/admin/challenges/ChallengeReviewPublish";
import { ChallengeRulesSettings } from "@/components/admin/challenges/ChallengeRulesSettings";
import { ChallengeScoringSettings } from "@/components/admin/challenges/ChallengeScoringSettings";
import { ChallengeTimingSettings } from "@/components/admin/challenges/ChallengeTimingSettings";

const tabs = ["Basic Info", "Media", "Entry Settings", "Timing", "Rules", "Scoring", "Review & Publish"];

export function AdminChallengeForm({ editingChallenge, onDone }: { editingChallenge?: Challenge | null; onDone?: () => void }) {
  const { user } = useAdmin();
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const initial = useMemo(() => editingChallenge ?? defaultChallenge(user?.uid ?? ""), [editingChallenge, user?.uid]);
  const [challenge, setChallenge] = useState<ChallengeInput>(initial);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave(status?: ChallengeStatus) {
    setIsSaving(true);
    try {
      await saveChallenge({ ...challenge, createdBy: challenge.createdBy || user?.uid || "" }, status);
      alert("Challenge saved.");
      setChallenge(defaultChallenge(user?.uid ?? ""));
      setActiveTab(tabs[0]);
      onDone?.();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Challenge could not be saved.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="rounded-lg border border-ekalo-line bg-black/40 p-5 shadow-card lg:col-span-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-ekalo-gold">Challenges</p>
          <h2 className="mt-1 text-2xl font-bold text-white">{editingChallenge ? "Edit Challenge" : "Create Challenge"}</h2>
        </div>
      </div>
      <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={activeTab === tab ? "whitespace-nowrap rounded-lg bg-ekalo-gold px-3 py-2 text-sm font-bold text-black" : "whitespace-nowrap rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-white/70"}>
            {tab}
          </button>
        ))}
      </div>
      <div className="mt-5">
        {activeTab === "Basic Info" ? <ChallengeBasicInfo challenge={challenge} onChange={setChallenge} /> : null}
        {activeTab === "Media" ? <ChallengeMediaSettings challenge={challenge} onChange={setChallenge} userId={user?.uid ?? "admin"} /> : null}
        {activeTab === "Entry Settings" ? <ChallengeEntrySettings challenge={challenge} onChange={setChallenge} /> : null}
        {activeTab === "Timing" ? <ChallengeTimingSettings challenge={challenge} onChange={setChallenge} /> : null}
        {activeTab === "Rules" ? <ChallengeRulesSettings challenge={challenge} onChange={setChallenge} /> : null}
        {activeTab === "Scoring" ? <ChallengeScoringSettings challenge={challenge} onChange={setChallenge} /> : null}
        {activeTab === "Review & Publish" ? <ChallengeReviewPublish challenge={challenge} isSaving={isSaving} onSave={handleSave} /> : null}
      </div>
    </div>
  );
}
