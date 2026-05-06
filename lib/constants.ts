export const MAX_IMAGE_UPLOAD_SIZE = 10 * 1024 * 1024;

export const R2_UPLOAD_FOLDERS = {
  beforeImages: "before-images",
  afterImages: "after-images",
  talentVideos: "talent-videos",
  thumbnails: "thumbnails",
  profileImages: "profile-images"
} as const;

export const VOTE_LIMIT_PER_CHALLENGE = 3;
export const VOTE_COOLDOWNS_MS = [0, 5000, 10000] as const;
