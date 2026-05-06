"use client";

import { doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { HomepageContent } from "@/types/siteContent";

export const defaultHomepageContent: HomepageContent = {
  navbar: {
    logoText: "EKALO",
    tagline: "India's Digital Talent Economy"
  },
  hero: {
    badge: "LIVE NOW",
    challengeLabel: "AI Photo Challenge #12",
    headlineLine1: "Win Money",
    headlineLine2: "With Your Talent",
    subheadline: "Compete. Get ranked. Earn real rewards.",
    primaryCta: "Enter Challenge Now (Free)",
    secondaryCta: "View Entries",
    beforeImageUrl: "/images/home/hero-comparison.png",
    afterImageUrl: "/images/home/hero-comparison.png",
    winnerImageUrl: "/images/home/winner-avatar.png",
    winnerLabel: "WINNER • AI PHOTO CHALLENGE #11",
    winnerUsername: "@aryxn.editz",
    featureChips: [
      { title: "Real Challenges", subtitle: "Live & exciting" },
      { title: "Fair Ranking", subtitle: "Votes + Quality" },
      { title: "Real Rewards", subtitle: "Cash Prizes" }
    ]
  },
  stats: [
    { label: "Prize Pool Live", value: "Rs. 500" },
    { label: "Entry", value: "FREE" },
    { label: "Challenge Live", value: "48h" },
    { label: "Active Creators", value: "100+" }
  ],
  challenges: [
    {
      id: "ai-photo-12",
      title: "AI Photo Challenge #12",
      subtitle: "Monsoon Cinematic Portrait",
      status: "LIVE",
      image: "/images/home/challenge-ai-photo.png",
      prize: "Rs. 5,000",
      entries: "351",
      timing: "Ends in 12h : 45m",
      actionLabel: "Participate Now"
    },
    {
      id: "logo-design",
      title: "Logo Design Challenge",
      subtitle: "Brand Identity Redesign",
      status: "UPCOMING",
      image: "/images/home/challenge-logo.png",
      prize: "Rs. 3,000",
      entries: "278",
      timing: "Starts in 22h",
      actionLabel: "Notify Me"
    },
    {
      id: "poster-design",
      title: "Poster Design Challenge",
      subtitle: "Freedom: 75 Years",
      status: "UPCOMING",
      image: "/images/home/challenge-poster.png",
      prize: "Rs. 3,000",
      entries: "156",
      timing: "Starts in 2d",
      actionLabel: "Notify Me"
    }
  ],
  trendingEntries: [
    { id: "aryxn", username: "@aryxn.editz", likes: "1.2K", image: "/images/home/entry-aryxn.png" },
    { id: "pixie", username: "@pixie.visuals", likes: "982", image: "/images/home/entry-pixie.png" },
    { id: "shooter", username: "@mr.shooter", likes: "871", image: "/images/home/entry-shooter.png" },
    { id: "visual", username: "@visual.by.me", likes: "653", image: "/images/home/entry-visual.png" }
  ],
  howItWorks: [
    { title: "Join Challenge", copy: "Choose any live challenge that excites you." },
    { title: "Submit Your Entry", copy: "Upload your best work and showcase your talent." },
    { title: "Get Votes & Rank", copy: "Share, get votes and climb the leaderboard." },
    { title: "Win Rewards", copy: "Top creators win cash rewards and recognition." }
  ],
  finalCta: {
    headline: "Your talent deserves more than likes.",
    subheadline: "Compete. Get ranked. Get paid.",
    buttonText: "Enter Challenge Now (Free)"
  },
  footer: {
    description: "A platform for creators to compete, get recognized and earn real rewards.",
    platformLinks: ["Challenges", "Winners", "How It Works", "Leaderboard"],
    companyLinks: ["About Us", "Careers", "Press Kit", "Contact Us"],
    supportLinks: ["Help Center", "Terms of Service", "Privacy Policy", "Community Guidelines"]
  }
};

function requireDb() {
  if (!db) {
    throw new Error("Firestore is not configured.");
  }

  return db;
}

export function mergeHomepageContent(data?: Partial<HomepageContent>): HomepageContent {
  if (!data) {
    return defaultHomepageContent;
  }

  return {
    ...defaultHomepageContent,
    ...data,
    navbar: { ...defaultHomepageContent.navbar, ...data.navbar },
    hero: { ...defaultHomepageContent.hero, ...data.hero },
    finalCta: { ...defaultHomepageContent.finalCta, ...data.finalCta },
    footer: { ...defaultHomepageContent.footer, ...data.footer },
    stats: data.stats?.length ? data.stats : defaultHomepageContent.stats,
    challenges: data.challenges?.length ? data.challenges : defaultHomepageContent.challenges,
    trendingEntries: data.trendingEntries?.length ? data.trendingEntries : defaultHomepageContent.trendingEntries,
    howItWorks: data.howItWorks?.length ? data.howItWorks : defaultHomepageContent.howItWorks
  };
}

export function listenToHomepageContent(callback: (content: HomepageContent, exists: boolean) => void) {
  return onSnapshot(doc(requireDb(), "siteContent", "homepage"), (snapshot) => {
    callback(mergeHomepageContent(snapshot.data() as Partial<HomepageContent> | undefined), snapshot.exists());
  });
}

export async function initializeHomepageContent(userId: string) {
  await setDoc(doc(requireDb(), "siteContent", "homepage"), {
    ...defaultHomepageContent,
    updatedAt: serverTimestamp(),
    updatedBy: userId
  });
}

export async function updateHomepageContent(updates: Record<string, unknown>, userId: string) {
  await updateDoc(doc(requireDb(), "siteContent", "homepage"), {
    ...updates,
    updatedAt: serverTimestamp(),
    updatedBy: userId
  });
}
