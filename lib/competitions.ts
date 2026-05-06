"use client";

import { collection, doc, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { slugify } from "@/lib/challenges";
import type { Competition, CompetitionInput, CompetitionStatus } from "@/types/competition";

function requireDb() {
  if (!db) throw new Error("Firestore is not configured.");
  return db;
}

export function toMillis(value: unknown) {
  if (!value) return 0;
  if (typeof value === "object" && "toMillis" in value && typeof value.toMillis === "function") return value.toMillis();
  if (typeof value === "string") return new Date(value).getTime();
  if (value instanceof Date) return value.getTime();
  return 0;
}

export function resolveCompetitionStatus(competition: Pick<Competition, "status" | "startsAt" | "endsAt">): CompetitionStatus {
  if (competition.status === "draft") return "draft";
  const now = Date.now();
  const startsAt = toMillis(competition.startsAt);
  const endsAt = toMillis(competition.endsAt);
  if (startsAt && now < startsAt) return "scheduled";
  if (endsAt && now > endsAt) return "ended";
  if (startsAt && (!endsAt || now >= startsAt)) return "live";
  return competition.status;
}

export function normalizeCompetition(id: string, data: Record<string, unknown>): Competition {
  const rawRules = data.rules;
  return {
    id,
    title: String(data.title ?? ""),
    categoryId: String(data.categoryId ?? data.categorySlug ?? data.category ?? ""),
    categorySlug: String(data.categorySlug ?? data.categoryId ?? slugify(String(data.categoryName ?? data.category ?? ""))),
    categoryName: String(data.categoryName ?? data.category ?? ""),
    type: String(data.type ?? data.challengeType ?? "mixed"),
    description: String(data.description ?? ""),
    rules: Array.isArray(rawRules) ? rawRules.map(String) : String(rawRules ?? "").split("\n").map((item) => item.trim()).filter(Boolean),
    prizePool: String(data.prizePool ?? data.prizePoolAmount ?? ""),
    entryFee: data.entryFeeType === "paid" || data.entryFee === "paid" || data.entryMode === "paid" ? "paid" : "free",
    entryFeeType: data.entryFeeType === "paid" || data.entryFee === "paid" || data.entryMode === "paid" ? "paid" : "free",
    entryFeeAmount: data.entryFeeType === "paid" || data.entryFee === "paid" || data.entryMode === "paid" ? Number(data.entryFeeAmount ?? data.paidEntryAmount ?? 0) : 0,
    maxEntries: data.maxEntries === null || data.maxEntries === undefined ? null : Number(data.maxEntries),
    allowedMediaTypes: Array.isArray(data.allowedMediaTypes) ? (data.allowedMediaTypes as Competition["allowedMediaTypes"]) : [data.challengeType === "video" ? "video" : "image"],
    thumbnailUrl: String(data.thumbnailUrl ?? data.coverImageUrl ?? ""),
    coverImageUrl: String(data.coverImageUrl ?? data.thumbnailUrl ?? ""),
    rulesVideoUrl: String(data.rulesVideoUrl ?? ""),
    rulesVideoType: data.rulesVideoType === "upload" || data.rulesVideoType === "url" ? data.rulesVideoType : null,
    startsAt: data.startsAt ?? data.startAt ?? null,
    endsAt: data.endsAt ?? data.endAt ?? null,
    status: (data.status === "upcoming" ? "scheduled" : data.status ?? "draft") as CompetitionStatus,
    isFeatured: Boolean(data.isFeatured),
    isVisible: typeof data.isVisible === "boolean" ? data.isVisible : data.status !== "draft",
    entriesCount: Number(data.entriesCount ?? (data.stats as { entriesCount?: number } | undefined)?.entriesCount ?? 0),
    joinedCount: Number(data.joinedCount ?? (data.stats as { entriesCount?: number } | undefined)?.entriesCount ?? 0),
    createdBy: String(data.createdBy ?? ""),
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}

export function listenToCompetitions(callback: (competitions: Competition[]) => void, includeDrafts = false) {
  const source = includeDrafts
    ? collection(requireDb(), "competitions")
    : query(collection(requireDb(), "competitions"), where("isVisible", "==", true), where("status", "in", ["scheduled", "live", "ended"]));
  return onSnapshot(source, (snapshot) => {
    const competitions = snapshot.docs.map((item) => normalizeCompetition(item.id, item.data()));
    callback(competitions.filter((item) => includeDrafts || (item.isVisible && item.status !== "draft")));
  });
}

export function listenToPublicCompetitionsByCategory(categorySlug: string, callback: (competitions: Competition[]) => void) {
  return onSnapshot(query(collection(requireDb(), "competitions"), where("categorySlug", "==", categorySlug), where("isVisible", "==", true), where("status", "in", ["scheduled", "live", "ended"])), (snapshot) => {
    callback(
      snapshot.docs
        .map((item) => normalizeCompetition(item.id, item.data()))
        .filter((item) => item.isVisible && item.status !== "draft")
        .sort((a, b) => toMillis(a.startsAt) - toMillis(b.startsAt))
    );
  });
}

export async function saveCompetition(input: CompetitionInput) {
  const firestore = requireDb();
  const id = input.id || slugify(input.title) || crypto.randomUUID();
  const normalizedStatus = input.status === "scheduled" ? "scheduled" : input.status;
  const payload = {
    ...input,
    id,
    entryFee: input.entryFeeType,
    entryFeeType: input.entryFeeType,
    entryFeeAmount: input.entryFeeType === "paid" ? Number(input.entryFeeAmount) : 0,
    thumbnailUrl: input.thumbnailUrl || input.coverImageUrl,
    coverImageUrl: input.coverImageUrl || input.thumbnailUrl,
    status: normalizedStatus,
    entriesCount: input.entriesCount ?? 0,
    joinedCount: input.joinedCount ?? 0,
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp()
  };
  await setDoc(doc(firestore, "competitions", id), payload, { merge: true });

  const challengePayload = {
    id,
    title: input.title,
    slug: id,
    category: input.categoryName,
    categoryId: input.categoryId,
    categorySlug: input.categorySlug,
    challengeType: input.allowedMediaTypes.includes("video") ? "video" : "image",
    status: input.status === "scheduled" ? "upcoming" : input.status,
    description: input.description,
    theme: input.type,
    rules: input.rules,
    prizePoolAmount: Number(String(input.prizePool).replace(/[^0-9.]/g, "")) || 0,
    prizeCurrency: "INR",
    coverMediaType: "image",
    coverImageUrl: input.coverImageUrl || input.thumbnailUrl,
    coverVideoUrl: "",
    thumbnailUrl: input.thumbnailUrl || input.coverImageUrl,
    rulesVideoUrl: input.rulesVideoUrl,
    rulesVideoType: input.rulesVideoType,
    entryMode: input.entryFeeType,
    entryFeeType: input.entryFeeType,
    entryFeeAmount: input.entryFeeType === "paid" ? Number(input.entryFeeAmount) : 0,
    freeEntriesPerUser: 1,
    paidEntryEnabled: input.entryFeeType === "paid",
    paidEntryAmount: input.entryFeeType === "paid" ? Number(input.entryFeeAmount) : 0,
    paidEntryCurrency: "INR",
    maxEntriesPerUser: 1,
    allowMultipleEntries: false,
    startAt: input.startsAt,
    endAt: input.endsAt,
    resultAnnounceAt: null,
    scoring: { votingWeight: 30, engagementWeight: 40, qualityWeight: 30, showScoringPublicly: true },
    participation: { requireLogin: true, requireBeforeAfter: false, requireCaption: false, allowComments: true, allowLikes: true, allowVotes: true, maxVotesPerUser: 3 },
    uploadRules: {
      allowedUploadTypes: input.allowedMediaTypes.includes("video") ? ["video/mp4", "video/webm", "video/quicktime"] : ["image/jpeg", "image/png", "image/webp"],
      maxImageSizeMB: 10,
      maxVideoSizeMB: 100,
      maxVideoDurationSeconds: 60,
      requireBeforeImage: false,
      requireAfterImage: false,
      requireVideo: input.allowedMediaTypes.includes("video")
    },
    adminControls: { approveEntriesManually: false, allowAdminRejectEntry: true, allowAdminMarkSuspicious: true },
    stats: { entriesCount: input.entriesCount ?? 0, votesCount: 0, likesCount: 0, commentsCount: 0, viewsCount: 0 },
    createdBy: input.createdBy,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  await setDoc(doc(firestore, "challenges", id), challengePayload, { merge: true });
  return id;
}

export async function updateCompetitionStatus(competitionId: string, status: CompetitionStatus) {
  await updateDoc(doc(requireDb(), "competitions", competitionId), { status, updatedAt: serverTimestamp() });
  await updateDoc(doc(requireDb(), "challenges", competitionId), { status: status === "scheduled" ? "upcoming" : status, updatedAt: serverTimestamp() });
}
