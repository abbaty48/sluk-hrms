export function EmployeeAppointmentSkeleton() {
  return (
    <div className="m-4 grid md:grid-cols-2 gap-6">
      {/* CURRENT POSITION Skeleton */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-6 animate-pulse">
        <div className="h-6 w-48 bg-muted shimmer rounded-md"></div>{" "}
        {/* Header */}
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-muted shimmer w-8 h-8"></div>
              <div className="flex-1 space-y-1">
                <div className="h-3 w-24 bg-muted shimmer rounded-md"></div>{" "}
                {/* Label */}
                <div className="h-4 w-32 bg-muted shimmer rounded-md"></div>{" "}
                {/* Value */}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DEPARTMENT & DATES Skeleton */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-6 animate-pulse">
        <div className="h-6 w-48 bg-muted shimmer rounded-md"></div>{" "}
        {/* Header */}
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-muted shimmer w-8 h-8"></div>
              <div className="flex-1 space-y-1">
                <div className="h-3 w-24 bg-muted shimmer rounded-md"></div>{" "}
                {/* Label */}
                <div className="h-4 w-32 bg-muted shimmer rounded-md"></div>{" "}
                {/* Value */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
