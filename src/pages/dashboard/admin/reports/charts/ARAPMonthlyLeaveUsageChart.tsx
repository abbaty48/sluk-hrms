import {
    Line,
    XAxis,
    YAxis,
    Tooltip,
    LineChart,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import { use, useEffect } from "react";
import type { MonthlyLeaveData } from "@/types/analytic-types";
import { ARAPFilterContext } from "../AdminReportAnalyticPageContext";
import { useMonthlyLeaveUsage } from "@/hooks/api/useAdminAnalyticsAPI";


export function ARAPMonthlyLeaveUsageChart({ setData }: { setData: React.Dispatch<React.SetStateAction<MonthlyLeaveData[]>> }) {
    const { setFilters, ...filters } = use(ARAPFilterContext)
    const { data } = useMonthlyLeaveUsage(filters);

    useEffect(() => {
        (() => {
            setData(data);
        })()
    }, [data])

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                    dataKey="month"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                    contentStyle={{
                        border: "1px solid var(--border)",
                        backgroundColor: "var(--card)",
                        borderRadius: "8px",
                        fontSize: "13px",
                    }}
                />
                <Line
                    type="monotone"
                    strokeWidth={2.5}
                    stroke="var(--accent)"
                    dataKey="Leave Days Used"
                    strokeDasharray="1034px 0px"
                    dot={{ fill: "var(--accent)", r: 5, strokeWidth: 2.5 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
