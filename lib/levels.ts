"use client";

import { doc, getDoc, onSnapshot, serverTimestamp, updateDoc, type Firestore, type WriteBatch } from "firebase/firestore";
import { getNextLevelDefinition, getUnlockedTier, levels, type LevelTier } from "@/constants/levels";
import { db } from "@/lib/firebase";
import type { EkaloUser } from "@/types/user";

export const defaultProgressionState = {
  coins: 0,
  level: 0,
  currentLevel: 0,
  totalVotesReceived: 0,
  validVotesReceived: 0,
  totalVotes: 0,
  currentLevelProgress: 0,
  currentLevelVotes: 0,
  nextLevelTarget: 100,
  totalCoins: 0,
  unlockedTiers: [] as LevelTier[],
  currentTier: null as LevelTier | null
};

function requireDb() {
  if (!db) throw new Error("Firestore is not configured.");
  return db;
}

export function calculateLevelProgress(input: {
  level?: number;
  coins?: number;
  currentLevelVotes?: number;
  totalVotes?: number;
  unlockedTiers?: LevelTier[];
  voteIncrement?: number;
}) {
  let level = input.level ?? 0;
  let coins = input.coins ?? 0;
  let currentLevelVotes = (input.currentLevelVotes ?? 0) + (input.voteIncrement ?? 0);
  const totalVotes = (input.totalVotes ?? 0) + (input.voteIncrement ?? 0);
  const unlockedTiers = [...(input.unlockedTiers ?? [])];
  const earnedLevels: Array<{ level: number; rewardCoins: number; tier: LevelTier | null }> = [];

  while (level < levels.length) {
    const nextLevel = getNextLevelDefinition(level);
    if (currentLevelVotes < nextLevel.votesRequired) break;

    currentLevelVotes -= nextLevel.votesRequired;
    level = nextLevel.level;
    coins += nextLevel.rewardCoins;
    if (nextLevel.tier && !unlockedTiers.includes(nextLevel.tier)) {
      unlockedTiers.push(nextLevel.tier);
    }
    earnedLevels.push({ level: nextLevel.level, rewardCoins: nextLevel.rewardCoins, tier: nextLevel.tier });
  }

  const nextLevel = getNextLevelDefinition(level);
  return {
    level,
    currentLevel: level,
    coins,
    totalCoins: coins,
    totalVotes,
    validVotesReceived: totalVotes,
    currentLevelVotes,
    currentLevelProgress: currentLevelVotes,
    nextLevelTarget: nextLevel.votesRequired,
    currentTier: getUnlockedTier(level),
    unlockedTiers,
    earnedLevels
  };
}

export function applyLevelProgressToBatch(
  batch: WriteBatch,
  firestore: Firestore,
  userId: string,
  userData: Partial<EkaloUser>,
  validVoteIncrement = 1
) {
  const validVotesReceived = (userData.validVotesReceived ?? 0) + validVoteIncrement;
  const totalVotesReceived = (userData.totalVotesReceived ?? 0) + 1;
  const progress = calculateLevelProgress({
    level: userData.currentLevel ?? userData.level ?? 0,
    coins: userData.totalCoins ?? userData.coins ?? 0,
    currentLevelVotes: userData.currentLevelVotes ?? userData.currentLevelProgress ?? 0,
    totalVotes: userData.totalVotes ?? userData.validVotesReceived ?? 0,
    unlockedTiers: userData.unlockedTiers ?? [],
    voteIncrement: validVoteIncrement
  });
  const userRef = doc(firestore, "users", userId);

  batch.update(userRef, {
    totalVotesReceived,
    validVotesReceived: progress.validVotesReceived,
    totalVotes: progress.totalVotes,
    currentLevelProgress: progress.currentLevelProgress,
    currentLevelVotes: progress.currentLevelVotes,
    nextLevelTarget: progress.nextLevelTarget,
    level: progress.level,
    currentLevel: progress.currentLevel,
    coins: progress.coins,
    totalCoins: progress.totalCoins,
    currentTier: progress.currentTier,
    unlockedTiers: progress.unlockedTiers,
    updatedAt: serverTimestamp()
  });

  progress.earnedLevels.forEach((earnedLevel) => {
    batch.set(doc(firestore, "levelEvents", `${userId}_${earnedLevel.level}`), {
      userId,
      level: earnedLevel.level,
      rewardCoins: earnedLevel.rewardCoins,
      tier: earnedLevel.tier,
      createdAt: serverTimestamp()
    });
  });

  return progress;
}

export async function handleLevelProgress(userId: string) {
  const firestore = requireDb();
  const userRef = doc(firestore, "users", userId);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) return null;

  const userData = snapshot.data() as Partial<EkaloUser>;
  const progress = calculateLevelProgress({
    level: userData.currentLevel ?? userData.level ?? 0,
    coins: userData.totalCoins ?? userData.coins ?? 0,
    currentLevelVotes: userData.currentLevelVotes ?? userData.currentLevelProgress ?? 0,
    totalVotes: userData.totalVotes ?? userData.validVotesReceived ?? 0,
    unlockedTiers: userData.unlockedTiers ?? []
  });

  await updateDoc(userRef, {
    currentLevelProgress: progress.currentLevelProgress,
    currentLevelVotes: progress.currentLevelVotes,
    nextLevelTarget: progress.nextLevelTarget,
    level: progress.level,
    currentLevel: progress.currentLevel,
    coins: progress.coins,
    totalCoins: progress.totalCoins,
    totalVotes: progress.totalVotes,
    validVotesReceived: progress.validVotesReceived,
    currentTier: progress.currentTier,
    unlockedTiers: progress.unlockedTiers,
    updatedAt: serverTimestamp()
  });

  return progress;
}

export function listenToEkaloUser(userId: string, callback: (user: EkaloUser | null) => void) {
  return onSnapshot(doc(requireDb(), "users", userId), (snapshot) => {
    callback(snapshot.exists() ? ({ uid: snapshot.id, ...snapshot.data() } as EkaloUser) : null);
  });
}
