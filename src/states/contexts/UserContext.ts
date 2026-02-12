import { createContext } from "react";

type UserContextHandlerType = {
  roleView: string;
  handleRoleChange: (role: string) => void;
};

export const initialUserContext = {
  roleView: "as_admin",
  handleRoleChange: (role: string) => {
    return void role;
  },
};

export const UserContext =
  createContext<UserContextHandlerType>(initialUserContext);
