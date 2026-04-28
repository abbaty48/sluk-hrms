import {
  useMutation,
  useSuspenseQuery,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import type {
  TLeaveType,
  TLeaveStats,
  TLeaveList,
  TLeaveFilters,
  TLeavePendingList,
  TChartLeaveTypeDistribution,
} from "@/types/leave-managementTypes";
import type { TPagination } from "@/types/types";
import {
  apiFetch,
  invalidateQueries,
  queryClient,
} from "@sluk/src/lib/api.utils";

type SearchCriteria = Partial<TLeaveFilters>;
export function useLeavesAPI(searchCriteria?: SearchCriteria) {
  const { data, refetch, isFetching, fetchNextPage, fetchPreviousPage } =
    useSuspenseInfiniteQuery({
      queryKey: ["leaves", { ...searchCriteria }],
      initialPageParam: 1,
      maxPages: searchCriteria?.limit ? +searchCriteria.limit : 5,
      queryFn: async ({ pageParam }) => {
        const params = new URLSearchParams();
        params.set("page", pageParam.toString());
        params.set("limit", searchCriteria?.limit?.toString() || "5");

        if (searchCriteria?.search) {
          params.set("search", searchCriteria.search);
        }

        if (searchCriteria) {
          Object.entries(searchCriteria).forEach(([key, value]) => {
            if (
              key !== "limit" &&
              key !== "q" &&
              value !== null &&
              value !== "null" &&
              value !== undefined
            ) {
              params.set(key, value.toString());
            }
          });
        }

        return await apiFetch<TLeaveList>(`/api/leaves?${params}`);
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
    refetch,
    isFetching,
    fetchNextPage,
    fetchPreviousPage,
    data: currentPage.data,
    pagination: currentPage.pagination as TPagination,
  };
}
/**
 *
 *
 */
export function useLeaveTypesAPI() {
  const { data } = useSuspenseQuery({
    queryKey: ["adminLeaveTypes"],
    queryFn: async () => await apiFetch<TLeaveType[]>("/api/leaves/types"),
  });
  return data;
}

/**
 *
 *
 */
export function useLeaveStatsAPI() {
  const { data: stats } = useSuspenseQuery({
    queryKey: ["leaveStats"],
    queryFn: async () => await apiFetch<TLeaveStats>("/api/leaves/stats"),
  });
  return stats;
}
/**
 *
 *
 */

export function useLeaveTypesDeleteAPI() {
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      return await apiFetch(`/api/leave/types/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaveTypes"] });
    },
  });
}
/**
 *
 *
 */
export function useLeaveTypeDistributionAPI() {
  return useSuspenseQuery<TChartLeaveTypeDistribution[]>({
    queryKey: ["leaveTypeDistribution"],
    queryFn: async () =>
      await apiFetch<TChartLeaveTypeDistribution[]>(
        "/api/charts/leave-type-distribution",
      ),
  });
}
/**
 *
 */
export function useLeavePending(departmentId?: string, limit = 10) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ["leaves", "pending", departmentId],
      queryFn: async ({ pageParam }) => {
        const params = new URLSearchParams({
          page: pageParam.toString(),
          limit: limit.toString(),
          ...(departmentId && { departmentId }),
        });
        return await apiFetch<TLeavePendingList>(
          `/api/leaves/pending?${params}`,
        );
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
export function useLeaveRejection() {
  return useMutation({
    mutationFn: async (id: string) => {
      await apiFetch(`/api/leaves/${id}/REJECTED`, {
        method: "PATCH",
      });
    },
    onSuccess: async () => {
      await invalidateQueries(["leaveStats", "leaves"]);
    },
  });
}

/**
 *
 */
export function useLeaveApproval() {
  return useMutation({
    mutationFn: async (id: string) => {
      await apiFetch(`/api/leaves/${id}/APPROVED`, {
        method: "PATCH",
        body: JSON.stringify({ comments: "Approved" }),
      });
    },
    onSuccess: async () => {
      await invalidateQueries(["leaveStats", "leaves"]);
    },
  });
}

/**
 *
 */
export function useLeaveCancelled() {
  return useMutation({
    mutationFn: async (id: string) => {
      await apiFetch(`/api/leaves/${id}/cancel`, { method: "POST" });
    },
  });
}

/**
 *
 */
export function useLeaveTypeUPSERTAPI() {
  type params = {
    id: string | undefined;
    payload: TLeaveType;
    action: "CREATE" | "UPDATE";
  };

  return useMutation({
    mutationFn: async ({ id, action, payload }: params) => {
      const { url, method } = {
        url:
          action === "CREATE" ? "/api/leaves/types" : `/api/leaves/types/${id}`,
        method: action === "CREATE" ? "POST" : "PUT",
      };
      return apiFetch(url, { method, body: JSON.stringify(payload) });
    },
    onSuccess: async () => {
      await invalidateQueries(["adminLeaveTypes"]);
    },
  });
}

/**
 *
 */

export function useLeaveTypeDeleteAPI() {
  return useMutation({
    mutationFn: async (id: string) =>
      await apiFetch(`/api/leaves/types/${id}`, {
        method: "DELETE",
      }),
    onSuccess: async () => {
      await invalidateQueries(["adminLeaveTypes", "leaves"]);
    },
  });
}
