import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useUnreadCount } from "@/hooks/api/useAdminNotificationsAPI";
import { UserContext } from "@/states/contexts/UserContext";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Shield, User } from "lucide-react";
import { use } from "react";

function RoleSwitcher() {
  const navigate = useNavigate();
  const { roleView, handleRoleChange } = use(UserContext);
  const roles = [
    { label: "Admin", value: "as_admin", icon: <Shield /> },
    { label: "Employee", value: "as_employee", icon: <User /> },
  ];

  const changeRole = (value: string) => {
    handleRoleChange(value);
    navigate(value === "as_employee" ? "/employee" : "/admin");
  };
  return (
    <ToggleGroup
      variant={"outline"}
      type="single"
      size={"sm"}
      defaultValue={roleView}
      className="hidden sm:flex items-center gap-2 rounded-full border px-1 py-1 transition-all"
    >
      {roles.map(({ label, value, icon }) => (
        <ToggleGroupItem
          key={value}
          value={value}
          name="role_switch"
          data-role={value}
          onClick={() => changeRole(value)}
          style={{ border: "none", borderRadius: "100px" }}
          aria-label={`Switch dark:bg-primary/20 to ${label} section.`}
          className={`flex items-center gap-1.5 cursor-pointer
            ${roleView === value ? "bg-primary! text-white!" : ""}
             rounded-full px-3 py-1 text-xs font-medium transition-all text-primary shadow-sm`}
        >
          {icon}
          {label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

function NotificationBadge() {
  const { data: unreadCount } = useUnreadCount();

  if (!unreadCount || unreadCount === 0) return null;

  return (
    <Link
      to="/admin/notifications"
      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors hover:bg-gray-100 hover:text-gray-900 h-10 w-10 relative"
    >
      <Bell className="stroke-primary" />
      <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
        {unreadCount > 99 ? "99+" : unreadCount}
      </span>
    </Link>
  );
}

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex flex-1 items-center gap-4 border-b pl-1 pr-4 py-3 w-full bg-card">
      <SidebarTrigger className="hover:bg-primary/50 hover:dark:bg-primary" />
      <div className="flex items-center gap-3 mx-auto">
        {/*Role Switcher*/}
        <RoleSwitcher />
        {/*notifications*/}
        <NotificationBadge />
      </div>
    </header>
  );
}
