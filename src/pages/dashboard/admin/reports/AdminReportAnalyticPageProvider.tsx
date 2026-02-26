import { useState, type PropsWithChildren } from "react";
import type { AnalyticsFilters } from "@/types/analytic-types";
import { ARAPFilterContext } from './AdminReportAnalyticPageContext'

export function ARAPFilterContextProvider({ children }: PropsWithChildren) {

    const [filters, setFilters] = useState<AnalyticsFilters>({
        year: new Date().getFullYear(),
        months: 6,
    });

    return (<ARAPFilterContext value={{ ...filters, setFilters }}>
        {children}
    </ARAPFilterContext>
    )
}
