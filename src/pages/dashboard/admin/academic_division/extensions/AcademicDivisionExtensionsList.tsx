import type {
  TExtensionRequest,
  TExtensionRequestStatus,
} from "@/types/academicDivisionTypes";
import {
  useExtensionRequestList,
  useExtensionRequestStatus,
} from "@/hooks/api/useAcademicDivisionAPI";
import type { ErrorResponseType } from "@sluk/src/types/errorResponseType";
import { QueryErrorBoundary } from "@/components/ErrorBoundary";
import { ArrowRight, Check, RefreshCw, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Paginator } from "@/components/Paginator";
import { useNavigate } from "react-router-dom";
import { dateFromString } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Suspense, useState } from "react";
import { toast } from "sonner";

type Props = {
  status: TExtensionRequestStatus | "null";
};

function TableRow({
  reason,
  status,
  duration,
  extension,
  durationMonths,
  id: extensionId,
  staff: { id, department, firstName, lastName },
}: TExtensionRequest) {
  const navigate = useNavigate();
  const { mutateAsync: changeStatusAync, isPending } =
    useExtensionRequestStatus();

  const handleStatus = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    status: TExtensionRequestStatus,
  ) => {
    try {
      e.stopPropagation();
      changeStatusAync({ id: extensionId, status });
      toast.success(status === "Approved" ? `Approved` : "Rejected");
    } catch (err) {
      const error = err as ErrorResponseType;
      toast.error(error.errorTitle, { description: error.errorMessage });
    }
  };

  const handleNavigation = (id: string) => {
    navigate(`/admin/employees/${id}/profile`);
  };

  return (
    <tr
      key={`${id}`}
      onClick={() => handleNavigation(id)}
      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors hover:cursor-pointer"
    >
      {/* NAME */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <span className="relative flex shrink-0 overflow-hidden rounded-full h-9 w-9">
            <span className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
              {/*{staff.}*/}
              {[firstName, lastName]
                .join(" ")
                .split(" ")
                .map((namePart, index) => (
                  <span key={index}>{namePart[0]?.toUpperCase()}</span>
                ))}
            </span>
          </span>
          <div>
            <p className="text-sm font-medium text-card-foreground">
              {firstName} {lastName}
            </p>
            <p className="text-xs text-muted-foreground">
              {"Faculty"}-{department}
            </p>
          </div>
        </div>
      </td>
      {/* EXTENSION*/}
      <td className="py-3 px-4 hidden lg:table-cell">
        <span className="text-xs block px-1.5 py-1 rounded-full bg-cyan-950 w-fit">
          {extension}
        </span>
        <span className="text-sm text-muted-foreground text-ellipsis">
          {reason}
        </span>
        {}
      </td>
      {/* DURATION */}
      <td className="py-3 px-4 hidden lg:table-cell">
        {durationMonths} Months
      </td>
      {/* NEW END DATE*/}
      <td className="py-3 px-4">
        {dateFromString<string>(new Date(duration.startDate))}
        <ArrowRight size={10} />
        <span className="text-amber-800">
          {dateFromString<string>(new Date(duration.endDate))}
        </span>
      </td>
      {/* STATUS */}
      <td className="py-3 px-4">
        <span className="status-badge status-approved">{status}</span>
      </td>
      {/* ACTION*/}
      <td className="py-3 px-4">
        {status === "Pending" ? (
          <div className="flex items-center gap-1.5 ml-3">
            <button
              disabled={isPending}
              onClick={(e) => handleStatus(e, "Approved")}
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
              onClick={(e) => handleStatus(e, "Rejected")}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap
                rounded-md text-sm font-medium ring-offset-background transition-colors
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0
                h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="stroke-destructive!" size={15} />
            </button>
          </div>
        ) : (
          <>__</>
        )}
      </td>
    </tr>
  );
}

function TableList({ status }: Props) {
  const [page, setPage] = useState("1");
  const [limit, setLimit] = useState("5");
  const { data, isFetching, pagination } = useExtensionRequestList({
    page,
    limit,
    status,
  });

  return (
    <>
      {/* Features bar with import/export */}
      <p className="text-sm p-4 border-b border-border flex gap-2 items-center">
        <RefreshCw size={18} /> Extension Request ({data.length})
      </p>

      {isFetching ? (
        <TableSkeleton rows={pagination?.limit} />
      ) : (
        <table className="text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                STAFF
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                EXTENSION
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                DURATION
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                NEW END DATE
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">
                STATUS
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                ACTIONS
              </th>
              <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((staff, index) => (
              <TableRow key={index} {...staff} />
            ))}
          </tbody>
        </table>
      )}
      {pagination && (
        <Paginator
          isFetching={isFetching}
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          hasNextPage={pagination.hasNextPage}
          hasPreviousPage={pagination.hasPrevPage}
          onRowsPerPageChange={(val) => setLimit(val)}
          fetchNextPage={() => setPage(String(pagination.page + 1))}
          fetchPreviousPage={() => setPage(String(pagination.page - 1))}
        />
      )}
    </>
  );
}

export function AcademicDivisionExtensionsList({ status }: Props) {
  return (
    <Card>
      <QueryErrorBoundary>
        <Suspense fallback={<TableSkeleton rows={5} />}>
          <TableList status={status} />
        </Suspense>
      </QueryErrorBoundary>
    </Card>
  );
}

function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="stats-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                STAFF
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                EXTENSION
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                DURATION
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                NEW END DATE
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">
                STATUS
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                ACTIONS
              </th>
              <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4"></th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: rows }).map((_, index) => (
              <tr key={index} className="border-b border-border last:border-0">
                {/* Employee Column */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-full shimmer" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3.5 w-32 shimmer" />
                      <Skeleton className="h-3 w-40 shimmer" />
                    </div>
                  </div>
                </td>

                <td className="py-3 px-4 hidden md:table-cell">
                  <Skeleton className="h-3.5 w-24 shimmer" />
                </td>

                <td className="py-3 px-4 hidden lg:table-cell">
                  <Skeleton className="h-3.5 w-28 shimmer" />
                </td>

                <td className="py-3 px-4">
                  <Skeleton className="h-6 w-16 rounded-full shimmer" />
                </td>

                <td className="py-3 px-4 hidden xl:table-cell">
                  <Skeleton className="h-3.5 w-28 shimmer" />
                </td>

                <td className="py-3 px-4 hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-7 w-7 shimmer" />
                    <Skeleton className="h-7 w-7 shimmer" />
                  </div>
                </td>

                <td className="py-3 px-4 text-right">
                  <Skeleton className="h-7 w-7 ml-auto animate-pulse shimmer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
