import {
  Sidebar,
  SidebarMenu,
  SidebarRail,
  SidebarGroup,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarProvider,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import {
  Bell,
  Clock,
  Users,
  SunMoon,
  Settings,
  ChartBar,
  Calendar,
  DollarSign,
  LogOutIcon,
  GraduationCap,
  LayoutDashboardIcon,
} from "lucide-react";
import { Link, Outlet } from "react-router-dom";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-row items-center justify-center gap-3 py-5 border-b border-gray-200">
        <SidebarMenu>
          <SidebarMenuButton>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
              <GraduationCap />
            </div>
            <hgroup className="flex flex-col">
              <h1 className="text-sm font-bold text-gray-900">SLU HRMS</h1>
              <p className="text-xs text-gray-500">Admin Portal</p>
            </hgroup>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>ADMIN MENU</SidebarGroupLabel>
          <SidebarGroupContent>
            {/*Dashboard*/}
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive>
                <Link to="/">
                  <LayoutDashboardIcon />
                  Dashboard
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/*Employees*/}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/employees">
                  <Users />
                  Employees
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/*Leave Management*/}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/calendar">
                  <Calendar />
                  Leave Management
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/*Attendance*/}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/attendance">
                  <Clock />
                  Attendance
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/*Payroll*/}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/payroll">
                  <DollarSign />
                  Payroll
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/*Reports*/}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/reports">
                  <ChartBar />
                  Reports
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/*Notifications*/}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/notifications">
                  <Bell /> Notifications
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <SunMoon /> Dark Mode
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/settings">
                <Settings />
                Settings
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <LogOutIcon /> Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export function DashBoardPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="full-container mx-auto w-full">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
