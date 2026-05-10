import { Card } from "@sluk/src/components/ui/card";

export function ASSharedSkeleton() {
  return (
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
  );
}
