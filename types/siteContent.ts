export type SiteStat = {
  label: string;
  value: string;
};

export type SiteFeatureChip = {
  title: string;
  subtitle: string;
};

export type SiteChallengeContent = {
  id: string;
  title: string;
  subtitle: string;
  status: "LIVE" | "UPCOMING";
  image: string;
  prize: string;
  entries: string;
  timing: string;
  actionLabel: string;
};

export type SiteTrendingEntryContent = {
  id: string;
  username: string;
  likes: string;
  image: string;
};

export type SiteHowItWorksStep = {
  title: string;
  copy: string;
};

export type SiteFooterContent = {
  description: string;
  platformLinks: string[];
  companyLinks: string[];
  supportLinks: string[];
};

export type HomepageContent = {
  navbar: {
    logoText: string;
    tagline: string;
  };
  hero: {
    badge: string;
    challengeLabel: string;
    headlineLine1: string;
    headlineLine2: string;
    subheadline: string;
    primaryCta: string;
    secondaryCta: string;
    beforeImageUrl: string;
    afterImageUrl: string;
    winnerImageUrl: string;
    winnerLabel: string;
    winnerUsername: string;
    featureChips: SiteFeatureChip[];
  };
  stats: SiteStat[];
  challenges: SiteChallengeContent[];
  trendingEntries: SiteTrendingEntryContent[];
  howItWorks: SiteHowItWorksStep[];
  finalCta: {
    headline: string;
    subheadline: string;
    buttonText: string;
  };
  footer: SiteFooterContent;
  updatedAt?: unknown;
  updatedBy?: string;
};
