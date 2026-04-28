import type {
  TNotification,
  TNotificationConfig,
} from "@/types/notificationsTypes";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import type { TStaff, TStaffDetails } from "@/types/staffTypes";

// Minimum 8 chars, 1 uppercase, 1 digit, 1 special character
export const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|\\:;"'<>,.?/~`]).{8,}$/;

// password check
export function isValidPassword(password: string): boolean {
  return PASSWORD_REGEX.test(password);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function sleep(duration = 1000) {
  await new Promise((resolve) => setTimeout(resolve, duration));
}

export const formatDate = (
  date: Date | number | undefined,
  dateStyle: "full" | "long" | "medium" | "short" = "long",
  locale = "en-CA",
) => Intl.DateTimeFormat(locale, { dateStyle }).format(date);

export const formatTime = (
  date: Date | number | undefined,
  timeStyle: "full" | "long" | "medium" | "short" = "long",
  locale = "en-CA",
) => Intl.DateTimeFormat(locale, { timeStyle }).format(date);

export const dateFromString = <R extends Date | string>(date: Date): R => {
  return date.toISOString().split("T")[0] as R;
};

// utils/getInitials.ts
export function nameTitle(name: string) {
  if (!name) return "";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();

  return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
}

export function name(staff: TStaff) {
  return [staff.firstName, staff.lastName].join(" ");
}

// Notification configuration helper
export function notificationConfig(
  type: TNotification["type"],
): TNotificationConfig {
  const configs: Record<TNotification["type"], TNotificationConfig> = {
    leave_approved: {
      icon: "CalendarDays",
      color: "text-success",
      borderColor: "border-l-success",
    },
    leave_rejected: {
      icon: "CircleAlert",
      color: "text-danger",
      borderColor: "border-l-danger",
    },
    leave_pending: {
      icon: "CalendarDays",
      color: "text-accent",
      borderColor: "border-l-accent",
    },
    payroll: {
      icon: "DollarSign",
      color: "text-primary",
      borderColor: "border-l-primary",
    },
    contract: {
      icon: "CircleAlert",
      color: "text-warning",
      borderColor: "border-l-warning",
    },
    system: {
      icon: "Info",
      color: "text-info",
      borderColor: "border-l-info",
    },
    profile: {
      icon: "CircleCheckBig",
      color: "text-success",
      borderColor: "border-l-success",
    },
    attendance: {
      icon: "Clock",
      color: "text-primary",
      borderColor: "border-l-primary",
    },
    general: {
      icon: "Bell",
      color: "text-primary",
      borderColor: "border-l-border",
    },
  };

  return configs[type] || configs.general;
}

// Helper function to format phone number
export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, "");

  // Format as +234 XXX XXX XXXX for Nigerian numbers
  if (cleaned.startsWith("234")) {
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `+${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
    }
  }

  return phone;
}

// Helper function to get status badge variant
export function getStaffStatusVariant(
  status: TStaffDetails["status"],
): "success" | "warning" | "destructive" | "secondary" {
  const variants: Record<
    TStaffDetails["status"],
    "success" | "warning" | "destructive" | "secondary"
  > = {
    Retired: "destructive",
    OnLeave: "warning",
    Employed: "success",
    Suspended: "warning",
    Resigned: "destructive",
    Deceased: "destructive",
    Terminated: "destructive",
    Contract_Ended: "secondary",
  };
  return variants[status];
}

// Helper function to format status label
export function getStaffStatusLabel(status: TStaffDetails["status"]): string {
  const labels: Record<TStaffDetails["status"], string> = {
    Employed: "Active",
    Retired: "Retired",
    Resigned: "Resigned",
    OnLeave: "On Leave",
    Terminated: "Terminated",
    Deceased: "Deceased",
    Suspended: "Suspended",
    Contract_Ended: "Contract_Ended",
  };
  return labels[status];
}
