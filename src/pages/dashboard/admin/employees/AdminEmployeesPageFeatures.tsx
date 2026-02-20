import { cn } from "@sluk/src/lib/utils";
import { LucidePlus } from "lucide-react";
import { Button } from "@sluk/src/components/ui/button";
import { ExportEmployees } from "./AdminEmployeesExport";
import { ImportEmployees } from "./AdminEmployeesImport";
import type { TStaffWithDepartmentName } from "@sluk/src/types/types";
import { AdminEmployeePageAddStaff } from "./AddStaff/AdminEmployeePageAddStaff";

type Align = "right" | "left" | "center";

function placement(align: Align) {
  switch (align) {
    case "right":
      return "place-self-end";
    case "left":
      return "place-self-start";
    case "center":
      return "place-self-center";
  }
}

interface AdminEmployeesPageFeaturesProps<T> {
  align: "right" | "left" | "center";
  currentPageData: T[];
  allPages?: { data: T[] }[];
  onImportComplete?: () => void;
}

export function AdminEmployeesPageFeatures({
  align,
  allPages,
  currentPageData,
  onImportComplete,
}: AdminEmployeesPageFeaturesProps<TStaffWithDepartmentName>) {
  return (
    <menu className={cn("flex items-center gap-2 list-none", placement(align))}>
      <ImportEmployees onImportComplete={onImportComplete} />

      <ExportEmployees currentPageData={currentPageData} allPages={allPages} />

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
    </menu>
  );
}
