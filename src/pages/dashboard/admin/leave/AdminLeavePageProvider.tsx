import { useCallback, useState, type PropsWithChildren } from "react";
import type { TLeaveFilters } from "@/types/leave-managementTypes";
import { AdminLeavePageContext, AdminLeavePageContextInitialStates, type TLeaveFilterActions } from "./AdminLeavePageContext";
/**
 *
 */
export function AdminLeavePageProvider({ children }: PropsWithChildren) {
    const [filters, filterSetter] = useState<TLeaveFilters>(AdminLeavePageContextInitialStates);

    const setFilters = useCallback((actions: TLeaveFilterActions) => {
        filterSetter(prev => ({ ...prev, ...actions }))
    }, [])

    return (<AdminLeavePageContext value={{ ...filters, setFilters }}>
        {children}
    </AdminLeavePageContext>)
}
