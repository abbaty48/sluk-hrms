import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import type {
  TDepartment,
  TDepartmentsListResponse,
  TDepartmentCreateRequest,
  TDepartmentUpdateRequest,
} from "@sluk/src/types/departmentTypes";
import { queryClient } from "@/lib/utils";
import type { TRank } from "@sluk/src/types/rankTypes";

/**
 *
 * @returns Department[]
 */
export const useAdminDepartment = () => {
  const { data } = useSuspenseQuery<TDepartment[]>({
    queryKey: ["departments"],
    queryFn: async () => {
      const resp = await fetch("/api/departments");
      if (!resp.ok) return [];

      return await resp.json();
    },
  });

  return { data };
};

/**
 *
 * @returns Rank[]
 */
export const useAdminRank = () => {
  const { data } = useSuspenseQuery<{ data: TRank[] }>({
    queryKey: ["ranks"],
    queryFn: async () => {
      return fetch("/api/ranks")
        .then((res) => res.json())
        .catch((error) => {
          throw error;
        });
    },
  });

  return { ranks: data.data };
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
        const response = await fetch(`/api/settings/departments${params}`);
        if (!response.ok) throw new Error("Failed to fetch departments");
        return response.json() as Promise<TDepartmentsListResponse>;
      },
      getNextPageParam: (lastPage) =>
        lastPage?.pagination.hasNextPage
          ? lastPage.pagination.page + 1
          : undefined,
      getPreviousPageParam: (firstPage) =>
        firstPage?.pagination.hasPrevPage
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
    queryFn: async () => {
      const response = await fetch(`/api/settings/departments/${id}`);
      if (!response.ok) throw new Error("Failed to fetch department");
      return response.json() as Promise<TDepartment>;
    },
    enabled: !!id,
  });
}

export function useCreateDepartment() {
  return useMutation({
    mutationFn: async (data: TDepartmentCreateRequest) => {
      const response = await fetch("/api/settings/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create department");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "departments"] });
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: TDepartmentUpdateRequest;
    }) => {
      const response = await fetch(`/api/settings/departments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update department");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "departments"] });
    },
  });
}

export function useDeleteDepartment() {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/settings/departments/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete department");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "departments"] });
    },
  });
}
