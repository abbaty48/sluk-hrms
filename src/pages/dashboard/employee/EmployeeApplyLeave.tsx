import { CheckCircle, Clock, XCircle, X } from "lucide-react"
import { useLeaveBalances, useLeaveHistory, useApplyLeave } from "@/hooks/api/useLeave"
import { Button } from "@sluk/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"



function statusColor(status: string) {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
    case "PENDING":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
    case "REJECTED":
      return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
    default:
      return "bg-muted text-muted-foreground"
  }
}



function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "APPROVED":
      return <CheckCircle className="w-5 h-5 text-green-600" />
    case "PENDING":
      return <Clock className="w-5 h-5 text-yellow-500" />
    case "REJECTED":
      return <XCircle className="w-5 h-5 text-red-600" />
    default:
      return null
  }
}



function MyLeave() {
  const [open, setOpen] = useState(false)

  const [leaveTypeId, setLeaveTypeId] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [reason, setReason] = useState("")

  const { balances } = useLeaveBalances("staff_2")
  const applyLeave = useApplyLeave()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useLeaveHistory("staff_2")

  const history = data?.pages.flatMap(p => p.data) ?? []


  const resetForm = () => {
    setLeaveTypeId("")
    setStartDate("")
    setEndDate("")
    setReason("")
  }



  const handleApplyLeave = () => {
    if (!leaveTypeId || !startDate || !endDate || !reason) return

    applyLeave.mutate(
      {
        staffId: "staff_2",
        leaveTypeId,
        startDate,
        endDate,
        reason
      },
      {
        onSuccess: () => {
          resetForm()
          setOpen(false)
        }
      }
    )
  }
 


  /* ---------- UI ---------- */

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-xl font-semibold">My Leave</h2>
          <p className="text-sm text-muted-foreground">
            View your leave balances and apply for time off
          </p>
        </div>

        <Button variant="outline"  onClick={() => setOpen(true)}>
          Apply Leave
        </Button>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

          <Card className="relative w-full max-w-lg shadow-2xl animate-in zoom-in-95">

            {/* CLOSE */}
            <Button
              onClick={() => setOpen(false)}
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
            >
              <X className="w-5 h-5" />
            </Button>

            <CardHeader>
              <CardTitle>Apply for Leave</CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">

              {/* TYPE */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Leave Type
                </label>

                <select
                  value={leaveTypeId}
                  onChange={e => setLeaveTypeId(e.target.value)}
                  className="w-full border border-border bg-background rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Leave Type</option>

                  {balances.map(type => (
                    <option key={type.leaveTypeId} value={type.leaveTypeId}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* DATES */}
              <div className="grid grid-cols-2 gap-4">

                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    Start Date
                  </label>

                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full border border-border bg-background rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    End Date
                  </label>

                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full border border-border bg-background rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

              </div>

              {/* REASON */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Reason
                </label>

                <textarea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="Briefly describe reason for leave..."
                  className="w-full border border-border bg-background rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-3 pt-2">

                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition"
                >
                  Cancel
                </button>

                <Button
                  onClick={handleApplyLeave}
                  disabled={applyLeave.isPending}
                >
                  {applyLeave.isPending ? "Submitting..." : "Submit Request"}
                </Button>

              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* BALANCES */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 px-2">
        {balances.map(b => {
          const percent = (b.used / b.allowed) * 100

          return (
            <Card key={b.leaveTypeId}>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs uppercase text-muted-foreground">
                  {b.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">

                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold">{b.remaining}</span>
                  <span className="text-muted-foreground text-sm">
                    / {b.allowed} days
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  {b.used} days used
                </p>

              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* HISTORY */}
      <Card className="mx-2">
        <CardHeader>
          <CardTitle>Leave History</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          {history.map(l => (
            <div
              key={l.id}
              className="flex justify-between items-center bg-muted/40 rounded-lg p-4"
            >
              <div className="flex gap-4 items-start">

                <div className="p-3 rounded-xl bg-background border flex items-center justify-center">
                  <StatusIcon status={l.status} />
                </div>

                <div>
                  <p className="font-medium">{l.reason}</p>

                  <p className="text-sm text-primary">
                    {l.startDate} → {l.endDate} · {l.totalDays} days
                  </p>

                  {l.approverId && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Approved by manager
                    </p>
                  )}
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(
                  l.status
                )}`}
              >
                {l.status}
              </span>
            </div>
          ))}

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
  )
}

export const Component = MyLeave