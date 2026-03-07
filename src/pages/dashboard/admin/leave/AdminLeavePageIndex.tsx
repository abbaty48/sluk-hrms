import { Motion } from "@sluk/src/components/Motion";
import { AdminLeavePageTable } from "./AdminLeavePageTable";
import { AdminLeavePageTypes } from "./AdminLeavePageTypes";
import { AdminLeavePageStats } from "./AdminLeavePageStats";
import { AdminLeavePageHeader } from "./AdminLeavePageHeader";
import { AdminLeavePageFilters } from "./AdminLeavePageFilters";
import { AdminLeavePageProvider } from "./AdminLeavePageProvider";

const Component = function AdminLeavePageIndex() {
  /*
  const [filters, setFilters] = useState<LeaveFilters>({
    search: "",
    status: "all",
    type: "all",
  });
  const [isAddTypeDialogOpen, setIsAddTypeDialogOpen] = useState(false);
  const [isFromDateOpen, setIsFromDateOpen] = useState(false);
  const [isToDateOpen, setIsToDateOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilterChange = (key: keyof LeaveFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };
  */

  return (
    <AdminLeavePageProvider>
      <Motion element="main" className="flex-1 p-4 lg:p-6 overflow-auto">
        <div className="animate-fade-in">
          {/* Header */}
          <AdminLeavePageHeader />
          {/* Stats Cards */}
          <AdminLeavePageStats />
          {/* Leave Types */}
          <AdminLeavePageTypes />
          {/* Filters */}
          <AdminLeavePageFilters />
          {/* Table */}
          <AdminLeavePageTable />
        </div>
      </Motion>
    </AdminLeavePageProvider>
  );
};

export default Component;
