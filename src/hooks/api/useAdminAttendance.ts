import type { AttendanceResponse, AttendanceResponseList, AttendanceStats, AttendanceWeeklyChart } from "@/types/attendance.types";
import { useSuspenseInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";
import type { TPagination } from "@/types/types";

/**
 *
 */
export function useAdminAttendanceDashboardStatsAPI() {
    const { data, isLoading } = useSuspenseQuery<AttendanceStats | null>({
        queryKey: ["adminAttendanceDashboardStats"],
        queryFn: async () => {
            const response = await fetch("/api/attendance/stats");
            if (!response.ok) throw new Error("Failed to fetch attendance stats");
            return response.json();
        },
    });
    return { data, isLoading };
}

/**
 *
 */
export function useAdminAttendanceWeeklyAPI() {
    const { data } = useSuspenseQuery<AttendanceWeeklyChart>({
        queryKey: ["adminAttendanceWeekly"],
        queryFn: async () => {
            const response = await fetch("/api/charts/current-week-attendance");
            if (!response.ok) throw new Error("Failed to fetch weekly attendance");
            return response.json();
        },
    });
    return data;
}

/**
 *
 */
export function useAdminAttendanceTodayAPI(pagePerRow: string) {
    const { data, isFetching, fetchNextPage, fetchPreviousPage } = useSuspenseInfiniteQuery<AttendanceResponseList>({
        queryKey: ["adminAttendanceToday"],
        maxPages: 5,
        initialPageParam: 1,
        queryFn: async () => {
            const today = new Date().toISOString().split("T")[0];
            const response = await fetch(`/api/attendance?startDate=${today}&limit=${pagePerRow}`);
            if (!response.ok) throw new Error("Failed to fetch attendance.");
            return response.json();
        },
        getNextPageParam: (lastPage) => lastPage?.pagination.hasNextPage ?
            lastPage.pagination.page + 1 : undefined
        ,
        getPreviousPageParam: (firstPage) => firstPage?.pagination.hasPrevPage ?
            firstPage.pagination.page - 1 : undefined,
    });


    const currentPage = data.pages[data.pages.length - 1];

    return {
        isFetching,
        fetchNextPage,
        fetchPreviousPage,
        pagination: currentPage.pagination as TPagination,
        data: currentPage.data as (AttendanceResponse[])
    }
}
