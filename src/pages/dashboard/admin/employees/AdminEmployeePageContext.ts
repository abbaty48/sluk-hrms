import { createContext } from "react";
import type { AdminEmployeePageContextAction } from "./AdminEmployeePageReducer";

export type AdminEmployeePageContextStateType = {
  dispatch: React.ActionDispatch<[action: AdminEmployeePageContextAction]>;
  departmentId: string;
  searchTerm: string;
  status: string;
  cadre: string;
  sort: string;
};

export const AdminEmployeePageContextInit: AdminEmployeePageContextStateType = {
  dispatch: () => void 0,
  departmentId: "",
  searchTerm: "",
  status: "",
  cadre: "",
  sort: "",
};

export const AdminEmployeePageContext =
  createContext<AdminEmployeePageContextStateType>(
    AdminEmployeePageContextInit,
  );
