export function AdminEmployeeTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="stats-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                Employee
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                Department
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                Role
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                Status
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">
                Join Date
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                Contact
              </th>
              <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4"></th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: rows }).map((_, index) => (
              <tr key={index} className="border-b border-border last:border-0">
                {/* Employee Column */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-full shimmer" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3.5 w-32 shimmer" />
                      <Skeleton className="h-3 w-40 shimmer" />
                    </div>
                  </div>
                </td>

                <td className="py-3 px-4 hidden md:table-cell">
                  <Skeleton className="h-3.5 w-24 shimmer" />
                </td>

                <td className="py-3 px-4 hidden lg:table-cell">
                  <Skeleton className="h-3.5 w-28 shimmer" />
                </td>

                <td className="py-3 px-4">
                  <Skeleton className="h-6 w-16 rounded-full shimmer" />
                </td>

                <td className="py-3 px-4 hidden xl:table-cell">
                  <Skeleton className="h-3.5 w-28 shimmer" />
                </td>

                <td className="py-3 px-4 hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-7 w-7 shimmer" />
                    <Skeleton className="h-7 w-7 shimmer" />
                  </div>
                </td>

                <td className="py-3 px-4 text-right">
                  <Skeleton className="h-7 w-7 ml-auto animate-pulse shimmer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Skeleton component with shimmer effect
function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-muted ${className}`}>
      <div className="absolute inset-0 shimmer" />
    </div>
  );
}
