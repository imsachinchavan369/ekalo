import type { LevelTier } from "@/constants/levels";

export type UserRole = "user" | "admin";

export type EkaloUser = {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  role: UserRole;
  createdAt: unknown;
  lastLoginAt: unknown;
  isBlocked: boolean;
  deviceIds: string[];
  coins: number;
  level: number;
  currentLevel: number;
  totalVotesReceived: number;
  validVotesReceived: number;
  totalVotes: number;
  currentLevelProgress: number;
  currentLevelVotes: number;
  nextLevelTarget: number;
  totalCoins: number;
  followersCount: number;
  currentTier: LevelTier | null;
  unlockedTiers: LevelTier[];
};
