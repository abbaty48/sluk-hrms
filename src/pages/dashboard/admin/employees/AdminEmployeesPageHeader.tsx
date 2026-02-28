import { AdminEmployeePageAddStaff } from "./AddStaff/AdminEmployeePageAddStaff";
import { Button } from "@sluk/src/components/ui/button";
import { LucidePlus } from "lucide-react";

export function AdminEmployeesPageHeader() {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h1 className="page-title">Employee Records</h1>
      <AdminEmployeePageAddStaff
        triggerButton={
          <Button
            variant={"outline"}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground dark:text-inherit hover:bg-primary/90 h-9 rounded-md px-3"
          >
            <LucidePlus />
            Add Staff
          </Button>
        }
      />
    </header>
  );
}
