import { useAdminDepartment } from "@sluk/src/hooks/api/useAdminDepartment";
import { useAdminEmployeesPageHook } from "./AdminEmployeesPageHook";
import { Card, CardContent } from "@sluk/src/components/ui/card";
import { SelectFilter } from "@sluk/src/components/SelectFilter";
import { SelectItem } from "@sluk/src/components/ui/select";
import { Button } from "@sluk/src/components/ui/button";
import { LucideSearch, FilterX } from "lucide-react";

/** */
function AdminEmployeesPageSearchFilter() {
  const { searchTerm, dispatch } = useAdminEmployeesPageHook();
  return (
    <div className="relative flex-1">
      <LucideSearch className="lucide lucide-search absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-9"
        placeholder="Search by name, email, or phone..."
        value={searchTerm}
        onChange={(e) =>
          dispatch({ type: "SET_SEARCHTERM", value: e.target.value })
        }
      />
    </div>
  );
}
/** */
function AdminEmployeesPageDepartmentFilter() {
  const { dispatch } = useAdminEmployeesPageHook();

  function DepartmentFilter() {
    const { data } = useAdminDepartment();

    return data.map((department) => (
      <SelectItem key={department.id} value={department.id}>
        {department.name}
      </SelectItem>
    ));
  }

  return (
    <SelectFilter
      placeholder={"Filter by department."}
      onSelectedFilterChange={(value) =>
        dispatch({ type: "SET_DEPARTMENT_ID", value: value! })
      }
    >
      <DepartmentFilter />
    </SelectFilter>
  );
}
/** */
function AdminEmployeesPageStatusFilter() {
  const { dispatch } = useAdminEmployeesPageHook();
  return (
    <SelectFilter
      placeholder={"Filter by status."}
      onSelectedFilterChange={(value) =>
        dispatch({ type: "SET_STATUS", value: value! })
      }
    >
      <SelectItem value={"null"}>All Statuses</SelectItem>
      <SelectItem value="On Leave">On Leave</SelectItem>
      <SelectItem value="Employed">Employed</SelectItem>
      <SelectItem value="Retired">Retired</SelectItem>
      <SelectItem value="Resigned">Resigned</SelectItem>
      <SelectItem value="Terminated">Terminated</SelectItem>
    </SelectFilter>
  );
}
/** */
function AdminEmployeesPageRoleFilter() {
  const { dispatch } = useAdminEmployeesPageHook();
  return (
    <SelectFilter
      placeholder={"Filter by role."}
      onSelectedFilterChange={(value) =>
        dispatch({ type: "SET_CANDRE", value: value! })
      }
    >
      <SelectItem value={"null"}>All Roles</SelectItem>
      <SelectItem value="Teaching">Teaching</SelectItem>
      <SelectItem value="Non-Teaching">Non-Teaching</SelectItem>
      <SelectItem value="Administrative">Administrative</SelectItem>
      <SelectItem value="Technical">Technical</SelectItem>
    </SelectFilter>
  );
}
/** */
function AdminEmployeesPageSortFilter() {
  const { dispatch } = useAdminEmployeesPageHook();
  return (
    <SelectFilter
      placeholder={"Sort Filter."}
      onSelectedFilterChange={(value) =>
        dispatch({ type: "SET_SORT", value: value! })
      }
    >
      <SelectItem value={"null"}>All Names</SelectItem>
      <SelectItem value="name_asc" defaultChecked>
        Name A-Z
      </SelectItem>
      <SelectItem value="name_desc">Name Z-A</SelectItem>
      <SelectItem value="created_asc">Join Date (Newest)</SelectItem>
      <SelectItem value="created_desc">Join Date (Oldest)</SelectItem>
      <SelectItem value="department">Department</SelectItem>
    </SelectFilter>
  );
}
/** */
function AdminEmployeesPageResetFilter() {
  const { dispatch } = useAdminEmployeesPageHook();
  return (
    <Button
      type="button"
      variant={"outline"}
      onClick={() => dispatch({ type: "RESET_FILTER" })}
    >
      <FilterX /> Reset Filter
    </Button>
  );
}
/** */
export function AdminEmployeesPageFilters() {
  return (
    <Card>
      <CardContent>
        <form className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <AdminEmployeesPageSearchFilter />
            {/*Department*/}
            <AdminEmployeesPageDepartmentFilter />
            {/* Status*/}
            <AdminEmployeesPageStatusFilter />
            {/* Role */}
            <AdminEmployeesPageRoleFilter />
            {/* */}
          </div>
          <div className="flex items-center justify-between">
            {/*SORT*/}
            <AdminEmployeesPageSortFilter />
            {/*Reset Filter*/}
            <AdminEmployeesPageResetFilter />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
