import type { PropsWithChildren } from "react";
import { AdminEmployeesPageTable } from "./AdminEmployeesPageTable";
import { AdminEmployeesPageHeader } from "./AdminEmployeesPageHeader";
import { AdminEmployeesPageFilters } from "./AdminEmployeesPageFilters";
import { AdminEmployeePageProvider } from "./AdminEmployeePageProvider";
import { AdminEmployeesPageFeatures } from "./AdminEmployeesPageFeatures";

export function AdminEmployeesPage({ children }: PropsWithChildren) {
  return (
    <AdminEmployeePageProvider>
      <section className="px-8 py-10 space-y-6">{children}</section>;
    </AdminEmployeePageProvider>
  );
}

AdminEmployeesPage.Table = AdminEmployeesPageTable;
AdminEmployeesPage.Header = AdminEmployeesPageHeader;
AdminEmployeesPage.Filters = AdminEmployeesPageFilters;
AdminEmployeesPage.Features = AdminEmployeesPageFeatures;
