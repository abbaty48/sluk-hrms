import type { TPagination } from "./types";

export type TEmploymentHistory = {
  id: string;
  staffId: string;
  position: string;
  department: string;
  subject: string | null;
  startDate: string;
  endDate: string; // "Present" or "MMM YYYY"
  isActive: boolean;
};

export type TEmploymentHistoryList = {
  data: TEmploymentHistory[];
  pagination: TPagination | null;
};
