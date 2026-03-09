import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sleep } from "@/lib/utils"
import type {
  TNotification,
  TNotificationListResponse,
  TNotificationStats,
  TNotificationQueryParams,
  TNotificationConfig,
  TMarkNotificationAsReadRequest,
  TMarkNotificationAsReadResponse,
} from "@/types/EmployeeNotification.types"

// ── GET NOTIFICATIONS ─────────────────────────────────────────────
export function useNotifications(
  staffId: string,
  filters?: TNotificationQueryParams
) {
  const params = new URLSearchParams()
  if (filters?.page)      params.set("page",      filters.page)
  if (filters?.limit)     params.set("limit",      filters.limit)
  if (filters?.read)      params.set("read",       filters.read)
  if (filters?.type)      params.set("type",       filters.type)
  if (filters?.priority)  params.set("priority",   filters.priority)
  if (filters?.startDate) params.set("startDate",  filters.startDate)
  if (filters?.endDate)   params.set("endDate",    filters.endDate)

  const { data } = useSuspenseQuery<TNotificationListResponse>({
    queryKey: ["notifications", staffId, filters],
    queryFn:  async () => {
      await sleep(800)
      const res = await fetch(
        `/api/staff/${staffId}/notifications?${params.toString()}`
      )
      if (!res.ok) throw new Error("Failed to fetch notifications")
      return res.json()
    },
    staleTime: 30000,
  })

  return data
}

// ── GET NOTIFICATION STATS ────────────────────────────────────────
export function useNotificationStats(staffId: string) {
  const { data } = useSuspenseQuery<TNotificationStats>({
    queryKey: ["notification-stats", staffId],
    queryFn:  async () => {
      await sleep(500)
      const res = await fetch(`/api/staff/${staffId}`)
      if (!res.ok) throw new Error("Failed to fetch notification stats")
      return res.json()
    },
    staleTime: 30000,
  })

  return data
}

// ── MARK ONE AS READ ──────────────────────────────────────────────
export function useMarkAsRead() {
  const queryClient = useQueryClient()

  return useMutation<TNotification, Error, string>({
    mutationFn: async (notifId: string) => {
      const res = await fetch(`/api/notifications/${notifId}/read`, {
        method: "PATCH",
      })
      if (!res.ok) throw new Error("Failed to mark as read")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      queryClient.invalidateQueries({ queryKey: ["notification-stats"] })
    },
  })
}

// ── MARK MULTIPLE AS READ ─────────────────────────────────────────
export function useMarkMultipleAsRead() {
  const queryClient = useQueryClient()

  return useMutation <
    TMarkNotificationAsReadResponse,
    Error,
    TMarkNotificationAsReadRequest
  >({
    mutationFn: async (payload: TMarkNotificationAsReadRequest) => {
      const res = await fetch("/api/notifications/read", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Failed to mark notifications as read")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      queryClient.invalidateQueries({ queryKey: ["notification-stats"] })
    },
  })
}

// ── MARK ALL AS READ ──────────────────────────────────────────────
export function useMarkAllAsRead(staffId: string) {
  const queryClient = useQueryClient()

  return useMutation<{ message: string; count: number }, Error, void>({
    mutationFn: async () => {
      const res = await fetch(
        `/api/staff/${staffId}/notifications/read-all`,
        { method: "PATCH" }
      )
      if (!res.ok) throw new Error("Failed to mark all as read")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      queryClient.invalidateQueries({ queryKey: ["notification-stats"] })
    },
  })
}

// ── DELETE NOTIFICATION ───────────────────────────────────────────
export function useDeleteNotification() {
  const queryClient = useQueryClient()

  return useMutation<{ message: string }, Error, string>({
    mutationFn: async (notifId: string) => {
      const res = await fetch(`/api/notifications/${notifId}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete notification")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      queryClient.invalidateQueries({ queryKey: ["notification-stats"] })
    },
  })
}

// ── NOTIFICATION CONFIG HELPER ────────────────────────────────────
export function getNotificationConfig(
  type: TNotification["type"]
): TNotificationConfig {
  const configs: Record<TNotification["type"], TNotificationConfig> = {
    leave_approved: {
      icon:        "CalendarCheck",
      color:       "text-success",
      borderColor: "border-l-green-500",
    },
    leave_rejected: {
      icon:        "CalendarX",
      color:       "text-danger",
      borderColor: "border-l-red-500",
    },
    leave_pending: {
      icon:        "CalendarClock",
      color:       "text-warning",
      borderColor: "border-l-yellow-500",
    },
    payroll: {
      icon:        "DollarSign",
      color:       "text-primary",
      borderColor: "border-l-primary",
    },
    contract: {
      icon:        "AlertCircle",
      color:       "text-warning",
      borderColor: "border-l-yellow-500",
    },
    system: {
      icon:        "Info",
      color:       "text-info",
      borderColor: "border-l-blue-500",
    },
    profile: {
      icon:        "FileText",
      color:       "text-accent",
      borderColor: "border-l-accent",
    },
    attendance: {
      icon:        "Clock",
      color:       "text-danger",
      borderColor: "border-l-red-500",
    },
    general: {
      icon:        "Bell",
      color:       "text-primary",
      borderColor: "border-l-primary",
    },
  }

  return configs[type] ?? configs.general
}