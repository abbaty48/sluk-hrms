import {
  Clock,
  Timer,
  XCircle,
  TrendingUp,
  CheckCircle2,
  TrendingDown,
  CalendarDays,
  type LucideIcon,
} from "lucide-react";
import { useAttendanceSummary } from "@/hooks/api/useAttendance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TStatCardProps = {
  title: string;
  value: number;
  trend?: number;
  icon: LucideIcon;
};

function StatCard({ title, value = 0, icon: Icon, trend = 0 }: TStatCardProps) {
  const isPositive = trend >= 0;

  const badgeColor =
    title === "Present"
      ? "bg-green-100 text-green-600"
      : title === "Absent"
        ? "bg-red-100 text-red-600"
        : title === "Late"
          ? "bg-yellow-100 text-yellow-600"
          : title === "Avg Hours"
            ? "bg-purple-100 text-purple-600"
            : "bg-blue-100 text-blue-600";

  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>

        {/* Colored Icon Badge */}
        <div className={`p-2 rounded-md ${badgeColor}`}>
          <Icon className="w-4 h-4" />
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-2xl font-bold">{value}</p>

        {/* Trend Indicator */}
        <div
          className={`flex items-center text-xs font-medium ${
            isPositive ? "text-green-500" : "text-red-400"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-4 h-4 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 mr-1" />
          )}
          {isPositive ? "+" : ""}
          {trend}% vs last month
        </div>
      </CardContent>
    </Card>
  );
}

export default function EmployeeAttendancePage() {
  const { data } = useAttendanceSummary("staff_2");

  const summary = data?.pages?.[0]?.summary;

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold">Attendance Overview</h2>
        <p className="text-sm text-muted-foreground">
          Track your attendance statistics
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Days"
          value={summary?.totalDays ?? 0}
          icon={CalendarDays}
          trend={2}
        />

        <StatCard
          title="Present"
          value={summary?.present ?? 0}
          icon={CheckCircle2}
          trend={4}
        />

        <StatCard
          title="Absent"
          value={summary?.absent ?? 0}
          icon={XCircle}
          trend={-2}
        />

        <StatCard
          title="Late"
          value={summary?.late ?? 0}
          icon={Clock}
          trend={-1}
        />

        <StatCard
          title="Avg Hours"
          value={summary?.avgWorkHours ?? 0}
          icon={Timer}
          trend={3}
        />
      </div>

      {/* RECENT LOGS CARD */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance Logs</CardTitle>
        </CardHeader>

        <CardContent className="text-sm text-muted-foreground">
          Logs section ready for table integration.
        </CardContent>
      </Card>
    </div>
  );
}
