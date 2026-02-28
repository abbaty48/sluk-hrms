import { Outlet } from "react-router";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSideBar } from "./DashboardSideBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserProvider } from "@/states/providers/UserProvider";


/**
 *
 */
export function DashBoardPage() {
  return (
    <UserProvider>
      <SidebarProvider>
        <DashboardSideBar />
        <main className="full-container mx-auto w-full">
          <DashboardHeader />
          <Outlet />
        </main>
      </SidebarProvider>
    </UserProvider>
  );
}
