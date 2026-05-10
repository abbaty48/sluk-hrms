import type {
  TStaffDetails,
  TStaffList,
  TStaffUpdateStatusRequest,
} from "@/types/staffTypes";
import type {
  TStaff,
  TStaffProfileUpdateRequest,
  TStaffUpdateStatusResponse,
} from "@/types/staffTypes";
import { useSuspenseQuery } from "@tanstack/react-query";
import { apiFetch, queryClient } from "@sluk/src/lib/api.utils";
import { useMutation, useSuspenseInfiniteQuery } from "@tanstack/react-query";

type SearchStaffCriteria = Partial<{
  q: string;
  all: boolean;
  page: string;
  sort: string;
  cadre: string;
  limit: string;
  status: string;
  departmentId: string;
}>;

export function useStaffAPI(searchCriteria?: SearchStaffCriteria) {
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
    queryKey: ["admin", "staffs", { ...searchCriteria }],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams();

      // Add parameters properly
      params.set("page", pageParam.toString());
      params.set("limit", searchCriteria?.limit?.toString() || "5");

      if (searchCriteria?.q) {
        params.set("q", searchCriteria.q);
      }

      // Add other search criteria (avoid duplicating limit and q)
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

      return await apiFetch<TStaffList>(
        searchCriteria?.all ? `/api/staffs/all` : `/api/staffs?${params}`,
      );
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage?.pagination.hasPrevPage
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
    pagination: currentPage.pagination,
    data: currentPage.data as TStaff[],
  };
}

/**
 *
 */
export function useAddStaffAPI() {
  return useMutation({
    mutationFn: async (data: any) =>
      await apiFetch("/api/staffs", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  });
}
/**
 *
 */
export function useUpdateStaffProfileAPI() {
  return useMutation({
    mutationFn: async (
      data: { staffId: string } & TStaffProfileUpdateRequest,
    ) =>
      await apiFetch(`/api/staffs/${data.staffId}/details`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  });
}

// ========================================
// GET STAFF PROFILE
// ========================================
export function useStaffProfile(staffId: string) {
  return useSuspenseQuery({
    queryKey: ["employeeProfile", staffId],
    queryFn: async () =>
      await apiFetch<TStaffDetails>(`/api/staffs/${staffId}/details`),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ========================================
// UPDATE EMPLOYEE STATUS
// ========================================
export function useStaffUpdateStaffStatus() {
  return useMutation({
    mutationFn: async (data: TStaffUpdateStatusRequest) =>
      await apiFetch(`/api/staffs/${data.staffId}/${data.status}`, {
        method: "PATCH",
        body: JSON.stringify({}),
      }),
    onSuccess: (data, variables) => {
      // Invalidate and refetch employee profile
      queryClient.invalidateQueries({
        queryKey: ["employeeProfile", variables.staffId],
      });

      // Update cache optimistically
      queryClient.setQueryData<TStaffUpdateStatusResponse>(
        ["employeeProfile", variables.staffId],
        (old: any) => {
          if (!old) return old;
          return {
            staff: data.staff,
          };
        },
      );
    },
  });
}
