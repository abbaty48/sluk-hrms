import type { TLeaveFilters, TLeaveList } from "@/types/leave-managementTypes";
import { createContext } from "react";

export type TLeaveFilterActions =
  | { leaves: TLeaveList }
  | { page: number }
  | { type: string }
  | { limit: string }
  | { search: string }
  | { status: string }
  | { toDate: Date | null }
  | { fromDate: Date | null };
/**
 *
 */
export const AdminLeavePageContextInitialStates: TLeaveFilters & {
  setFilters: (actions: TLeaveFilterActions) => void;
} = {
  leaves: [],
  search: "",
  limit: "5",
  type: "null",
  status: "null",
  toDate: null,
  fromDate: null,
  setFilters: (actions: TLeaveFilterActions) => void actions,
};
/**
 *
 */
export const AdminLeavePageContext = createContext(
  AdminLeavePageContextInitialStates,
);
