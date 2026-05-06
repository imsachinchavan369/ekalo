export type CompetitionStatus = "draft" | "scheduled" | "live" | "result_pending" | "ended";
export type CompetitionPhase = "draft" | "upcoming" | "live" | "voting_closed" | "ended";
export type CompetitionEntryFee = "free" | "paid";
export type CompetitionMediaType = "video" | "photo" | "audio" | "image" | "mixed";

export type Competition = {
  id: string;
  title: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  type: string;
  description: string;
  rules: string[];
  prizePool: string;
  entryFee?: CompetitionEntryFee;
  entryFeeType: CompetitionEntryFee;
  entryFeeAmount: number;
  maxEntries: number | null;
  allowedMediaTypes: CompetitionMediaType[];
  thumbnailUrl: string;
  coverImageUrl: string;
  rulesVideoUrl: string;
  rulesVideoType: "upload" | "url" | null;
  startsAt: unknown;
  endsAt: unknown;
  resultAt: unknown;
  status: CompetitionStatus;
  isFeatured: boolean;
  isVisible: boolean;
  entriesCount: number;
  joinedCount: number;
  createdBy: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type CompetitionInput = Omit<Competition, "id" | "createdAt" | "updatedAt" | "entriesCount" | "joinedCount"> & {
  id?: string;
  entriesCount?: number;
  joinedCount?: number;
};
