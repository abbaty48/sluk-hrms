import type { TPagination } from "@sluk/src/types/types";
import { apiFetch, invalidateQueries } from "@sluk/src/lib/api.utils";
import { useMutation, useSuspenseInfiniteQuery } from "@tanstack/react-query";

type GetProps<T> = {
  data: T[];
  pagination: TPagination | null;
};

/** */
export function useGetEntities<T extends GetProps<T>>(
  path: string,
  key: string,
  page: number = 1,
  term: string | undefined = undefined,
) {
  //
  const params = new URLSearchParams();
  params.set("page", String(page));
  //
  if (term) params.set("q", term);
  const { data, isFetching } = useSuspenseInfiniteQuery({
    queryKey: [key, term, page],
    queryFn: async () => await apiFetch<T>(`/api/${path}?${params}`),
    maxPages: 5,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage?.pagination?.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage?.pagination?.hasNextPage
        ? firstPage.pagination.page - 1
        : undefined,
  });
  //

  const currentPage = data.pages[data.pages.length - 1];
  return {
    isFetching,
    data: currentPage.data,
    pagination: currentPage.pagination,
  };
}
/** */
export function useCreateEntity<T>() {
  type Args = {
    data: T;
    path: string;
  };
  return useMutation({
    mutationFn: async ({ data, path }: Args) => {
      return await apiFetch(`/api/${path}`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      invalidateQueries([]);
    },
  });
}
/** */
export function useUpdateEntity<T>() {
  type Args = {
    id: string;
    path: string;
    data: Partial<T>;
  };
  return useMutation({
    mutationFn: async ({ id, data, path }: Args) => {
      return await apiFetch(`/api/${path}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      invalidateQueries([]);
    },
  });
}
/** */
export function useDeleteEntity() {
  type Args = {
    id: string;
    path: string;
  };
  return useMutation({
    mutationFn: async ({ id, path }: Args) =>
      await fetch(`/api/${path}/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      invalidateQueries([]);
    },
  });
}
