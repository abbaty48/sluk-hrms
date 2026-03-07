import type { TUser, TUserRole } from "./userTypes";

export interface ILoginCredentials {
  email: string;
  password: string;
  role: TUserRole;
  rememberMe?: boolean;
}

export interface IAuthResponse {
  success: boolean;
  message: string;
  user: TUser;
  token: string;
  expiresIn: number; // milliseconds
}

export interface ILoginRequest {
  email: string;
  password: string;
  role: TUserRole;
  rememberMe?: boolean;
}

export interface ILogoutResponse {
  success: boolean;
  message: string;
}

export interface IForgotPasswordRequest {
  email: string;
}

export interface IForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface IResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface IChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IChangePasswordResponse {
  success: boolean;
  message: string;
}

export interface IVerifyTokenRequest {
  token: string;
}

export interface IVerifyTokenResponse {
  valid: boolean;
  user?: TUser;
}

export interface IPasswordReset {
  userId: string;
  token: string;
  expiresAt: string; // 1 hour
  createdAt: string;
}

export interface IAuthContextType {
  user: TUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: ILoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: TUser) => void;
}

// Role configuration
export interface IRoleConfig {
  id: TUserRole;
  label: string;
  description: string;
  icon: string;
  permissions: string[];
}

export const ROLE_CONFIGS: Record<TUserRole, IRoleConfig> = {
  admin: {
    id: "admin",
    label: "HR Admin",
    description: "Full system access",
    icon: "Shield",
    permissions: [
      "manage_staff",
      "manage_leave",
      "manage_payroll",
      "view_reports",
      "manage_settings",
      "manage_departments",
    ],
  },
  staff: {
    id: "staff",
    label: "Staff",
    description: "Personal access",
    icon: "User",
    permissions: [
      "view_own_profile",
      "request_leave",
      "view_own_payroll",
      "view_own_attendance",
    ],
  },
};
