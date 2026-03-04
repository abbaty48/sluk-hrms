import type { TLeaveFilters, TLeaveResponse } from "@/types/leave-managementTypes"
import { createContext } from "react"

export type TLeaveFilterActions = |
{ leaves: TLeaveResponse[] } |
{ page: number } |
{ type: string } |
{ limit: string } |
{ search: string } |
{ status: string } |
{ toDate: Date | undefined } |
{ fromDate: Date | undefined };
/**
 *
 */
export const AdminLeavePageContextInitialStates: TLeaveFilters & {
    setFilters: (actions: TLeaveFilterActions) => void
} = {
    leaves: [],
    search: "",
    limit: "5",
    type: 'null',
    status: 'null',
    toDate: undefined,
    fromDate: undefined,
    setFilters: (actions: TLeaveFilterActions) => void actions
}
/**
 *
 */
export const AdminLeavePageContext = createContext(AdminLeavePageContextInitialStates)
