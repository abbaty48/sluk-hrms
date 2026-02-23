import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@sluk/src/components/ui/select";
import { useLeaveTypesAPI } from "@sluk/src/hooks/api/useAdminLeave";
import { SelectFilter } from "@sluk/src/components/SelectFilter";
import { AdminLeavePageContext } from "./AdminLeavePageContext";
import { Button } from "@sluk/src/components/ui/button";
import { Calendar, Filter, Search } from "lucide-react";
import { Input } from "@sluk/src/components/ui/input";
import { DatePickerDialog } from "../../../../components/DatePickerDialog";
import { Card } from "@sluk/src/components/ui/card";
import { use, useState } from "react";

export function AdminLeavePageFilters() {

    const { toDate, fromDate, status, search, setFilters } = use(AdminLeavePageContext)
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
                            onChange={(e) => setFilters({ "search": e.target.value })}
                        />
                    </div>

                    {/* Status Filter */}
                    <Select
                        value={status}
                        onValueChange={(value) => setFilters({ "status": value })}
                    >
                        <SelectTrigger className="w-40">
                            <Filter className="h-4 w-4 mr-1" />
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="null">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Type Filter */}
                    <SelectFilter
                        placeholder="All Types"
                        onValueChange={(value) => setFilters({ "type": value! })}
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
                        {fromDate ? fromDate.toLocaleDateString() : "From"}
                    </Button>

                    <Button
                        variant="outline"
                        className="w-36 justify-start text-left font-normal"
                        onClick={() => setIsToDateOpen(true)}
                    >
                        <Calendar className="h-4 w-4 mr-1" />
                        {toDate ? toDate.toLocaleDateString() : "To"}
                    </Button>
                </div>
            </Card>

            {/* Dialogs */}

            <DatePickerDialog
                date={fromDate}
                open={isFromDateOpen}
                title="Select From Date"
                onOpenChange={setIsFromDateOpen}
                onDateChange={(date) => setFilters({ "fromDate": date })}
            />
            <DatePickerDialog
                date={toDate}
                open={isToDateOpen}
                title="Select To Date"
                onOpenChange={setIsToDateOpen}
                onDateChange={(date) => setFilters({ "toDate": date })}
            />
        </>
    )
}
