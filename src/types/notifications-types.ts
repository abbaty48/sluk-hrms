// ========================================
// NOTIFICATIONS TYPES
// Add these to your main types.ts file
// ========================================

export type TNotificationType =
  | "leave_approved"
  | "leave_rejected"
  | "leave_pending"
  | "payroll"
  | "contract"
  | "system"
  | "profile"
  | "attendance"
  | "general";

export type TNotificationPriority = "low" | "medium" | "high" | "urgent";

export type TNotification = {
  id: string;
  userId: string;
  type: TNotificationType;
  title: string;
  message: string;
  priority: TNotificationPriority;
  read: boolean;
  icon?: string; // Icon name from lucide-react
  actionUrl?: string; // URL to navigate on click
  metadata?: Record<string, any>; // Additional data (e.g., leaveId, payslipId)
  createdAt: string; // ISO date string
  readAt?: string | null; // ISO date string when marked as read
}

export type TNotificationListResponse = {
  data: TNotification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    unreadCount: number;
  };
}

export type TNotificationStats = {
  total: number;
  unread: number;
  read: number;
  todayCount: number;
  weekCount: number;
  byType: Record<TNotificationType, number>;
}

export interface TNotificationQueryParams {
  page?: string;
  limit?: string;
  read?: string; // "true" | "false" | undefined (all)
  type?: TNotificationType;
  priority?: TNotificationPriority;
  startDate?: string;
  endDate?: string;
}

export type TMarkNotificationAsReadRequest = {
  notificationIds: string[]; // Array of notification IDs to mark as read
}

export type TMarkNotificationAsReadResponse = {
  success: boolean;
  count: number; // Number of notifications marked as read
  notifications: TNotification[];
}

export type TNotificationPreferences = {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  notificationTypes: {
    [K in TNotificationType]: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string; // HH:mm format
  };
}

// Helper type for notification icon colors
export type TNotificationIconColor =
  | "text-success"
  | "text-primary"
  | "text-warning"
  | "text-danger"
  | "text-info"
  | "text-accent";

// Helper function type for getting notification config
export type TNotificationConfig = {
  icon: string; // Lucide icon name
  color: TNotificationIconColor;
  borderColor: string; // Tailwind class
}
