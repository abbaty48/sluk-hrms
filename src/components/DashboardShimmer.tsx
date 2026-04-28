import { Card, CardContent } from "@/components/ui/card";

export function StatCardShimmer() {
  return (
    <Card>
      <CardContent className="flex items-start justify-between">
        <div className="w-full">
          {/* title */}
          <div className="h-4 w-24 rounded shimmer" />

          {/* main number */}
          <div className="mt-2 h-8 w-32 rounded shimmer" />

          {/* trend row */}
          <div className="mt-2 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full shimmer" />
            <div className="h-3 w-10 rounded shimmer" />
            <div className="h-3 w-20 rounded shimmer" />
          </div>
        </div>

        {/* right icon circle */}
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
          <div className="h-6 w-6 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}
export function StatsShimmerGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <StatCardShimmer />
      <StatCardShimmer />
      <StatCardShimmer />
      <StatCardShimmer />
    </div>
  );
}
