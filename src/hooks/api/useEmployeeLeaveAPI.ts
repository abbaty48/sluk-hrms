import type { TLeaveApplication, TLeaveBalance, TLeaveRequest } from '@/types/leave-management.types'
import { useSuspenseQuery, useMutation, useSuspenseInfiniteQuery } from '@tanstack/react-query'
import type { TPagination } from '@/types/types'
import { queryClient } from '@/lib/utils'


export function useLeaveBalancesAPI(staffId: string) {
  const { data } = useSuspenseQuery({
    queryKey: ["leave-balances", staffId],
    queryFn: async () => {
      const res = await fetch(`/api/staff/${staffId}/leave-balances`);
      if (!res.ok) throw new Error("Failed to fetch balances");
      return res.json() as Promise<TLeaveBalance[]>;
    }
  })
  return data
}

export function useLeaveHistoryAPI(staffId: string) {
  const { data, isFetching, fetchNextPage, fetchPreviousPage } = useSuspenseInfiniteQuery({
    queryKey: ["leave-history", staffId],
    initialPageParam: 1,
    maxPages: 5,
    queryFn: async ({ pageParam }) => {
      const res = await fetch(
        `/api/staff/${staffId}/leaves?page=${pageParam}&limit=3`
      )
      if (!res.ok) throw new Error("Failed to fetch leaves")
      return await res.json() as { data: TLeaveRequest[], pagination: TPagination };
    },
    getPreviousPageParam: firstPage => firstPage?.pagination.hasPrevPage ?
      firstPage.pagination.page - 1 : undefined,
    getNextPageParam: lastPage => lastPage?.pagination.hasNextPage ?
      lastPage?.pagination.page + 1 : undefined
  })

  return {
    isFetching,
    fetchNextPage,
    fetchPreviousPage,
    data: data?.pages.flatMap(p => p.data) ?? [],
    pagination: data?.pages[0].pagination,
  }
}

export function useApplyLeaveAPI() {

  return useMutation({
    mutationFn: async (data: TLeaveApplication) => {
      const res = await fetch("/api/leaves", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to apply leave")

      return res.json();
    },

    onSuccess: () => {
      // refetch leave history + balances
      queryClient.invalidateQueries({ queryKey: ["leaveHistory"] })
      queryClient.invalidateQueries({ queryKey: ["leaveBalances"] })
    }
  })
}
