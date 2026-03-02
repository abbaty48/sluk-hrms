export function EmployeeDashboardSkeleton() {
  return (
    <div className="space-y-6 p-4">

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full shimmer" />
        <div className="space-y-2">
          <div className="h-4 w-40 rounded shimmer" />
          <div className="h-3 w-24 rounded shimmer" />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((card) => (
          <div
            key={card}
            className="p-6 rounded-lg border bg-card space-y-4"
          >
            <div className="h-4 w-24 rounded shimmer" />
            <div className="h-8 w-20 rounded shimmer" />
            <div className="h-3 w-16 rounded shimmer" />
          </div>
        ))}
      </div>

      {/* Recent Leaves */}
      <div className="p-6 rounded-lg border bg-card space-y-4">
        {[1, 2, 3, 4].map((row) => (
          <div
            key={row}
            className="flex justify-between items-center"
          >
            <div className="space-y-2">
              <div className="h-4 w-32 rounded shimmer" />
              <div className="h-3 w-24 rounded shimmer" />
            </div>
            <div className="h-6 w-20 rounded-full shimmer" />
          </div>
        ))}
      </div>

    </div>
  );
}
