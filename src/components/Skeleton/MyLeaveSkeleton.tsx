import { Card, CardContent, CardHeader } from "@/components/ui/card"
export function LeaveBalanceSkeleton() {
  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between px-2">
        <div className="space-y-2">
          <div className="h-6 w-32 rounded-md shimmer" />
          <div className="h-4 w-64 rounded-md shimmer" />
        </div>

        <div className="h-9 w-28 rounded-lg shimmer" />
      </div>

      {/* BALANCE CARDS */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 px-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border rounded-xl p-6 space-y-4">
            <div className="h-4 w-24 rounded shimmer" />
            <div className="h-8 w-20 rounded shimmer" />
            <div className="h-2 w-full rounded-full shimmer" />
            <div className="h-3 w-20 rounded shimmer" />
          </div>
        ))}
      </div>

      {/* HISTORY */}
      <div className="mx-2 border rounded-xl p-6 space-y-4">
        <div className="h-5 w-40 rounded shimmer mb-4" />

        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex justify-between items-center bg-muted/40 rounded-lg p-4"
          >
            <div className="flex gap-4 items-center">
              <div className="h-12 w-12 rounded-xl shimmer" />
              <div className="space-y-2">
                <div className="h-4 w-40 rounded shimmer" />
                <div className="h-3 w-32 rounded shimmer" />
              </div>
            </div>

            <div className="h-6 w-20 rounded-full shimmer" />
          </div>
        ))}
      </div>

    </div>
  )
}


export function LeaveHistorySkeleton() {
  return (
    <Card className="mx-2">
      <CardHeader>
        <div className="shimmer h-5 w-28 rounded-md" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex justify-between items-center bg-muted/40 rounded-lg p-4">
            <div className="flex gap-4 items-start">
              <div className="shimmer w-11 h-11 rounded-xl" />
              <div className="space-y-2">
                <div className="shimmer h-4 w-40 rounded-md" />
                <div className="shimmer h-3 w-56 rounded-md" />
                <div className="shimmer h-3 w-24 rounded-md" />
              </div>
            </div>
            <div className="shimmer h-6 w-20 rounded-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
