// ========================================
// NOTIFICATIONS TYPES
// Add these to your main types.ts file
// ========================================

export type NotificationType =
  | "leave_approved"
  | "leave_rejected"
  | "leave_pending"
  | "payroll"
  | "contract"
  | "system"
  | "profile"
  | "attendance"
  | "general";

export type NotificationPriority = "low" | "medium" | "high" | "urgent";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  read: boolean;
  icon?: string; // Icon name from lucide-react
  actionUrl?: string; // URL to navigate on click
  metadata?: Record<string, any>; // Additional data (e.g., leaveId, payslipId)
  createdAt: string; // ISO date string
  readAt?: string | null; // ISO date string when marked as read
}

export interface NotificationListResponse {
  data: Notification[];
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

export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  byType: Record<NotificationType, number>;
  todayCount: number;
  weekCount: number;
}

export interface NotificationQueryParams {
  page?: string;
  limit?: string;
  read?: string; // "true" | "false" | undefined (all)
  type?: NotificationType;
  priority?: NotificationPriority;
  startDate?: string;
  endDate?: string;
}

export interface MarkAsReadRequest {
  notificationIds: string[]; // Array of notification IDs to mark as read
}

export interface MarkAsReadResponse {
  success: boolean;
  count: number; // Number of notifications marked as read
  notifications: Notification[];
}

export interface NotificationPreferences {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  notificationTypes: {
    [K in NotificationType]: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string; // HH:mm format
  };
}

// Helper type for notification icon colors
export type NotificationIconColor =
  | "text-success"
  | "text-primary"
  | "text-warning"
  | "text-danger"
  | "text-info"
  | "text-accent";

// Helper function type for getting notification config
export interface NotificationConfig {
  icon: string; // Lucide icon name
  color: NotificationIconColor;
  borderColor: string; // Tailwind class
}
