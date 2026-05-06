"use client";

import { doc, getDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "@/lib/firebase";

export type AdminCheckResult = {
  isAdmin: boolean;
  role: string | null;
};

export async function checkIsAdmin(user: User): Promise<AdminCheckResult> {
  const allowedEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim().toLowerCase();
  const emailMatches = Boolean(allowedEmail && user.email?.toLowerCase() === allowedEmail);
  const isDev = process.env.NODE_ENV === "development";

  if (!db) {
    if (isDev) {
      console.log("[EKALO admin] current user email:", user.email);
      console.log("[EKALO admin] admin email env value:", allowedEmail);
      console.log("[EKALO admin] firestore role result:", null);
      console.log("[EKALO admin] admin access result:", emailMatches);
    }

    return { isAdmin: emailMatches, role: null };
  }

  const snapshot = await getDoc(doc(db, "users", user.uid));
  const role = snapshot.exists() && typeof snapshot.data().role === "string" ? snapshot.data().role : null;
  const isAdmin = role === "admin" || emailMatches;

  if (isDev) {
    console.log("[EKALO admin] current user email:", user.email);
    console.log("[EKALO admin] admin email env value:", allowedEmail);
    console.log("[EKALO admin] firestore role result:", role);
    console.log("[EKALO admin] admin access result:", isAdmin);
  }

  return {
    isAdmin,
    role
  };
}
