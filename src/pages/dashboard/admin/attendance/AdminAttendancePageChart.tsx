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
import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { QueryErrorBoundary } from "@/components/ErrorBoundary";
import type { AttendanceWeeklyChart } from "@/types/attendance.types";
import { useAdminAttendanceWeeklyAPI } from "@/hooks/api/useAdminAttendance";
import { AdminAttendancePageChartSkeleton } from "./AdminAttendancePageSkeletons";


export function AdminAttendancePageChart() {
  return (
    <QueryErrorBoundary>
      <Suspense fallback={<AdminAttendancePageChartSkeleton />}>
        <AttendancePageChart />
      </Suspense>
    </QueryErrorBoundary>
  )
}

function AttendancePageChart() {
  const data = useAdminAttendanceWeeklyAPI()

  return (
    <Card className="p-4 mb-6">
      <h3 className="text-sm font-semibold text-card-foreground mb-4">
        This Week's Attendance: ({data.summary.weekStart} - {data.summary.weekEnd})
      </h3>
      <div className="flex items-center justify-center h-75">
        <AttendanceChart data={data} />
      </div>
    </Card>
  )
}

function AttendanceChart({ data }: { data: AttendanceWeeklyChart }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data.weekData}
        margin={{
          top: 0,
          right: 10,
          left: -10,
          bottom: 0,
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
        />
        <XAxis
          dataKey="day"
          fontSize={12}
          tickLine={false}
          stroke="var(--border)"
          tick={{ fill: "amber-600" }}
        />
        <YAxis
          fontSize={12}
          tickLine={false}
          axisLine={false}
          stroke="var(--border)"
          tick={{ fill: "var(--muted-foreground)" }}
        />
        <Tooltip
          cursor={{ fill: "var(--muted-background) / 0.2)" }}
          contentStyle={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            fontSize: "13px",
          }}
          labelStyle={{
            marginBottom: "4px",
            color: "var(--card-foreground)",
          }}
        />
        <Legend
          iconSize={14}
          iconType="square"
          wrapperStyle={{
            fontSize: "12px",
            paddingTop: "10px",
          }}
        />
        <Bar
          dataKey="present"
          maxBarSize={44}
          radius={[4, 4, 0, 0]}
          fill="var(--success)"
        />
        <Bar
          dataKey="absent"
          maxBarSize={44}
          radius={[4, 4, 0, 0]}
          fill="var(--destructive)"
        />
        <Bar
          dataKey="late"
          maxBarSize={44}
          fill="var(--warning)"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="onLeave"
          maxBarSize={44}
          radius={[4, 4, 0, 0]}
          fill="var(--warning)"
        />
      </BarChart>
    </ResponsiveContainer >
  );
}
