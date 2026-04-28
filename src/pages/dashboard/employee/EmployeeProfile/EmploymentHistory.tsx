import { Suspense, useState } from "react";
import { Briefcase, LucideHistory } from "lucide-react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { useEmploymentHistory } from "@sluk/src/hooks/api/useEmployeeAPI";
import { Card, CardContent, CardHeader } from "@sluk/src/components/ui/card";
import { EmploymentHistorySkeleton } from "@/pages/dashboard/employee/skeletons/EmploymentHistorySkeleton";
import { Paginator } from "@sluk/src/components/Paginator";
import { EmptyState } from "@sluk/src/components/EmptyState";

export default function EmploymentHistory() {
  return (
    <QueryErrorResetBoundary>
      <Suspense fallback={<EmploymentHistorySkeleton />}>
        <History />
      </Suspense>
    </QueryErrorResetBoundary>
  );
}

function History() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const { data: history, pagination } = useEmploymentHistory({ page, limit });

  if (history.length <= 0 && pagination?.totalPages === 0) {
    return (
      <EmptyState
        description="Lucky you, no history for you now."
        title="No Employment History"
        icon={LucideHistory}
      />
    );
  }

  return (
    <Card className="space-y-6 p-2">
      {/* HEADER */}
      <CardHeader>
        <h2 className="text-lg font-semibold">Employment History</h2>
      </CardHeader>

      {/* TIMELINE */}
      <CardContent className="relative border-l pl-6 space-y-8">
        {history.map((job) => (
          <div key={job.id} className="relative">
            {/* ICON */}
            <div
              className={`absolute -left-9.75 top-1 p-2 rounded-lg ${
                job.isActive
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Briefcase className="w-5 h-5 " />
            </div>

            {/* CONTENT */}
            <div className="flex justify-between gap-4">
              <div>
                <p className="font-medium">{job.position}</p>
                <p className="text-sm text-primary">{job.department}</p>

                <p className="text-xs text-muted-foreground">
                  {job.startDate} — {job.endDate || "Present"}
                </p>
              </div>

              {job.isActive && (
                <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full h-fit">
                  Current
                </span>
              )}
            </div>
          </div>
        ))}
      </CardContent>

      {/* PAGINATION */}
      {pagination && history.length > 0 && (
        <Paginator
          isFetching
          currentPage={page}
          totalPages={pagination.totalPages}
          hasNextPage={pagination.hasNextPage}
          hasPreviousPage={pagination.hasPrevPage}
          fetchNextPage={() =>
            setPage((prev) => (prev < pagination.totalPages ? page + 1 : page))
          }
          fetchPreviousPage={() =>
            setPage((prev) => (prev <= 0 ? 0 : page - 1))
          }
          onRowsPerPageChange={(val) => setLimit(+val)}
        />
      )}
    </Card>
  );
}
