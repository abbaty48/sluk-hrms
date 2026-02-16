import { Outlet } from "react-router-dom";
import { DashboardHeader } from "./DashboardHeader";

export function DashBoardMain() {
  return (
    <>
      <DashboardHeader />
      <Outlet />
    </>
  );
}
