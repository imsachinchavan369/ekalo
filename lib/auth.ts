"use client";

import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { auth, db, googleProvider, hasFirebaseConfig } from "@/lib/firebase";
import { defaultProgressionState } from "@/lib/levels";

export async function signInWithGoogle() {
  if (!hasFirebaseConfig || !auth || !db) {
    throw new Error("Firebase is not configured yet. Add the NEXT_PUBLIC_FIREBASE_* values in .env.local.");
  }

  const credential = await signInWithPopup(auth, googleProvider);
  const userRef = doc(db, "users", credential.user.uid);
  const snapshot = await getDoc(userRef);

  await setDoc(
    userRef,
    {
      uid: credential.user.uid,
      displayName: credential.user.displayName,
      email: credential.user.email,
      photoURL: credential.user.photoURL,
      role: snapshot.exists() ? snapshot.data().role : "user",
      createdAt: snapshot.exists() ? snapshot.data().createdAt : serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      isBlocked: snapshot.exists() ? snapshot.data().isBlocked : false,
      deviceIds: snapshot.exists() ? snapshot.data().deviceIds ?? [] : [],
      coins: snapshot.exists() ? snapshot.data().coins ?? defaultProgressionState.coins : defaultProgressionState.coins,
      level: snapshot.exists() ? snapshot.data().level ?? defaultProgressionState.level : defaultProgressionState.level,
      currentLevel: snapshot.exists()
        ? snapshot.data().currentLevel ?? snapshot.data().level ?? defaultProgressionState.currentLevel
        : defaultProgressionState.currentLevel,
      totalVotesReceived: snapshot.exists()
        ? snapshot.data().totalVotesReceived ?? defaultProgressionState.totalVotesReceived
        : defaultProgressionState.totalVotesReceived,
      validVotesReceived: snapshot.exists()
        ? snapshot.data().validVotesReceived ?? defaultProgressionState.validVotesReceived
        : defaultProgressionState.validVotesReceived,
      totalVotes: snapshot.exists()
        ? snapshot.data().totalVotes ?? snapshot.data().validVotesReceived ?? defaultProgressionState.totalVotes
        : defaultProgressionState.totalVotes,
      currentLevelProgress: snapshot.exists()
        ? snapshot.data().currentLevelProgress ?? defaultProgressionState.currentLevelProgress
        : defaultProgressionState.currentLevelProgress,
      currentLevelVotes: snapshot.exists()
        ? snapshot.data().currentLevelVotes ?? snapshot.data().currentLevelProgress ?? defaultProgressionState.currentLevelVotes
        : defaultProgressionState.currentLevelVotes,
      nextLevelTarget: snapshot.exists()
        ? snapshot.data().nextLevelTarget ?? defaultProgressionState.nextLevelTarget
        : defaultProgressionState.nextLevelTarget,
      totalCoins: snapshot.exists()
        ? snapshot.data().totalCoins ?? snapshot.data().coins ?? defaultProgressionState.totalCoins
        : defaultProgressionState.totalCoins,
      followersCount: snapshot.exists() ? snapshot.data().followersCount ?? 0 : 0,
      currentTier: snapshot.exists() ? snapshot.data().currentTier ?? defaultProgressionState.currentTier : defaultProgressionState.currentTier,
      unlockedTiers: snapshot.exists() ? snapshot.data().unlockedTiers ?? defaultProgressionState.unlockedTiers : defaultProgressionState.unlockedTiers
    },
    { merge: true }
  );

  return credential;
}

export async function logout() {
  if (!auth) {
    return;
  }

  await signOut(auth);
}

export const signOutCurrentUser = logout;

export function getCurrentUser() {
  return auth?.currentUser ?? null;
}

export function listenToCurrentUser(callback: (user: User | null) => void) {
  if (!auth) {
    callback(null);
    return () => undefined;
  }

  return onAuthStateChanged(auth, callback);
}
