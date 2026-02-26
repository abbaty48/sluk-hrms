import { createContext } from 'react'
import type { AnalyticsFilters } from "@/types/analytic-types";

export const adminReportAnalyticPageFilterContextInit: AnalyticsFilters & {
    setFilters: React.Dispatch<React.SetStateAction<AnalyticsFilters>>
} = {
    year: new Date().getFullYear(),
    setFilters: () => void 0,
    months: 6,
}

export const ARAPFilterContext = createContext(adminReportAnalyticPageFilterContextInit);
