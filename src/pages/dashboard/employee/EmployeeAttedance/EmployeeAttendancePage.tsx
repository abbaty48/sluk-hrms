import {
  Clock,
  XCircle,
  TimerIcon,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { Suspense, useState } from "react";
import { Motion } from "@/components/Motion";
import { formatTime } from "@sluk/src/lib/utils";
import { Progress } from "@sluk/src/components/ui/progress";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { EmployeeAttendanceList } from "./EmployeeAttendanceList";
import { useAttendanceSummary } from "@sluk/src/hooks/api/useEmployeeAPI";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TStatCardProps = {
  title: string;
  value: number;
  subTitle?: string;
  icon: LucideIcon;
};

function StatCard({ title, subTitle, value = 0, icon: Icon }: TStatCardProps) {
  return (
    <Card className="hover:shadow-md transition-all duration-200 py-4 px-2">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-xs text-muted-foreground">{title}</CardTitle>
        <Icon className={"w-4 h-4"} />
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-2xl font-bold">{value}</p>
        {subTitle && (
          <p className="text-muted-foreground text-xs">{subTitle}</p>
        )}
      </CardContent>
    </Card>
  );
}

function AttendanceRateStatCard({
  title,
  value = 0,
}: {
  title: string;
  value: number;
}) {
  return (
    <Card className="hover:shadow-md transition-all duration-200 py-4 px-2">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-xs text-muted-foreground">{title}</CardTitle>
        <TimerIcon className={"w-4 h-4"} />
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-2xl font-bold">{value}%</p>
        <Progress value={value} />
      </CardContent>
    </Card>
  );
}

export default function EmployeeAttendancePage() {
  return (
    <QueryErrorResetBoundary>
      <Suspense fallback={<EmployeeAttendanceSkeleton />}>
        <EmployeeAttendance />
      </Suspense>
    </QueryErrorResetBoundary>
  );
}

function EmployeeAttendance() {
  const [page, setPage] = useState(1);
  const [pagePerRow, setPagePerRow] = useState("5");
  const { data, isFetching, pagination, fetchNextPage, fetchPreviousPage } =
    useAttendanceSummary(page, pagePerRow);

  if (!data) {
    return <>No Data</>;
  }

  const { summary, attendances, todayAttendance } = data;
  return (
    <Motion className="space-y-6 p-6">
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold">Attendance Overview</h2>
        <p className="text-sm text-muted-foreground">
          Track your personal attendance and punctuality
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-4">
        <AttendanceRateStatCard
          value={+(summary?.avgWorkHours ?? 0)}
          title="ATTENDANCE RATES"
        />

        <StatCard
          value={summary?.present ?? 0}
          title="DAYS PRESENT"
          subTitle="out of 200 work days."
          icon={CheckCircle2}
        />

        <StatCard
          value={summary?.absent ?? 0}
          title="DAYS ABSENT"
          subTitle="including sick days."
          icon={XCircle}
        />

        <StatCard
          value={summary?.late ?? 0}
          subTitle="this academic session"
          title="LATE ARRIVALS"
          icon={Clock}
        />
      </div>

      {/* TODAY'S ATTENDANCE */}
      <Card>
        <div className="flex gap-2 p-1 px-4 text-sm items-center">
          <div className="rounded-lg bg-emerald-200 p-2 w-fit">
            <Clock stroke="green" size={18} />
          </div>
          {todayAttendance ? (
            <p className="">
              Today's Status: {todayAttendance.status}
              <br />
              <span className="text-muted-foreground">
                Checked in at {formatTime(new Date(todayAttendance.checkIn!))}
              </span>
            </p>
          ) : (
            <p>Today's Status: Absent</p>
          )}
        </div>
      </Card>

      {/* RECENT LOGS CARD */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance Logs</CardTitle>
        </CardHeader>

        <CardContent className="text-sm text-muted-foreground">
          <EmployeeAttendanceList
            page={1}
            isFetching={isFetching}
            pagination={pagination}
            attendances={attendances}
            setPagePerRow={setPagePerRow}
            fetchNextPage={fetchNextPage}
            fetchPreviousPage={fetchPreviousPage}
          />
        </CardContent>
      </Card>
    </Motion>
  );
}

function EmployeeAttendanceSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold">Attendance Overview</h2>
        <p className="text-sm text-muted-foreground">
          Track your personal attendance and punctuality
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="py-5 px-4 bg-card border rounded-xl flex flex-col justify-between gap-4"
          >
            <div className="flex flex-row justify-between items-center">
              <div className="shimmer w-10/12 h-5"></div>
              <div className={"w-4 h-4 shimmer"}></div>
            </div>

            <div className="space-y-2">
              <div className="w-2/12 h-8 shimmer"></div>
              <div className="w-10/12 h-2.5 shimmer"></div>
            </div>
          </div>
        ))}
      </div>

      {/* TODAY'S ATTENDANCE */}
      <div className="bg-card border rounded-xl py-5 px-1">
        <div className="flex gap-2 p-1 px-4 text-sm items-center">
          <div className="rounded-lg bg-emerald-200 p-2 w-fit">
            <Clock stroke="green" size={18} />
          </div>

          <div className="">
            <div className="flex gap-2 items-center">
              Today's Status:
              <span className="w-12 h-4 shimmer inline-block my-1"></span>
            </div>
            <div className="w-10/12 h-3 shimmer my-1"></div>
          </div>
        </div>
      </div>

      {/* RECENT LOGS CARD */}

      <Card className="">
        <CardHeader>
          <CardTitle>Recent Attendance Logs</CardTitle>
        </CardHeader>

        <CardContent className="text-sm text-muted-foreground">
          <div className="flex flex-wrap items-center justify-between text-xs p-3 px-10 font-semibold border-b">
            <span>DATE</span>
            <span>CHECK IN</span>
            <span>CHECK OUT</span>
            <span>HOURS</span>
            <span>STATUS</span>
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex flex-wrap items-center justify-between p-3 px-5 gap-4 h-10"
            >
              {[1, 2, 3, 4, 5].map((x) => (
                <div key={x} className="w-[10%] h-4 shimmer"></div>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
