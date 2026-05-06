export type RewardStatus = "pending" | "verifying" | "paid";
export type RewardPaymentMethod = "manual_upi";

export type Reward = {
  id: string;
  userId: string;
  challengeId: string;
  challengeTitle: string;
  entryId: string;
  rank: number;
  amount: number;
  status: RewardStatus;
  createdAt: unknown;
  updatedAt: unknown;
  paidAt: unknown | null;
  paymentMethod: RewardPaymentMethod;
  paymentNote?: string;
};

export type RewardInput = {
  userId: string;
  challengeId: string;
  challengeTitle: string;
  entryId: string;
  rank: number;
  amount: number;
  status: RewardStatus;
  paidAt?: Date | null;
  paymentNote?: string;
};
