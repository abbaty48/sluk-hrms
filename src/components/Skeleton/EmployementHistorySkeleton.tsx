

export   function EmploymentHistorySkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-6 animate-pulse">

      {/* HEADER */}
      <div className="h-6 w-48 bg-muted shimmer rounded-md"></div>

      {/* TIMELINE SKELETON */}
      <div className="relative border-l pl-6 space-y-8 mt-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="relative">

            {/* ICON */}
            <div className="absolute -left-[39px] top-1 p-2 rounded-lg bg-muted shimmer w-8 h-8"></div>

            {/* CONTENT */}
            <div className="flex justify-between gap-4">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-muted shimmer rounded-md"></div> {/* Position */}
                <div className="h-3 w-24 bg-muted shimmer rounded-md"></div> {/* Department */}
                <div className="h-3 w-28 bg-muted shimmer rounded-md"></div> {/* Dates */}
              </div>

              {/* Current badge placeholder */}
              <div className="h-5 w-16 bg-muted shimmer rounded-full"></div>
            </div>
          </div>
        ))}
      </div>

      {/* BUTTON SKELETON */}
      <div className="h-10 w-full bg-muted shimmer rounded-lg mt-2"></div>
    </div>
  )
}