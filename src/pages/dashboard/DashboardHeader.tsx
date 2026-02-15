import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { UserContext } from "@sluk/src/states/contexts/UserContext";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Shield, User } from "lucide-react";
import { Link } from "react-router-dom";
import { use } from "react";

function RoleSwitcher() {
  const { roleView, handleRoleChange } = use(UserContext);
  const roles = [
    { label: "Admin", value: "as_admin", icon: <Shield /> },
    { label: "Employee", value: "as_employee", icon: <User /> },
  ];
  return (
    <ToggleGroup
      variant={"outline"}
      type="single"
      size={"sm"}
      defaultValue="as_admin"
      className="hidden sm:flex items-center gap-2 rounded-full border px-1 py-1 transition-all"
    >
      {roles.map(({ label, value, icon }) => (
        <ToggleGroupItem
          key={value}
          value={value}
          name="role_switch"
          data-role={value}
          aria-label={`Switchdark:bg-primary/20 to ${label} section.`}
          style={{
            border: "none",
            borderRadius: "100px",
          }}
          onClick={() => handleRoleChange(value)}
          className={`flex items-center gap-1.5 cursor-pointer
            ${roleView === value ? "bg-primary! dark:bg-primary/20! text-white!" : ""}
             rounded-full px-3 py-1 text-xs font-medium transition-all text-primary shadow-sm`}
        >
          {icon}
          {label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
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
        <Link
          to="/notifications"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors hover:bg-gray-100 hover:text-gray-900 h-10 w-10 relative"
        >
          <Bell className="stroke-primary" />
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
          </span>
        </Link>
      </div>
    </header>
  );
}
