"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { ElementType, HTMLAttributes } from "react";
import {
  AtSign,
  ChevronRight,
  Coins,
  Crown,
  Gift,
  History,
  Lock,
  Mail,
  Medal,
  Pencil,
  Share2,
  Shield,
  ShoppingCart,
  Sparkles,
  Star,
  ThumbsUp,
  Trophy,
  UserPlus,
  Wallet,
  Zap
} from "lucide-react";
import { Button, LinkButton } from "@/components/ui/Button";
import { listenToCurrentUser, signInWithGoogle } from "@/lib/auth";
import { followUser, listenToFollowStatus, unfollowUser } from "@/lib/followers";
import { listenToEkaloUser } from "@/lib/levels";
import { listenToUserRewards } from "@/lib/rewards";
import { cn } from "@/lib/utils";
import { getLevelProgress, getTierByLevel, getTierFrameByLevel, tierUnlocks } from "@/constants/levels";
import type { EkaloUser } from "@/types/user";
import type { Reward } from "@/types/reward";

type ProfileExtras = EkaloUser & {
  username?: string | null;
  rank?: number | null;
  currentRank?: number | null;
  wins?: number | null;
};

const tierStyles = {
  Bronze: "border-[#c97845]/60 text-[#f1a56d] shadow-[0_0_26px_rgba(201,120,69,0.22)]",
  Silver: "border-slate-200/50 text-slate-100 shadow-[0_0_26px_rgba(215,225,239,0.18)]",
  Gold: "border-yellow-300/60 text-yellow-200 shadow-[0_0_28px_rgba(247,201,72,0.24)]",
  Platinum: "border-violet-300/60 text-violet-200 shadow-[0_0_30px_rgba(167,139,250,0.24)]",
  Diamond: "border-sky-300/70 text-sky-200 shadow-[0_0_42px_rgba(33,167,255,0.34)]"
};

function formatNumber(value: number | null | undefined) {
  return new Intl.NumberFormat("en-IN").format(value ?? 0);
}

function getUsername(profile: EkaloUser) {
  const extras = profile as ProfileExtras;
  if (extras.username) return extras.username.replace(/^@/, "");
  if (profile.email) return profile.email.split("@")[0];
  if (profile.displayName) return profile.displayName.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 24);
  return "ekalo-creator";
}

function getInitials(name: string | null | undefined) {
  return (name || "EK").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function ProfileFrame({ profile, level }: { profile: EkaloUser; level: number }) {
  const [hasPhotoError, setHasPhotoError] = useState(false);
  const frame = getTierFrameByLevel(level);
  const tier = getTierByLevel(level)?.tier;
  const canUsePhoto = Boolean(profile.photoURL && !hasPhotoError);

  return (
    <div className={cn("relative mx-auto aspect-square w-44 shrink-0 sm:mx-0 sm:w-52", tier === "Diamond" && "drop-shadow-[0_0_38px_rgba(33,167,255,0.55)]")}>
      {frame ? <Image src={frame} alt={`${tier} profile frame`} fill sizes="220px" className="object-contain" priority /> : null}
      <div className="absolute inset-[22%] overflow-hidden rounded-full border border-sky-300/45 bg-slate-950 shadow-[0_0_34px_rgba(14,165,233,0.25)]">
        {canUsePhoto ? (
          <Image src={profile.photoURL as string} alt="" fill sizes="120px" className="object-cover" onError={() => setHasPhotoError(true)} />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-950 via-slate-950 to-black text-3xl font-black text-white">
            {getInitials(profile.displayName)}
          </div>
        )}
      </div>
    </div>
  );
}

function GlassPanel({ className, children, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn("rounded-lg border border-sky-300/15 bg-slate-950/58 p-4 shadow-[0_22px_70px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:p-5", className)} {...props}>
      {children}
    </section>
  );
}

export function ProfilePageClient() {
  const [userId, setUserId] = useState<string | null>(null);
  const [targetUserId, setTargetUserId] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLoginPending, setIsLoginPending] = useState(false);
  const [isFollowPending, setIsFollowPending] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [profile, setProfile] = useState<EkaloUser | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);

  useEffect(() => {
    return listenToCurrentUser((user) => {
      setUserId(user?.uid ?? null);
      const viewedUserId = typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("userId");
      setTargetUserId(viewedUserId || user?.uid || null);
      setIsAuthLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!userId || !targetUserId) {
      setProfile(null);
      setRewards([]);
      return;
    }

    const unsubscribeProfile = listenToEkaloUser(targetUserId, setProfile);
    const unsubscribeRewards = userId === targetUserId ? listenToUserRewards(targetUserId, setRewards) : () => undefined;
    if (userId !== targetUserId) setRewards([]);
    return () => {
      unsubscribeProfile();
      unsubscribeRewards();
    };
  }, [targetUserId, userId]);

  useEffect(() => {
    if (!userId || !targetUserId || userId === targetUserId) {
      setIsFollowing(false);
      return;
    }

    return listenToFollowStatus(targetUserId, userId, setIsFollowing);
  }, [targetUserId, userId]);

  async function handleLogin() {
    setIsLoginPending(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Google login could not be started.");
    } finally {
      setIsLoginPending(false);
    }
  }

  async function handleShare() {
    const url = window.location.href;
    const title = "EKALO Creator Profile";
    if (navigator.share) {
      await navigator.share({ title, url });
      return;
    }
    await navigator.clipboard.writeText(url);
    alert("Profile link copied.");
  }

  async function handleFollowToggle() {
    if (!userId || !targetUserId || userId === targetUserId) return;

    setIsFollowPending(true);
    try {
      if (isFollowing) {
        await unfollowUser(targetUserId, userId);
      } else {
        await followUser(targetUserId, userId);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Follower action could not be completed.");
    } finally {
      setIsFollowPending(false);
    }
  }

  const rewardWins = rewards.length;
  const profileView = useMemo(() => {
    if (!profile) return null;
    const progress = getLevelProgress(profile);
    const tier = progress.currentTier;
    const username = getUsername(profile);
    const extras = profile as ProfileExtras;
    const wins = extras.wins ?? rewardWins;
    const rank = extras.currentRank ?? extras.rank ?? null;

    return {
      progress,
      tier,
      username,
      wins,
      rank,
      coins: profile.totalCoins ?? profile.coins ?? 0,
      validVotes: profile.validVotesReceived ?? profile.totalVotes ?? 0,
      followersCount: profile.followersCount ?? 0
    };
  }, [profile, rewardWins]);

  if (isAuthLoading) {
    return <ProfileSkeleton />;
  }

  if (!userId) {
    return (
      <GlassPanel className="mx-auto max-w-2xl border-sky-300/20 bg-black/55 p-6 text-center">
        <h2 className="text-2xl font-bold text-white">Log in to view profile</h2>
        <p className="mt-2 text-white/65">Track your coins, level, valid votes, and creator tier in one place.</p>
        <Button type="button" onClick={handleLogin} disabled={isLoginPending} className="mt-5 bg-sky-400 text-black hover:bg-sky-300">
          {isLoginPending ? "Opening..." : "Log In"}
        </Button>
      </GlassPanel>
    );
  }

  if (!profile || !profileView) {
    return <ProfileSkeleton />;
  }

  const { progress, tier, username, wins, rank, coins, validVotes, followersCount } = profileView;
  const tierName = tier?.tier ?? "Rising Creator";
  const tierClass = tier ? tierStyles[tier.tier] : "border-sky-300/35 text-sky-200 shadow-[0_0_24px_rgba(14,165,233,0.2)]";
  const isOwnProfile = userId === targetUserId;

  return (
    <div className="space-y-5 overflow-hidden">
      <GlassPanel className="relative overflow-hidden border-sky-300/25 bg-[linear-gradient(135deg,rgba(8,13,24,0.92),rgba(2,6,12,0.82))] p-5 sm:p-7">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_15%,rgba(33,167,255,0.24),transparent_30rem)]" aria-hidden="true" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          <ProfileFrame profile={profile} level={progress.currentLevel} />
          <div className="min-w-0 flex-1">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-300/25 bg-sky-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-sky-200">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Create. Compete. Conquer.
            </div>
            <h2 className="truncate text-3xl font-black text-white sm:text-4xl">{profile.displayName || "EKALO Creator"}</h2>
            <div className="mt-3 grid gap-2 text-sm text-white/65 sm:grid-cols-2">
              <span className="flex min-w-0 items-center gap-2"><AtSign className="h-4 w-4 text-sky-300" /> <span className="truncate">@{username}</span></span>
              <span className="flex min-w-0 items-center gap-2"><Mail className="h-4 w-4 text-sky-300" /> <span className="truncate">{profile.email || "No email added"}</span></span>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className={cn("inline-flex items-center gap-2 rounded-lg border bg-white/[0.04] px-3 py-2 text-sm font-extrabold", tierClass)}>
                <Shield className="h-4 w-4" aria-hidden="true" />
                {tierName}
              </span>
              <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-bold text-white">Level {progress.currentLevel}</span>
              <span className="rounded-lg border border-yellow-300/25 bg-yellow-300/10 px-3 py-2 text-sm font-bold text-yellow-100">{formatNumber(coins)} coins</span>
              <span className="rounded-lg border border-sky-300/20 bg-sky-400/10 px-3 py-2 text-sm font-bold text-sky-100">{formatNumber(followersCount)} followers</span>
            </div>
          </div>
          {isOwnProfile ? (
            <LinkButton href="#edit-profile" variant="outline" icon={<Pencil className="h-4 w-4" />} iconPosition="left" className="w-full border-sky-300/25 hover:border-sky-300 hover:text-sky-200 sm:w-auto">
              Edit Profile
            </LinkButton>
          ) : (
            <Button
              type="button"
              onClick={handleFollowToggle}
              disabled={isFollowPending}
              variant="outline"
              icon={<UserPlus className="h-4 w-4" />}
              iconPosition="left"
              className="w-full border-sky-300/25 hover:border-sky-300 hover:text-sky-200 sm:w-auto"
            >
              {isFollowPending ? "Saving..." : isFollowing ? "Following" : "Follow"}
            </Button>
          )}
        </div>
      </GlassPanel>

      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <GlassPanel>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">Level Progress</p>
              <h3 className="mt-2 text-4xl font-black text-white">Level {progress.currentLevel}</h3>
              <p className="mt-1 text-white/60">{tierName}</p>
            </div>
            <div className="rounded-lg border border-yellow-300/20 bg-yellow-300/10 p-3 text-right">
              <p className="text-xs text-white/55">Next Reward</p>
              <p className="mt-1 text-2xl font-black text-yellow-100">{formatNumber(progress.nextRewardCoins)}</p>
              <p className="text-xs text-white/55">coins</p>
            </div>
          </div>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-sky-500 via-blue-400 to-cyan-300 shadow-[0_0_24px_rgba(56,189,248,0.55)] transition-all" style={{ width: `${progress.progressPercent}%` }} />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="font-bold text-white">{formatNumber(progress.currentVotes)} / {formatNumber(progress.requiredVotes)} votes</span>
            <span className="text-sky-200">{formatNumber(progress.remainingVotes)} votes to Level {progress.nextLevel}</span>
          </div>
          <div className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/35 p-3 text-sm text-white/75">
            <span className="flex items-center gap-2"><Lock className="h-4 w-4 text-sky-300" /> {progress.nextTierMessage}</span>
            <ChevronRight className="h-4 w-4 text-white/35" />
          </div>
        </GlassPanel>

        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={Coins} label="Total Coins" value={formatNumber(coins)} copy="Keep earning" />
          <StatCard icon={ThumbsUp} label="Valid Votes" value={formatNumber(validVotes)} copy="Powering levels" />
          <StatCard icon={Trophy} label="Current Rank" value={rank ? `#${formatNumber(rank)}` : "--"} copy={rank ? "This week" : "Not ranked yet"} />
          <StatCard icon={Star} label="Wins" value={formatNumber(wins)} copy="Contest wins" />
        </div>
      </div>

      <GlassPanel>
        <div className="flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 text-xl font-black text-white"><Crown className="h-5 w-5 text-sky-300" /> Creator Tier Progression</h3>
          <span className="hidden text-sm text-sky-200 sm:inline">Diamond unlocks at Level 100</span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {tierUnlocks.map((item) => {
            const unlocked = progress.currentLevel >= item.level;
            const active = tier?.tier === item.tier;
            return (
              <div key={item.tier} className={cn("relative overflow-hidden rounded-lg border bg-black/35 p-3 transition", active ? "border-sky-300/60 shadow-[0_0_34px_rgba(33,167,255,0.2)]" : "border-white/10", !unlocked && "opacity-45")}>
                {!unlocked ? <Lock className="absolute right-3 top-3 h-4 w-4 text-white/65" aria-hidden="true" /> : null}
                <div className="relative mx-auto aspect-square w-24">
                  <Image src={item.frame} alt={`${item.tier} tier frame`} fill sizes="96px" className="object-contain" />
                </div>
                <p className="mt-2 text-center text-sm font-black uppercase" style={{ color: item.badgeColor }}>{item.tier}</p>
                <p className="mt-1 text-center text-xs text-white/55">Unlocks at Level {item.level}</p>
              </div>
            );
          })}
        </div>
      </GlassPanel>

      <div className="grid gap-5 lg:grid-cols-[0.88fr_1.12fr]">
        <GlassPanel>
          <div className="flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-xl font-black text-white"><Wallet className="h-5 w-5 text-sky-300" /> Wallet</h3>
            <LinkButton href="/rewards" variant="ghost" size="sm" icon={<History className="h-4 w-4" />} iconPosition="left">View History</LinkButton>
          </div>
          <div className="mt-4 rounded-lg border border-sky-300/15 bg-[radial-gradient(circle_at_85%_20%,rgba(250,204,21,0.18),transparent_14rem)] p-4">
            <p className="text-sm text-white/60">Current Balance</p>
            <p className="mt-2 text-4xl font-black text-white">{formatNumber(coins)}</p>
            <p className="mt-1 text-sm text-white/50">Coins earned from valid votes and rewards</p>
          </div>
          <LinkButton href="/coins" className="mt-4 w-full bg-sky-500 text-black hover:bg-sky-300" icon={<ShoppingCart className="h-4 w-4" />} iconPosition="left">
            Buy Coins
          </LinkButton>
        </GlassPanel>

        <GlassPanel>
          <h3 className="flex items-center gap-2 text-xl font-black text-white"><Zap className="h-5 w-5 text-sky-300" /> Earn Coins</h3>
          <div className="mt-4 grid gap-3">
            <EarnLink href="/challenges" label="Get Votes" value="+10 to +50" icon={ThumbsUp} />
            <EarnLink href="/winners" label="Win Contests" value="+100 to +500" icon={Trophy} />
            <EarnLink href="/levels" label="Level Rewards" value={`Next +${formatNumber(progress.nextRewardCoins)}`} icon={Medal} />
            <EarnLink href="#invite-friends" label="Refer & Earn" value="+100 per friend" icon={UserPlus} />
          </div>
        </GlassPanel>
      </div>

      <GlassPanel>
        <div className="flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 text-xl font-black text-white"><Gift className="h-5 w-5 text-sky-300" /> Recent Activity</h3>
          <LinkButton href="/rewards" variant="ghost" size="sm">View All</LinkButton>
        </div>
        {rewards.length ? (
          <div className="mt-4 divide-y divide-white/10 overflow-hidden rounded-lg border border-white/10">
            {rewards.slice(0, 4).map((reward) => (
              <a key={reward.id} href="/rewards" className="flex items-center justify-between gap-3 bg-white/[0.03] px-4 py-3 transition hover:bg-sky-400/10">
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-white">Won rank #{reward.rank} in {reward.challengeTitle}</span>
                  <span className="text-sm text-white/50">{formatNumber(reward.amount)} reward value</span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-white/35" />
              </a>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-lg border border-dashed border-sky-300/20 bg-black/30 p-5 text-center text-white/60">
            No recent activity yet. Start competing to build your profile.
          </div>
        )}
      </GlassPanel>

      {isOwnProfile ? (
      <GlassPanel id="edit-profile">
        <h3 className="text-xl font-black text-white">Quick Actions</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <button type="button" onClick={() => alert("Profile editing is coming soon.")} className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-left transition hover:border-sky-300/50 hover:bg-sky-400/10">
            <Pencil className="h-5 w-5 text-sky-300" /><span className="mt-3 block font-bold text-white">Edit Profile</span>
          </button>
          <button type="button" onClick={handleShare} className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-left transition hover:border-sky-300/50 hover:bg-sky-400/10">
            <Share2 className="h-5 w-5 text-sky-300" /><span className="mt-3 block font-bold text-white">Share Profile</span>
          </button>
          <a id="invite-friends" href="mailto:?subject=Join me on EKALO&body=One Talent. One Gem. One Winner." className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-left transition hover:border-sky-300/50 hover:bg-sky-400/10">
            <UserPlus className="h-5 w-5 text-sky-300" /><span className="mt-3 block font-bold text-white">Invite Friends</span>
          </a>
          <a href="/rewards" className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-left transition hover:border-sky-300/50 hover:bg-sky-400/10">
            <Gift className="h-5 w-5 text-sky-300" /><span className="mt-3 block font-bold text-white">View Rewards</span>
          </a>
          <a href="/entries" className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-left transition hover:border-sky-300/50 hover:bg-sky-400/10">
            <Medal className="h-5 w-5 text-sky-300" /><span className="mt-3 block font-bold text-white">View Entries</span>
          </a>
        </div>
      </GlassPanel>
      ) : null}

      <p className="text-center text-sm font-semibold uppercase tracking-[0.24em] text-white/45">One Talent. One Gem. One Winner.</p>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, copy }: { icon: ElementType; label: string; value: string; copy: string }) {
  return (
    <div className="rounded-lg border border-sky-300/15 bg-slate-950/58 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
      <Icon className="h-6 w-6 text-sky-300" aria-hidden="true" />
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/45">{label}</p>
      <p className="mt-1 text-2xl font-black text-white sm:text-3xl">{value}</p>
      <p className="mt-1 text-sm text-white/50">{copy}</p>
    </div>
  );
}

function EarnLink({ href, label, value, icon: Icon }: { href: string; label: string; value: string; icon: ElementType }) {
  return (
    <a href={href} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 transition hover:border-sky-300/45 hover:bg-sky-400/10">
      <span className="flex items-center gap-3 font-semibold text-white"><Icon className="h-5 w-5 text-sky-300" /> {label}</span>
      <span className="text-sm font-bold text-lime-300">{value}</span>
    </a>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-5">
      <div className="h-72 animate-pulse rounded-lg border border-sky-300/15 bg-slate-950/70" />
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="h-52 animate-pulse rounded-lg border border-sky-300/15 bg-slate-950/70" />
        <div className="h-52 animate-pulse rounded-lg border border-sky-300/15 bg-slate-950/70" />
      </div>
    </div>
  );
}
