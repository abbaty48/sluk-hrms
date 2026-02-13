import { use } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { UserContext } from "@/states/contexts/UserContext";
import { AdminDashboardView } from "./admin/dashboard/AdminDashboard";
import { EmployeeDashboardView } from "./employee/EmployeeDashboard";

export function DashBoardMain() {
  const { roleView } = use(UserContext);
  return (
    <>
      <DashboardHeader />
      {roleView === "as_admin" ? (
        <>
          <AdminDashboardView />
        </>
      ) : (
        <EmployeeDashboardView />
      )}
    </>
  );
}
