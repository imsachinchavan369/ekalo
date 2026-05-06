export type CategoryStatus = "active" | "upcoming" | "hidden";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: CategoryStatus;
  isVisible: boolean;
  order: number;
  icon: string;
  isProtected?: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type CategoryInput = Omit<Category, "id" | "createdAt" | "updatedAt"> & {
  id?: string;
};
