import {
  useSuspenseQuery,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { apiFetch } from "@sluk/src/lib/api.utils";
import type { TStaff, TStaffStats } from "@/types/staffTypes";
import type { TQualification } from "@sluk/src/types/qualificationTypes";
import { type TEmploymentHistoryList } from "@/types/employeeHistoryTypes";
import type { TAttendanceSummaryList } from "@sluk/src/types/attendance.types";

export function useEmployee() {
  return useSuspenseQuery<TStaff>({
    queryKey: ["employee"],
    queryFn: async () => await apiFetch("/api/staffs/details"),
  });
}

/**
 *
 */
export const useEmployeeDashboard = () => {
  return useSuspenseQuery({
    queryKey: ["employee-dashboard"],
    queryFn: async () => await apiFetch<TStaffStats>("/api/staffs/stats"),
  });
};
/**
 *
 */
export function useEmployeeQualifications() {
  return useSuspenseQuery({
    queryKey: ["employeeQualifications"],
    queryFn: async () =>
      await apiFetch<TQualification[]>("/api/staffs/qualifications"),
  });
}
/**
 *
 */
export function useEmploymentHistory({
  page = 1,
  limit = 5,
}: Partial<{
  page?: number;
  limit?: number;
}>) {
  const { data } = useSuspenseInfiniteQuery({
    queryKey: ["employmentHistory"],
    initialPageParam: 1,
    maxPages: 3,
    queryFn: async () =>
      await apiFetch<TEmploymentHistoryList>(
        `/api/staffs/employment?page=${page}&limit=${limit}`,
      ),
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
    data: currentPage.data,
    pagination: currentPage.pagination,
  };
}

/**
 *
 */

// export function useAttendanceSummary() {
//   const { data } = useQuery({
//     queryKey: ["attendance-summary"],
//     queryFn: async () => {
//       return await apiFetch<TAttendanceSummaryList>(
//         `/api/staffs/attendance/summary`,
//       );
//     },
//   });
//   return { data };
// }

export function useAttendanceSummary(
  page?: number,
  limit?: string,
  month?: number,
  year?: number,
) {
  const { data, fetchNextPage, fetchPreviousPage, isFetching } =
    useSuspenseInfiniteQuery({
      queryKey: ["attendance-summary", page, month, year],
      queryFn: async () => {
        const params = new URLSearchParams();
        params.set("page", String(page || "1"));
        params.set("limit", limit || "5");
        if (month) {
          params.set("month", String(month));
        }
        if (year) {
          params.set("year", String(year));
        }
        return await apiFetch<TAttendanceSummaryList>(
          `/api/staffs/attendance/summary?${params}`,
        );
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage?.pagination?.hasNextPage
          ? lastPage.pagination.page + 1
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
