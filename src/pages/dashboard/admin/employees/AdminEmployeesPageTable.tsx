import { AdminEmployeeTableSkeleton } from "./AdminEmployeeTableSkeleton";
import { QueryErrorBoundary } from "@sluk/src/components/ErrorBoundary";
import { LucideMail, LucidePhone, LucideEllipsis } from "lucide-react";
import { useAdminEmployeesPageHook } from "./AdminEmployeesPageHook";
import { useStaffAPI } from "@sluk/src/hooks/api/useAdminStaffApi";
import { Paginator } from "@sluk/src/components/Paginator";
import { useDebounce } from "@sluk/src/hooks/use-debounce";
import { Card } from "@sluk/src/components/ui/card";
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
  const { data, isFetching, pagination, fetchNextPage, fetchPreviousPage } =
    useStaffAPI({ limit: rowsPerPage, q, status, cadre, sort, departmentId });

  return (
    <>
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
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                Contact
              </th>
              <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((staff) => (
              <tr
                key={staff.id}
                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <span className="relative flex shrink-0 overflow-hidden rounded-full h-9 w-9">
                      <span className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                        {staff.name.split(" ").map((namePart, index) => (
                          <span key={index}>{namePart[0]?.toUpperCase()}</span>
                        ))}
                      </span>
                    </span>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">
                        {staff.name}
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
                    {staff.department.name}
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
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "long",
                    }).format(new Date(staff.createdAt))}
                  </span>
                </td>
                {/* CONTACT USER*/}
                <td className="py-3 px-4 hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-7 w-7">
                      <LucideMail />
                    </button>
                    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-7 w-7">
                      <LucidePhone />
                    </button>
                  </div>
                </td>
                {/* ACTION MENU */}
                <td className="py-3 px-4 text-right">
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-7 w-7">
                    <LucideEllipsis />
                  </button>
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
