import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useLeavesAPI,
  useLeaveApproval,
  useLeaveRejection,
} from "@/hooks/api/useAdminLeave";
import { toast } from "sonner";
import { formatDate } from "@sluk/src/lib/utils";
import { Card } from "@sluk/src/components/ui/card";
import { Button } from "@sluk/src/components/ui/button";
import { Suspense, use, useEffect, useState } from "react";
import { Paginator } from "@sluk/src/components/Paginator";
import type { TLeaveItem } from "@/types/leave-managementTypes";
import { AdminLeavePageContext } from "./AdminLeavePageContext";
import { QueryErrorBoundary } from "@/components/ErrorBoundary";
import { Check, CircleX, Loader2, NotepadText } from "lucide-react";

/**
 *
 */
export function AdminLeavePageTable() {
  return (
    <QueryErrorBoundary>
      <Suspense fallback={<LeavePageTableSkeleton />}>
        <LeavePageTable />
      </Suspense>
    </QueryErrorBoundary>
  );
}

/**
 *
 */
function LeaveReason({ reason }: { reason: string | null }) {
  const [isHover, setIsHover] = useState(false);
  return (
    <Popover open={isHover}>
      <PopoverTrigger
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <NotepadText size={"1rem"} />
      </PopoverTrigger>
      <PopoverContent className="m-0 p-0">
        <p className="p-2">Reason: {reason}</p>
      </PopoverContent>
    </Popover>
  );
}
/**
 *
 */
function TableRow({
  id,
  staff,
  status,
  reason,
  endDate,
  startDate,
  leaveType,
  totalDays,
}: TLeaveItem) {
  //
  const { mutateAsync: mutateRejection, isPending: isRejecting } =
    useLeaveRejection();
  const { mutateAsync: mutateApproval, isPending: isApproving } =
    useLeaveApproval();

  const getStatusBadgeClass = (status: string) => {
    const baseClass =
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
    switch (status) {
      case "PENDING":
        return `${baseClass} bg-warning/10 text-warning`;
      case "APPROVED":
        return `${baseClass} bg-success/10 text-success`;
      case "REJECTED":
        return `${baseClass} bg-destructive/10 text-destructive`;
      default:
        return baseClass;
    }
  };

  const handleLeaveApprove = async (id: string) => {
    mutateApproval(id, {
      onSuccess: () => {
        toast.success("Approved", { description: "Leave has been approved." });
      },
      onError: () => {
        toast.error("Approval Failed ", {
          description: "Failed to approved leave.",
        });
      },
    });
  };

  const handleLeaveRejection = async (id: string) => {
    mutateRejection(id, {
      onSuccess: () => {
        toast.success("Rejected", { description: "Leave has been rejected." });
      },
      onError: () => {
        toast.error("Rejection Failed", {
          description: "Failed to reject leave.",
        });
      },
    });
  };

  return (
    <tr className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
      <td className="py-3 px-4">
        <p className="text-sm font-medium text-card-foreground">
          {staff?.name}
        </p>
        <p className="text-xs text-muted-foreground">{staff?.department}</p>
      </td>
      <td className="py-3 px-4">
        <span className="text-sm text-card-foreground">{leaveType}</span>
      </td>
      <td className="py-3 px-4 hidden md:table-cell">
        <span className="text-sm text-muted-foreground space-x-2">
          {formatDate(new Date(startDate))}→{formatDate(new Date(endDate))}
        </span>
      </td>
      <td className="py-3 px-4 hidden lg:table-cell">
        <span className="text-sm font-medium text-card-foreground">
          {totalDays}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className={getStatusBadgeClass(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </td>
      <td className="flex gap-1.5 flex-wrap py-3 px-4">
        <LeaveReason reason={reason} />
        {status === "PENDING" ? (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              disabled={isApproving}
              onClick={() => handleLeaveApprove(id)}
              className="h-8 w-8 text-success hover:text-success hover:bg-success/10"
            >
              {isApproving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={isRejecting}
              onClick={() => handleLeaveRejection(id)}
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              {isRejecting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CircleX className="h-4 w-4" />
              )}
            </Button>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </td>
    </tr>
  );
}

export function LeavePageTable() {
  const { setFilters, leaves: _, ...filters } = use(AdminLeavePageContext);
  const {
    data: leaves,
    isFetching,
    pagination,
    fetchNextPage,
    fetchPreviousPage,
  } = useLeavesAPI({ ...filters });

  useEffect(() => {
    (() => {
      setFilters({ leaves: [] });
    })();
  }, []);

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                Employee
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                Type
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                Duration
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                Days
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                Status
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {leaves?.map((leave) => (
              <TableRow key={leave.id} {...leave} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Showing {leaves.length * pagination.page} of {pagination.total}
          </p>
          <Paginator
            isFetching={isFetching}
            currentPage={pagination.page}
            fetchNextPage={fetchNextPage}
            totalPages={pagination.totalPages}
            hasNextPage={pagination.hasNextPage}
            fetchPreviousPage={fetchPreviousPage}
            hasPreviousPage={pagination.hasPrevPage}
            onRowsPerPageChange={(value) => setFilters({ limit: value })}
          />
        </div>
      )}
    </Card>
  );
}

/**
 *
 */
function LeavePageTableSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                Employee
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                Type
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                Duration
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                Days
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                Status
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
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

                <td className="py-3 px-4 lg:table-cell">
                  <Skeleton className="h-7 w-20 animate-pulse shimmer" />
                </td>

                <td className="py-3 px-4 text-right">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-7 w-7 shimmer" />
                    <Skeleton className="h-7 w-7 shimmer" />
                    <Skeleton className="h-7 w-7 shimmer" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-muted ${className}`}>
      <div className="absolute inset-0 shimmer" />
    </div>
  );
}
