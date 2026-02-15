import { sleep } from "@sluk/src/lib/utils";
import type {
  DashboardStats,
  StaffPerDepartment,
  LeaveTypeDistribution,
} from "@sluk/src/types/types";
import {
  useSuspenseQuery,
  useSuspenseInfiniteQuery,
  useMutation,
} from "@tanstack/react-query";

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
 *
 *
 */
export function useLeaveTypeDistributionAPI() {
  const { data } = useSuspenseQuery<LeaveTypeDistribution[]>({
    queryKey: ["leaveTypeDistribution"],
    queryFn: async () => {
      return fetch("/api/charts/leave-type-distribution?year=2025")
        .then((res) => res.json())
        .catch((error) => error.message);
    },
  });
  return { data };
}
/**
 *
 */

export function useInfinitePendingLeaves(departmentId?: string, limit = 10) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ["leaves", "pending", departmentId],
      queryFn: async ({ pageParam = 1 }) => {
        const params = new URLSearchParams({
          page: pageParam.toString(),
          limit: limit.toString(),
          ...(departmentId && { departmentId }),
        });
        try {
          return await (await fetch(`/api/leaves/pending?${params}`)).json();
        } catch (error) {
          return error;
        }
      },
      getNextPageParam: (lastPage) => {
        return lastPage?.pagination.hasNextPage
          ? lastPage.pagination.page + 1
          : undefined;
      },
      initialPageParam: 1,
    });

  return {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    data: data.pages.flatMap((page) => page.data),
  };
}
/**
 *
 */
export function useRejectLeave() {
  const { mutateAsync } = useMutation({
    mutationFn: async (id: string) => {
      await sleep(1000);
      await fetch(`/api/leaves/${id}/REJECTED`, {
        method: "PATCH",
      });
    },
  });
  return { mutateAsync };
}

/**
 *
 */
export function useApproveLeave() {
  const { mutateAsync } = useMutation({
    mutationFn: async (id: string) => {
      await sleep(1000);
      await fetch(`/api/leaves/${id}/APPROVED`, {
        method: "PATCH",
        body: JSON.stringify({ comments: "Approved" }),
      });
    },
  });

  return { mutateAsync };
}

/**
 *
 */
export function useCancelLeave() {
  const { mutateAsync } = useMutation({
    mutationFn: async (id: string) => {
      await sleep(1000);
      await fetch(`/api/leaves/${id}/cancel`, { method: "POST" });
    },
  });

  return { mutateAsync };
}
