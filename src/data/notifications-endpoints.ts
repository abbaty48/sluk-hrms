// ========================================
// NOTIFICATIONS ENDPOINTS
// Add to server.ts after analytics endpoints
// ========================================

import type {
  TNotification,
  TNotificationStats,
  TNotificationListResponse,
  TMarkNotificationAsReadRequest,
  TMarkNotificationAsReadResponse,
} from "@/types/notifications-types.ts";
import type { Application, Response } from "express";
import type { TDatabase, TAuthRequest } from "@/types/types";

export function hrmsNOTIFICATION_ENDPOINTS(
  server: Application,
  getDb: () => TDatabase,
) {
  // 1. Get Notifications (with pagination and filters)
  server.get("/api/notifications", (req: TAuthRequest, res: Response): void => {
    const db = getDb();
    const {
      page = "1",
      limit = "20",
      read,
      type,
      priority,
      startDate,
      endDate,
    } = req.query;

    // Get current user's notifications
    let notifications = db.notifications.filter(
      (n) => n.userId === req.user?.staffId,
    );

    // Apply filters
    if (read !== undefined) {
      const isRead = read === "true";
      notifications = notifications.filter((n) => n.read === isRead);
    }

    if (type) {
      notifications = notifications.filter((n) => n.type === type);
    }

    if (priority) {
      notifications = notifications.filter((n) => n.priority === priority);
    }

    if (startDate) {
      notifications = notifications.filter(
        (n) => new Date(n.createdAt) >= new Date(startDate as string),
      );
    }

    if (endDate) {
      notifications = notifications.filter(
        (n) => new Date(n.createdAt) <= new Date(endDate as string),
      );
    }

    // Sort by createdAt descending (newest first)
    notifications.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    // Calculate unread count
    const unreadCount = db.notifications.filter(
      (n) => n.userId === req.user?.staffId && !n.read,
    ).length;

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const total = notifications.length;
    const totalPages = Math.ceil(total / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedData = notifications.slice(startIndex, endIndex);

    const response: TNotificationListResponse = {
      data: paginatedData,
      pagination: {
        total,
        totalPages,
        unreadCount,
        page: pageNum,
        limit: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    };

    res.json(response);
  });

  // 2. Get Notification by ID
  server.get(
    "/api/notifications/:id",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const { id } = req.params;

      const notification = db.notifications.find(
        (n) => n.id === id && n.userId === req.user?.staffId,
      );

      if (!notification) {
        res.status(404).json({ error: "Notification not found" });
        return;
      }

      res.json(notification);
    },
  );

  // 3. Mark Notification(s) as Read
  server.patch(
    "/api/notifications/mark-read",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const { notificationIds } = req.body as TMarkNotificationAsReadRequest;

      if (!notificationIds || !Array.isArray(notificationIds)) {
        res.status(400).json({ error: "notificationIds array is required" });
        return;
      }

      const updatedNotifications: TNotification[] = [];
      const now = new Date().toISOString();

      notificationIds.forEach((id) => {
        const notification = db.notifications.find(
          (n) => n.id === id && n.userId === req.user?.staffId,
        );

        if (notification && !notification.read) {
          notification.read = true;
          notification.readAt = now;
          updatedNotifications.push(notification);
        }
      });

      // saveDb(db);

      const response: TMarkNotificationAsReadResponse = {
        success: true,
        count: updatedNotifications.length,
        notifications: updatedNotifications
      };

      res.json(response);
    },
  );

  // 4. Mark All as Read
  server.patch(
    "/api/notifications/mark-all-read",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const now = new Date().toISOString();

      const updatedNotifications: TNotification[] = [];

      db.notifications.forEach((notification) => {
        if (notification.userId === req.user?.staffId && !notification.read) {
          notification.read = true;
          notification.readAt = now;
          updatedNotifications.push(notification);
        }
      });

      // saveDb(db);

      const response: TMarkNotificationAsReadResponse = {
        success: true,
        count: updatedNotifications.length,
        notifications: updatedNotifications,
      };

      res.json(response);
    },
  );

  // 5. Mark as Unread
  server.patch(
    "/api/notifications/:id/mark-unread",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const { id } = req.params;

      const notification = db.notifications.find(
        (n) => n.id === id && n.userId === req.user?.staffId,
      );

      if (!notification) {
        res.status(404).json({ error: "Notification not found" });
        return;
      }

      notification.read = false;
      notification.readAt = null;

      // saveDb(db);

      res.json({
        success: true,
        notification,
      });
    },
  );

  // 6. Delete Notification
  server.delete(
    "/api/notifications/:id",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();
      const { id } = req.params;

      const index = db.notifications.findIndex(
        (n) => n.id === id && n.userId === req.user?.staffId,
      );

      if (index === -1) {
        res.status(404).json({ error: "Notification not found" });
        return;
      }

      const deleted = db.notifications.splice(index, 1)[0];
      // saveDb(db);

      res.json({
        success: true,
        message: "Notification deleted successfully",
        deleted,
      });
    },
  );

  // 7. Delete All Read Notifications
  server.delete(
    "/api/notifications/delete-read",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();

      const initialLength = db.notifications.length;

      db.notifications = db.notifications.filter(
        (n) => !(n.userId === req.user?.staffId && n.read),
      );

      const deletedCount = initialLength - db.notifications.length;

      // saveDb(db);

      res.json({
        success: true,
        message: `Deleted ${deletedCount} read notifications`,
        count: deletedCount,
      });
    },
  );

  // 8. Create Notification (Admin/System use)
  server.post("/api/notifications", (req: TAuthRequest, res: Response): void => {
    const db = getDb();
    const {
      icon,
      userId,
      type,
      title,
      message,
      priority,
      metadata,
      actionUrl,
    } = req.body;

    // Validation
    if (!userId || !type || !title || !message) {
      res.status(400).json({
        error: "userId, type, title, and message are required",
      });
      return;
    }

    const newNotification: TNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      userId,
      icon,
      type,
      title,
      message,
      metadata,
      actionUrl,
      read: false,
      priority: priority || "medium",
      createdAt: new Date().toISOString(),
      readAt: null,
    };

    db.notifications.push(newNotification);
    // saveDb(db);

    res.status(201).json({
      success: true,
      message: "Notification created successfully",
      notification: newNotification,
    });
  });

  // 9. Get Notification Statistics
  server.get(
    "/api/notifications/stats",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();

      const userNotifications = db.notifications.filter(
        (n) => n.userId === req.user?.staffId,
      );

      const unread = userNotifications.filter((n) => !n.read).length;
      const read = userNotifications.filter((n) => n.read).length;

      // Group by type
      const byType: Record<string, number> = {};
      userNotifications.forEach((n) => {
        byType[n.type] = (byType[n.type] || 0) + 1;
      });

      // Count today's notifications
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayCount = userNotifications.filter(
        (n) => new Date(n.createdAt) >= today,
      ).length;

      // Count this week's notifications
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekCount = userNotifications.filter(
        (n) => new Date(n.createdAt) >= weekAgo,
      ).length;

      const stats: TNotificationStats = {
        read,
        unread,
        weekCount,
        todayCount,
        total: userNotifications.length,
        byType: byType as Record<any, number>,
      };

      res.json(stats);
    },
  );

  // 10. Get/Update Notification Preferences
  server.get(
    "/api/notifications/preferences",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();

      let preferences = db.notificationPreferences?.find(
        (p) => p.userId === req.user?.staffId,
      );

      // Create default preferences if none exist
      if (!preferences) {
        preferences = {
          userId: req.user?.staffId || "",
          emailNotifications: true,
          pushNotifications: true,
          notificationTypes: {
            leave_approved: true,
            leave_rejected: true,
            leave_pending: true,
            payroll: true,
            contract: true,
            system: true,
            profile: true,
            attendance: true,
            general: true,
          },
          quietHours: {
            enabled: false,
            start: "22:00",
            end: "08:00",
          },
        };
      }

      res.json(preferences);
    },
  );

  server.patch(
    "/api/notifications/preferences",
    (req: TAuthRequest, res: Response): void => {
      const db = getDb();

      if (!db.notificationPreferences) {
        db.notificationPreferences = [];
      }

      let preferences = db.notificationPreferences.find(
        (p) => p.userId === req.user?.staffId,
      );

      if (preferences) {
        // Update existing preferences
        Object.assign(preferences, req.body);
      } else {
        // Create new preferences
        preferences = {
          userId: req.user?.staffId || "",
          ...req.body,
        };
        db.notificationPreferences.push(preferences!);
      }

      // saveDb(db);

      res.json({
        success: true,
        message: "Preferences updated successfully",
        preferences,
      });
    },
  );
}
