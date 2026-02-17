import { AdminEmployeesPage } from "./AdminEmployeesPage";

export const Component = function AdminEmployeesPageIndex() {
  return (
    <AdminEmployeesPage>
      <AdminEmployeesPage.Header>
        <AdminEmployeesPage.Features align="right" />
      </AdminEmployeesPage.Header>
      <AdminEmployeesPage.Filters />
      <AdminEmployeesPage.Table />
    </AdminEmployeesPage>
  );
};
