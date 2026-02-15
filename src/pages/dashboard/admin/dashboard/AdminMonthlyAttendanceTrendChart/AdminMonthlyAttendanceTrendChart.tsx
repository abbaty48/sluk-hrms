import { useMonthlyAttendanceTrendAPI } from "@sluk/src/hooks/api/useAdminApi";
import { Card, CardContent, CardHeader } from "@sluk/src/components/ui/card";
import { QueryErrorBoundary } from "@sluk/src/components/ErrorBoundary";
import { FileBox } from "lucide-react";
import { Suspense } from "react";
import {
  CartesianGrid,
  LineChart,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  Line,
} from "recharts";

export function AdminMonthlyAttendanceTrendChart() {
  return (
    <Card className="stats-card">
      <CardHeader>
        <h3 className="text-sm font-semibold text-card-foreground mb-4">
          Monthly Attendance Trend
        </h3>
      </CardHeader>
      <CardContent className="recharts-responsive-container w-full h-70 min-w-0">
        <QueryErrorBoundary>
          <Suspense
            fallback={
              <div className="rounded-3xl w-inherit min-h-[20vh] h-[40vh] shimmer"></div>
            }
          >
            <MonthlyAttendanceTrend />
          </Suspense>
        </QueryErrorBoundary>
      </CardContent>
    </Card>
  );
}

function MonthlyAttendanceTrend() {
  const { data } = useMonthlyAttendanceTrendAPI();

  if (!data) {
    return (
      <div className="min-h-[40vh] rounded-xl w-full shimmer flex items-center justify-center gap-4">
        <FileBox /> Missing data
      </div>
    );
  }

  return (
    <>
      <LineChart
        data={data}
        height={"100%"}
        style={{ color: "hsl(30 55% 42%)", fontSize: ".65rem" }}
      >
        <CartesianGrid strokeDasharray="3 3" alignmentBaseline="hanging" />
        <XAxis dataKey="month" style={{ fill: "hsl(30 55% 42%)" }} />
        <YAxis
          width="auto"
          stroke="inherit"
          strokeDasharray={3}
          style={{ fill: "hsl(30 55% 42%)" }}
        />
        <Tooltip />
        <Legend />
        <Line dataKey="present" stroke="hsl(30 55% 42%)" />
        <Line dataKey="absent" stroke="hsl(0 35% 50%)" />
      </LineChart>
    </>
  );
}
