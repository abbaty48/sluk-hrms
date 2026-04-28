import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLeaveHistoryAPI } from "@/hooks/api/useEmployeeLeaveAPI";
import { QueryErrorBoundary } from "@/components/ErrorBoundary";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { Paginator } from "@/components/Paginator";
import { formatDate } from "@sluk/src/lib/utils";
import { Suspense, useState } from "react";

/**
 *
 */
function EmployeeLeaveShimmer() {
  return (
    <>
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

      <div className="flex items-center justify-between">
        <div className="h-10 w-50 rounded shimmer mb-4" />
        <div className="h-10 w-70 rounded shimmer mb-4" />
      </div>
    </>
  );
}
/**
 *
 */
function statusColor(status: string) {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
    case "PENDING":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "REJECTED":
      return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-muted text-muted-foreground";
  }
}
/**
 *
 */
function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "APPROVED":
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    case "PENDING":
      return <Clock className="w-5 h-5 text-yellow-500" />;
    case "REJECTED":
      return <XCircle className="w-5 h-5 text-red-600" />;
    default:
      return null;
  }
}
/**
 *
 */
function EmployeeLeaves() {
  const [key, setKey] = useState(1);
  const [limit, setLimit] = useState("5");
  const { data, pagination, isFetching, fetchNextPage, fetchPreviousPage } =
    useLeaveHistoryAPI({
      key,
      limit,
    });

  return (
    <>
      {data.map((l) => (
        <div
          key={l.id}
          className="flex justify-between items-center bg-muted/40 rounded-lg p-4"
        >
          <div className="flex gap-4 items-start">
            <div className="p-3 rounded-xl bg-background border flex items-center justify-center">
              <StatusIcon status={l.status} />
            </div>

            <div>
              <p className="font-medium">{l.reason}</p>

              <p className="text-sm text-primary">
                {formatDate(new Date(l.startDate))} →{" "}
                {formatDate(new Date(l.endDate))} · {l.totalDays} days
              </p>

              {l.approver ? (
                <p className="text-xs text-muted-foreground mt-1">
                  Approve by {l.approver?.name} - {l.approver?.rank}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground mt-1">
                  {l.status === "PENDING" ? "Not approved yet." : "N/A"}
                </p>
              )}
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(
              l.status,
            )}`}
          >
            {l.status}
          </span>
        </div>
      ))}

      {pagination && (
        <Paginator
          isFetching={isFetching}
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          hasNextPage={pagination.hasNextPage}
          hasPreviousPage={pagination.hasPrevPage}
          onRowsPerPageChange={(limit) => setLimit(limit)}
          fetchNextPage={() => {
            fetchNextPage();
            setKey(key + 1);
          }}
          fetchPreviousPage={() => {
            fetchPreviousPage();
            setKey(key - 1);
          }}
        />
      )}
    </>
  );
}

export function EmployeeLeavePageHistory() {
  return (
    <Card className="mx-2">
      <CardHeader>
        <CardTitle>Leave History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <QueryErrorBoundary>
          <Suspense fallback={<EmployeeLeaveShimmer />}>
            <EmployeeLeaves />
          </Suspense>
        </QueryErrorBoundary>
      </CardContent>
    </Card>
  );
}
