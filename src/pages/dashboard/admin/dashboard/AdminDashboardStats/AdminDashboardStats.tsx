import {
  Clock,
  Users,
  UserCheck,
  TrendingUp,
  CalendarDays,
  TrendingDown,
} from "lucide-react";
import { Suspense } from "react";
import type { DashboardStats } from "@/types/types";
import { StatsShimmerGrid } from "./DashboardShimmer";
import { Card, CardContent } from "@sluk/src/components/ui/card";
import { useDashboardStatsAPI } from "@sluk/src/hooks/api/useAdminApi";
import { QueryErrorBoundary } from "@sluk/src/components/ErrorBoundary";

export function AdminDashboardStats() {
  return (
    <QueryErrorBoundary>
      <Suspense fallback={<StatsShimmerGrid />}>
        <DashboardStats />
      </Suspense>
    </QueryErrorBoundary>
  );
}

export function DashboardStats() {
  const { stats } = useDashboardStatsAPI();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Staff
            </p>
            <p className="mt-2 text-3xl font-bold text-card-foreground">
              {new Intl.NumberFormat().format(stats?.totalStaff || 0)}
            </p>
            <div className="mt-2 flex items-center gap-1 text-xs">
              <TrendingUp className="stroke-success!" />
              <span className="text-success">{stats?.totalStaffChange}</span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info/10">
            <Users className="stroke-info!" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Active Staff
            </p>
            <p className="mt-2 text-3xl font-bold text-card-foreground">
              {new Intl.NumberFormat().format(stats?.activeStaff || 0)}
            </p>
            <div className="mt-2 flex items-center gap-1 text-xs">
              <TrendingUp className="stroke-success!" />
              <span className="text-success">{stats?.activeStaffChange}</span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
            <UserCheck className="stroke-success!" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              On Leave
            </p>
            <p className="mt-2 text-3xl font-bold text-card-foreground">
              {new Intl.NumberFormat().format(stats?.onLeaveToday || 0)}
            </p>
            <div className="mt-2 flex items-center gap-1 text-xs">
              <TrendingDown className="stroke-destructive!" />
              <span className="text-destructive">{stats?.onLeaveChange}</span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
            <CalendarDays className="stroke-warning!" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Avg. Attendance
            </p>
            <p className="mt-2 text-3xl font-bold text-card-foreground">
              {new Intl.NumberFormat().format(stats?.avgWorkHours || 0)}%
            </p>
            <div className="mt-2 flex items-center gap-1 text-xs">
              <TrendingUp className="stroke-success!" />
              <span className="text-success">
                {stats?.attendanceRateChange || 0} %
              </span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
            <Clock className="stroke-success!" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
