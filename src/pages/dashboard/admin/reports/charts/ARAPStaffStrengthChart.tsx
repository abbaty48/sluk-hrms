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
import { use, useEffect } from "react";
import type { StaffStrengthYearData } from "@/types/analytic-types";
import { ARAPFilterContext } from "../AdminReportAnalyticPageContext";
import { useStaffStrengthYears } from "@/hooks/api/useAdminAnalyticsAPI";

export function ARAPStaffStrengthChart({
  setData,
}: {
  setData: React.Dispatch<React.SetStateAction<StaffStrengthYearData[]>>;
}) {
  const { setFilters: _, ...filters } = use(ARAPFilterContext);
  const { data } = useStaffStrengthYears(filters);

  useEffect(() => {
    (() => {
      setData(data);
    })();
  }, [setData, data]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="year"
          fontSize={".65rem"}
          stroke="var(--muted-foreground)"
        />
        <YAxis stroke="var(--muted-foreground)" fontSize={".65rem"} />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            fontSize: "0.65rem",
          }}
        />
        <Legend />
        <Bar dataKey="Male" fill="var(--primary)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Female" fill="var(--secondary)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
