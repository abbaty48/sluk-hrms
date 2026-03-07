import { AdminAttendancePageTable } from "./AdminAttendancePageTable";
import { AdminAttendancePageStats } from "./AdminAttendancePageStats";
import { AdminAttendancePageChart } from "./AdminAttendancePageChart";
import { Motion } from "@sluk/src/components/Motion";

const Component = function AttendancePageWithQuery() {
  return (
    <Motion element="main" className="flex-1 p-4 lg:p-6 overflow-auto">
      <div className="animate-fade-in">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Attendance Tracking
          </h1>
          <p className="text-muted-foreground">
            Monitor daily attendance and availability
          </p>
        </div>
        {/* Stats Cards */}
        <AdminAttendancePageStats />
        {/* Chart */}
        <AdminAttendancePageChart />
        {/* Table */}
        <AdminAttendancePageTable />
      </div>
    </Motion>
  );
};

export default Component;
