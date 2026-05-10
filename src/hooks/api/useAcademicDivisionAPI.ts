import type {
  TAcademicStats,
  TStudyStaffQuery,
  TExtensionRequest,
  TExtensionRequestList,
  TExtensionRequestForm,
  TStaffOnStudyLeaveList,
  TExtensionRequestStatus,
  TChartAccademicSponsorshipDistribution,
} from "@/types/academicDivisionTypes";
import {
  useMutation,
  useSuspenseQuery,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { apiFetch, invalidateQueries } from "@/lib/api.utils";

/***
 *
 */
export function useAcademicDivisionStats() {
  return useSuspenseQuery({
    queryKey: ["academic-division-stats"],
    queryFn: async () => await apiFetch<TAcademicStats>(`/api/academic/stats`),
    staleTime: 5 * 60 * 1000,
  });
}
/***
 *
 */
export function useSponsorshipDistribution() {
  return useSuspenseQuery({
    queryKey: ["academic-division-sponsorship-chart"],
    queryFn: async () =>
      await apiFetch<TChartAccademicSponsorshipDistribution>(
        `/api/charts/study-leave-distribution`,
      ),
    staleTime: 5 * 60 * 1000,
  });
}
/***
 *
 */
export function useExtensionRequestList(
  searchCriteria?: Partial<{
    page: string;
    limit: string;
    status: TExtensionRequestStatus | "null";
  }>,
) {
  const {
    data,
    refetch,
    isFetching,
    hasNextPage,
    fetchNextPage,
    hasPreviousPage,
    fetchPreviousPage,
  } = useSuspenseInfiniteQuery({
    initialPageParam: 1,
    maxPages: 5,
    queryKey: ["extension-request-list", { ...searchCriteria }],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams();

      // Add parameters properly
      params.set("page", pageParam.toString());
      params.set("limit", searchCriteria?.limit || "5");

      // Add other search criteria (avoid duplicating limit and q)
      if (searchCriteria) {
        Object.entries(searchCriteria).forEach(([key, value]) => {
          if (
            key !== "limit" &&
            value !== null &&
            value !== "null" &&
            value !== undefined
          ) {
            params.set(key, value.toString());
          }
        });
      }

      return await apiFetch<TExtensionRequestList>(
        `/api/academic/extension-request?${params}`,
      );
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage?.pagination?.hasPrevPage
        ? firstPage.pagination.page - 1
        : undefined;
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.pagination?.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined;
    },
  });

  // Get the most recent page data (last fetched page)
  const currentPage = data.pages[data.pages.length - 1];

  return {
    refetch,
    isFetching,
    hasNextPage,
    fetchNextPage,
    hasPreviousPage,
    fetchPreviousPage,
    allPages: data.pages,
    data: currentPage.data,
    pagination: currentPage.pagination,
  };
}
/***
 *
 */
export function useAcademicDivisionStudyStaffList(
  searchCriteria?: TStudyStaffQuery,
) {
  const {
    data,
    refetch,
    isFetching,
    hasNextPage,
    fetchNextPage,
    hasPreviousPage,
    fetchPreviousPage,
  } = useSuspenseInfiniteQuery({
    initialPageParam: 1,
    maxPages: searchCriteria?.limit ? +searchCriteria.limit : 5,
    queryKey: ["academic-division-study-staffs", { ...searchCriteria }],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams();

      // Add parameters properly
      params.set("page", pageParam.toString());
      params.set("limit", searchCriteria?.limit?.toString() || "5");

      // Add other search criteria (avoid duplicating limit and q)
      if (searchCriteria) {
        Object.entries(searchCriteria).forEach(([key, value]) => {
          if (
            key !== "limit" &&
            value !== null &&
            value !== "null" &&
            value !== undefined
          ) {
            params.set(key, value.toString());
          }
        });
      }

      return await apiFetch<TStaffOnStudyLeaveList>(
        `/api/academic/study-leave?${params}`,
      );
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage?.pagination?.hasPrevPage
        ? firstPage.pagination.page - 1
        : undefined;
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.pagination?.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined;
    },
  });

  // Get the most recent page data (last fetched page)
  const currentPage = data.pages[data.pages.length - 1];

  return {
    refetch,
    isFetching,
    hasNextPage,
    fetchNextPage,
    hasPreviousPage,
    fetchPreviousPage,
    allPages: data.pages,
    data: currentPage.data,
    pagination: currentPage.pagination,
  };
}
/**
 *
 */
export function useEmployeeExtensionRequest(staffId: string) {
  const { data } = useSuspenseQuery({
    queryKey: ["employeeExtensionRequest", staffId],
    queryFn: async () => {
      return await apiFetch<TExtensionRequest | null>(
        `/api/academic/extension-request/staffs/${staffId}`,
      );
    },
  });
  return data;
}
/***
 *
 */
export function useExtensionRequestUPSERTAPI() {
  type params = {
    id: string | undefined;
    action: "CREATE" | "UPDATE";
    payload: TExtensionRequestForm;
  };

  return useMutation({
    mutationFn: async ({ id, action, payload }: params) => {
      const { url, method } = {
        url:
          action === "CREATE"
            ? "/api/academic/extension-request"
            : `/api/academic/extension-request/${id}`,
        method: action === "CREATE" ? "POST" : "PUT",
      };
      return apiFetch(url, { method, body: JSON.stringify(payload) });
    },
    onSuccess: async () => {
      await invalidateQueries(["extension-request-list"]);
    },
  });
}
/***
 *
 */
export function useExtensionRequestStatus() {
  type Params = {
    id: string;
    status: TExtensionRequestStatus;
  };

  return useMutation({
    mutationFn: async ({ id, status }: Params) => {
      const { url, method } = {
        url: `/api/academic/extension-request/${id}/${status}`,
        method: "PATCH",
      };
      return await apiFetch(url, { method, body: JSON.stringify({}) });
    },
    onSuccess: async () => {
      await invalidateQueries(["extension-request-list"]);
    },
  });
}
