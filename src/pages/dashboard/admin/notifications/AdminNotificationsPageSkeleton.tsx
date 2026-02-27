import { Card } from "@/components/ui/card";

export function NotificationsPageSkeleton({ row }: { row?: number }) {
  return (
    <div className="p-5">
      {/* Page Header */}
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="space-y-2">
          <h2 className="page-title">Notifications </h2>
          <div className="h-4 w-40 bg-muted rounded shimmer" />
        </div>
        <div className="h-9 w-40 bg-muted rounded-md shimmer" />
      </div>

      {/* Notification Items */}
      <div className="space-y-3">
        {Array.from({ length: row ?? 5 }).map((_, i) => (
          <NotificationItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function NotificationItemSkeleton() {
  return (
    <Card className="flex flex-row items-start gap-4 p-4 border-l-4 border-l-muted">
      {/* Icon */}
      <div className="mt-0.5">
        <div className="h-6 w-6 bg-muted rounded-full shimmer" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="h-5 w-48 bg-muted rounded shimmer" />
          <div className="h-4 w-24 bg-muted rounded shimmer" />
        </div>
        <div className="space-y-1">
          <div className="h-4 w-full bg-muted rounded shimmer" />
          <div className="flex gap-4">
            <div className="h-4 w-18 bg-muted rounded shimmer" />
            <div className="h-4 w-10 bg-muted rounded shimmer" />
          </div>
        </div>
      </div>

      {/* Unread indicator placeholder */}
      <div className="h-2 w-2 mt-2 shrink-0" />
    </Card>
  );
}

// Compact version for dropdown/popover
export function NotificationDropdownSkeleton() {
  return (
    <div className="space-y-2 p-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-start gap-3 p-2">
          <div className="h-4 w-4 bg-muted rounded-full shimmer" />
          <div className="flex-1 space-y-1">
            <div className="h-3 w-32 bg-muted rounded shimmer" />
            <div className="h-3 w-24 bg-muted rounded shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Single notification skeleton
export function SingleNotificationSkeleton() {
  return (
    <div className="stats-card flex items-start gap-4 p-4">
      <div className="h-5 w-5 bg-muted rounded-full shimmer" />
      <div className="flex-1 space-y-2">
        <div className="h-5 w-40 bg-muted rounded shimmer" />
        <div className="h-4 w-full bg-muted rounded shimmer" />
        <div className="h-4 w-2/3 bg-muted rounded shimmer" />
        <div className="h-3 w-20 bg-muted rounded shimmer" />
      </div>
    </div>
  );
}

// Empty state
export function NotificationsEmptyState() {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8 text-muted-foreground"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold mb-2">No notifications</h3>
      <p className="text-sm text-muted-foreground">
        You're all caught up! Check back later for updates.
      </p>
    </div>
  );
}
