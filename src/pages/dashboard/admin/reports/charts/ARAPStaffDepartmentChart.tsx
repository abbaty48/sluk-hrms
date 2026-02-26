import {
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import { use, useEffect } from "react";
import type { StaffDepartmentData } from "@/types/analytic-types";
import { ARAPFilterContext } from "../AdminReportAnalyticPageContext";
import { useStaffByDepartment } from "@/hooks/api/useAdminAnalyticsAPI";


export function ARAPStaffDepartmentChart({ setData }: { setData: React.Dispatch<React.SetStateAction<StaffDepartmentData[]>> }) {
    const { setFilters, ...filters } = use(ARAPFilterContext)
    const { data } = useStaffByDepartment(filters);
    useEffect(() => {
        (() => {
            setData(data);
        })()
    }, [data])

    return (
        <ResponsiveContainer width="100%" minHeight={280} maxHeight={500} height={400}>
            <BarChart data={data} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" stroke="var(--base)" fontSize={8} />
                <YAxis
                    tickSize={5}
                    type="category"
                    fontSize={'.5rem'}
                    dataKey="department"
                    stroke="var(--base)"
                    tickFormatter={(tick) => {
                        // slice the string into array
                        const t_1 = String(tick).split(/\s/);
                        // check if the first word length is >= 5, then shorten it 3, other just return it.
                        const t_2 = /^(.{5})/.test(t_1[0]) ? t_1[0].slice(0, 3) + ' . ' : t_1[0];
                        // concat the remaining words to the first words after the first word,
                        // then replace any characters after 30 chars with ellipsis...
                        return t_2.concat(tick.slice(t_1[0].length)).replace(/.{30}$/, '...');
                    }
                    }
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        fontSize: "13px",
                    }}
                />
                <Bar
                    dataKey="staffCount"
                    fill="var(--base)"
                    radius={[0, 4, 4, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
