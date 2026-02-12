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
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@sluk/src/components/ui/dropdown-menu";
import { UserContext } from "@sluk/src/states/contexts/UserContext";
import { UserProvider } from "@sluk/src/states/providers/UserProvider";
import {
  Bell,
  User,
  Clock,
  Users,
  UserCog,
  SunMoon,
  Settings,
  FileText,
  ChartBar,
  Calendar,
  UserCircle,
  DollarSign,
  LogOutIcon,
  GraduationCap,
  ChevronsUpDown,
  LayoutDashboardIcon,
} from "lucide-react";
import { use } from "react";
import { Link, Outlet } from "react-router-dom";

/**
 * Admin Sidebar Component
 */
export function AdminSidebar() {
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <div className="flex items-center gap-2 py-4 -m-1">
                    <UserCircle className="rounded-full bg-gray-100 border" />
                    <p className="flex flex-col max-w-prose">
                      <span>John Doe</span>
                      <span>john.doe@example.com</span>
                    </p>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <SidebarMenuButton>
                    <UserCog /> Account Settings
                  </SidebarMenuButton>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SidebarMenuButton>
                    <LogOutIcon /> Logout
                  </SidebarMenuButton>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

/**
 * Employee Sidebar Component
 */
export function EmployeeSidebar() {
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
              <p className="text-xs text-gray-500">Staff Portal</p>
            </hgroup>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>MY MENU</SidebarGroupLabel>
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
            {/*My Profile*/}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/:userid/profile">
                  <User />
                  My Profile
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/*Apply Leave*/}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/:userid/leave">
                  <Calendar />
                  Apply Leave
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/*My Attendance*/}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/:userid/attendance">
                  <Clock />
                  My Attendance
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/*Documents*/}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/:userid/documents">
                  <FileText />
                  Documents
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/*Notifications*/}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/:userid/notifications">
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
          {/**/}
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <div className="flex items-center gap-2 py-4 -m-1">
                    <UserCircle className="rounded-full bg-gray-100 border" />
                    <p className="flex flex-col max-w-prose">
                      <span>John Doe</span>
                      <span>john.doe@example.com</span>
                    </p>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <SidebarMenuButton>
                    <UserCog /> Account Settings
                  </SidebarMenuButton>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SidebarMenuButton>
                    <LogOutIcon /> Logout
                  </SidebarMenuButton>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

/**
 *  Dashboard Sidebar Component
 */
export function DashboardSideBar() {
  const { roleView } = use(UserContext);
  return roleView === "as_admin" ? <AdminSidebar /> : <EmployeeSidebar />;
}
/**
 *
 */
export function DashBoardPage() {
  return (
    <UserProvider>
      <SidebarProvider>
        <DashboardSideBar />
        <main className="full-container mx-auto w-full">
          <SidebarTrigger />
          <Outlet />
        </main>
      </SidebarProvider>
    </UserProvider>
  );
}
