export type Vote = {
  id: string;
  challengeId: string;
  entryId: string;
  voterId: string;
  entryOwnerId: string;
  createdAt: unknown;
  deviceId: string;
  userAgent: string;
  isValid: boolean;
  isSuspicious: boolean;
};
