import { useAdminDepartment } from "@sluk/src/hooks/api/useAdminDepartment";
import { AdminEmployeeTableSkeleton } from "./AdminEmployeeTableSkeleton";
import { QueryErrorBoundary } from "@sluk/src/components/ErrorBoundary";
import { useStaffAPI } from "@sluk/src/hooks/api/useAdminStaffApi";
import { Card, CardContent } from "@sluk/src/components/ui/card";
import { SelectFilter } from "@sluk/src/components/SelectFilter";
import { Paginator } from "@sluk/src/components/Paginator";
import { SelectItem } from "@sluk/src/components/ui/select";
import { useDebounce } from "@sluk/src/hooks/use-debounce";
import { Button } from "@sluk/src/components/ui/button";
import { Suspense, useState } from "react";
import {
  LucidePlus,
  LucideMail,
  LucidePhone,
  LucideImport,
  LucideSearch,
  LucideEllipsis,
  LucideDownload,
} from "lucide-react";

type Props = {
  q: string;
  sort: string;
  cadre: string;
  status: string;
  departmentId: string;
};

function EmployeeTable({ q, sort, departmentId, cadre, status }: Props) {
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

function DepartmentFilter() {
  const { data } = useAdminDepartment();
  return data.map((department) => (
    <SelectItem key={department.id} value={department.id}>
      {department.name}
    </SelectItem>
  ));
}

export const Component = function AdminEmployeesPage() {
  const [departmentId, setDepartmentId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<string>("");
  const [cadre, setCadre] = useState<string>("");
  const [sort, setSort] = useState<string>("");
  const term = useDebounce(searchTerm, 500);
  return (
    <div className="px-8 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Employee Records</h1>
          <p className="page-subtitle">8 of 8 staff members</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={"outline"}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
          >
            <LucideImport />
            Import CSV
          </Button>

          <Button
            variant={"outline"}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
          >
            <LucideDownload />
            Export
          </Button>

          <Button
            variant={"outline"}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground dark:text-inherit hover:bg-primary/90 h-9 rounded-md px-3"
          >
            <LucidePlus />
            Add Staff
          </Button>
        </div>
      </div>
      <Card>
        <CardContent>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <LucideSearch className="lucide lucide-search absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-9"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {/*Department*/}
              <SelectFilter
                placeholder="Filter by department."
                onSelectedFilterChange={(value) => setDepartmentId(value!)}
              >
                <DepartmentFilter />
              </SelectFilter>

              {/* Status*/}
              <SelectFilter
                placeholder="Filter by status."
                onSelectedFilterChange={(value) => setStatus(value!)}
              >
                <SelectItem value={""}>All Statuses</SelectItem>
                <SelectItem value="On Leave">On Leave</SelectItem>
                <SelectItem value="Employed">Employed</SelectItem>
                <SelectItem value="Retired">Retired</SelectItem>
                <SelectItem value="Terminated">Terminated</SelectItem>
                <SelectItem value="Resigned">Resigned</SelectItem>
              </SelectFilter>

              {/* Role */}
              <SelectFilter
                placeholder="Filter by role."
                onSelectedFilterChange={(value) => setCadre(value!)}
              >
                <SelectItem value={""}>All Roles</SelectItem>
                <SelectItem value="Teaching">Teaching</SelectItem>
                <SelectItem value="Non-Teaching">Non-Teaching</SelectItem>
                <SelectItem value="Administrative">Administrative</SelectItem>
                <SelectItem value="Technical">Technical</SelectItem>
              </SelectFilter>
              {/* */}
            </div>
            <div className="flex items-center justify-between">
              <SelectFilter
                placeholder="Sort"
                onSelectedFilterChange={(value) => setSort(value!)}
              >
                <SelectItem value={""}>All Names</SelectItem>
                <SelectItem value="name_asc">Name A-Z</SelectItem>
                <SelectItem value="name_desc">Name Z-A</SelectItem>
                <SelectItem value="created_asc">Join Date (Newest)</SelectItem>
                <SelectItem value="created_desc">Join Date (Oldest)</SelectItem>
                <SelectItem value="department">Department</SelectItem>
              </SelectFilter>
            </div>
          </div>
        </CardContent>
      </Card>
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
    </div>
  );
};
