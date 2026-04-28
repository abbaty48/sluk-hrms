import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import { DatePickerDialog } from "@/components/DatePickerDialog";
import {
  AdminLeavePageContext,
  AdminLeavePageContextInitialStates,
} from "./AdminLeavePageContext";
import { useLeaveTypesAPI } from "@/hooks/api/useAdminLeave";
import { SelectFilter } from "@/components/SelectFilter";
import { Calendar, Filter, FilterX, Search } from "lucide-react";
import { dateFromString, formatDate } from "@sluk/src/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { use, useState } from "react";

export function AdminLeavePageFilters() {
  const { toDate, fromDate, status, search, setFilters } = use(
    AdminLeavePageContext,
  );
  const [isFromDateOpen, setIsFromDateOpen] = useState(false);
  const [isToDateOpen, setIsToDateOpen] = useState(false);
  const leaveTypes = useLeaveTypesAPI();

  return (
    <>
      <Card className="p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              className="pl-9 w-52"
              placeholder="Search employee..."
              onChange={(e) => setFilters({ search: e.target.value })}
            />
          </div>

          {/* Status Filter */}
          <Select
            value={status}
            onValueChange={(value) => setFilters({ status: value })}
          >
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-1" />
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="null">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {/* Type Filter */}
          <SelectFilter
            placeholder="All Types"
            onValueChange={(value) => setFilters({ type: value! })}
          >
            <SelectItem value="null">All Types</SelectItem>
            {leaveTypes?.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectFilter>

          {/* Date Range */}
          <Button
            variant="outline"
            className="w-36 justify-start text-left font-normal"
            onClick={() => setIsFromDateOpen(true)}
          >
            <Calendar className="h-4 w-4 mr-1" />
            {fromDate ? formatDate(new Date(fromDate)) : "From"}
          </Button>

          <Button
            variant="outline"
            className="w-36 justify-start text-left font-normal"
            onClick={() => setIsToDateOpen(true)}
          >
            <Calendar className="h-4 w-4 mr-1" />
            {toDate ? formatDate(new Date(toDate)) : "To"}
          </Button>

          <Button
            variant={"outline"}
            className="ml-auto"
            onClick={() => setFilters(AdminLeavePageContextInitialStates)}
          >
            <FilterX />
            Clear filter
          </Button>
        </div>
      </Card>

      {/* Dialogs */}
      <DatePickerDialog
        date={fromDate!}
        open={isFromDateOpen}
        title="Select From Date"
        onOpenChange={setIsFromDateOpen}
        onDateChange={(date) => {
          setFilters({ fromDate: dateFromString<Date>(date!) });
        }}
      />
      <DatePickerDialog
        date={toDate!}
        open={isToDateOpen}
        title="Select To Date"
        onOpenChange={setIsToDateOpen}
        onDateChange={(date) =>
          setFilters({ toDate: dateFromString<Date>(date!) })
        }
      />
    </>
  );
}
