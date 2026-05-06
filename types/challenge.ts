export type ChallengeType = "image" | "video";
export type ChallengeStatus = "draft" | "upcoming" | "live" | "ended";
export type EntryMode = "free" | "paid";
export type CoverMediaType = "image" | "video";

export type Challenge = {
  id: string;
  title: string;
  slug: string;
  category: string;
  challengeType: ChallengeType;
  status: ChallengeStatus;
  description: string;
  theme: string;
  rules: string[];
  prizePoolAmount: number;
  prizeCurrency: string;
  coverMediaType: CoverMediaType;
  coverImageUrl: string;
  coverVideoUrl: string;
  thumbnailUrl: string;
  entryMode: EntryMode;
  entryFeeType?: EntryMode;
  entryFeeAmount?: number;
  rulesVideoUrl?: string;
  rulesVideoType?: "upload" | "url" | null;
  freeEntriesPerUser: number;
  paidEntryEnabled: boolean;
  paidEntryAmount: number;
  paidEntryCurrency: string;
  maxEntriesPerUser: number;
  allowMultipleEntries: boolean;
  startAt: unknown;
  endAt: unknown;
  resultAnnounceAt: unknown | null;
  scoring: {
    votingWeight: number;
    engagementWeight: number;
    qualityWeight: number;
    showScoringPublicly: boolean;
  };
  participation: {
    requireLogin: boolean;
    requireBeforeAfter: boolean;
    requireCaption: boolean;
    allowComments: boolean;
    allowLikes: boolean;
    allowVotes: boolean;
    maxVotesPerUser: number;
  };
  uploadRules: {
    allowedUploadTypes: string[];
    maxImageSizeMB: number;
    maxVideoSizeMB: number;
    maxVideoDurationSeconds: number;
    requireBeforeImage: boolean;
    requireAfterImage: boolean;
    requireVideo: boolean;
  };
  adminControls: {
    approveEntriesManually: boolean;
    allowAdminRejectEntry: boolean;
    allowAdminMarkSuspicious: boolean;
  };
  stats: {
    entriesCount: number;
    votesCount: number;
    likesCount: number;
    commentsCount: number;
    viewsCount: number;
  };
  createdBy: string;
  createdAt: unknown;
  updatedAt: unknown;
};

export type ChallengeInput = Omit<Challenge, "id" | "createdAt" | "updatedAt" | "stats"> & {
  id?: string;
};
