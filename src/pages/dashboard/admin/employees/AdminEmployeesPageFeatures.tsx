import { cn } from "@/lib/utils";
import { ExportEmployees } from "./AdminEmployeesExport";
import { ImportEmployees } from "./AdminEmployeesImport";
import type { TStaffWithDepartmentName } from "@/types/staff-types";

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
    </menu>
  );
}
