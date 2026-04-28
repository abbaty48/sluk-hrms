import { Motion } from "@sluk/src/components/Motion";
import { AdminLeavePageTable } from "./AdminLeavePageTable";
import { AdminLeavePageTypes } from "./AdminLeavePageTypes";
import { AdminLeavePageStats } from "./AdminLeavePageStats";
import { AdminLeavePageHeader } from "./AdminLeavePageHeader";
import { AdminLeavePageFilters } from "./AdminLeavePageFilters";
import { AdminLeavePageProvider } from "./AdminLeavePageProvider";

const Component = function AdminLeavePageIndex() {
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
