import type { DashboardStats, StaffPerDepartment } from "@sluk/src/types/types";
import { useSuspenseQuery } from "@tanstack/react-query";

/**
 *
 * @returns
 */
export function useMonthlyAttendanceTrendAPI() {
  const { data } = useSuspenseQuery({
    queryKey: ["monthlyAttendanceTrend"],
    queryFn: async () => {
      return fetch("/api/charts/monthly-attendance-trend?months=6")
        .then((res) => res.json())
        .catch((error) => error.message);
    },
  });
  return { data };
}
/**
 *  query administrator dashboard stats
 * @returns and object of DashboardStats/null and an error.
 */
export function useDashboardStatsAPI() {
  const { data: stats } = useSuspenseQuery<DashboardStats | null>({
    queryKey: ["adminDashboardstats"],
    queryFn: async () => {
      return fetch("/api/dashboard/stats")
        .then((res) => res.json())
        .catch((error) => error.message);
    },
  });
  return { stats };
}
/**
 *
 */
export function useStaffPerDepartmentAPI() {
  const { data } = useSuspenseQuery<StaffPerDepartment[]>({
    queryKey: ["staffsPerDepartment"],
    queryFn: async () => {
      return fetch("/api/charts/staff-per-department?limit=10")
        .then((res) => res.json())
        .catch((error) => error.message);
    },
  });
  return { data };
}
/**
 *
 */
