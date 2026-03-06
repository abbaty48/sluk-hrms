import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLeaveBalancesAPI } from "@/hooks/api/useEmployeeLeaveAPI";
import { QueryErrorBoundary } from "@/components/ErrorBoundary";
import { Suspense } from "react";

function LeaveBalanceShimmer() {
  return (
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
  );
}

function LeaveBalance() {
  const data = useLeaveBalancesAPI("staff_2");
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 px-2">
      {data.map((b) => {
        const percent = (b.used / b.allowed) * 100;

        return (
          <Card key={b.leaveTypeId}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase text-muted-foreground">
                {b.name}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">{b.remaining}</span>
                <span className="text-muted-foreground text-sm">
                  / {b.allowed} days
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>

              <p className="text-xs text-muted-foreground">
                {b.used} days used
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export function EmployeeLeavePageBalance() {
  return (
    <QueryErrorBoundary>
      <Suspense fallback={<LeaveBalanceShimmer />}>
        <LeaveBalance />
      </Suspense>
    </QueryErrorBoundary>
  );
}
