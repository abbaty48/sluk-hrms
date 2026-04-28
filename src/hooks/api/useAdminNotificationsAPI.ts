import type {
  TNotificationList,
  TNotificationStats,
  TNotificationQueryParams,
  TNotificationPreferences,
  TMarkNotificationAsReadRequest,
  TMarkNotificationAsReadResponse,
} from "@/types/notificationsTypes";
import { apiFetch, queryClient } from "@/lib/api.utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// 1. Get Notifications List
export function useNotifications(params?: TNotificationQueryParams) {
  const queryParams = new URLSearchParams();
  if (params?.type) queryParams.set("type", params.type);
  if (params?.page) queryParams.set("page", params.page);
  if (params?.limit) queryParams.set("limit", params.limit);
  if (params?.endDate) queryParams.set("endDate", params.endDate);
  if (params?.priority) queryParams.set("priority", params.priority);
  if (params?.read !== undefined) queryParams.set("read", params.read);
  if (params?.startDate) queryParams.set("startDate", params.startDate);

  return useQuery({
    queryKey: ["notifications", params],
    queryFn: async () =>
      await apiFetch<TNotificationList>(`/api/notifications?${queryParams}`),
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider fresh for 10 seconds
  });
}

// 2. Get Single Notification
export function useNotification(id: string) {
  return useQuery({
    queryKey: ["notification", id],
    queryFn: async () =>
      await apiFetch<Notification>(`/api/notifications/${id}`),
    enabled: !!id,
  });
}

// 3. Get Notification Statistics
export function useNotificationStats() {
  return useQuery({
    queryKey: ["notifications", "stats"],
    queryFn: async () =>
      await apiFetch<TNotificationStats>("/api/notifications/stats"),
    refetchInterval: 60000, // Refetch every minute
  });
}

// 4. Mark Notification(s) as Read
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationIds: string[]) =>
      await apiFetch<TMarkNotificationAsReadResponse>(
        "/api/notifications/mark-read",
        {
          method: "PATCH",
          body: JSON.stringify({
            notificationIds,
          } as TMarkNotificationAsReadRequest),
        },
      ),
    onSuccess: () => {
      // Invalidate all notification queries
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// 5. Mark All as Read
export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () =>
      await apiFetch<TMarkNotificationAsReadResponse>(
        "/api/notifications/mark-all-read",
        {
          method: "PATCH",
          body: JSON.stringify({}),
        },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// 6. Mark as Unread
export function useMarkAsUnread() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      return await fetch(`/api/notifications/${notificationId}/mark-unread`, {
        method: "PATCH",
        body: JSON.stringify({}),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// 7. Delete Notification
export function useDeleteNotification() {
  return useMutation({
    mutationFn: async (notificationId: string) =>
      await apiFetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// 8. Delete All Read Notifications
export function useDeleteAllRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () =>
      await apiFetch("/api/notifications/delete-read", {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// 9. Create Notification (Admin/System)
export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notification: Partial<Notification>) => {
      return await apiFetch("/api/notifications", {
        method: "POST",
        body: JSON.stringify(notification),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// 10. Get/Update Notification Preferences
export function useNotificationPreferences() {
  return useQuery({
    queryKey: ["notifications", "preferences"],
    queryFn: async () =>
      await apiFetch<TNotificationPreferences>(
        "/api/notifications/preferences",
      ),
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (preferences: Partial<TNotificationPreferences>) => {
      return await apiFetch("/api/notifications/preferences", {
        method: "PATCH",
        body: JSON.stringify(preferences),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications", "preferences"],
      });
    },
  });
}

// 11. Get Unread Count Only (for badge)
export function useUnreadCount() {
  const { data } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      return await apiFetch<TNotificationList>(
        "/api/notifications?read=false&limit=1",
      );
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
  return data?.pagination.unreadCount || 0;
}

// 12. Combined hook for notification page
export function useNotificationsPage(params?: TNotificationQueryParams) {
  const markAsRead = useMarkAsRead();
  const stats = useNotificationStats();
  const markAllAsRead = useMarkAllAsRead();
  const notifications = useNotifications(params);
  const deleteNotification = useDeleteNotification();

  return {
    notifications,
    stats,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    isLoading: notifications.isLoading || stats.isLoading,
    isError: notifications.isError || stats.isError,
  };
}
