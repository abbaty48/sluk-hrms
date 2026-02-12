import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Bell, Search, Shield, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

function RoleSwitcher() {
  const [role, setRole] = useState("as_admin");
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
      className="hidden sm:flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-1 py-1 transition-all hover:bg-gray-100"
    >
      {roles.map(({ label, value, icon }) => (
        <ToggleGroupItem
          key={value}
          value={value}
          name="role_switch"
          data-role={value}
          aria-label={`Switch to ${label} section.`}
          style={{
            border: "none",
            borderRadius: "100px",
            background: role === value ? "#2b7fff" : "transparent",
            color: role === value ? "white" : "inherit",
          }}
          onClick={() => setRole(value)}
          className={` flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all  text-primary shadow-sm`}
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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-gray-200 px-4 lg:px-6">
      <form className="flex-1 relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 opacity-30" />
        <input
          type="text"
          className="flex h-10 w-full rounded-md border-0 px-3 py-2 text-sm pl-9 bg-gray-50 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Search staff, departments..."
        />
      </form>

      <div className="flex items-center gap-3">
        {/*Role Switcher*/}
        <RoleSwitcher />
        {/*notifications*/}
        <Link
          to="/notifications"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors hover:bg-gray-100 hover:text-gray-900 h-10 w-10 relative"
        >
          <Bell />
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600"></span>
          </span>
        </Link>
      </div>
    </header>
  );
}
