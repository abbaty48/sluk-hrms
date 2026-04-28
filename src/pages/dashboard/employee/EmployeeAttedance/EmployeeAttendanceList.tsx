import { LogsIcon } from "lucide-react";
import { Paginator } from "@/components/Paginator";
import type { TPagination } from "@sluk/src/types/types";
import type { TAttendance } from "@/types/attendance.types";
import { formatDate, formatTime } from "@sluk/src/lib/utils";
import { EmptyState } from "@sluk/src/components/EmptyState";

type AttendanceTableProps = {
  page: number;
  isFetching: boolean;
  attendances: TAttendance[];
  fetchNextPage: () => void;
  fetchPreviousPage: () => void;
  pagination: TPagination | null;
  setPagePerRow: React.Dispatch<React.SetStateAction<string>>;
};

export function EmployeeAttendanceList({
  fetchPreviousPage,
  setPagePerRow,
  fetchNextPage,
  attendances,
  isFetching,
  pagination,
  page,
}: AttendanceTableProps) {
  const getStatusBadgeClass = (status: string) => {
    const baseClass =
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
    switch (status) {
      case "PRESENT":
        return `${baseClass} bg-success/10 text-success`;
      case "ABSENT":
        return `${baseClass} bg-destructive/10 text-destructive`;
      case "LATE":
        return `${baseClass} bg-warning/10 text-warning`;
      case "ONLEAVE":
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
    <div className="overflow-x-auto space-y-5">
      {attendances.length <= 0 ? (
        <EmptyState
          title="Attendace Logs"
          icon={LogsIcon}
          description={"You have no Attendances submitted yet."}
        />
      ) : (
        <>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  DATE
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                  CHECK IN
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  CHECK OUT
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  HOURS
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                  STATUS
                </th>
              </tr>
            </thead>
            <tbody>
              {attendances.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td
                    className="py-3 px-4 text-sm font-medium text-card-fo
                    reground"
                  >
                    {formatDate(new Date(record.date), "medium")}
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground hidden md:table-cell">
                    {formatTime(
                      new Date(record.checkIn!),
                      "medium",
                    ).toUpperCase()}
                  </td>
                  <td className="py-3 px-4 text-sm text-card-foreground">
                    {formatTime(
                      new Date(record.checkOut!),
                      "medium",
                    ).toUpperCase()}
                  </td>
                  <td className="py-3 px-4 text-sm text-card-foreground">
                    {record.workHours}h
                  </td>
                  <td className="py-3 px-4">
                    <span className={getStatusBadgeClass(record.status)}>
                      {getStatusLabel(record.status)}
                    </span>
                    {/*<span className={getStatusBadgeClass(record.status)}>
                      {getStatusLabel(record.status)}
                    </span>*/}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
    </div>
  );
}
