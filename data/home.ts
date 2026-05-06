export type ChallengeStatus = "LIVE" | "UPCOMING";

export type Challenge = {
  id: string;
  title: string;
  subtitle: string;
  status: ChallengeStatus;
  image: string;
  prize: string;
  entries: string;
  timing: string;
  actionLabel: string;
};

export type TrendingEntry = {
  id: string;
  username: string;
  likes: string;
  image: string;
  reward?: {
    amount: number;
    status: "pending" | "verifying" | "paid";
  };
};

export const challenges: Challenge[] = [
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
];

export const trendingEntries: TrendingEntry[] = [
  {
    id: "aryxn",
    username: "@aryxn.editz",
    likes: "1.2K",
    image: "/images/home/entry-aryxn.png",
    reward: {
      amount: 500,
      status: "paid"
    }
  },
  {
    id: "pixie",
    username: "@pixie.visuals",
    likes: "982",
    image: "/images/home/entry-pixie.png"
  },
  {
    id: "shooter",
    username: "@mr.shooter",
    likes: "871",
    image: "/images/home/entry-shooter.png"
  },
  {
    id: "visual",
    username: "@visual.by.me",
    likes: "653",
    image: "/images/home/entry-visual.png"
  }
];
