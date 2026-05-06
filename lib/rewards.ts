"use client";

import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Reward, RewardInput, RewardStatus } from "@/types/reward";

function requireDb() {
  if (!db) {
    throw new Error("Firestore is not configured.");
  }

  return db;
}

function normalizeReward(id: string, data: Record<string, unknown>): Reward {
  return {
    id,
    userId: String(data.userId ?? ""),
    challengeId: String(data.challengeId ?? ""),
    challengeTitle: String(data.challengeTitle ?? ""),
    entryId: String(data.entryId ?? ""),
    rank: Number(data.rank ?? 0),
    amount: Number(data.amount ?? 0),
    status: (data.status ?? "pending") as RewardStatus,
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
    paidAt: data.paidAt ?? null,
    paymentMethod: "manual_upi",
    paymentNote: typeof data.paymentNote === "string" ? data.paymentNote : undefined
  };
}

function sortRewards(rewards: Reward[]) {
  return [...rewards].sort((a, b) => getMillis(b.createdAt) - getMillis(a.createdAt));
}

export function getMillis(value: unknown) {
  if (value instanceof Timestamp) {
    return value.toMillis();
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value === "string") {
    return new Date(value).getTime() || 0;
  }

  return 0;
}

export function formatRewardDate(value: unknown) {
  const millis = getMillis(value);
  if (!millis) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(millis));
}

export function formatRewardAmount(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

export function listenToUserRewards(userId: string, callback: (rewards: Reward[]) => void) {
  const rewardsQuery = query(collection(requireDb(), "rewards"), where("userId", "==", userId));

  return onSnapshot(rewardsQuery, (snapshot) => {
    callback(sortRewards(snapshot.docs.map((reward) => normalizeReward(reward.id, reward.data()))));
  });
}

export function listenToRewards(callback: (rewards: Reward[]) => void) {
  return onSnapshot(collection(requireDb(), "rewards"), (snapshot) => {
    callback(sortRewards(snapshot.docs.map((reward) => normalizeReward(reward.id, reward.data()))));
  });
}

export async function getRewardsByEntryIds(entryIds: string[]) {
  if (!entryIds.length) {
    return [];
  }

  const rewardsQuery = query(collection(requireDb(), "rewards"), where("entryId", "in", entryIds.slice(0, 10)));
  const snapshot = await getDocs(rewardsQuery);
  return snapshot.docs.map((reward) => normalizeReward(reward.id, reward.data()));
}

export async function createReward(input: RewardInput) {
  return addDoc(collection(requireDb(), "rewards"), {
    userId: input.userId,
    challengeId: input.challengeId,
    challengeTitle: input.challengeTitle,
    entryId: input.entryId,
    rank: input.rank,
    amount: input.amount,
    status: input.status,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    paidAt: input.paidAt ?? null,
    paymentMethod: "manual_upi",
    paymentNote: input.paymentNote?.trim() || ""
  });
}

export async function updateReward(
  rewardId: string,
  input: {
    status: RewardStatus;
    paidAt?: Date | null;
    paymentNote?: string;
  }
) {
  await updateDoc(doc(requireDb(), "rewards", rewardId), {
    status: input.status,
    paidAt: input.paidAt ?? null,
    paymentNote: input.paymentNote?.trim() || "",
    updatedAt: serverTimestamp()
  });
}
