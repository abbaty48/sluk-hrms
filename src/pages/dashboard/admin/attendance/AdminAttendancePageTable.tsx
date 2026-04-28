import { AdminAttendancePageTableSkeleton } from "./AdminAttendancePageSkeletons";
import { useAdminAttendanceTodayAPI } from "@/hooks/api/useAdminAttendance";
import type { TAttendanceResponse } from "@/types/attendance.types";
import { QueryErrorBoundary } from "@/components/ErrorBoundary";
import { Paginator } from "@/components/Paginator";
import { formatDate } from "@sluk/src/lib/utils";
import { Logs, LogsIcon } from "lucide-react";
import { Suspense, useState } from "react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@sluk/src/components/EmptyState";

type AttendanceTableProps = {
  data: TAttendanceResponse[];
};

export function AdminAttendancePageTable() {
  return (
    <QueryErrorBoundary>
      <Suspense fallback={<AdminAttendancePageTableSkeleton />}>
        <AttendancePageTable />
      </Suspense>
    </QueryErrorBoundary>
  );
}

function AttendancePageTable() {
  const [pagePerRow, setPagePerRow] = useState("5");
  const {
    data: todayAttendance,
    pagination,
    fetchNextPage,
    fetchPreviousPage,
    isFetching,
  } = useAdminAttendanceTodayAPI(pagePerRow);

  return (
    <Card className="overflow-hidden">
      <div className="p-4">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">
          Today's Attendance Log
        </h3>
      </div>
      {todayAttendance.length <= 0 && pagination?.total === 0 ? (
        <div className="flex items-center justify-center my-5 gap-3">
          <Logs size={"3rem"} /> No Attendance for today.
        </div>
      ) : (
        <>
          <AttendanceTable data={todayAttendance} />
          {pagination && (
            <Paginator
              isFetching={isFetching}
              currentPage={pagination.page}
              fetchNextPage={fetchNextPage}
              totalPages={pagination.totalPages}
              hasNextPage={pagination.hasNextPage}
              fetchPreviousPage={fetchPreviousPage}
              hasPreviousPage={pagination.hasPrevPage}
              onRowsPerPageChange={(value) => setPagePerRow(value!)}
            />
          )}
        </>
      )}
    </Card>
  );
}

export function AttendanceTable({ data }: AttendanceTableProps) {
  const getStatusBadgeClass = (status: string) => {
    const baseClass =
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
    switch (status) {
      case "present":
        return `${baseClass} bg-success/10 text-success`;
      case "absent":
        return `${baseClass} bg-destructive/10 text-destructive`;
      case "late":
        return `${baseClass} bg-warning/10 text-warning`;
      case "on_leave":
        return `${baseClass} bg-primary/10 text-primary`;
      default:
        return baseClass;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "present":
        return "Present";
      case "absent":
        return "Absent";
      case "late":
        return "Late";
      case "on_leave":
        return "On Leave";
      default:
        return status;
    }
  };

  return (
    <div className="overflow-x-auto">
      {data.length <= 0 ? (
        <EmptyState
          title="Attendace Logs"
          icon={LogsIcon}
          description={`No Attendance logs today ${formatDate(new Date())}`}
        />
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                Employee
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                Department
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                Check-in
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((record) => (
              <tr
                key={record.id}
                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="py-3 px-4 text-sm font-medium text-card-foreground">
                  {record.employeeName}
                </td>
                <td className="py-3 px-4 text-sm text-muted-foreground hidden md:table-cell">
                  {record.department}
                </td>
                <td className="py-3 px-4 text-sm text-card-foreground">
                  {record.checkIn || "—"}
                </td>
                <td className="py-3 px-4">
                  <span className={getStatusBadgeClass(record.status)}>
                    {getStatusLabel(record.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
