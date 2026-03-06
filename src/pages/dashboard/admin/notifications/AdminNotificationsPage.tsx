import {
  NotificationsEmptyState,
  NotificationsPageSkeleton,
} from "./AdminNotificationsPageSkeleton";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NotificationItem } from "./AdminNotificationItem";
import type { TNotification } from "@/types/notificationsTypes";
import { useNotificationsPage } from "@/hooks/api/useAdminNotificationsAPI";

const Component = function NotificationsPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    page: "1",
    limit: "5",
  });

  const {
    isLoading,
    markAsRead,
    notifications,
    markAllAsRead,
    deleteNotification,
  } = useNotificationsPage(filters);

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead.mutateAsync();
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead.mutateAsync([id]);
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification.mutateAsync(id);
      toast.success("Notification deleted");
    } catch {
      toast.error("Failed to delete notification");
    }
  };

  const handleNotificationClick = (notification: TNotification) => {
    // Mark as read if unread
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }

    // Navigate if action URL exists
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  if (isLoading) {
    return <NotificationsPageSkeleton />;
  }

  const hasNotifications =
    notifications.data && notifications.data.data.length > 0;

  return (
    <div className="p-5 space-y-5">
      {/* Page Header */}
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="page-title">Notifications</h2>
          <p className="page-subtitle">
            {notifications.data?.pagination.unreadCount || 0} unread
            notification
            {notifications.data?.pagination.unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
        {hasNotifications &&
          (notifications.data?.pagination.unreadCount ?? 0) > 0 && (
            <Button
              variant="outline"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsRead.isPending}
            >
              {markAllAsRead.isPending ? "Marking..." : "Mark all as read"}
            </Button>
          )}
      </div>

      {/* Notifications List */}
      {!hasNotifications ? (
        <NotificationsEmptyState />
      ) : (
        <div className="space-y-3">
          {notifications.data?.data.map((notification) => (
            <NotificationItem
              key={notification.id}
              showActions={true}
              onDelete={handleDelete}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
              onClick={handleNotificationClick}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {hasNotifications && notifications.data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={() =>
              setFilters({
                ...filters,
                page: (parseInt(filters.page) - 1).toString(),
              })
            }
            disabled={!notifications.data.pagination.hasPrevPage}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {notifications.data.pagination.page} of{" "}
            {notifications.data.pagination.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() =>
              setFilters({
                ...filters,
                page: (parseInt(filters.page) + 1).toString(),
              })
            }
            disabled={!notifications.data.pagination.hasNextPage}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default Component;
