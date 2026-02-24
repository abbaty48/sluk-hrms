import { useSuspenseQuery , useInfiniteQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import type { LeaveApplication } from '@sluk/src/types/types'


export function useLeaveBalances(staffId: string) {
  const { data } = useSuspenseQuery({
    queryKey: ["leave-balances", staffId],
    queryFn: async () => {
      const res = await fetch(`/api/staff/${staffId}/leave-balances`)
      if (!res.ok) throw new Error("Failed to fetch balances")
      return res.json()
    }
  })

  return { balances: data }
}

export function useLeaveHistory(staffId: string) {
  return useInfiniteQuery({
    queryKey: ["leave-history", staffId],
    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      const res = await fetch(
        `/api/staff/${staffId}/leaves?page=${pageParam}&limit=3`
      )
      if (!res.ok) throw new Error("Failed to fetch leaves")
      return res.json();
    },

    getNextPageParam: lastPage => lastPage.nextPage
  })
}


// Additional hooks for applying  leave details can be added here



export function useApplyLeave() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: LeaveApplication) => {
      const res = await fetch("/api/leaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
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