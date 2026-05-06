"use client";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Challenge } from "@/types/challenge";
import type { Entry, EntryStatus } from "@/types/entry";

function requireDb() {
  if (!db) throw new Error("Firestore is not configured.");
  return db;
}

function normalizeEntry(id: string, data: Record<string, unknown>): Entry {
  return { id, ...data } as Entry;
}

export async function getUserEntryCount(challengeId: string, userId: string) {
  const snapshot = await getDocs(query(collection(requireDb(), "entries"), where("challengeId", "==", challengeId), where("userId", "==", userId)));
  return snapshot.size;
}

export async function getEntry(entryId: string) {
  const snapshot = await getDoc(doc(requireDb(), "entries", entryId));
  return snapshot.exists() ? normalizeEntry(snapshot.id, snapshot.data()) : null;
}

export async function listEntries(challengeId?: string, status?: EntryStatus) {
  const constraints = [];
  if (challengeId) constraints.push(where("challengeId", "==", challengeId));
  if (status) constraints.push(where("status", "==", status));
  const snapshot = await getDocs(query(collection(requireDb(), "entries"), ...constraints, limit(100)));
  return snapshot.docs.map((entry) => normalizeEntry(entry.id, entry.data()));
}

export async function createChallengeEntry(input: {
  challenge: Challenge;
  userId: string;
  username: string;
  userPhoto: string | null;
  title: string;
  caption: string;
  media: Entry["media"];
  entryMode: "free" | "paid";
  paymentId?: string;
  paymentStatus?: Entry["paymentStatus"];
  metadata: Entry["metadata"];
}) {
  if (input.challenge.status !== "live") throw new Error("This challenge is not live.");
  const count = await getUserEntryCount(input.challenge.id, input.userId);
  const maxEntries = input.challenge.allowMultipleEntries ? input.challenge.maxEntriesPerUser : input.challenge.freeEntriesPerUser;
  if (count >= maxEntries) throw new Error("You have reached the entry limit for this challenge.");
  if (input.challenge.entryMode === "paid" && input.paymentStatus !== "paid") throw new Error("Payment must be verified before entry submission.");

  const firestore = requireDb();
  const entryStatus = input.challenge.adminControls.approveEntriesManually ? "pending" : "approved";
  const entryRef = doc(collection(firestore, "entries"));
  const batch = writeBatch(firestore);
  batch.set(entryRef, {
    challengeId: input.challenge.id,
    challengeSlug: input.challenge.slug,
    challengeTitle: input.challenge.title,
    challengeType: input.challenge.challengeType,
    userId: input.userId,
    username: input.username,
    userPhoto: input.userPhoto,
    title: input.title,
    caption: input.caption,
    media: input.media,
    status: entryStatus,
    entryMode: input.entryMode,
    paymentId: input.paymentId ?? "",
    paymentStatus: input.paymentStatus ?? "",
    votesCount: 0,
    validVotesCount: 0,
    likesCount: 0,
    commentsCount: 0,
    viewsCount: 0,
    votingScore: 0,
    engagementScore: 0,
    qualityScore: 0,
    totalScore: 0,
    metadata: input.metadata,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    approvedAt: entryStatus === "approved" ? serverTimestamp() : null,
    rejectedAt: null,
    rejectionReason: ""
  });
  batch.update(doc(firestore, "challenges", input.challenge.id), {
    "stats.entriesCount": increment(1),
    updatedAt: serverTimestamp()
  });
  await batch.commit();
  return entryRef.id;
}

export async function updateEntryAdmin(entryId: string, status: EntryStatus, qualityScore: number, rejectionReason = "") {
  await updateDoc(doc(requireDb(), "entries", entryId), {
    status,
    qualityScore,
    rejectionReason,
    updatedAt: serverTimestamp(),
    approvedAt: status === "approved" ? serverTimestamp() : null,
    rejectedAt: status === "rejected" ? serverTimestamp() : null
  });
}
