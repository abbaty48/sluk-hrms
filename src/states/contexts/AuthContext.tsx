import {
  useState,
  useEffect,
  useContext,
  createContext,
  type ReactNode,
  useEffectEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import type { TUser } from "@/types/userTypes";
import { useLogin, useLogout } from "@/hooks/api/useAuthAPI";
import type { ILoginCredentials, IAuthContextType } from "@/types/authTypes";

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const [user, setUser] = useState<TUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const userEffect = useEffectEvent(() => {
    const token = localStorage.getItem("auth_token");
    const userString = localStorage.getItem("user");

    if (token && userString) {
      try {
        (() => {
          const userData = JSON.parse(userString);
          setUser(userData);
        })();
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
      }
    }

    setIsLoading(false);
  });

  // Load user from localStorage on mount
  useEffect(() => {
    userEffect();
  }, []);

  const login = async (credentials: ILoginCredentials) => {
    const response = await loginMutation.mutateAsync(credentials);
    setUser(response.user);

    // Navigate based on role
    if (credentials.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/employee");
    }
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
    setUser(null);
    navigate("/auth/login");
  };

  const updateUser = (updatedUser: TUser) => {
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
