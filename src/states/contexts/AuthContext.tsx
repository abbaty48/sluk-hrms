import {
  useState,
  useEffect,
  useContext,
  createContext,
  type ReactNode,
  useEffectEvent,
} from "react";
import {
  AuthUserRole,
  type TAuthUser,
  type IAuthCredentials,
  type IAuthContextType,
} from "@/types/authTypes";
import { useNavigate } from "react-router-dom";
import { useLogin, useLogout } from "@/hooks/api/useAuthAPI";

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const [user, setUser] = useState<TAuthUser | null>(null);
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
      } catch {
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

  const login = async (credentials: IAuthCredentials) => {
    const { user } = await loginMutation.mutateAsync(credentials);
    setUser(user);

    // Navigate based on role
    if (
      user.role === AuthUserRole.DEPT_ADMIN ||
      user.role === AuthUserRole.HR_ADMIN
    ) {
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

  const updateUser = (updatedUser: TAuthUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const value: IAuthContextType = {
    user,
    login,
    logout,
    isLoading,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role.includes("admin") || false,
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
