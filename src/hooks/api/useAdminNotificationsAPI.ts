import type {
  TNotificationStats,
  TNotificationPreferences,
  TNotificationQueryParams,
  TNotificationListResponse,
  TMarkNotificationAsReadRequest,
  TMarkNotificationAsReadResponse,
} from "@/types/notifications-types";
import { queryClient } from "@/lib/utils";
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
    queryFn: async () => {
      const response = await fetch(`/api/notifications?${queryParams}`);
      if (!response.ok) throw new Error("Failed to fetch notifications");
      return response.json() as Promise<TNotificationListResponse>;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider fresh for 10 seconds
  });
}

// 2. Get Single Notification
export function useNotification(id: string) {
  return useQuery({
    queryKey: ["notification", id],
    queryFn: async () => {
      const response = await fetch(`/api/notifications/${id}`);
      if (!response.ok) throw new Error("Failed to fetch notification");
      return response.json() as Promise<Notification>;
    },
    enabled: !!id,
  });
}

// 3. Get Notification Statistics
export function useNotificationStats() {
  return useQuery({
    queryKey: ["notifications", "stats"],
    queryFn: async () => {
      const response = await fetch("/api/notifications/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json() as Promise<TNotificationStats>;
    },
    refetchInterval: 60000, // Refetch every minute
  });
}

// 4. Mark Notification(s) as Read
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationIds: string[]) => {
      const response = await fetch("/api/notifications/mark-read", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds } as TMarkNotificationAsReadRequest),
      });

      if (!response.ok) throw new Error("Failed to mark as read");
      return response.json() as Promise<TMarkNotificationAsReadResponse>;
    },
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
    mutationFn: async () => {
      const response = await fetch("/api/notifications/mark-all-read", {
        method: "PATCH",
      });

      if (!response.ok) throw new Error("Failed to mark all as read");
      return response.json() as Promise<TMarkNotificationAsReadResponse>;
    },
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
      const response = await fetch(
        `/api/notifications/${notificationId}/mark-unread`,
        {
          method: "PATCH",
        },
      );

      if (!response.ok) throw new Error("Failed to mark as unread");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// 7. Delete Notification
export function useDeleteNotification() {
  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete notification");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// 8. Delete All Read Notifications
export function useDeleteAllRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/notifications/delete-read", {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete read notifications");
      return response.json();
    },
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
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notification),
      });

      if (!response.ok) throw new Error("Failed to create notification");
      return response.json();
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
    queryFn: async () => {
      const response = await fetch("/api/notifications/preferences");
      if (!response.ok) throw new Error("Failed to fetch preferences");
      return response.json() as Promise<TNotificationPreferences>;
    },
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (preferences: Partial<TNotificationPreferences>) => {
      const response = await fetch("/api/notifications/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) throw new Error("Failed to update preferences");
      return response.json();
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
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const response = await fetch("/api/notifications?read=false&limit=1");
      if (!response.ok) throw new Error("Failed to fetch unread count");
      const data = (await response.json()) as TNotificationListResponse;
      return data.pagination.unreadCount;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

// 12. Combined hook for notification page
export function useNotificationsPage(params?: TNotificationQueryParams) {
  const notifications = useNotifications(params);
  const stats = useNotificationStats();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
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
