export type PaymentStatus = "created" | "paid" | "failed" | "refunded";
export type PaymentProvider = "manual" | "razorpay";

export type Payment = {
  id: string;
  userId: string;
  challengeId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: PaymentProvider;
  createdAt: unknown;
  paidAt: unknown | null;
  verifiedBy: string;
  providerPaymentId: string;
  providerOrderId: string;
};
