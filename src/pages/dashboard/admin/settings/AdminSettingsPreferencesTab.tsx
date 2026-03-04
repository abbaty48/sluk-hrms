import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import {
  useSystemPreferences,
  useUpdatePreferences,
} from "@/hooks/api/useAdminSettingsAPI";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect, useEffectEvent } from "react";
import { PreferencesTabSkeleton } from "./AdminSettingsPageSkeleton";
import type { DateFormat, FiscalYearMonth } from "@/types/settingsTypes";

const APPROVAL_LEVELS = [1, 2, 3, 4, 5];
const FISCAL_MONTHS: FiscalYearMonth[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DATE_FORMATS: DateFormat[] = ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"];

export function AdminSettingsPreferencesTab() {
  const { data: preferences, isLoading, error } = useSystemPreferences();
  const updatePreferences = useUpdatePreferences();

  const [formData, setFormData] = useState({
    institutionName: "",
    leaveApprovalLevels: 2,
    smsNotifications: false,
    emailNotifications: true,
    institutionAbbreviation: "",
    dateFormat: "DD/MM/YYYY" as DateFormat,
    fiscalYearStart: "January" as FiscalYearMonth,
  });

  const storeFormData = useEffectEvent(() => {
    if (preferences) {
      setFormData({
        dateFormat: preferences.dateFormat,
        institutionName: preferences.institutionName,
        fiscalYearStart: preferences.fiscalYearStart,
        emailNotifications: preferences.emailNotifications,
        leaveApprovalLevels: preferences.leaveApprovalLevels,
        smsNotifications: preferences.smsNotifications || false,
        institutionAbbreviation: preferences.institutionAbbreviation,
      });
    }
  });

  useEffect(() => {
    storeFormData();
  }, [preferences]);

  const handleSave = async () => {
    try {
      await updatePreferences.mutateAsync(formData);
      toast.success("Preferences updated successfully");
    } catch {
      toast.error("Failed to update preferences");
    }
  };

  if (isLoading) return <PreferencesTabSkeleton />;
  if (error) return <div>Error loading preferences</div>;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Preferences</h2>
          <p className="text-sm text-muted-foreground">
            General system settings and preferences
          </p>
        </div>
        <Button onClick={handleSave} disabled={updatePreferences.isPending}>
          <Save className="h-4 w-4 mr-1" />
          {updatePreferences.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="space-y-6">
        {/* Institution Details */}
        <Card className="stats-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Institution Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inst-name">Institution Name</Label>
              <Input
                id="inst-name"
                value={formData.institutionName}
                onChange={(e) =>
                  setFormData({ ...formData, institutionName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inst-abbr">Abbreviation</Label>
              <Input
                id="inst-abbr"
                value={formData.institutionAbbreviation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    institutionAbbreviation: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </Card>

        {/* System Configuration */}
        <Card className="stats-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            System Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Date Format</Label>
              <Select
                value={formData.dateFormat}
                onValueChange={(value: DateFormat) =>
                  setFormData({ ...formData, dateFormat: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DATE_FORMATS.map((format) => (
                    <SelectItem key={format} value={format}>
                      {format}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Fiscal Year Start</Label>
              <Select
                value={formData.fiscalYearStart}
                onValueChange={(value: FiscalYearMonth) =>
                  setFormData({ ...formData, fiscalYearStart: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FISCAL_MONTHS.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Leave Approval Levels</Label>
              <Select
                value={formData.leaveApprovalLevels.toString()}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    leaveApprovalLevels: parseInt(value),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {APPROVAL_LEVELS.map((level) => (
                    <SelectItem key={level} value={level.toString()}>
                      {level} Level{level > 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="stats-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Email Notifications
                </p>
                <p className="text-xs text-muted-foreground">
                  Send email alerts for leave approvals and payroll
                </p>
              </div>
              <Switch
                checked={formData.emailNotifications}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, emailNotifications: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  SMS Notifications
                </p>
                <p className="text-xs text-muted-foreground">
                  Send SMS alerts for urgent notifications
                </p>
              </div>
              <Switch
                checked={formData.smsNotifications}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, smsNotifications: checked })
                }
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
