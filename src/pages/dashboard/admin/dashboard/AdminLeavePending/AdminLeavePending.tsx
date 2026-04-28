import {
  X,
  Check,
  ArrowRight,
  LoaderPinwheel,
  LucideMoreHorizontal,
} from "lucide-react";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { QueryErrorBoundary } from "@/components/ErrorBoundary";
import type { TLeavePending } from "@/types/leave-managementTypes";
import { CardContent, CardHeader, Card } from "@/components/ui/card";
import { useAdminLeavePendingHook } from "./useAdminLeavePendingHook";

function ShimmerCard() {
  return <Card className="shimmer h-16 w-full rounded"></Card>;
}

function Shimmers() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_i, index) => (
        <ShimmerCard key={index} />
      ))}
    </div>
  );
}

export function AdminLeavePending() {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <h3 className="text-sm font-semibold text-card-foreground">
          Pending Approvals
        </h3>
      </CardHeader>
      <CardContent className=" space-y-1">
        <QueryErrorBoundary>
          <Suspense fallback={<Shimmers />}>
            <PendingLeavesList />
          </Suspense>
        </QueryErrorBoundary>
      </CardContent>
    </Card>
  );
}

function PendingLeavesList({ departmentId }: { departmentId?: string }) {
  const {
    optimisticData,
    handleApprove,
    handleReject,
    hasNextPage,
    isPending,
    fetchNextPage,
    isFetchingNextPage,
  } = useAdminLeavePendingHook(departmentId);

  return (
    <div className="space-y-4">
      <div className="space-y-4 min-h-[50vh] max-h-60 overflow-hidden overflow-y-auto">
        {optimisticData.map((leave: TLeavePending) => (
          <article
            key={leave.id}
            className="relative flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-card-foreground truncate">
                {leave.staff.name}
              </p>
              <p className="text-xs text-muted-foreground flex flex-col">
                <span className="absolute top-2 right-2 rounded border p-1 bg-primary text-primary-foreground font-bold text-xs">
                  {leave.leaveType}
                </span>
                <span>
                  {Intl.DateTimeFormat("en-CA", { dateStyle: "full" }).format(
                    new Date(leave.startDate),
                  )}{" "}
                </span>
                <span className="flex items-center gap-1">
                  to <ArrowRight size={"1em"} color="green" />
                </span>
                <span>
                  {Intl.DateTimeFormat("en-CA", { dateStyle: "full" }).format(
                    new Date(leave.endDate),
                  )}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-1.5 ml-3">
              <button
                onClick={() => handleApprove(leave.id)}
                className="inline-flex items-center justify-center gap-2
                    whitespace-nowrap rounded-md text-sm font-medium ring-offset-background
                    transition-colors focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none
                    disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 h-7 w-7
                    text-success hover:bg-success/10 hover:text-success"
              >
                <Check className="stroke-success!" size={15} />
              </button>
              <button
                disabled={isPending}
                onClick={() => handleReject(leave.id)}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap
                    rounded-md text-sm font-medium ring-offset-background transition-colors
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                    disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0
                    h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="stroke-destructive!" size={15} />
              </button>
            </div>
          </article>
        ))}
      </div>
      <div className="flex items-center justify-between">
        {/**/}
        {hasNextPage && (
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="flex flex-col gap-0 py-4 text-xs cursor-pointer"
          >
            {isFetchingNextPage ? (
              <>
                <LoaderPinwheel className="animate-spin" />
                <span>Loading more...</span>
              </>
            ) : (
              <>
                <LucideMoreHorizontal />
                <span>Load More</span>
              </>
            )}
          </Button>
        )}
        {/**/}
        <span className="absolute right-5 top-6">
          ({optimisticData.length})
        </span>
      </div>
    </div>
  );
}
