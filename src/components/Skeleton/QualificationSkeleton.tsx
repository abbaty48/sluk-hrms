export  function QualificationsSkeleton() {
  return (
    <div className="m-4">
      <div className="bg-card border border-border rounded-xl p-6 space-y-6 animate-pulse">

        {/* HEADER */}
        <div className="h-6 w-48 bg-muted shimmer rounded-md"></div>

        {/* 3 placeholder qualification cards */}
        <div className="space-y-4 mt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-lg border bg-background"
            >
              {/* ICON */}
              <div className="p-3 rounded-lg bg-muted shimmer w-8 h-8"></div>

              {/* TEXT */}
              <div className="flex-1 space-y-1">
                <div className="h-4 w-32 bg-muted shimmer rounded-md"></div> {/* Degree */}
                <div className="h-3 w-28 bg-muted shimmer rounded-md"></div> {/* Institution */}
                <div className="h-2 w-20 bg-muted shimmer rounded-md"></div> {/* Year */}
              </div>

              {/* BADGE */}
              <div className="h-5 w-16 bg-muted shimmer rounded-full"></div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}