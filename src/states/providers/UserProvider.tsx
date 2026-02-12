import { useState } from "react";
import { initialUserContext, UserContext } from "@/states/contexts/UserContext";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userContext, setUserContext] = useState(initialUserContext);

  const handleRoleChange = (role: string) => {
    setUserContext({ ...userContext, roleView: role });
  };

  return (
    <UserContext value={{ ...userContext, handleRoleChange }}>
      {children}
    </UserContext>
  );
}
