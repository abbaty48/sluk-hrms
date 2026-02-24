import { useAdminAttendanceDashboardStatsAPI } from "@/hooks/api/useAdminAttendance";
import { AdminAttendancePageStatsCardsSkeleton } from "./AdminAttendancePageSkeletons";
import { CircleAlert, Clock, Loader2, UserCheck, UserX } from "lucide-react";
import { QueryErrorBoundary } from "@/components/ErrorBoundary";
import { Card } from "@/components/ui/card";
import { Suspense } from "react";

export function AdminAttendancePageStats() {
    return <QueryErrorBoundary>
        <Suspense fallback={<AdminAttendancePageStatsCardsSkeleton />}>
            <DashboardStats />
        </Suspense>
    </QueryErrorBoundary>
}

export function DashboardStats() {

    const { data: stats, isLoading: statsLoading } = useAdminAttendanceDashboardStatsAPI();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {/* Present Today */}
            <Card className="p-4">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Present Today
                        </p>
                        <p className="mt-2 text-3xl font-bold text-card-foreground">
                            {statsLoading ? (
                                <Loader2 className="h-8 w-8 animate-spin" />
                            ) : (
                                stats?.presentToday || 0
                            )}
                        </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10 text-success">
                        <UserCheck className="h-6 w-6" />
                    </div>
                </div>
            </Card>

            {/* Absent */}
            <Card className="p-4">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Absent
                        </p>
                        <p className="mt-2 text-3xl font-bold text-card-foreground">
                            {statsLoading ? (
                                <Loader2 className="h-8 w-8 animate-spin" />
                            ) : (
                                stats?.absent || 0
                            )}
                        </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <UserX className="h-6 w-6" />
                    </div>
                </div>
            </Card>

            {/* Late Arrivals */}
            <Card className="p-4">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Late Arrivals
                        </p>
                        <p className="mt-2 text-3xl font-bold text-card-foreground">
                            {statsLoading ? (
                                <Loader2 className="h-8 w-8 animate-spin" />
                            ) : (
                                stats?.lateArrivals || 0
                            )}
                        </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                        <Clock className="h-6 w-6" />
                    </div>
                </div>
            </Card>

            {/* On Leave */}
            <Card className="p-4">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            On Leave
                        </p>
                        <p className="mt-2 text-3xl font-bold text-card-foreground">
                            {statsLoading ? (
                                <Loader2 className="h-8 w-8 animate-spin" />
                            ) : (
                                stats?.onLeave || 0
                            )}
                        </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <CircleAlert className="h-6 w-6" />
                    </div>
                </div>
            </Card>
        </div>
    )
}
