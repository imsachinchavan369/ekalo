"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { castVote } from "@/lib/firestore";
import { getCurrentUser } from "@/lib/auth";

export function VoteButton({ challengeId, entryId, entryOwnerId }: { challengeId: string; entryId: string; entryOwnerId: string }) {
  const [message, setMessage] = useState("");
  const [isVoting, setIsVoting] = useState(false);

  async function handleVote() {
    setIsVoting(true);
    setMessage("");

    try {
      const user = getCurrentUser();
      if (!user) {
        throw new Error("Log in with Google to vote.");
      }

      const result = await castVote({
        challengeId,
        entryId,
        voterId: user.uid,
        entryOwnerId,
        deviceId: window.localStorage.getItem("ekaloDeviceId") ?? "browser-device",
        userAgent: window.navigator.userAgent
      });
      setMessage(result.levelUp ? `?? Level Up! You earned ${result.levelUp.rewardCoins} coins` : "Vote counted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Vote could not be counted.");
    } finally {
      setIsVoting(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button type="button" onClick={handleVote} disabled={isVoting}>{isVoting ? "Voting..." : "Vote"}</Button>
      {message ? <p className="text-sm text-white/65">{message}</p> : null}
    </div>
  );
}
