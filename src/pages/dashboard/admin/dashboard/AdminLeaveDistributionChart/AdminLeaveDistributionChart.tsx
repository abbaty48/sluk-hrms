import {
  Pie,
  Legend,
  Tooltip,
  PieChart,
  ResponsiveContainer,
  type PieLabelRenderProps,
} from "recharts";
import { Suspense } from "react";
import { FileBox } from "lucide-react";
import { QueryErrorBoundary } from "@sluk/src/components/ErrorBoundary";
import { Card, CardContent, CardHeader } from "@sluk/src/components/ui/card";
import { useLeaveTypeDistributionAPI } from "@sluk/src/hooks/api/useAdminApi";

export function AdminLeaveDistributionChart() {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-semibold text-card-foreground mb-4">
          Leave Distribution Trend
        </h3>
      </CardHeader>
      <CardContent className="recharts-responsive-container w-full">
        <QueryErrorBoundary>
          <Suspense
            fallback={
              <div className="rounded-3xl w-inherit min-h-[20vh] h-[50vh] shimmer"></div>
            }
          >
            <LeaveDistributionChart />
          </Suspense>
        </QueryErrorBoundary>
      </CardContent>
    </Card>
  );
}

// Custom radial label
const renderLabel = ({
  cx,
  cy,
  name,
  outerRadius,
  midAngle = 0,
}: PieLabelRenderProps) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 30;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="hsl(25 90% 55%)"
      dominantBaseline="central"
      className="text-[.55rem] font-medium"
      textAnchor={x > cx ? "start" : "end"}
    >
      {`${name}`}
    </text>
  );
};

// Custom legend with colors
const CustomLegend = ({ payload }: any) => (
  <div className="flex flex-row flex-wrap justify-center gap-4 mt-6 w-full">
    {payload.map((entry: any, index: number) => (
      <div key={`legend-${index}`} className="flex items-center gap-2">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: entry.payload.color }}
        />
        <span className={"text-[.65rem] font-medium text-primary "}>
          {entry.value}
        </span>
        <span className={`text-[.65rem] text-primary`}>
          ({entry.payload.percentage}%)
        </span>
      </div>
    ))}
  </div>
);

export default function LeaveDistributionChart() {
  const { data } = useLeaveTypeDistributionAPI();

  if (!data) {
    return (
      <div className="min-h-[40vh] rounded-xl w-full shimmer flex items-center justify-center gap-4">
        <FileBox /> Missing data
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Tooltip
          contentStyle={{
            border: "none",
            color: "white",
            fontSize: ".6rem",
            borderRadius: "0.5rem",
            backgroundColor: "hsl(25 80% 55%)",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Legend content={<CustomLegend />} />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          nameKey="name"
          dataKey="value"
          innerRadius="50%"
          outerRadius="75%"
          paddingAngle={5}
          label={(props: PieLabelRenderProps) => renderLabel(props)}
          fill="currentColor"
          strokeWidth={0}
          labelLine={{
            stroke: "hsl(30 55% 42%)",
            strokeWidth: 1,
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
