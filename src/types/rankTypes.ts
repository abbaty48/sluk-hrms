import type { TPagination } from "./types.ts";

export type TCreateRankRequest = {
  description: string;
  title: string;
};

export type TRanksList = {
  data: TRank[];
  pagination: TPagination | null;
};

export type TRank = {
  id: string;
  title: string;
  isActive: boolean;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};
