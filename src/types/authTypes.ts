export type UserRole = "admin" | "staff";

export interface ILoginCredentials {
  email: string;
  password: string;
  role: UserRole;
  rememberMe?: boolean;
}

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  staffId?: string;
  passwordHash: string;
  departmentId?: string;
  profilePhoto?: string;
  phoneNumber?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface IAuthResponse {
  success: boolean;
  message: string;
  user: IUser;
  token: string;
  expiresIn: number; // milliseconds
}

export interface ILoginRequest {
  email: string;
  password: string;
  role: UserRole;
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
  user?: IUser;
}

export interface IPasswordReset {
  userId: string,
  token: string,
  expiresAt: string, // 1 hour
  createdAt: string,
}

export interface IAuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: ILoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: IUser) => void;
}

// Role configuration
export interface IRoleConfig {
  id: UserRole;
  label: string;
  description: string;
  icon: string;
  permissions: string[];
}

export const ROLE_CONFIGS: Record<UserRole, IRoleConfig> = {
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
