"use client";

import { collection, deleteDoc, doc, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { slugify } from "@/lib/challenges";
import type { Category, CategoryInput, CategoryStatus } from "@/types/category";

export const defaultCategories: Category[] = [
  { id: "rap", name: "Rap", slug: "rap", description: "Rap battles and performance competitions.", status: "active", isVisible: true, order: 1, icon: "mic", isProtected: true },
  { id: "ai-photo", name: "AI Photo", slug: "ai-photo", description: "AI photo and image creation competitions.", status: "active", isVisible: true, order: 2, icon: "image", isProtected: true },
  { id: "singing", name: "Singing", slug: "singing", description: "", status: "upcoming", isVisible: true, order: 3, icon: "music" },
  { id: "dance", name: "Dance", slug: "dance", description: "", status: "upcoming", isVisible: true, order: 4, icon: "activity" },
  { id: "beat-making-music-production", name: "Beat Making / Music Production", slug: "beat-making-music-production", description: "", status: "upcoming", isVisible: true, order: 5, icon: "sliders" },
  { id: "video-editing", name: "Video Editing", slug: "video-editing", description: "", status: "upcoming", isVisible: true, order: 6, icon: "video" },
  { id: "photography", name: "Photography", slug: "photography", description: "", status: "upcoming", isVisible: true, order: 7, icon: "camera" },
  { id: "logo-design", name: "Logo Design", slug: "logo-design", description: "", status: "upcoming", isVisible: true, order: 8, icon: "badge" },
  { id: "poster-design", name: "Poster Design", slug: "poster-design", description: "", status: "upcoming", isVisible: true, order: 9, icon: "layout" },
  { id: "acting-dialogue", name: "Acting / Dialogue", slug: "acting-dialogue", description: "", status: "upcoming", isVisible: true, order: 10, icon: "clapperboard" },
  { id: "stand-up-comedy", name: "Stand-up / Comedy", slug: "stand-up-comedy", description: "", status: "upcoming", isVisible: true, order: 11, icon: "laugh" },
  { id: "poetry-shayari", name: "Poetry / Shayari", slug: "poetry-shayari", description: "", status: "upcoming", isVisible: true, order: 12, icon: "pen" },
  { id: "fashion-styling", name: "Fashion / Styling", slug: "fashion-styling", description: "", status: "upcoming", isVisible: true, order: 13, icon: "shirt" },
  { id: "voiceover-dubbing", name: "Voiceover / Dubbing", slug: "voiceover-dubbing", description: "", status: "upcoming", isVisible: true, order: 14, icon: "audio" },
  { id: "instrument-playing", name: "Instrument Playing", slug: "instrument-playing", description: "", status: "upcoming", isVisible: true, order: 15, icon: "guitar" },
  { id: "short-film-cinematic-reels", name: "Short Film / Cinematic Reels", slug: "short-film-cinematic-reels", description: "", status: "upcoming", isVisible: true, order: 16, icon: "film" }
];

function requireDb() {
  if (!db) throw new Error("Firestore is not configured.");
  return db;
}

function normalize(id: string, data: Record<string, unknown>): Category {
  const fallback = defaultCategories.find((item) => item.id === id || item.slug === data.slug);
  return {
    id,
    name: String(data.name ?? fallback?.name ?? ""),
    slug: String(data.slug ?? fallback?.slug ?? id),
    description: String(data.description ?? fallback?.description ?? ""),
    status: (data.status === "hidden" || data.status === "upcoming" || data.status === "active" ? data.status : fallback?.status ?? "upcoming") as CategoryStatus,
    isVisible: typeof data.isVisible === "boolean" ? data.isVisible : fallback?.isVisible ?? true,
    order: Number(data.order ?? fallback?.order ?? 999),
    icon: String(data.icon ?? fallback?.icon ?? "sparkles"),
    isProtected: Boolean(data.isProtected ?? fallback?.isProtected),
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}

export function mergeWithDefaultCategories(categories: Category[]) {
  const bySlug = new Map(categories.map((category) => [category.slug, category]));
  for (const category of defaultCategories) {
    if (!bySlug.has(category.slug)) bySlug.set(category.slug, category);
  }
  return [...bySlug.values()].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

export function listenToCategories(callback: (categories: Category[]) => void, includeHidden = false) {
  const source = includeHidden
    ? collection(requireDb(), "categories")
    : query(collection(requireDb(), "categories"), where("isVisible", "==", true), where("status", "in", ["active", "upcoming"]));
  return onSnapshot(source, (snapshot) => {
    const categories = mergeWithDefaultCategories(snapshot.docs.map((item) => normalize(item.id, item.data())));
    callback(includeHidden ? categories : categories.filter((item) => item.isVisible && item.status !== "hidden"));
  });
}

export async function saveCategory(input: CategoryInput) {
  const id = input.id || slugify(input.slug || input.name);
  await setDoc(
    doc(requireDb(), "categories", id),
    {
      ...input,
      id,
      slug: slugify(input.slug || input.name),
      isProtected: input.isProtected ?? ["rap", "ai-photo"].includes(id),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}

export async function updateCategoryStatus(categoryId: string, status: CategoryStatus, isVisible = status !== "hidden") {
  await updateDoc(doc(requireDb(), "categories", categoryId), { status, isVisible, updatedAt: serverTimestamp() });
}

export async function deleteCategory(category: Category) {
  if (category.isProtected || ["rap", "ai-photo"].includes(category.slug)) throw new Error("Protected categories cannot be deleted.");
  await deleteDoc(doc(requireDb(), "categories", category.id));
}
