import {
  Info,
  Bell,
  Clock,
  Delete,
  FileText,
  UserCheck,
  CheckCheck,
  DollarSign,
  CircleAlert,
  CalendarDays,
  CircleCheckBig,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { cn, notificationConfig } from "@/lib/utils";
import { Button } from "@sluk/src/components/ui/button";
import type { Notification } from "@/types/notifications-types";

// Icon component mapper
const iconComponents = {
  CircleCheckBig,
  CalendarDays,
  CircleAlert,
  DollarSign,
  UserCheck,
  FileText,
  Clock,
  Bell,
  Info,
};

interface NotificationItemProps {
  notification: Notification;
  onClick?: (notification: Notification) => void;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export function NotificationItem({
  notification,
  onClick,
  onMarkAsRead,
  onDelete,
  showActions = false,
}: NotificationItemProps) {
  const config = notificationConfig(notification.type);
  const IconComponent =
    iconComponents[config.icon as keyof typeof iconComponents] || Bell;

  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
  });

  const handleClick = () => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
    if (onClick) {
      onClick(notification);
    }
  };

  return (
    <Card
      className={cn(
        "flex flex-row items-start gap-4 p-4 border-l-4 transition-opacity hover:bg-accent/50",
        config.borderColor,
        !notification.read ? "opacity-100" : "opacity-75",
      )}
      onClick={handleClick}
    >
      {/* Icon */}
      <div className={cn("mt-0.5", config.color)}>
        <IconComponent className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-card-foreground">
            {notification.title}
          </h3>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {timeAgo}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {notification.message}
        </p>

        {/* Optional Actions */}
        {showActions && (
          <div className="flex gap-2 mt-2">
            {!notification.read && onMarkAsRead && (
              <Button
                type="submit"
                variant={"outline"}
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead(notification.id);
                }}
                className="text-xs text-primary cursor-pointer"
              >
                <CheckCheck />
                Mark as read
              </Button>
            )}
            {onDelete && (
              <Button
                type="button"
                variant={"destructive"}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(notification.id);
                }}
                className="text-xs text-danger cursor-pointer hover:underline"
              >
                <Delete />
                Delete
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Unread indicator */}
      {!notification.read && (
        <div className="flex h-2 w-2 mt-2 rounded-full bg-primary shrink-0" />
      )}
    </Card>
  );
}

// Compact version for dropdown/popover
export function NotificationItemCompact({
  notification,
  onClick,
}: {
  notification: Notification;
  onClick?: (notification: Notification) => void;
}) {
  const config = notificationConfig(notification.type);
  const IconComponent =
    iconComponents[config.icon as keyof typeof iconComponents] || Bell;

  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
  });

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-2 rounded-md border border-l-4 cursor-pointer hover:bg-accent transition-colors",
        !notification.read && "bg-accent/50",
      )}
      onClick={() => onClick?.(notification)}
    >
      <div className={cn("mt-0.5", config.color)}>
        <IconComponent className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-medium line-clamp-1">
            {notification.title}
          </p>
          {!notification.read && (
            <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1" />
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
          {notification.message}
        </p>
        <span className="text-xs text-muted-foreground mt-1">{timeAgo}</span>
      </div>
    </div>
  );
}
