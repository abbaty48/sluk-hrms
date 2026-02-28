import { createContext } from "react";

type UserContextHandlerType = {
  roleView: string;
  handleRoleChange: (role: string) => void;
};



export function initialUserContext() {
  return {
    roleView: window.location.pathname.startsWith('/admin') ? "as_admin" : "as_employee",
    handleRoleChange: (role: string) => {
      return void role;
    },
  }
};

export const UserContext =
  createContext<UserContextHandlerType>(initialUserContext());
