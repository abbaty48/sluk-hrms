import {
  useQuery,
  useMutation,
  useSuspenseQuery,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import type {
  TDepartment,
  TDepartmentsList,
  TDepartmentCreateRequest,
  TDepartmentUpdateRequest,
} from "@sluk/src/types/departmentTypes";
import type { TRanksList } from "@sluk/src/types/rankTypes";
import { apiFetch, queryClient } from "@sluk/src/lib/api.utils";

/**
 *
 * @returns Department[]
 */
export const useAdminDepartment = () => {
  return useSuspenseQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      return await apiFetch<TDepartment[]>("/api/departments", {
        method: "GET",
      });
    },
  });
};

/**
 *
 * @returns Rank[]
 */
export const useAdminRank = () => {
  return useSuspenseQuery<TRanksList>({
    queryKey: ["ranks"],
    queryFn: async () => apiFetch<TRanksList>("/api/ranks/all"),
  });
};

export function useDepartments({
  limit,
  page,
  activeOnly = false,
}: Partial<{ activeOnly: boolean; limit: string; page: string }>) {
  const { data, isFetching, fetchNextPage, fetchPreviousPage } =
    useSuspenseInfiniteQuery({
      queryKey: ["settings", "departments", activeOnly, limit, page],
      maxPages: 10,
      initialPageParam: 1,
      staleTime: 2 * 60 * 1000, // 2 minutes
      queryFn: async () => {
        const params = `?page=${page}&limit=${limit}${activeOnly ? "&active=true" : ""}`;
        return await apiFetch<TDepartmentsList>(
          `/api/settings/departments${params}`,
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
    data: currentPage.data,
    isFetching,
    fetchNextPage,
    fetchPreviousPage,
    pagination: currentPage.pagination,
  };
}

export function useDepartment(id: string) {
  return useQuery({
    queryKey: ["settings", "departments", id],
    queryFn: async () =>
      await apiFetch<TDepartment>(`/api/settings/departments/${id}`),
    enabled: !!id,
  });
}

export function useCreateDepartment() {
  return useMutation({
    mutationFn: async (data: TDepartmentCreateRequest) => {
      return await apiFetch("/api/settings/departments", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "departments"] });
    },
  });
}

export function useUpdateDepartment() {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: TDepartmentUpdateRequest;
    }) => {
      return await apiFetch(`/api/settings/departments/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "departments"] });
    },
  });
}

export function useDeleteDepartment() {
  return useMutation({
    mutationFn: async (id: string) => {
      return await apiFetch(`/api/settings/departments/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "departments"] });
    },
  });
}
