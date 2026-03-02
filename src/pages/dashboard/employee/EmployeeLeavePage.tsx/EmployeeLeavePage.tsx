import { EmployeeLeavePageHistory } from "./EmployeeLeavePageHistory"
import { EmployeeLeavePageBalance } from "./EmployeeLeavePageBalance"
import { EmployeeLeavePageApply } from "./EmployeeLeavePageApply"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export const Component = function EmployeeLeavePage() {
  const [isDialogOpened, setIsDialogOpened] = useState(false);

  return (
    <>
      <div className="space-y-8 p-4">
        {/* HEADER */}
        <div className="flex items-center justify-between px-2">
          <div>
            <h2 className="text-xl font-semibold">My Leave</h2>
            <p className="text-sm text-muted-foreground">
              View your leave balances and apply for time off.
            </p>
          </div>

          <Button variant="outline" onClick={() => setIsDialogOpened(true)}>
            Apply Leave
          </Button>
        </div>
        {/* BALANCES */}
        <EmployeeLeavePageBalance />
        {/* HISTORY */}
        <EmployeeLeavePageHistory />
      </div>
      {/* DIALOG */}
      <EmployeeLeavePageApply
        isDialog={isDialogOpened}
        setDialog={setIsDialogOpened} />
    </>
  )
}
