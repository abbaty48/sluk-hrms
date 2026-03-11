import {
  useMarkAsRead,
  useNotifications,
  useMarkAllAsRead,
  useDeleteNotification,
  getNotificationConfig,
} from "@/hooks/api/useEmployeeNotificationAPI"
import { Suspense } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { QueryErrorBoundary } from "@/components/ErrorBoundary"
import type { TNotification } from "@/types/notificationsTypes"
import { CalendarCheck, CalendarX, CalendarClock, DollarSign, AlertCircle, Info, FileText, Clock, Bell, Trash2 } from "lucide-react"

// ── HELPERS ───────────────────────────────────────────────────────
function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins} minute${mins !== 1 ? "s" : ""} ago`
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`
  return `${days} day${days !== 1 ? "s" : ""} ago`
}

// ── ICON RESOLVER ─────────────────────────────────────────────────
function NotifyIcon({ type, className }: { type: TNotification["type"]; className?: string }) {
  const cls = className ?? "w-5 h-5"
  switch (type) {
    case "leave_approved": return <CalendarCheck className={cls} />
    case "leave_rejected": return <CalendarX className={cls} />
    case "leave_pending": return <CalendarClock className={cls} />
    case "payroll": return <DollarSign className={cls} />
    case "contract": return <AlertCircle className={cls} />
    case "system": return <Info className={cls} />
    case "profile": return <FileText className={cls} />
    case "attendance": return <Clock className={cls} />
    default: return <Bell className={cls} />
  }
}

// ── PRIORITY BADGE ────────────────────────────────────────────────
function PriorityBadge({ priority }: { priority: TNotification["priority"] }) {
  const styles = {
    low: "bg-muted text-muted-foreground",
    urgent: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    medium: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    high: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  }
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${styles[priority]}`}>
      {priority}
    </span>
  )
}

// ── SHIMMER ───────────────────────────────────────────────────────
function NotificationsShimmer() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="border rounded-xl p-4 flex gap-4 items-start">
          <div className="shimmer w-10 h-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between">
              <div className="shimmer h-4 w-48 rounded-md" />
              <div className="shimmer h-3 w-20 rounded-md" />
            </div>
            <div className="shimmer h-3 w-full rounded-md" />
            <div className="shimmer h-3 w-3/4 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── NOTIFICATION CARD ─────────────────────────────────────────────
function NotificationCard({ notify }: { notify: TNotification }) {
  const navigate = useNavigate()
  const markAsRead = useMarkAsRead()
  const deleteNotify = useDeleteNotification()
  const config = getNotificationConfig(notify.type)

  const handleClick = () => {
    if (!notify.read) markAsRead.mutate(notify.id)
    if (notify.actionUrl) navigate(notify.actionUrl)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteNotify.mutate(notify.id)
  }

  return (
    <div
      onClick={handleClick}
      className={`
        group relative border rounded-xl p-4 flex gap-4 items-start
        transition-all duration-200 hover:bg-muted/30
        ${notify.actionUrl ? "cursor-pointer" : "cursor-default"}
        ${!notify.read ? `border-l-4 ${config.borderColor} bg-primary/3` : ""}
      `}
    >
      {/* ICON */}
      <div className={`p-2 rounded-full bg-muted shrink-0 ${config.color}`}>
        <NotifyIcon type={notify.type} />
      </div>

      {/* CONTENT */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm leading-snug ${!notify.read ? "font-semibold" : "font-medium"}`}>
            {notify.title}
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatTimeAgo(notify.createdAt)}
            </span>
            {!notify.read && (
              <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {notify.message}
        </p>

        <div className="flex items-center gap-2 pt-1">
          <PriorityBadge priority={notify.priority} />
        </div>
      </div>

      {/* DELETE BUTTON */}
      <button
        onClick={handleDelete}
        disabled={deleteNotify.isPending}
        className="
          absolute right-3 top-3 opacity-0 group-hover:opacity-100
          transition-opacity p-1 rounded-md hover:bg-destructive/10
          text-muted-foreground hover:text-destructive
        "
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}

// ── NOTIFICATIONS LIST ────────────────────────────────────────────
function NotificationsList() {
  const data = useNotifications("staff_2")
  const markAllRead = useMarkAllAsRead("staff_2")

  const notifications = data?.data ?? []
  const pagination = data?.pagination
  const unreadCount = pagination?.unreadCount ?? 0

  return (
    <div className="space-y-4">

      {/* HEADER */}
      <div className="flex items-start justify-between px-1">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
              : "All caught up!"}
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
          >
            {markAllRead.isPending ? "Marking..." : "Mark all as read"}
          </Button>
        )}
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total", value: pagination?.total ?? 0 },
          { label: "Unread", value: pagination?.unreadCount ?? 0 },
          { label: "Read", value: (pagination?.total ?? 0) - (pagination?.unreadCount ?? 0) },
        ].map(stat => (
          <div key={stat.label} className="border rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* LIST */}
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <Bell size={40} className="opacity-20" />
          <p className="text-sm">You have no notifications.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(notify => (
            <NotificationCard key={notify.id} notify={notify} />
          ))}
        </div>
      )}

    </div>
  )
}

// ── PAGE ──────────────────────────────────────────────────────────
export const Component = function EmployeeNotificationsPage() {
  return (
    <main className="flex-1 p-4 lg:p-6 overflow-auto">
      <QueryErrorBoundary>
        <Suspense fallback={<NotificationsShimmer />}>
          <NotificationsList />
        </Suspense>
      </QueryErrorBoundary>
    </main>
  )
}
