import type { TDashboardStats } from "@/types/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { TStaffPerDepartment } from "@/types/staff-types";

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
  const { data: stats } = useSuspenseQuery<TDashboardStats | null>({
    queryKey: ["adminDashboardStats"],
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
  const { data } = useSuspenseQuery<TStaffPerDepartment[]>({
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
