import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { IUser, ILoginCredentials, IAuthContextType } from "@/types/authTypes";
import { useLogin, useLogout } from "@/hooks/api/useAuth";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const userString = localStorage.getItem("user");

    if (token && userString) {
      try {
        const userData = JSON.parse(userString);
        setUser(userData);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (credentials: ILoginCredentials) => {
    const response = await loginMutation.mutateAsync(credentials);
    setUser(response.user);

    // Navigate based on role
    if (credentials.role === "admin") {
      navigate("/admin");
    } else if (credentials.role === "department_admin") {
      navigate("/department");
    } else {
      navigate("/employee");
    }
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
    setUser(null);
    navigate("/auth/login");
  };

  const updateUser = (updatedUser: IUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const value: IAuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
}
