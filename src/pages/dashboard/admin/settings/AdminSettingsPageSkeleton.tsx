import { Card } from "@/components/ui/card";

export function SettingsPageSkeleton() {
  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header mb-6">
        <div className="h-8 w-32 bg-muted rounded shimmer mb-2" />
        <div className="h-4 w-64 bg-muted rounded shimmer" />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Skeleton */}
        <SettingsSidebarSkeleton />

        {/* Content Skeleton */}
        <div className="flex-1 min-w-0">
          <PreferencesTabSkeleton />
        </div>
      </div>
    </div>
  );
}

export function SettingsSidebarSkeleton() {
  return (
    <Card className="stats-card lg:w-64 shrink-0 p-2">
      <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2.5">
            <div className="h-4 w-4 bg-muted rounded shimmer" />
            <div className="h-4 w-24 bg-muted rounded shimmer" />
          </div>
        ))}
      </nav>
    </Card>
  );
}

export function PreferencesTabSkeleton() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-6 w-32 bg-muted rounded shimmer mb-2" />
          <div className="h-4 w-64 bg-muted rounded shimmer" />
        </div>
        <div className="h-9 w-32 bg-muted rounded-md shimmer" />
      </div>

      {/* Content Cards */}
      <div className="space-y-6">
        {/* Institution Details Card */}
        <Card className="stats-card p-6">
          <div className="h-5 w-40 bg-muted rounded shimmer mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-32 bg-muted rounded shimmer" />
                <div className="h-10 w-full bg-muted rounded-md shimmer" />
              </div>
            ))}
          </div>
        </Card>

        {/* System Configuration Card */}
        <Card className="stats-card p-6">
          <div className="h-5 w-48 bg-muted rounded shimmer mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-32 bg-muted rounded shimmer" />
                <div className="h-10 w-full bg-muted rounded-md shimmer" />
              </div>
            ))}
          </div>
        </Card>

        {/* Notifications Card */}
        <Card className="stats-card p-6">
          <div className="h-5 w-32 bg-muted rounded shimmer mb-4" />
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 w-40 bg-muted rounded shimmer mb-2" />
                  <div className="h-3 w-64 bg-muted rounded shimmer" />
                </div>
                <div className="h-6 w-11 bg-muted rounded-full shimmer" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function DepartmentsTabSkeleton() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Units/Departments
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage organizational units and departments
          </p>
        </div>
        <div className="h-9 w-40 bg-muted rounded-md shimmer" />
      </div>

      {/* Table */}
      <Card className="stats-card overflow-hidden">
        {/* Table Header */}
        <div className="border-b border-border p-4">
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 w-24 bg-muted rounded shimmer" />
            ))}
          </div>
        </div>

        {/* Table Rows */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="border-b border-border p-4 last:border-b-0">
            <div className="grid grid-cols-4 gap-4 items-center">
              <div className="h-4 w-full bg-muted rounded shimmer" />
              <div className="h-4 w-full bg-muted rounded shimmer" />
              <div className="h-4 w-20 bg-muted rounded shimmer" />
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-muted rounded shimmer" />
                <div className="h-8 w-8 bg-muted rounded shimmer" />
              </div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

export function ListTabSkeleton() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-6 w-32 bg-muted rounded shimmer mb-2" />
          <div className="h-4 w-64 bg-muted rounded shimmer" />
        </div>
        <div className="h-9 w-32 bg-muted rounded-md shimmer" />
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="stats-card p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="h-5 w-32 bg-muted rounded shimmer" />
              <div className="h-6 w-6 bg-muted rounded shimmer" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted rounded shimmer" />
              <div className="h-4 w-3/4 bg-muted rounded shimmer" />
            </div>
            <div className="mt-4 flex gap-2">
              <div className="h-8 w-16 bg-muted rounded shimmer" />
              <div className="h-8 w-16 bg-muted rounded shimmer" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-9 px-4 text-sm font-medium hover:bg-primary/90"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
