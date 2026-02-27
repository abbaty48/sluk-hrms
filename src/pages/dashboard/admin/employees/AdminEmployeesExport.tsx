import type { TStaffWithDepartmentName as Staff } from "@sluk/src/types/types";
import { useCSVExporter, type CSVColumn } from "@sluk/src/hooks/use-csv";
import { LucideDownload, LucideLoader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

// Staff-specific wrapper (backward compatible)
interface ExportEmployeesProps {
  allPages?: { data: Staff[] }[];
  currentPageData: Staff[];
  filters?: {
    q?: string;
    status?: string;
    cadre?: string;
    departmentId?: string;
  };
}

export function ExportEmployees({
  currentPageData,
  filters = {},
  allPages,
}: ExportEmployeesProps) {
  // Define columns for staff export
  const columns: CSVColumn<Staff>[] = [
    { header: "Staff No", accessor: (staff) => staff.staffNo },
    { header: "Name", accessor: (staff) => staff.name },
    { header: "Email", accessor: (staff) => staff.email },
    { header: "Phone", accessor: (staff) => staff.phone },
    { header: "Gender", accessor: (staff) => staff.gender },
    { header: "Date of Birth", accessor: (staff) => staff.dateOfBirth },
    { header: "Department", accessor: (staff) => staff.department?.name },
    { header: "Rank", accessor: (staff) => staff.rank },
    { header: "Cadre", accessor: (staff) => staff.cadre },
    { header: "Category", accessor: (staff) => staff.staffCategory },
    { header: "Status", accessor: (staff) => staff.status },
    { header: "State", accessor: (staff) => staff.state },
    { header: "LGA", accessor: (staff) => staff.lga },
    {
      header: "Join Date",
      accessor: (staff) => new Date(staff.createdAt).toLocaleDateString(),
    },
  ];

  // Function to fetch all staff data
  const fetchAllData = async (filters: any): Promise<Staff[]> => {
    const params = new URLSearchParams({
      limit: "10000",
      ...(filters.q && { q: filters.q }),
      ...(filters.status && { status: filters.status }),
      ...(filters.cadre && { cadre: filters.cadre }),
      ...(filters.departmentId && { departmentId: filters.departmentId }),
    });

    const response = await fetch(`/api/staff/search?${params}`);
    const result = await response.json();

    if (!result.data || !Array.isArray(result.data)) {
      throw new Error("Invalid response format");
    }

    return result.data;
  };

  const {
    state,
    handleAllDataExport,
    handleCurrentPageExport,
    handleCachedPagesExport,
  } = useCSVExporter({
    allPages,
    filters,
    columns,
    fetchAllData,
    currentPageData,
    filename: "employees",
    onSuccessExport: ({ title, message }) => {
      toast.success(title, { description: message });
    },
    onSuccessSave: ({ title, message }) => {
      toast.success(title, { description: message });
    },
    onErrorExport: ({ title, message }) => {
      toast.success(title, { description: message });
    },
    onErrorSave: ({ title, message }) => {
      toast.success(title, { description: message });
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={state.isExporting}
          className="inline-flex items-center justify-center gap-2"
        >
          {state.isExporting ? (
            <LucideLoader2 className="animate-spin" />
          ) : (
            <LucideDownload />
          )}
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={handleCurrentPageExport}
          disabled={state.isExporting}
        >
          Export Current Page ({currentPageData.length} rows)
        </DropdownMenuItem>
        {allPages && allPages.length > 0 && (
          <DropdownMenuItem
            onClick={handleCachedPagesExport}
            disabled={state.isExporting}
          >
            Export Cached Pages (
            {allPages.reduce((sum, page) => sum + (page.data?.length || 0), 0)}{" "}
            rows)
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={handleAllDataExport}
          disabled={state.isExporting}
        >
          Export All Data
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
