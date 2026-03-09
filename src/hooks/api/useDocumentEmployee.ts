import { useSuspenseQuery, useMutation, useQueryClient,useQuery } from "@tanstack/react-query"
import { sleep } from "@/lib/utils"
import type { TStaffDocumentsResponse, TDocumentResponse, TAddDocumentPayload } from "@sluk/src/types/types"

export function useStaffDocument(
  staffId: string,
  filters?: { category?: string; status?: string }
) {
  const params = new URLSearchParams()
  if (filters?.category) params.set("category", filters.category)
  if (filters?.status)   params.set("status",   filters.status)

  const { data } = useSuspenseQuery<TStaffDocumentsResponse>({
    queryKey:  ["staffDocuments", staffId, filters],
    queryFn:   async () => {
      await sleep(1000)
      const res = await fetch(`/api/staff/${staffId}/documents?${params.toString()}`)
      if (!res.ok) throw new Error("Failed to fetch staff documents")
      return res.json()
    },
    staleTime:       10000,
  })

  return data  
}

// useDocuments.ts

export function useDocumentView(docId: string | null) {
  return useQuery<TDocumentResponse>({  
    queryKey: ["documentView", docId],
    queryFn:  async () => {
      const res = await fetch(`/api/documents/${docId}/view`)
      if (!res.ok) throw new Error("Failed to fetch document")
      return res.json()
    },
    enabled: !!docId, 
    retry: false,
  })
}

export function useAddDocument(staffId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: TAddDocumentPayload) => {
      const res = await fetch(`/api/staff/${staffId}/documents`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Failed to upload document")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffDocuments", staffId] })
      queryClient.invalidateQueries({ queryKey: ["documents"] })
    },
  })
}

export function downloadDocument(docId: string) {
  window.open(`/api/documents/${docId}/download`, "_blank")
}