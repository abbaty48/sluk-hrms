import {
  AdminEmployeePageContext,
  AdminEmployeePageContextInit,
} from "./AdminEmployeePageContext";
import { useReducer, type PropsWithChildren } from "react";
import { AdminEmployeePageReducer } from "./AdminEmployeePageReducer";

export function AdminEmployeePageProvider({ children }: PropsWithChildren) {
  const [states, dispatch] = useReducer(
    AdminEmployeePageReducer,
    AdminEmployeePageContextInit,
  );

  return (
    <AdminEmployeePageContext value={{ ...states, dispatch }}>
      {children}
    </AdminEmployeePageContext>
  );
}
