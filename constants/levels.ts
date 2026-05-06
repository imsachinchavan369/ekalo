export type LevelTier = "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond";

export type LevelDefinition = {
  level: number;
  votesRequired: number;
  rewardCoins: number;
  tier: LevelTier | null;
};

export const LEVEL_COUNT = 100;
export const TOTAL_LEVEL_VOTES = 1_000_000;

export const tierUnlocks: Array<{ tier: LevelTier; level: number; frame: string; badgeColor: string }> = [
  { tier: "Bronze", level: 10, frame: "/images/profile/frames/bronze.jpg", badgeColor: "#c97845" },
  { tier: "Silver", level: 25, frame: "/images/profile/frames/silver.jpg", badgeColor: "#d7e1ef" },
  { tier: "Gold", level: 50, frame: "/images/profile/frames/gold.jpg", badgeColor: "#f7c948" },
  { tier: "Platinum", level: 75, frame: "/images/profile/frames/platinum.png", badgeColor: "#a78bfa" },
  { tier: "Diamond", level: 100, frame: "/images/profile/frames/diamond.jpg", badgeColor: "#21a7ff" }
];

export const levels: LevelDefinition[] = [
  { level: 1, votesRequired: 100, rewardCoins: 25, tier: null },
  { level: 2, votesRequired: 200, rewardCoins: 50, tier: null },
  { level: 3, votesRequired: 300, rewardCoins: 75, tier: null },
  { level: 4, votesRequired: 400, rewardCoins: 100, tier: null },
  { level: 5, votesRequired: 500, rewardCoins: 125, tier: null },
  { level: 6, votesRequired: 600, rewardCoins: 150, tier: null },
  { level: 7, votesRequired: 700, rewardCoins: 175, tier: null },
  { level: 8, votesRequired: 800, rewardCoins: 200, tier: null },
  { level: 9, votesRequired: 900, rewardCoins: 225, tier: null },
  { level: 10, votesRequired: 1000, rewardCoins: 250, tier: "Bronze" },
  { level: 11, votesRequired: 1500, rewardCoins: 275, tier: null },
  { level: 12, votesRequired: 2000, rewardCoins: 300, tier: null },
  { level: 13, votesRequired: 2500, rewardCoins: 325, tier: null },
  { level: 14, votesRequired: 3000, rewardCoins: 350, tier: null },
  { level: 15, votesRequired: 3500, rewardCoins: 375, tier: null },
  { level: 16, votesRequired: 4000, rewardCoins: 400, tier: null },
  { level: 17, votesRequired: 4500, rewardCoins: 425, tier: null },
  { level: 18, votesRequired: 5000, rewardCoins: 450, tier: null },
  { level: 19, votesRequired: 5500, rewardCoins: 475, tier: null },
  { level: 20, votesRequired: 6000, rewardCoins: 500, tier: null },
  { level: 21, votesRequired: 6200, rewardCoins: 525, tier: null },
  { level: 22, votesRequired: 6400, rewardCoins: 550, tier: null },
  { level: 23, votesRequired: 6600, rewardCoins: 575, tier: null },
  { level: 24, votesRequired: 6800, rewardCoins: 600, tier: null },
  { level: 25, votesRequired: 7000, rewardCoins: 825, tier: "Silver" },
  { level: 26, votesRequired: 7200, rewardCoins: 850, tier: null },
  { level: 27, votesRequired: 7400, rewardCoins: 875, tier: null },
  { level: 28, votesRequired: 7600, rewardCoins: 900, tier: null },
  { level: 29, votesRequired: 7800, rewardCoins: 925, tier: null },
  { level: 30, votesRequired: 8000, rewardCoins: 950, tier: null },
  { level: 31, votesRequired: 8200, rewardCoins: 975, tier: null },
  { level: 32, votesRequired: 8400, rewardCoins: 1000, tier: null },
  { level: 33, votesRequired: 8600, rewardCoins: 1025, tier: null },
  { level: 34, votesRequired: 8800, rewardCoins: 1050, tier: null },
  { level: 35, votesRequired: 9000, rewardCoins: 1075, tier: null },
  { level: 36, votesRequired: 9200, rewardCoins: 1100, tier: null },
  { level: 37, votesRequired: 9400, rewardCoins: 1125, tier: null },
  { level: 38, votesRequired: 9600, rewardCoins: 1150, tier: null },
  { level: 39, votesRequired: 9800, rewardCoins: 1175, tier: null },
  { level: 40, votesRequired: 10000, rewardCoins: 1200, tier: null },
  { level: 41, votesRequired: 10200, rewardCoins: 1225, tier: null },
  { level: 42, votesRequired: 10400, rewardCoins: 1250, tier: null },
  { level: 43, votesRequired: 10600, rewardCoins: 1275, tier: null },
  { level: 44, votesRequired: 10800, rewardCoins: 1300, tier: null },
  { level: 45, votesRequired: 11000, rewardCoins: 1325, tier: null },
  { level: 46, votesRequired: 11200, rewardCoins: 1350, tier: null },
  { level: 47, votesRequired: 11400, rewardCoins: 1375, tier: null },
  { level: 48, votesRequired: 11600, rewardCoins: 1400, tier: null },
  { level: 49, votesRequired: 11800, rewardCoins: 1425, tier: null },
  { level: 50, votesRequired: 12000, rewardCoins: 1750, tier: "Gold" },
  { level: 51, votesRequired: 12210, rewardCoins: 1775, tier: null },
  { level: 52, votesRequired: 12270, rewardCoins: 1800, tier: null },
  { level: 53, votesRequired: 12330, rewardCoins: 1825, tier: null },
  { level: 54, votesRequired: 12390, rewardCoins: 1850, tier: null },
  { level: 55, votesRequired: 12450, rewardCoins: 1875, tier: null },
  { level: 56, votesRequired: 12510, rewardCoins: 1900, tier: null },
  { level: 57, votesRequired: 12570, rewardCoins: 1925, tier: null },
  { level: 58, votesRequired: 12630, rewardCoins: 1950, tier: null },
  { level: 59, votesRequired: 12690, rewardCoins: 1975, tier: null },
  { level: 60, votesRequired: 12750, rewardCoins: 2000, tier: null },
  { level: 61, votesRequired: 12810, rewardCoins: 2025, tier: null },
  { level: 62, votesRequired: 12870, rewardCoins: 2050, tier: null },
  { level: 63, votesRequired: 12930, rewardCoins: 2075, tier: null },
  { level: 64, votesRequired: 12990, rewardCoins: 2100, tier: null },
  { level: 65, votesRequired: 13050, rewardCoins: 2125, tier: null },
  { level: 66, votesRequired: 13110, rewardCoins: 2150, tier: null },
  { level: 67, votesRequired: 13170, rewardCoins: 2175, tier: null },
  { level: 68, votesRequired: 13230, rewardCoins: 2200, tier: null },
  { level: 69, votesRequired: 13290, rewardCoins: 2225, tier: null },
  { level: 70, votesRequired: 13350, rewardCoins: 2250, tier: null },
  { level: 71, votesRequired: 13410, rewardCoins: 2275, tier: null },
  { level: 72, votesRequired: 13470, rewardCoins: 2300, tier: null },
  { level: 73, votesRequired: 13530, rewardCoins: 2325, tier: null },
  { level: 74, votesRequired: 13590, rewardCoins: 2350, tier: null },
  { level: 75, votesRequired: 13650, rewardCoins: 2875, tier: "Platinum" },
  { level: 76, votesRequired: 13710, rewardCoins: 2900, tier: null },
  { level: 77, votesRequired: 13770, rewardCoins: 2925, tier: null },
  { level: 78, votesRequired: 13830, rewardCoins: 2950, tier: null },
  { level: 79, votesRequired: 13890, rewardCoins: 2975, tier: null },
  { level: 80, votesRequired: 13950, rewardCoins: 3000, tier: null },
  { level: 81, votesRequired: 14010, rewardCoins: 3025, tier: null },
  { level: 82, votesRequired: 14070, rewardCoins: 3050, tier: null },
  { level: 83, votesRequired: 14130, rewardCoins: 3075, tier: null },
  { level: 84, votesRequired: 14190, rewardCoins: 3100, tier: null },
  { level: 85, votesRequired: 14250, rewardCoins: 3125, tier: null },
  { level: 86, votesRequired: 14310, rewardCoins: 3150, tier: null },
  { level: 87, votesRequired: 14370, rewardCoins: 3175, tier: null },
  { level: 88, votesRequired: 14430, rewardCoins: 3200, tier: null },
  { level: 89, votesRequired: 14490, rewardCoins: 3225, tier: null },
  { level: 90, votesRequired: 14550, rewardCoins: 3250, tier: null },
  { level: 91, votesRequired: 14610, rewardCoins: 3275, tier: null },
  { level: 92, votesRequired: 14670, rewardCoins: 3300, tier: null },
  { level: 93, votesRequired: 14730, rewardCoins: 3325, tier: null },
  { level: 94, votesRequired: 14790, rewardCoins: 3350, tier: null },
  { level: 95, votesRequired: 14850, rewardCoins: 3375, tier: null },
  { level: 96, votesRequired: 14910, rewardCoins: 3400, tier: null },
  { level: 97, votesRequired: 14970, rewardCoins: 3425, tier: null },
  { level: 98, votesRequired: 15030, rewardCoins: 3450, tier: null },
  { level: 99, votesRequired: 15090, rewardCoins: 3475, tier: null },
  { level: 100, votesRequired: 15150, rewardCoins: 4500, tier: "Diamond" }
];

const totalVotes = levels.reduce((sum, level) => sum + level.votesRequired, 0);
const hasStrictVoteIncrease = levels.every((definition, index) => index === 0 || definition.votesRequired > levels[index - 1].votesRequired);
const hasNonDecreasingRewards = levels.every((definition, index) => index === 0 || definition.rewardCoins >= levels[index - 1].rewardCoins);

if (levels.length !== LEVEL_COUNT || totalVotes !== TOTAL_LEVEL_VOTES || !hasStrictVoteIncrease || !hasNonDecreasingRewards) {
  throw new Error("Invalid EKALO level configuration.");
}

export function getLevelDefinition(level: number) {
  return levels[Math.max(0, Math.min(level - 1, levels.length - 1))];
}

export function getNextLevelDefinition(currentLevel: number) {
  return levels.find((definition) => definition.level > currentLevel) ?? levels[levels.length - 1];
}

export function getVisibleLevels(currentLevel: number) {
  const startLevel = Math.max(1, currentLevel || 1);
  return levels.slice(startLevel - 1, Math.min(startLevel + 2, levels.length));
}

export function getUnlockedTier(level: number) {
  return [...levels].reverse().find((definition) => definition.tier && level >= definition.level)?.tier ?? null;
}

export function getTierByLevel(level: number) {
  return [...tierUnlocks].reverse().find((tier) => level >= tier.level) ?? null;
}

export function getTierFrameByLevel(level: number) {
  return getTierByLevel(level)?.frame ?? null;
}

export function getVotesRequiredForLevel(level: number) {
  return getLevelDefinition(level).votesRequired;
}

export function getRewardCoinsForLevel(level: number) {
  return getLevelDefinition(level).rewardCoins;
}

export function getNextTier(level: number) {
  return tierUnlocks.find((tier) => level < tier.level) ?? null;
}

export function getLevelProgress(user: {
  level?: number;
  currentLevel?: number;
  currentLevelVotes?: number;
  currentLevelProgress?: number;
  nextLevelTarget?: number;
}) {
  const currentLevel = user.currentLevel ?? user.level ?? 0;
  const currentVotes = user.currentLevelVotes ?? user.currentLevelProgress ?? 0;
  const nextLevel = getNextLevelDefinition(currentLevel);
  const requiredVotes = user.nextLevelTarget ?? nextLevel.votesRequired;
  const progressPercent = requiredVotes > 0 ? Math.min(100, Math.round((currentVotes / requiredVotes) * 100)) : 100;
  const nextTier = getNextTier(currentLevel);

  return {
    currentLevel,
    currentVotes,
    requiredVotes,
    progressPercent,
    nextLevel: nextLevel.level,
    nextRewardCoins: nextLevel.rewardCoins,
    currentTier: getTierByLevel(currentLevel),
    nextTier,
    nextTierMessage: nextTier ? `${nextTier.tier} unlocks at Level ${nextTier.level}` : "All creator tiers unlocked",
    remainingVotes: Math.max(0, requiredVotes - currentVotes)
  };
}
