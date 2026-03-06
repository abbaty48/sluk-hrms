import type {
  IUser,
  ILoginRequest,
  IAuthResponse,
  IVerifyTokenRequest,
  IVerifyTokenResponse,
  IResetPasswordRequest,
  IResetPasswordResponse,
  IChangePasswordRequest,
  IForgotPasswordRequest,
  IForgotPasswordResponse,
  IChangePasswordResponse,
} from "@/types/authTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ========================================
// 1. LOGIN HOOK
// ========================================

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: ILoginRequest) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      return response.json() as Promise<IAuthResponse>;
    },
    onSuccess: (data) => {
      // Store token in localStorage
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Update query cache
      queryClient.setQueryData(["auth", "user"], data.user);
    },
  });
}

// ========================================
// 2. LOGOUT HOOK
// ========================================

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      return response.json();
    },
    onSuccess: () => {
      // Clear localStorage
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");

      // Clear query cache
      queryClient.clear();

      // Redirect to login
      window.location.href = "/auth/login";
    },
  });
}

// ========================================
// 3. VERIFY TOKEN HOOK
// ========================================

export function useVerifyToken(token?: string) {
  return useQuery({
    queryKey: ["auth", "verify", token],
    queryFn: async () => {
      const tokenToVerify = token || localStorage.getItem("auth_token");

      if (!tokenToVerify) {
        return { valid: false };
      }

      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenToVerify } as IVerifyTokenRequest),
      });

      if (!response.ok) {
        return { valid: false };
      }

      return response.json() as Promise<IVerifyTokenResponse>;
    },
    enabled: !!token || !!localStorage.getItem("auth_token"),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ========================================
// 4. GET CURRENT USER HOOK
// ========================================

export function useCurrentUser() {
  return useQuery({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      return response.json() as Promise<IUser>;
    },
    enabled: !!localStorage.getItem("auth_token"),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ========================================
// 5. FORGOT PASSWORD HOOK
// ========================================

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (data: IForgotPasswordRequest) => {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send reset email");
      }

      return response.json() as Promise<IForgotPasswordResponse>;
    },
  });
}

// ========================================
// 6. RESET PASSWORD HOOK
// ========================================

export function useResetPassword() {
  return useMutation({
    mutationFn: async (data: IResetPasswordRequest) => {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to reset password");
      }

      return response.json() as Promise<IResetPasswordResponse>;
    },
  });
}

// ========================================
// 7. CHANGE PASSWORD HOOK
// ========================================

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: IChangePasswordRequest) => {
      const token = localStorage.getItem("auth_token");

      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to change password");
      }

      return response.json() as Promise<IChangePasswordResponse>;
    },
  });
}

// ========================================
// 8. CHECK AUTHENTICATION STATUS HOOK
// ========================================

export function useAuth() {
  const token = localStorage.getItem("auth_token");
  const userString = localStorage.getItem("user");

  const user = userString ? (JSON.parse(userString) as IUser) : null;
  const isAuthenticated = !!token && !!user;

  return {
    user,
    token,
    isAuthenticated,
  };
}
