import { Briefcase } from "lucide-react"
import { useEmploymentHistoryAPI } from "@/hooks/api/staff"
import { EmploymentHistorySkeleton } from "@/pages/dashboard/employee/skeletons/EmploymentHistorySkeleton"

export default function EmploymentHistory() {
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useEmploymentHistoryAPI("staff_2")

  // flatten pages safely
  const history = data?.pages.flatMap(page => page.data) ?? []

  // check if user has loaded all pages
  const reachedEnd = !hasNextPage && history.length > 0

  if (isLoading) {
    return (<EmploymentHistorySkeleton />)
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-6">

      {/* HEADER */}
      <h2 className="text-lg font-semibold">Employment History</h2>

      {/* TIMELINE */}
      <div className="relative border-l pl-6 space-y-8">
        {history.map(job => (
          <div key={job.id} className="relative">

            {/* ICON */}
            <div
              className={`absolute -left-9.75 top-1 p-2 rounded-lg ${job.isCurrent
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground"
                }`}
            >
              <Briefcase className="w-5 h-5 " />
            </div>

            {/* CONTENT */}
            <div className="flex justify-between gap-4">

              <div>
                <p className="font-medium">{job.position}</p>
                <p className="text-sm text-primary">{job.department}</p>

                <p className="text-xs text-muted-foreground">
                  {job.startDate} — {job.endDate || "Present"}
                </p>
              </div>

              {job.isCurrent && (
                <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full h-fit">
                  Current
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* BUTTON */}
      {history.length > 0 && (
        <button
          onClick={() => {
            if (reachedEnd) {
              // simplest reset - do nothing, just disable button
            } else {
              fetchNextPage();
            }
          }}
          className="w-full py-2 border rounded-lg text-sm hover:bg-muted transition"
        >
          {isFetchingNextPage
            ? "Loading..."
            : reachedEnd
              ? "View Less"
              : "Load More"}
        </button>
      )}
    </div>
  );
}
