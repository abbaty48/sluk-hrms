import {
    Sidebar,
    SidebarMenu,
    SidebarRail,
    SidebarGroup,
    SidebarFooter,
    SidebarHeader,
    SidebarContent,
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
} from "@/components/ui/dropdown-menu";
import {
    Bell,
    Clock,
    Users,
    UserCog,
    Settings,
    FileText,
    ChartBar,
    Calendar,
    UserCircle,
    LogOutIcon,
    GraduationCap,
    ChevronsUpDown,
    LayoutDashboardIcon,
} from "lucide-react";
import { use } from "react";
import { cn } from "@/lib/utils";
import { ThemeButton } from "@/components/ThemeButton";
import { Link, NavLink, useLocation } from "react-router";
import { UserContext } from "@/states/contexts/UserContext";
/**
 * Admin Sidebar Component
 */
function AdminSidebar() {
    const pathname = useLocation().pathname;

    const links = [
        {
            to: "/admin",
            label: "Dashboard",
            icon: <LayoutDashboardIcon />,
        },
        { to: "/admin/employees", label: "Employees", icon: <Users /> },
        {
            to: "/admin/leave",
            label: "Leave Management",
            icon: <Calendar />,
        },
        { to: "/admin/attendance", label: "Attendance", icon: <Clock /> },
        { to: "/admin/reports", label: "Reports", icon: <ChartBar /> },
        {
            to: "/admin/notifications",
            label: "Notifications",
            icon: <Bell />,
        },
    ];
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu className="flex flex-row items-center overflow-hidden gap-3 py-3 border-b border-primary/10">
                    <div className="flex items-center justify-center rounded-lg bg-primary p-2">
                        <GraduationCap size={16} />
                    </div>
                    <hgroup className="flex flex-col">
                        <h1 className="text-sm font-bold text-gray-100">SLU HRMS</h1>
                        <p className="text-xs text-gray-500">Admin Portal</p>
                    </hgroup>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>ADMIN MENU</SidebarGroupLabel>
                    <SidebarGroupContent className="list-none">
                        {links.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={() => {
                                    return cn(
                                        link.to === pathname
                                            ? "dark:bg-accent-foreground dark:text-primary bg-black/35"
                                            : "",
                                        "peer/menu-button flex w-full my-1 items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm",
                                    );
                                }}
                            >
                                {link.icon}
                                {link.label}
                            </NavLink>
                        ))}
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t border-primary/50">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <ThemeButton />
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
                                        <UserCircle className="rounded-full bg-primary/50 border-2" />
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
function EmployeeSidebar() {
    const pathname = useLocation().pathname;

    const links = [
        {
            to: "/employee",
            label: "Dashboard",
            icon: <LayoutDashboardIcon />,
        },
        { to: "/employee/profile", label: "My Profile", icon: <Users /> },
        {
            to: "/employee/leave",
            label: "Apply Leave",
            icon: <Calendar />,
        },
        { to: "/employee/attendance", label: "My Attendance", icon: <Clock /> },
        { to: "/employee/documents", label: "Reports", icon: <FileText /> },
        {
            to: "/employee/notifications",
            label: "Notifications",
            icon: <Bell />,
        },
    ];
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="flex flex-row items-center justify-center gap-3 py-4 border-b border-primary/50">
                <SidebarMenu>
                    <SidebarMenuButton>
                        <div className="flex items-center justify-center rounded-lg bg-primary p-1">
                            <GraduationCap />
                        </div>
                        <hgroup className="flex flex-col">
                            <h1 className="text-sm font-bold text-gray-100">SLU HRMS</h1>
                            <p className="text-xs text-gray-500">Staff Portal</p>
                        </hgroup>
                    </SidebarMenuButton>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>MY MENU</SidebarGroupLabel>
                    <SidebarGroupContent className="list-none">
                        {links.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={() => {
                                    return cn(
                                        link.to === pathname
                                            ? "dark:bg-accent-foreground dark:text-primary bg-black/35"
                                            : "",
                                        "peer/menu-button flex w-full my-1 items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm",
                                    );
                                }}
                            >
                                {link.icon}
                                {link.label}
                            </NavLink>
                        ))}
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t border-primary/50">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <ThemeButton />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    {/**/}
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <div className="flex items-center gap-2 py-4 -m-1">
                                        <UserCircle className="rounded-full bg-primary/50 border-2" />
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
