import { use, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SelectFilter } from "@/components/SelectFilter";
import { Building2, Calendar, Filter } from "lucide-react";
import { DatePickerDialog } from "@/components/DatePickerDialog";
import { ARAPFilterContext } from "./AdminReportAnalyticPageContext";
import { DepartmentSelectItems } from "@/components/DeparmentSelectItems";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ARAPFilters() {
  const { setFilters, ...filters } = use(ARAPFilterContext);
  const [isFromDateOpen, setIsFromDateOpen] = useState(false);
  const [isToDateOpen, setIsToDateOpen] = useState(false);

  const handleFiltering = () => {};

  return (
    <>
      <Card className="stats-card mb-6 p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="space-y-1.5 flex-1">
            <label className="text-xs font-medium text-muted-foreground">
              Department
            </label>
            <SelectFilter
              value={filters.departmentId || "all"}
              triggerClassName="w-full"
              placeholder={
                <>
                  <Building2 className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>All Departments</span>
                </>
              }
              onValueChange={(value) =>
                setFilters({
                  ...filters,
                  departmentId: value === "all" ? undefined : value,
                })
              }
            >
              <>
                <SelectItem value="all">All Departments</SelectItem>
                <DepartmentSelectItems />
              </>
            </SelectFilter>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Year
            </label>
            <Select
              value={filters.year?.toString() || "2025"}
              onValueChange={(value) =>
                setFilters({ ...filters, year: parseInt(value) })
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="2025" />
              </SelectTrigger>
              <SelectContent>
                {[2025, 2024, 2023, 2022, 2021].map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsFromDateOpen(true)}
            className="w-36 justify-start text-left font-normal"
          >
            <Calendar className="h-4 w-4 mr-1" />
            {filters.startDate ?? "From"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setIsToDateOpen(true)}
            className="w-36 justify-start text-left font-normal"
          >
            <Calendar className="h-4 w-4 mr-1" />
            {filters.endDate ?? "To"}
          </Button>

          <Button
            variant="secondary"
            className="gap-1.5"
            onClick={handleFiltering}
          >
            <Filter className="h-4 w-4" />
            Apply
          </Button>
        </div>
      </Card>

      <DatePickerDialog
        title="From"
        open={isFromDateOpen}
        onOpenChange={setIsFromDateOpen}
        date={new Date(filters.startDate!)}
        onDateChange={(value) =>
          setFilters({
            ...filters,
            startDate: value?.toLocaleDateString("en-CA"),
          })
        }
      />

      <DatePickerDialog
        title="To"
        open={isToDateOpen}
        onOpenChange={setIsToDateOpen}
        date={new Date(filters.endDate!)}
        onDateChange={(value) => {
          setFilters({
            ...filters,
            endDate: value?.toLocaleDateString("en-CA"),
          });
        }}
      />
    </>
  );
}
