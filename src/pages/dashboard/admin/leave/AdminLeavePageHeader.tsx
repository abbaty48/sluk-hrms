import { AdminLeavePageContext } from "./AdminLeavePageContext";
import { useCSVExporter } from "@/hooks/use-csv";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { use } from "react";

export function AdminLeavePageHeader() {
  const { leaves, ...filters } = use(AdminLeavePageContext);
  const { handleCurrentPageExport } = useCSVExporter({
    filename: "leaves",
    columns: [
      { header: "Employee", accessor: (c) => c.staff.name },
      { header: "Type", accessor: (c) => c.leaveType },
      { header: "Duration", accessor: (c) => `${c.startDate} -> ${c.endDate}` },
      { header: "Days", accessor: (c) => c.totalDays },
      { header: "Status", accessor: (c) => c.status },
      { header: "Reason", accessor: (c) => c.reason },
    ],
    filters,
    currentPageData: leaves,
    onSuccessSave: () => {
      toast.success("Exported saved. ", {
        description: "Successfully export to csv file.",
      });
    },
    onErrorExport: () => {
      toast.success("Exporting Failed. ", {
        description: "Failed to export to csv file.",
      });
    },
  });

  const handleExportCSV = async () => {
    await handleCurrentPageExport();
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Leave Management</h1>
        <p className="text-muted-foreground">
          Manage and track all leave requests
        </p>
      </div>
      <Button variant="outline" onClick={handleExportCSV}>
        <Download className="h-4 w-4 mr-1" />
        Export CSV
      </Button>
    </div>
  );
}
