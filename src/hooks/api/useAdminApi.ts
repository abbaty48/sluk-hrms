import { apiFetch } from "@sluk/src/lib/api.utils";
import type { TDashboardStats } from "@/types/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { TChartStaffPerDepartment } from "@/types/staffTypes";
import type { TMonthlyAttendanceTrend } from "@sluk/src/types/attendance.types";

/**
 *
 * @returns
 */
export function useMonthlyAttendanceTrendAPI() {
  return useSuspenseQuery({
    queryKey: ["monthlyAttendanceTrend"],
    queryFn: async () =>
      await apiFetch<TMonthlyAttendanceTrend[]>(
        "/api/charts/monthly-attendance-trend?months=6",
      ),
  });
}
/**
 *  query administrator dashboard stats
 * @returns and object of DashboardStats/null and an error.
 */
export function useDashboardStatsAPI() {
  return useSuspenseQuery({
    queryKey: ["adminDashboardStats"],
    queryFn: async () =>
      await apiFetch<TDashboardStats>("/api/dashboard/stats"),
  });
}
/**
 *
 */
export function useStaffPerDepartmentAPI() {
  return useSuspenseQuery<TChartStaffPerDepartment[]>({
    queryKey: ["staffsPerDepartment"],
    queryFn: async () =>
      await apiFetch<TChartStaffPerDepartment[]>(
        "/api/charts/staff-per-department?limit=10",
      ),
  });
}
/**
 *
 */
