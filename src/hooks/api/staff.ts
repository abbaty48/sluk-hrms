import { sleep } from "@/lib/utils"
import type { TStaff } from "@/types/staff-types"
import { useQuery, useInfiniteQuery } from "@tanstack/react-query"
import type { TEmploymentHistoryResponse, TQualification } from "@/types/types"



export function useStaff(id: string) {
  return useQuery<TStaff>({
    queryKey: ["staff", id],
    queryFn: async () => {
      await sleep(1000)
      const res = await fetch(`/api/staff/${id}/details`)
      if (!res.ok) throw new Error("Failed to fetch staff")
      return res.json()
    },
  })
}

export function useStaffQualificationsAPI(staffId: string) {
  console.log("Fetching qualifications for staff ID:", staffId);
  const { data: qualifications = [] } = useQuery<TQualification[]>({
    queryKey: ["staffQualifications", staffId],
    queryFn: async () => {
      await sleep(1000)
      const res = await fetch(`/api/staff/${staffId}/qualifications`)
      const data = await res.json()
      console.log("RESPONSE:", data)
      // handle both array and wrapped response
      return Array.isArray(data) ? data : data.qualifications ?? data.data ?? []
    },
    enabled: !!staffId,
  })

  return { qualifications }
}




const fetchEmploymentHistory = async (
  staffId: string,
  page: number,
): Promise<TEmploymentHistoryResponse> => {
  const res = await fetch(
    `/api/staff/${staffId}/employment?page=${page}&limit=3`,
  )
  if (!res.ok) throw new Error("Failed to fetch employment history");
  return res.json();
}


export function useEmploymentHistoryAPI(staffId: string) {
  return useInfiniteQuery<TEmploymentHistoryResponse>({
    queryKey: ["employmentHistory", staffId],
    queryFn: ({ pageParam = 1 }) =>
      fetchEmploymentHistory(staffId, pageParam as number),
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 1,
    enabled: !!staffId,
  })
}
