import {
    Bar,
    XAxis,
    YAxis,
    Legend,
    Tooltip,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import { usePayrollBreakdown } from "@/hooks/api/useAdminAnalyticsAPI";

export function ARAPPayrollBreakdownChart() {
    const { data } = usePayrollBreakdown();

    const formatYAxis = (value: number) => `₦${value}M`;

    return (

        <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="month"
                    fontSize={'.065rem'}
                />
                <YAxis
                    fontSize={".60rem"}
                    tickFormatter={formatYAxis}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        fontSize: "0.75rem",
                    }}
                />
                <Legend />
                <Bar dataKey="Salary" stackId="a" fill="var(--primary)" />
                <Bar dataKey="Allowances" stackId="a" fill="var(--secondary)" />
                <Bar
                    dataKey="Deductions"
                    stackId="a"
                    fill="var(--accent)"
                    radius={[4, 4, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
