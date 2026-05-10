import type {
  TLeaveList,
  TLeaveApplication,
  TLeaveBalanceList,
} from "@sluk/src/types/leave-managementTypes";
import {
  useMutation,
  useSuspenseQuery,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { apiFetch, queryClient } from "@/lib/api.utils";

export function useLeaveBalancesAPI() {
  const { data } = useSuspenseQuery({
    queryKey: ["leave-balances"],
    queryFn: async () =>
      await apiFetch<TLeaveBalanceList>(`/api/staffs/leave-balances`),
  });
  return data.data;
}

export function useLeaveTypesAPI() {
  const { data } = useSuspenseQuery({
    queryKey: ["leave-types"],
    queryFn: async () => await apiFetch<TLeaveBalanceList>(`/api/leaves/types`),
  });
  return data.data;
}

export function useLeaveHistoryAPI({
  key,
  limit,
}: Partial<{
  key: number;
  limit: string;
}>) {
  const { data, isFetching, fetchNextPage, fetchPreviousPage } =
    useSuspenseInfiniteQuery({
      queryKey: ["leave-history", key, limit],
      initialPageParam: 1,
      maxPages: Number(limit || 5),
      queryFn: async () => {
        return await apiFetch<TLeaveList>(
          `/api/leaves/staff?page=${key}&limit=${limit || "5"}`,
        );
      },
      getPreviousPageParam: (firstPage) =>
        firstPage?.pagination?.hasPrevPage
          ? firstPage.pagination.page - 1
          : undefined,
      getNextPageParam: (lastPage) =>
        lastPage?.pagination?.hasNextPage
          ? lastPage?.pagination.page + 1
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

export function useApplyLeaveAPI() {
  return useMutation({
    mutationFn: async (data: TLeaveApplication) => {
      return await apiFetch("/api/leaves", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      // refetch leave history + balances
      queryClient.invalidateQueries({ queryKey: ["leave-history"] });
      queryClient.invalidateQueries({ queryKey: ["leave-balances"] });
    },
  });
}
