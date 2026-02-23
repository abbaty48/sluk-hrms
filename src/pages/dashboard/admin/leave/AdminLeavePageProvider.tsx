import { useCallback, useState, type PropsWithChildren } from "react";
import type { LeaveFilters } from "@sluk/src/types/leave-management.types";
import { AdminLeavePageContext, AdminLeavePageContextInitialStates, type TLeaveFilterActions } from "./AdminLeavePageContext";
/**
 *
 */
export function AdminLeavePageProvider({ children }: PropsWithChildren) {
    const [filters, filterSetter] = useState<LeaveFilters>(AdminLeavePageContextInitialStates);

    const setFilters = useCallback((actions: TLeaveFilterActions) => {
        filterSetter(prev => ({ ...prev, ...actions }))
    }, [])

    return (<AdminLeavePageContext value={{ ...filters, setFilters }}>
        {children}
    </AdminLeavePageContext>)
}
