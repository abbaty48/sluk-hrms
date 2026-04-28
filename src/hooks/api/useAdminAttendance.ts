import type {
  TAttendanceStats,
  TAttendanceResponse,
  TAttendanceWeeklyChart,
  TAttendanceResponseList,
} from "@/types/attendance.types";
import {
  useSuspenseQuery,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import type { TPagination } from "@/types/types";
import { apiFetch } from "@sluk/src/lib/api.utils";
import { dateFromString } from "@sluk/src/lib/utils";

/**
 *
 */
export function useAdminAttendanceDashboardStatsAPI() {
  const { data, isLoading } = useSuspenseQuery<TAttendanceStats | null>({
    queryKey: ["adminAttendanceDashboardStats"],
    queryFn: async () =>
      await apiFetch<TAttendanceStats | null>("/api/attendance/stats"),
  });
  return { data, isLoading };
}

/**
 *
 */
export function useAdminAttendanceWeeklyAPI() {
  const { data } = useSuspenseQuery<TAttendanceWeeklyChart>({
    queryKey: ["adminAttendanceWeekly"],
    queryFn: async () => await apiFetch("/api/charts/attendance-current-week"),
  });
  return data;
}

/**
 *
 */
export function useAdminAttendanceTodayAPI(pagePerRow: string) {
  const { data, isFetching, fetchNextPage, fetchPreviousPage } =
    useSuspenseInfiniteQuery<TAttendanceResponseList>({
      queryKey: ["adminAttendanceToday"],
      maxPages: 5,
      initialPageParam: 1,
      queryFn: async () => {
        const today = dateFromString<string>(new Date());
        return await apiFetch<TAttendanceResponseList>(
          `/api/attendance?startDate=${today}&limit=${pagePerRow}`,
        );
      },
      getNextPageParam: (lastPage) =>
        lastPage?.pagination?.hasNextPage
          ? lastPage.pagination.page + 1
          : undefined,
      getPreviousPageParam: (firstPage) =>
        firstPage?.pagination?.hasPrevPage
          ? firstPage.pagination.page - 1
          : undefined,
    });

  const currentPage = data.pages[data.pages.length - 1];

  return {
    isFetching,
    fetchNextPage,
    fetchPreviousPage,
    data: currentPage.data,
    pagination: currentPage.pagination,
  };
}
