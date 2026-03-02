import { useInfiniteQuery } from "@tanstack/react-query";

export function useAttendanceSummary(staffId: string, month?: number, year?: number) {
  return useInfiniteQuery({
    queryKey: ["attendance-summary", staffId, month, year],

    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(
        `/api/staff/${staffId}/attendance/summary?page=${pageParam}&month=${month ?? ""}&year=${year ?? ""}`
      );

      if (!res.ok) throw new Error("Failed to fetch attendance");

      return res.json();
    },

    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 1
  });
}