import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Skeleton for Stats Cards
export function AdminAttendancePageStatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-12 w-12 rounded-lg" />
          </div>
        </Card>
      ))}
    </div>
  );
}

// Skeleton for Chart
export function AdminAttendancePageChartSkeleton() {
  return (
    <Card className="p-4 mb-6">
      <Skeleton className="h-5 w-48 mb-4" />
      <div className="space-y-3">
        {/* Chart bars simulation */}
        <div className="flex items-end justify-between gap-8 h-62.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <Skeleton
                className="w-full rounded-t-lg"
                style={{ height: `${Math.random() * 150 + 100}px` }}
              />
              <Skeleton className="h-3 w-8" />
            </div>
          ))}
        </div>
        {/* Legend */}
        <div className="flex justify-center gap-4 pt-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </Card>
  );
}

// Skeleton for Table
export function AdminAttendancePageTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <Card className="overflow-hidden">
      <div className="p-4">
        <Skeleton className="h-5 w-48 mb-4" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4">
                <Skeleton className="h-4 w-20" />
              </th>
              <th className="text-left py-3 px-4 hidden md:table-cell">
                <Skeleton className="h-4 w-24" />
              </th>
              <th className="text-left py-3 px-4">
                <Skeleton className="h-4 w-16" />
              </th>
              <th className="text-left py-3 px-4">
                <Skeleton className="h-4 w-16" />
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, index) => (
              <tr
                key={index}
                className="border-b border-border last:border-0"
              >
                <td className="py-3 px-4">
                  <Skeleton className="h-4 w-32" />
                </td>
                <td className="py-3 px-4 hidden md:table-cell">
                  <Skeleton className="h-4 w-24" />
                </td>
                <td className="py-3 px-4">
                  <Skeleton className="h-4 w-16" />
                </td>
                <td className="py-3 px-4">
                  <Skeleton className="h-6 w-16 rounded-full" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
