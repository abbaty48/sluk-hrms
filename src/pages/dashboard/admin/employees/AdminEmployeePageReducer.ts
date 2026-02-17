import {
  AdminEmployeePageContextInit,
  type AdminEmployeePageContextStateType,
} from "./AdminEmployeePageContext";

export type AdminEmployeePageContextAction =
  | { type: "SET_DEPARTMENT_ID"; value: string }
  | { type: "SET_SEARCHTERM"; value: string }
  | { type: "SET_STATUS"; value: string }
  | { type: "SET_CANDRE"; value: string }
  | { type: "SET_SORT"; value: string }
  | { type: "RESET_FILTER" };

export function AdminEmployeePageReducer(
  states: AdminEmployeePageContextStateType,
  action: AdminEmployeePageContextAction,
) {
  switch (action.type) {
    case "SET_DEPARTMENT_ID":
      return { ...states, departmentId: action.value };
    case "SET_SEARCHTERM":
      return { ...states, searchTerm: action.value };
    case "SET_STATUS":
      return { ...states, status: action.value };
    case "SET_CANDRE":
      return { ...states, cadre: action.value };
    case "SET_SORT":
      return { ...states, sort: action.value };
    case "RESET_FILTER":
      return AdminEmployeePageContextInit;
    default:
      return states;
  }
}
