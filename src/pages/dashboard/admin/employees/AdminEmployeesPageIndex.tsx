import { AdminEmployeesPage } from "./AdminEmployeesPage";

const Component = function AdminEmployeesPageIndex() {
  return (
    <AdminEmployeesPage>
      <AdminEmployeesPage.Header />
      <AdminEmployeesPage.Filters />
      <AdminEmployeesPage.Table />
    </AdminEmployeesPage>
  );
};

export default Component;
