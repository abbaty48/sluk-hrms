import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAttendanceSummary } from "@/hooks/api/useAttendance";

function StatCard({ title, value }: { title: string; value: any }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground font-medium">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-2xl font-bold">{value ?? 0}</p>
      </CardContent>
    </Card>
  );
}

 function AttendancePage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useAttendanceSummary("staff_2");

  const summary = data?.pages?.[0]?.summary;
  console.log("Summary:", summary);

  return (
    <div className="space-y-6 p-6">

      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold">Attendance Overview</h2>
        <p className="text-sm text-muted-foreground">
          Track your attendance statistics
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">

        <StatCard title="Total Days" value={summary?.totalDays} />
        <StatCard title="Present" value={summary?.present} />
        <StatCard title="Absent" value={summary?.absent} />
        <StatCard title="Late" value={summary?.late} />
        <StatCard title="Avg Hours" value={summary?.avgWorkHours} />

      </div>

      {/* RECENT LOGS */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance Logs</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

        

          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              className="w-full border py-2 rounded-lg text-sm hover:bg-muted"
            >
              {isFetchingNextPage ? "Loading..." : "Load More"}
            </button>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
export const Component = AttendancePage;