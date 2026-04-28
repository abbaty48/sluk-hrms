import { useAcademicDivisionStudyStaffList } from "@sluk/src/hooks/api/useAcademicDivisionAPI";
import type { TADPOverviewActions } from "./AcademicDivisionPageOverviewLeaves";
import type { TStudyStaffQuery } from "@/types/academicDivisionTypes";
import { QueryErrorBoundary } from "@/components/ErrorBoundary";
import { Skeleton } from "@sluk/src/components/ui/skeleton";
import { Paginator } from "@/components/Paginator";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Suspense } from "react";

type Props = {
  filters: TStudyStaffQuery;
  changeFilter: ({ action, value }: TADPOverviewActions) => void;
};

function TableList({ filters, changeFilter }: Props) {
  const { data, isFetching, pagination } = useAcademicDivisionStudyStaffList({
    ...filters,
  });

  const navigate = useNavigate();

  return (
    <>
      {/* Features bar with import/export */}
      <p className="p-4 border-b border-border">
        Staff on Stufy Leave ({pagination?.total})
      </p>

      {isFetching ? (
        <TableSkeleton rows={pagination?.limit} />
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                STAFF
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden md:table-cell">
                INSTITUTION
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4 hidden lg:table-cell">
                DEGREE
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                SPONSORSHIP
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map(
              (
                {
                  country,
                  programme,
                  degreeType,
                  institution,
                  sponsorshipType,
                  staff: { id, department, firstName, lastName },
                },
                index,
              ) => (
                <tr
                  key={`${id}_${index}`}
                  onClick={() => navigate(`/admin/employees/${id}/profile`)}
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
                              <span key={index}>
                                {namePart[0]?.toUpperCase()}
                              </span>
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
                  {/* INSTITUTION*/}
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-sm text-card-foreground">
                      {institution}
                    </span>
                    <br />
                    <span className="text-xs text-muted-foreground">
                      {country}
                    </span>
                  </td>
                  {/* DEGREE */}
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className="text-xs block px-1.5 py-1 rounded-full bg-cyan-950 w-fit">
                      {degreeType}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {programme}
                    </span>
                    {}
                  </td>
                  {/* SPONSORSHIP*/}
                  <td className="py-3 px-4">
                    <span className="status-badge status-approved">
                      {sponsorshipType}
                    </span>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      )}
      {pagination && (
        <Paginator
          isFetching={isFetching}
          currentPage={pagination.page}
          fetchNextPage={() =>
            changeFilter({
              action: "SET_page",
              value: `${pagination.page + 1}`,
            })
          }
          totalPages={pagination.totalPages}
          hasNextPage={pagination.hasNextPage}
          fetchPreviousPage={() => {
            changeFilter({
              action: "SET_page",
              value: `${pagination.page - 1}`,
            });
          }}
          hasPreviousPage={pagination.hasPrevPage}
          onRowsPerPageChange={(value) => {
            changeFilter({ action: "SET_limit", value: value });
          }}
        />
      )}
    </>
  );
}

export function AcademicDivisionPageOverviewTable({
  filters,
  changeFilter,
}: Props) {
  return (
    <Card>
      <QueryErrorBoundary>
        <Suspense fallback={<TableSkeleton rows={5} />}>
          <TableList changeFilter={changeFilter} filters={filters} />
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
