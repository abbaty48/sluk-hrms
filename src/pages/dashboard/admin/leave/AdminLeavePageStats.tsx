import { QueryErrorBoundary } from "@sluk/src/components/ErrorBoundary";
import { useLeaveStatsAPI } from "@sluk/src/hooks/api/useAdminLeave";
import { Card } from "@sluk/src/components/ui/card";
import { CalendarDays } from "lucide-react";
import { Suspense } from "react";

export function AdminLeavePageStats() {
    return (
        <QueryErrorBoundary>
            <Suspense fallback={<LeaveStatsCardsSkeletonGrid />}>
                <LeaveStats />
            </Suspense>
        </QueryErrorBoundary>
    )
}

function LeaveStats() {

    const stats = useLeaveStatsAPI()

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <CalendarDays className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-card-foreground">
                            {stats?.total || 0}
                        </p>
                        <p className="text-xs text-muted-foreground">Total Requests</p>
                    </div>
                </div>
            </Card>

            <Card className="p-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
                        <CalendarDays className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-card-foreground">
                            {stats?.approved || 0}
                        </p>
                        <p className="text-xs text-muted-foreground">Approved</p>
                    </div>
                </div>
            </Card>

            <Card className="p-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
                        <CalendarDays className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-card-foreground">
                            {stats?.pending || 0}
                        </p>
                        <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                </div>
            </Card>

            <Card className="p-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                        <CalendarDays className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-card-foreground">
                            {stats?.rejected || 0}
                        </p>
                        <p className="text-xs text-muted-foreground">Rejected</p>
                    </div>
                </div>
            </Card>
        </div>
    )
}


export function LeaveStatsCardsSkeletonGrid() {
    function LeaveStatsCardSkeleton() {
        return (
            <Card className="p-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted shimmer" />
                    <div className="flex-1 space-y-2">
                        <div className="h-7 w-16 bg-muted rounded shimmer" />
                        <div className="h-3 w-20 bg-muted rounded shimmer" />
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <LeaveStatsCardSkeleton />
            <LeaveStatsCardSkeleton />
            <LeaveStatsCardSkeleton />
            <LeaveStatsCardSkeleton />
        </div>
    );
}
