import {
  useQuery,
  useMutation,
  useSuspenseQuery,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import {
  type TDocumentList,
  type TDocumentSummary,
} from "@sluk/src/types/documentTypes";
import { apiFetch, invalidateQueries } from "@sluk/src/lib/api.utils";

export function useEmployeeDocument(filters?: {
  category: string | null;
  status?: string | null;
  limit?: string;
  page?: number;
}) {
  const params = new URLSearchParams();
  if (filters?.limit) params.set("limit", filters.limit || "5");
  if (filters?.page) params.set("page", String(filters.page || 1));
  if (filters?.status) params.set("status", filters.status);
  if (filters?.category) params.set("category", filters.category);

  const { data, isFetching, fetchNextPage, fetchPreviousPage } =
    useSuspenseInfiniteQuery({
      queryKey: ["employeeDocuments", { ...filters }],
      maxPages: +(filters?.limit || 5),
      initialPageParam: 1,
      queryFn: async () => {
        return await apiFetch<TDocumentList>(`/api/documents/staffs?${params}`);
      },
      getNextPageParam: (lastPage) =>
        lastPage?.pagination?.hasNextPage
          ? lastPage.pagination.page + 1
          : undefined,
      getPreviousPageParam: (firstPage) =>
        firstPage?.pagination?.hasPrevPage
          ? firstPage?.pagination?.page - 1
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

// useDocuments.ts

export function useDocumentSummary() {
  return useSuspenseQuery({
    queryKey: ["documentSummary"],
    queryFn: async () =>
      await apiFetch<TDocumentSummary | null>(`/api/documents/summary`),
    staleTime: 60 * 1000,
  });
}

export function useDocumentView(docId: string | null) {
  return useQuery({
    queryKey: ["documentView", docId],
    queryFn: async () =>
      await apiFetch<TDocumentList>(`/api/documents/${docId}/view`),
    enabled: !!docId,
    retry: false,
  });
}

export function useAddDocument() {
  return useMutation({
    mutationFn: async (payload: FormData) => {
      return await apiFetch(`/api/documents`, {
        method: "POST",
        body: payload,
        redirect: "follow",
      });
    },
    onSuccess: () => {
      invalidateQueries(["documentSummary", "employeeDocuments"]);
    },
  });
}

export function downloadDocument(docId: string) {
  window.open(`/api/documents/${docId}/download`, "_blank");
}
