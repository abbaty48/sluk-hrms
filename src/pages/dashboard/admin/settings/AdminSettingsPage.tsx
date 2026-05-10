import {
  Medal,
  Shield,
  Building2,
  UsersRound,
  SlidersVertical,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Motion } from "@/components/Motion";
import type { SettingsTab } from "@/types/settingsTypes";
import { AdminSettingsRanksTab } from "./AdminSettingsRanksTab";
import { AdminSettingsCommitteesTab } from "./AdminSettingsCommiteeTab";
import { AdminSettingsDepartmentTab } from "./AdminSettingsDepartmentsTab";
import { AdminSettingsAppointmentsTab } from "./AdminSettingsAppointmentTab";
import { AdminSettingsPreferencesTab } from "./AdminSettingsPreferencesTab";
import { AdminSettingsResponsibilitiesTab } from "./AdminSettingsResponsibilityTab";

interface TabConfig {
  id: SettingsTab;
  label: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType;
}

const TABS: TabConfig[] = [
  {
    id: "preferences",
    label: "Preferences",
    icon: SlidersVertical,
    component: AdminSettingsPreferencesTab,
  },
  {
    id: "departments",
    icon: Building2,
    label: "Units/Departments",
    component: AdminSettingsDepartmentTab,
  },
  {
    id: "committees",
    icon: UsersRound,
    label: "Committees",
    component: AdminSettingsCommitteesTab,
  },
  {
    id: "responsibilities",
    icon: Shield,
    label: "Responsibilities",
    component: AdminSettingsResponsibilitiesTab,
  },
  {
    id: "ranks",
    icon: Medal,
    label: "Ranks",
    component: AdminSettingsRanksTab,
  },
  {
    id: "appointments",
    icon: FileText,
    label: "Nature of Appointments",
    component: AdminSettingsAppointmentsTab,
  },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("preferences");

  const ActiveTabComponent =
    TABS.find((tab) => tab.id === activeTab)?.component ||
    AdminSettingsPreferencesTab;

  return (
    <Motion className="animate-in p-4 space-y-5">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">
          Manage system configuration and preferences
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <Card className="stats-card lg:w-64 shrink-0 p-2">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all whitespace-nowrap",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </Card>

        {/* Tab Content */}
        <div className="flex-1 min-w-0">
          <ActiveTabComponent />
        </div>
      </div>
    </Motion>
  );
}
