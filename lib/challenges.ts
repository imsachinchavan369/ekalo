"use client";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Challenge, ChallengeInput, ChallengeStatus, ChallengeType } from "@/types/challenge";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function defaultChallenge(createdBy = ""): ChallengeInput {
  return {
    title: "",
    slug: "",
    category: "",
    challengeType: "image",
    status: "draft",
    description: "",
    theme: "",
    rules: [],
    prizePoolAmount: 0,
    prizeCurrency: "INR",
    coverMediaType: "image",
    coverImageUrl: "",
    coverVideoUrl: "",
    thumbnailUrl: "",
    entryMode: "free",
    freeEntriesPerUser: 1,
    paidEntryEnabled: false,
    paidEntryAmount: 0,
    paidEntryCurrency: "INR",
    maxEntriesPerUser: 1,
    allowMultipleEntries: false,
    startAt: "",
    endAt: "",
    resultAnnounceAt: null,
    scoring: {
      votingWeight: 30,
      engagementWeight: 40,
      qualityWeight: 30,
      showScoringPublicly: true
    },
    participation: {
      requireLogin: true,
      requireBeforeAfter: true,
      requireCaption: false,
      allowComments: true,
      allowLikes: true,
      allowVotes: true,
      maxVotesPerUser: 3
    },
    uploadRules: {
      allowedUploadTypes: ["image/jpeg", "image/png", "image/webp"],
      maxImageSizeMB: 10,
      maxVideoSizeMB: 100,
      maxVideoDurationSeconds: 60,
      requireBeforeImage: true,
      requireAfterImage: true,
      requireVideo: false
    },
    adminControls: {
      approveEntriesManually: false,
      allowAdminRejectEntry: true,
      allowAdminMarkSuspicious: true
    },
    createdBy
  };
}

function requireDb() {
  if (!db) throw new Error("Firestore is not configured.");
  return db;
}

function normalize(id: string, data: Record<string, unknown>): Challenge {
  const rawStatus = String(data.status ?? "draft");
  return {
    ...defaultChallenge(String(data.createdBy ?? "")),
    ...data,
    category: String(data.categoryName ?? data.category ?? ""),
    challengeType: data.challengeType === "video" || (Array.isArray(data.allowedMediaTypes) && data.allowedMediaTypes.includes("video")) ? "video" : "image",
    status: (rawStatus === "scheduled" ? "upcoming" : rawStatus) as ChallengeStatus,
    theme: String(data.theme ?? data.type ?? ""),
    prizePoolAmount: Number(String(data.prizePoolAmount ?? data.prizePool ?? 0).replace(/[^0-9.]/g, "")) || 0,
    coverImageUrl: String(data.coverImageUrl ?? data.thumbnailUrl ?? ""),
    thumbnailUrl: String(data.thumbnailUrl ?? data.coverImageUrl ?? ""),
    entryMode: data.entryFeeType === "paid" || data.entryMode === "paid" || data.entryFee === "paid" ? "paid" : "free",
    entryFeeType: data.entryFeeType === "paid" || data.entryMode === "paid" || data.entryFee === "paid" ? "paid" : "free",
    entryFeeAmount: data.entryFeeType === "paid" || data.entryMode === "paid" || data.entryFee === "paid" ? Number(data.entryFeeAmount ?? data.paidEntryAmount ?? 0) : 0,
    rulesVideoUrl: String(data.rulesVideoUrl ?? ""),
    rulesVideoType: data.rulesVideoType === "upload" || data.rulesVideoType === "url" ? data.rulesVideoType : null,
    startAt: data.startAt ?? data.startsAt ?? "",
    endAt: data.endAt ?? data.endsAt ?? "",
    id,
    stats: {
      entriesCount: 0,
      votesCount: 0,
      likesCount: 0,
      commentsCount: 0,
      viewsCount: 0,
      ...((data.stats as object) ?? {})
    },
    scoring: { ...defaultChallenge().scoring, ...((data.scoring as object) ?? {}) },
    participation: { ...defaultChallenge().participation, ...((data.participation as object) ?? {}) },
    uploadRules: { ...defaultChallenge().uploadRules, ...((data.uploadRules as object) ?? {}) },
    adminControls: { ...defaultChallenge().adminControls, ...((data.adminControls as object) ?? {}) }
  } as Challenge;
}

export function applyChallengeTypeDefaults(challenge: ChallengeInput, type: ChallengeType): ChallengeInput {
  if (type === "video") {
    return {
      ...challenge,
      challengeType: "video",
      coverMediaType: challenge.coverMediaType,
      participation: { ...challenge.participation, requireBeforeAfter: false },
      uploadRules: {
        ...challenge.uploadRules,
        allowedUploadTypes: ["video/mp4", "video/webm", "video/quicktime"],
        requireBeforeImage: false,
        requireAfterImage: false,
        requireVideo: true
      }
    };
  }

  return {
    ...challenge,
    challengeType: "image",
    coverMediaType: "image",
    participation: { ...challenge.participation, requireBeforeAfter: true },
    uploadRules: {
      ...challenge.uploadRules,
      allowedUploadTypes: ["image/jpeg", "image/png", "image/webp"],
      requireBeforeImage: true,
      requireAfterImage: true,
      requireVideo: false
    }
  };
}

export function listenToChallenges(callback: (challenges: Challenge[]) => void) {
  return onSnapshot(collection(requireDb(), "challenges"), (snapshot) => {
    callback(snapshot.docs.map((item) => normalize(item.id, item.data())).sort((a, b) => a.title.localeCompare(b.title)));
  });
}

export async function getPublicChallenges() {
  const snapshot = await getDocs(query(collection(requireDb(), "competitions"), where("isVisible", "==", true), where("status", "in", ["scheduled", "live", "ended"])));
  return snapshot.docs.map((item) => normalize(item.id, item.data()));
}

export function listenToPublicChallenges(callback: (challenges: Challenge[]) => void) {
  return onSnapshot(query(collection(requireDb(), "competitions"), where("isVisible", "==", true), where("status", "in", ["scheduled", "live", "ended"])), (snapshot) => {
    callback(snapshot.docs.map((item) => normalize(item.id, item.data())));
  });
}

export function listenToChallengeBySlugOrId(slugOrId: string, callback: (challenge: Challenge | null) => void) {
  return onSnapshot(collection(requireDb(), "challenges"), (snapshot) => {
    const match = snapshot.docs.map((item) => normalize(item.id, item.data())).find((item) => item.id === slugOrId || item.slug === slugOrId);
    callback(match ?? null);
  });
}

export async function saveChallenge(input: ChallengeInput, status?: ChallengeStatus) {
  const firestore = requireDb();
  const id = input.id || slugify(input.slug || input.title) || crypto.randomUUID();
  const challengeRef = doc(firestore, "challenges", id);
  const payload = {
    ...input,
    id,
    slug: slugify(input.slug || input.title),
    status: status ?? input.status,
    stats: {
      entriesCount: 0,
      votesCount: 0,
      likesCount: 0,
      commentsCount: 0,
      viewsCount: 0
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  await setDoc(challengeRef, payload, { merge: true });
  return id;
}

export async function updateChallengeStatus(challengeId: string, status: ChallengeStatus) {
  await updateDoc(doc(requireDb(), "challenges", challengeId), { status, updatedAt: serverTimestamp() });
}

export async function deleteDraftChallenge(challenge: Challenge) {
  if (challenge.status !== "draft") throw new Error("Only draft challenges can be deleted.");
  await deleteDoc(doc(requireDb(), "challenges", challenge.id));
}
