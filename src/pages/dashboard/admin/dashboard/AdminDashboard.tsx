import { AdminLeavePending } from "./AdminLeavePending/AdminLeavePending";
import { AdminDashboardStats } from "./AdminDashboardStats/AdminDashboardStats";
import { AdminLeaveDistributionChart } from "./AdminLeaveDistributionChart/AdminLeaveDistributionChart";
import { AdminStaffPerDepartmentChart } from "./AdminStaffPerDepartmentChart/AdminStaffPerDepartmentChart";
import { AdminMonthlyAttendanceTrendChart } from "./AdminMonthlyAttendanceTrendChart/AdminMonthlyAttendanceTrendChart";

export function AdminDashboardView() {
  return (
    <article className="p-4 lg:p-6 overflow-auto w-full">
      <div className="mb-6">
        <h2 className="text-2xl leading-8 font-bold text-foreground">
          Dashboard
        </h2>
        <p className="mt-1 text-[.875rem] lean-[1.25rem] text-muted-foreground">
          Welcome back, Admin. Here's your HR overview.
        </p>
      </div>
      <AdminDashboardStats />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <AdminStaffPerDepartmentChart />
        <AdminMonthlyAttendanceTrendChart />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AdminLeaveDistributionChart />
        <AdminLeavePending />
      </div>
    </article>
  );
}
