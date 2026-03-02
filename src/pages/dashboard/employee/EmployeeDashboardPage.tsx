import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import {
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEmployeeDashboard } from "@/hooks/api/useEmployeeDashboard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EmployeeDashboardSkeleton } from "./skeletons/EmployeeDashboardSkeleton";

export const Component = function EmployeeDashboardPage() {
  const { data, isLoading, isError } = useEmployeeDashboard("staff_1");

  if (isLoading) return <EmployeeDashboardSkeleton />
  if (isError) return (
    <div className="p-6">
      <Alert variant={'destructive'} >
        <AlertTitle>Server Error.</AlertTitle>
        <AlertDescription>
          Something went amiss, might be from server, we'll try again little moment.
        </AlertDescription>
      </Alert>
      <EmployeeDashboardSkeleton />
    </div>
  )
  return (
    <div className="space-y-8 p-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">My Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, {data?.name}
        </p>
      </div>



      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-4">

        {/* LEAVE BALANCE */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              LEAVE BALANCE
            </CardTitle>
            <Calendar className="w-5 h-5 text-green-600" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {data?.leaveBalance.totalRemaining}
              <span className="text-sm text-muted-foreground">
                {" "}
                / {data?.leaveBalance.totalAllowed} days
              </span>
            </div>

            <div className="w-full bg-muted rounded-full h-2 mt-3">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${data?.leavePercent}%` }}
              />
            </div>

            <p className="text-xs text-muted-foreground mt-2">
              {data?.leaveBalance.totalUsed} days used this year
            </p>
          </CardContent>
        </Card>

        {/* ATTENDANCE */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              ATTENDANCE RATE
            </CardTitle>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {data?.attendance.rate}
            </div>

            <p className="text-xs text-muted-foreground mt-2">
              Work Hours: {data?.attendance.workHours}
            </p>
          </CardContent>
        </Card>

        {/* SALARY */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              NET SALARY
            </CardTitle>
            <DollarSign className="w-5 h-5 text-orange-500" />
          </CardHeader>

          <CardContent>
            {data?.salary ? (
              <>
                <div className="text-2xl font-bold">
                  ₦{data?.salary.netSalary.toLocaleString()}
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                  {data?.salary.month} payslip
                </p>

                <Badge
                  className={
                    data?.salary.status === "PAID"
                      ? "bg-green-100 text-green-700 mt-2"
                      : "bg-yellow-100 text-yellow-700 mt-2"
                  }
                >
                  {data?.salary.status}
                </Badge>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No payroll available
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* LOWER SECTION */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* RECENT LEAVES */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Leave Requests</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {data?.recentLeaves.map((leave) => (
              <div
                key={leave.id}
                className="flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{leave.leaveType}</p>
                  <p className="text-xs text-muted-foreground">
                    {leave.startDate} – {leave.endDate}
                  </p>
                </div>

                <Badge
                  className={
                    leave.status === "APPROVED"
                      ? "bg-green-100 text-green-700"
                      : leave.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }
                >
                  {leave.status}
                </Badge>
              </div>
            ))}

            <Button variant="outline" className="w-full">
              View All Leave History
            </Button>
          </CardContent>
        </Card>

        {/* SIMPLE NOTIFICATIONS PLACEHOLDER */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Info</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-1" />
              <div>
                <p className="text-sm">
                  Department: {data?.department}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <AlertCircle className="w-4 h-4 text-orange-500 mt-1" />
              <div>
                <p className="text-sm">
                  Rank: {data?.rank}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
