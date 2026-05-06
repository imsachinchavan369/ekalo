"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  increment,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type EntryComment = {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  text: string;
  createdAt: unknown;
};

function requireDb() {
  if (!db) throw new Error("Firestore is not configured.");
  return db;
}

export function listenToEntryLike(entryId: string, userId: string, callback: (liked: boolean) => void) {
  return onSnapshot(doc(requireDb(), "entries", entryId, "likes", userId), (snapshot) => callback(snapshot.exists()));
}

export async function toggleEntryLike(entryId: string, userId: string, shouldLike: boolean) {
  const firestore = requireDb();
  const entryRef = doc(firestore, "entries", entryId);
  const likeRef = doc(firestore, "entries", entryId, "likes", userId);

  await runTransaction(firestore, async (transaction) => {
    const likeSnapshot = await transaction.get(likeRef);
    if (shouldLike && !likeSnapshot.exists()) {
      transaction.set(likeRef, { createdAt: serverTimestamp() });
      transaction.update(entryRef, { likesCount: increment(1), updatedAt: serverTimestamp() });
    }
    if (!shouldLike && likeSnapshot.exists()) {
      transaction.delete(likeRef);
      transaction.update(entryRef, { likesCount: increment(-1), updatedAt: serverTimestamp() });
    }
  });
}

export function listenToEntryComments(entryId: string, callback: (comments: EntryComment[]) => void) {
  return onSnapshot(query(collection(requireDb(), "entries", entryId, "comments"), orderBy("createdAt", "desc")), (snapshot) => {
    callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as EntryComment));
  });
}

export async function addEntryComment(input: {
  entryId: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  text: string;
}) {
  const text = input.text.trim().replace(/\s+/g, " ");
  if (!text) throw new Error("Comment cannot be empty.");
  if (text.length > 500) throw new Error("Comment is too long.");
  const firestore = requireDb();
  await addDoc(collection(firestore, "entries", input.entryId, "comments"), {
    userId: input.userId,
    userName: input.userName,
    userAvatar: input.userAvatar,
    text,
    createdAt: serverTimestamp()
  });
  await runTransaction(firestore, async (transaction) => {
    const entryRef = doc(firestore, "entries", input.entryId);
    const snapshot = await transaction.get(entryRef);
    if (snapshot.exists()) transaction.update(entryRef, { commentsCount: increment(1), updatedAt: serverTimestamp() });
  });
}

export async function deleteEntryLikeIfPresent(entryId: string, userId: string) {
  const likeRef = doc(requireDb(), "entries", entryId, "likes", userId);
  const snapshot = await getDoc(likeRef);
  if (snapshot.exists()) await deleteDoc(likeRef);
}
