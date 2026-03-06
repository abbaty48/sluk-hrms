import { Outlet } from "react-router";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSideBar } from "./DashboardSideBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/states/contexts/AuthContext";

/**
 *
 */
export function DashBoardPage() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <DashboardSideBar />
        <main className="full-container mx-auto w-full">
          <DashboardHeader />
          <Outlet />
        </main>
      </SidebarProvider>
    </AuthProvider>
  );
}
