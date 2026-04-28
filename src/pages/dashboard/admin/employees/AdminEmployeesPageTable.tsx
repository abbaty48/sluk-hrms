import { AdminEmployeeTableSkeleton } from "./AdminEmployeeTableSkeleton";
import { AdminEmployeesPageFeatures } from "./AdminEmployeesPageFeatures";
import { useAdminEmployeesPageHook } from "./AdminEmployeesPageHook";
import { QueryErrorBoundary } from "@/components/ErrorBoundary";
import { useStaffAPI } from "@/hooks/api/useAdminStaffApi";
import { Paginator } from "@/components/Paginator";
import { useDebounce } from "@/hooks/use-debounce";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Suspense, useState } from "react";

type EmployeeTable = {
  q: string;
  sort: string;
  cadre: string;
  status: string;
  departmentId: string;
};

function EmployeeTable({
  q,
  sort,
  cadre,
  status,
  departmentId,
}: EmployeeTable) {
  const [rowsPerPage, setRowsPerPage] = useState("5");
  const {
    data,
    refetch,
    isFetching,
    pagination,
    fetchNextPage,
    fetchPreviousPage,
  } = useStaffAPI({ limit: rowsPerPage, q, status, cadre, sort, departmentId });

  const navigate = useNavigate();
  return (
    <>
      {/* Features bar with import/export */}
      <div className="p-4 border-b border-border">
        <AdminEmployeesPageFeatures
          align="right"
          currentPageData={data}
          onImportComplete={() => refetch()}
        />
      </div>

      {isFetching ? (
        <AdminEmployeeTableSkeleton rows={pagination.limit} />
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
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                Role
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                Status
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden xl:table-cell">
                Join Date
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((staff) => (
              <tr
                key={staff.id}
                onClick={() => navigate(`/admin/employees/${staff.id}/profile`)}
                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors hover:cursor-pointer"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <span className="relative flex shrink-0 overflow-hidden rounded-full h-9 w-9">
                      <span className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                        {/*{staff.}*/}
                        {[staff.firstName, staff.lastName]
                          .join(" ")
                          .split(" ")
                          .map((namePart, index) => (
                            <span key={index}>
                              {namePart[0]?.toUpperCase()}
                            </span>
                          ))}
                      </span>
                    </span>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">
                        {staff.firstName} {staff.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {staff.email}
                      </p>
                    </div>
                  </div>
                </td>
                {/* Department Name*/}
                <td className="py-3 px-4 hidden md:table-cell">
                  <span className="text-sm text-card-foreground">
                    {staff.department?.name}
                  </span>
                </td>
                {/* Staff Role*/}
                <td className="py-3 px-4 hidden lg:table-cell">
                  <span className="text-sm text-muted-foreground">
                    {staff.rank}
                  </span>
                </td>
                {/* Staff Status*/}
                <td className="py-3 px-4">
                  <span className="status-badge status-approved">
                    {staff.status}
                  </span>
                </td>
                {/* JOIN DATE*/}
                <td className="py-3 px-4 hidden xl:table-cell">
                  <span className="text-sm text-muted-foreground">
                    {new Intl.DateTimeFormat("en-CA", {
                      dateStyle: "medium",
                    }).format(new Date(staff.createdAt))}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Paginator
        isFetching={isFetching}
        currentPage={pagination.page}
        fetchNextPage={fetchNextPage}
        totalPages={pagination.totalPages}
        hasNextPage={pagination.hasNextPage}
        fetchPreviousPage={fetchPreviousPage}
        hasPreviousPage={pagination.hasPrevPage}
        onRowsPerPageChange={(value) => {
          setRowsPerPage(value);
        }}
      />
    </>
  );
}

export function AdminEmployeesPageTable() {
  const { sort, cadre, status, searchTerm, departmentId } =
    useAdminEmployeesPageHook();
  const term = useDebounce(searchTerm, 500);

  return (
    <Card>
      <QueryErrorBoundary>
        <Suspense fallback={<AdminEmployeeTableSkeleton rows={5} />}>
          <EmployeeTable
            q={term}
            sort={sort}
            cadre={cadre}
            status={status}
            departmentId={departmentId}
          />
        </Suspense>
      </QueryErrorBoundary>
    </Card>
  );
}
