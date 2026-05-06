import type { ChallengeType, EntryMode } from "@/types/challenge";

export type EntryStatus = "pending" | "approved" | "rejected" | "suspicious";

export type Entry = {
  id: string;
  challengeId: string;
  challengeSlug: string;
  challengeTitle: string;
  challengeType: ChallengeType;
  userId: string;
  username: string;
  userPhoto: string | null;
  title: string;
  caption: string;
  media: {
    beforeImageUrl: string;
    afterImageUrl: string;
    videoUrl: string;
    thumbnailUrl: string;
  };
  status: EntryStatus;
  entryMode: EntryMode;
  paymentId?: string;
  paymentStatus?: "created" | "paid" | "failed" | "refunded";
  votesCount: number;
  validVotesCount: number;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  votingScore: number;
  engagementScore: number;
  qualityScore: number;
  totalScore: number;
  metadata: {
    fileTypes: string[];
    fileSizes: number[];
    videoDurationSeconds: number | null;
    durationUnknown: boolean;
  };
  createdAt: unknown;
  updatedAt: unknown;
  approvedAt: unknown | null;
  rejectedAt: unknown | null;
  rejectionReason: string;
};
