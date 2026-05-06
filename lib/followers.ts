"use client";

import { doc, increment, onSnapshot, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

function requireDb() {
  if (!db) throw new Error("Firestore is not configured.");
  return db;
}

function getFollowerRef(targetUserId: string, currentUserId: string) {
  return doc(requireDb(), "users", targetUserId, "followers", currentUserId);
}

export function listenToFollowStatus(targetUserId: string, currentUserId: string, callback: (isFollowing: boolean) => void) {
  if (targetUserId === currentUserId) {
    callback(false);
    return () => undefined;
  }

  return onSnapshot(getFollowerRef(targetUserId, currentUserId), (snapshot) => {
    callback(snapshot.exists());
  });
}

export async function followUser(targetUserId: string, currentUserId: string) {
  if (targetUserId === currentUserId) {
    throw new Error("You cannot follow yourself.");
  }

  const firestore = requireDb();
  const targetRef = doc(firestore, "users", targetUserId);
  const followerRef = doc(firestore, "users", targetUserId, "followers", currentUserId);

  await runTransaction(firestore, async (transaction) => {
    const [targetSnapshot, followerSnapshot] = await Promise.all([transaction.get(targetRef), transaction.get(followerRef)]);
    if (!targetSnapshot.exists()) throw new Error("Profile not found.");
    if (followerSnapshot.exists()) return;

    transaction.set(followerRef, { createdAt: serverTimestamp() });
    transaction.update(targetRef, {
      followersCount: increment(1),
      updatedAt: serverTimestamp()
    });
  });
}

export async function unfollowUser(targetUserId: string, currentUserId: string) {
  if (targetUserId === currentUserId) {
    throw new Error("You cannot unfollow yourself.");
  }

  const firestore = requireDb();
  const targetRef = doc(firestore, "users", targetUserId);
  const followerRef = doc(firestore, "users", targetUserId, "followers", currentUserId);

  await runTransaction(firestore, async (transaction) => {
    const [targetSnapshot, followerSnapshot] = await Promise.all([transaction.get(targetRef), transaction.get(followerRef)]);
    if (!targetSnapshot.exists()) throw new Error("Profile not found.");
    if (!followerSnapshot.exists()) return;

    transaction.delete(followerRef);
    transaction.update(targetRef, {
      followersCount: increment(-1),
      updatedAt: serverTimestamp()
    });
  });
}
