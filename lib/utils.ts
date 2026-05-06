export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function safeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function calculateEntryScore(input: {
  votesCount: number;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  qualityScore: number;
}) {
  // V1 scoring is intentionally simple. Final scoring can move to Cloud Functions
  // once moderation, anti-abuse signals, and quality review workflows mature.
  const votingScore = input.votesCount * 0.3;
  const engagementScore = (input.likesCount + input.commentsCount * 2 + Math.floor(input.viewsCount / 10)) * 0.4;
  const qualityScore = input.qualityScore * 0.3;

  return {
    votingScore,
    engagementScore,
    qualityScore,
    totalScore: votingScore + engagementScore + qualityScore
  };
}

export function validateVote(input: {
  voterId: string | null | undefined;
  entryOwnerId: string;
  entryId?: string;
  existingVotes: Array<{
    entryId?: string;
    createdAt?: { toMillis?: () => number } | Date | null;
    isSuspicious?: boolean;
  }>;
  now?: number;
}) {
  const now = input.now ?? Date.now();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const voteTime = (vote: { createdAt?: { toMillis?: () => number } | Date | null }) =>
    vote.createdAt instanceof Date ? vote.createdAt.getTime() : vote.createdAt?.toMillis ? vote.createdAt.toMillis() : 0;
  const todaysVotes = input.existingVotes.filter((vote) => {
    const millis = voteTime(vote);
    return millis >= startOfDay.getTime() && millis <= now;
  });
  const latestMillis = input.existingVotes.reduce((latest, vote) => Math.max(latest, voteTime(vote)), 0);

  if (!input.voterId) {
    return { valid: false, suspicious: false, message: "Log in with Google to vote." };
  }

  if (input.voterId === input.entryOwnerId) {
    return { valid: false, suspicious: true, message: "You cannot vote on your own entry." };
  }

  if (todaysVotes.length >= 15) {
    return { valid: false, suspicious: false, message: "You have used all 15 votes for today." };
  }

  if (input.entryId && todaysVotes.some((vote) => vote.entryId === input.entryId)) {
    return { valid: false, suspicious: false, message: "You can vote once per entry per day." };
  }

  const cooldown = 5000;
  if (latestMillis && now - latestMillis < cooldown) {
    return { valid: false, suspicious: false, message: `Please wait ${Math.ceil((cooldown - (now - latestMillis)) / 1000)}s before voting again.` };
  }

  if (input.existingVotes.some((vote) => vote.isSuspicious)) {
    return { valid: false, suspicious: true, message: "Suspicious vote activity detected." };
  }

  return { valid: true, suspicious: false, message: "Vote allowed." };
}
