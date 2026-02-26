import { Card } from "@/components/ui/card";
import { memo } from "react";

export const AdminReportPageSkeletonReportsAnalyticsPage = memo(() => {
    return (
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <div className="animate-fade-in">
                {/* Page Header */}
                <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                    <div className="space-y-2">
                        <div className="h-8 w-64 bg-muted rounded shimmer" />
                        <div className="h-4 w-96 bg-muted rounded shimmer" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-9 w-32 bg-muted rounded-md shimmer" />
                        <div className="h-9 w-32 bg-muted rounded-md shimmer" />
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
                    <div className="h-10 w-32 bg-muted rounded-lg shimmer" />
                    <div className="h-10 w-32 bg-muted rounded-lg shimmer" />
                    <div className="h-10 w-32 bg-muted rounded-lg shimmer" />
                    <div className="h-10 w-36 bg-muted rounded-lg shimmer" />
                </div>

                {/* Filter Controls */}
                <Card className="mb-6 p-4">
                    <div className="flex flex-col sm:flex-row gap-3 items-end">
                        <div className="space-y-1.5 flex-1">
                            <div className="h-3 w-20 bg-muted rounded shimmer" />
                            <div className="h-10 w-full bg-muted rounded-md shimmer" />
                        </div>
                        <div className="space-y-1.5">
                            <div className="h-3 w-12 bg-muted rounded shimmer" />
                            <div className="h-10 w-32 bg-muted rounded-md shimmer" />
                        </div>
                        <div className="space-y-1.5">
                            <div className="h-3 w-12 bg-muted rounded shimmer" />
                            <div className="h-10 w-40 bg-muted rounded-md shimmer" />
                        </div>
                        <div className="space-y-1.5">
                            <div className="h-3 w-8 bg-muted rounded shimmer" />
                            <div className="h-10 w-40 bg-muted rounded-md shimmer" />
                        </div>
                        <div className="h-9 w-24 bg-muted rounded-md shimmer" />
                    </div>
                </Card>

                {/* First Row - Two Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Staff Strength Chart */}
                    <Card className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-5 w-48 bg-muted rounded shimmer" />
                            <div className="h-9 w-24 bg-muted rounded-md shimmer" />
                        </div>
                        <div className="h-75 bg-muted rounded-lg shimmer" />
                    </Card>

                    {/* Staff by Category (Pie Chart) */}
                    <Card className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-5 w-40 bg-muted rounded shimmer" />
                            <div className="h-9 w-24 bg-muted rounded-md shimmer" />
                        </div>
                        <div className="h-75 flex items-center justify-center">
                            <div className="w-48 h-48 bg-muted rounded-full shimmer" />
                        </div>
                    </Card>
                </div>

                {/* Staff by Department Chart */}
                <Card className="mb-6 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-5 w-44 bg-muted rounded shimmer" />
                        <div className="h-9 w-24 bg-muted rounded-md shimmer" />
                    </div>
                    <div className="h-70 bg-muted rounded-lg shimmer" />
                </Card>

                {/* Monthly Leave Usage Chart */}
                <Card className="mb-6 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-5 w-44 bg-muted rounded shimmer" />
                        <div className="h-9 w-24 bg-muted rounded-md shimmer" />
                    </div>
                    <div className="h-75 bg-muted rounded-lg shimmer" />
                </Card>

                {/* Payroll Breakdown Chart */}
                <Card className="mb-6 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-5 w-52 bg-muted rounded shimmer" />
                        <div className="h-9 w-24 bg-muted rounded-md shimmer" />
                    </div>
                    <div className="h-80 bg-muted rounded-lg shimmer" />
                </Card>
            </div>
        </main>
    );
})

// Compact version for faster loading
export const AdminReportPageSkeletonReportsAnalyticsCompactPage = memo(() => {
    return (
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <div className="space-y-4">
                {/* Header Skeleton */}
                <div className="space-y-2">
                    <div className="h-8 w-64 bg-muted rounded shimmer" />
                    <div className="h-4 w-96 bg-muted rounded shimmer" />
                </div>

                {/* Filters Skeleton */}
                <div className="flex gap-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-10 w-32 bg-muted rounded-lg shimmer" />
                    ))}
                </div>

                {/* Charts Grid Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="p-4">
                            <div className="h-5 w-40 bg-muted rounded shimmer mb-4" />
                            <div className="h-48 bg-muted rounded-lg shimmer" />
                        </Card>
                    ))}
                </div>
            </div>
        </main>
    );
})

// Individual chart skeleton components
export const AdminReportPageSkeletonChartCard = memo(({ height = 300 }: { height?: number }) => {
    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="h-5 w-48 bg-muted rounded-md shimmer" />
                <div className="h-9 w-24 bg-muted rounded-md shimmer" />
            </div>
            <div className={`h-[${height}px] bg-muted rounded-lg shimmer`} />
        </div>
    );
})
export const AdminReportPageSkeletonMonthlyChartCard = memo(({ height = 300 }: { height?: number }) => {
    return (
        <div className="p-4">
            <div className={`h-[${height}px] bg-muted rounded-lg shimmer`} />
        </div>
    );
})

export const AdminReportPageSkeletonPieChartCard = memo(() => {
    return (
        <div className="h-75 flex items-center justify-center">
            <div className="w-48 h-48 bg-muted rounded-full shimmer" />
        </div>
    );
})
