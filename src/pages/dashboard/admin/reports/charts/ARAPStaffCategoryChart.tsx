import { use, useEffect } from "react";
import type { StaffCategoryData } from "@/types/analytic-types";
import { ARAPFilterContext } from "../AdminReportAnalyticPageContext";
import { useStaffByCategory } from "@/hooks/api/useAdminAnalyticsAPI";
import { Pie, Legend, Tooltip, PieChart, ResponsiveContainer } from "recharts";

export function ARAPStaffCategoryChart({
  setData,
}: {
  setData: React.Dispatch<React.SetStateAction<StaffCategoryData[]>>;
}) {
  const { setFilters: _, ...filters } = use(ARAPFilterContext);
  const { data } = useStaffByCategory(filters);

  useEffect(() => {
    (() => {
      setData(data);
    })();
  }, [setData, data]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart style={{ color: "var(--muted-foreground)" }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          dataKey="value"
          innerRadius="50%"
          outerRadius="75%"
          paddingAngle={5}
          fill="currentColor"
          strokeWidth={0}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            fontSize: "0.65rem",
          }}
          itemStyle={{ color: "var(--primary)" }}
        />
        <Legend iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  );
}
