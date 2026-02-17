import { useContext } from "react";
import { AdminEmployeePageContext } from "./AdminEmployeePageContext";

export function useAdminEmployeesPageHook() {
  return useContext(AdminEmployeePageContext);
}
