"use client";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { applyLevelProgressToBatch } from "@/lib/levels";
import { calculateEntryScore, validateVote } from "@/lib/utils";
import type { Entry } from "@/types/entry";

function requireDb() {
  if (!db) {
    throw new Error("Firestore is not configured.");
  }

  return db;
}

export async function userHasEntry(challengeId: string, userId: string) {
  const firestore = requireDb();
  const entriesQuery = query(
    collection(firestore, "entries"),
    where("challengeId", "==", challengeId),
    where("userId", "==", userId),
    limit(1)
  );
  const snapshot = await getDocs(entriesQuery);
  return !snapshot.empty;
}

export async function createEntry(input: {
  challengeId: string;
  userId: string;
  username: string;
  userPhoto: string | null;
  title?: string;
  beforeImageUrl: string;
  afterImageUrl: string;
}) {
  const firestore = requireDb();

  if (await userHasEntry(input.challengeId, input.userId)) {
    throw new Error("You have already submitted your free entry for this challenge.");
  }

  const score = calculateEntryScore({
    votesCount: 0,
    likesCount: 0,
    commentsCount: 0,
    viewsCount: 0,
    qualityScore: 0
  });

  return addDoc(collection(firestore, "entries"), {
    ...input,
    title: input.title ?? "",
    status: "approved",
    votesCount: 0,
    validVotesCount: 0,
    likesCount: 0,
    commentsCount: 0,
    viewsCount: 0,
    ...score,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function getEntry(entryId: string) {
  const snapshot = await getDoc(doc(requireDb(), "entries", entryId));
  return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as Entry) : null;
}

export async function castVote(input: {
  challengeId: string;
  entryId: string;
  voterId: string;
  entryOwnerId: string;
  deviceId: string;
  userAgent: string;
}) {
  const firestore = requireDb();
  const votesQuery = query(
    collection(firestore, "votes"),
    where("voterId", "==", input.voterId),
    orderBy("createdAt", "desc")
  );
  const votes = await getDocs(votesQuery);
  const existingVotes = votes.docs.map((vote) => vote.data());
  const ownerSnapshot = await getDoc(doc(firestore, "users", input.entryOwnerId));
  const validation = validateVote({
    voterId: input.voterId,
    entryOwnerId: input.entryOwnerId,
    entryId: input.entryId,
    existingVotes
  });

  const batch = writeBatch(firestore);
  batch.set(doc(collection(firestore, "votes")), {
    ...input,
    isValid: validation.valid,
    isSuspicious: validation.suspicious,
    createdAt: serverTimestamp()
  });

  if (!validation.valid) {
    await batch.commit();
    throw new Error(validation.message);
  }

  batch.update(doc(firestore, "entries", input.entryId), {
    votesCount: increment(1),
    validVotesCount: increment(1),
    updatedAt: serverTimestamp()
  });
  const progress = ownerSnapshot.exists()
    ? applyLevelProgressToBatch(batch, firestore, input.entryOwnerId, ownerSnapshot.data(), 1)
    : null;
  await batch.commit();

  return { levelUp: progress?.earnedLevels.at(-1) ?? null };
}

export async function updateEntryReview(entryId: string, status: Entry["status"], qualityScore: number) {
  await updateDoc(doc(requireDb(), "entries", entryId), {
    status,
    qualityScore,
    updatedAt: serverTimestamp()
  });
}
