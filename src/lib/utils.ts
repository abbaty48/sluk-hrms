import type {
  TNotification,
  TNotificationConfig,
} from "@/types/notificationsTypes";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import { QueryClient } from "@tanstack/react-query";
import type { TStaffDetails } from "../types/staffTypes";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function sleep(duration = 1000) {
  await new Promise((resolve) => setTimeout(resolve, duration));
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // 30 seconds
      retry: (failureCount, error) => {
        // Don't retry for 4xx errors
        if (
          error &&
          typeof error === "object" &&
          "status" in error &&
          typeof error.status === "number" &&
          error.status >= 400 &&
          error.status < 500
        ) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

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
  status: TStaffDetails["status"]
): "success" | "warning" | "destructive" | "secondary" {
  const variants: Record<TStaffDetails["status"], "success" | "warning" | "destructive" | "secondary"> = {
    "Retired": "secondary",
    "On Leave": "warning",
    "Employed": "success",
    "Resigned": "destructive",
    "Terminated": "destructive",
  };
  return variants[status];
}

// Helper function to format status label
export function getStaffStatusLabel(status: TStaffDetails["status"]): string {
  const labels: Record<TStaffDetails["status"], string> = {
    Employed: "Active",
    Retired: "InActive",
    Resigned: "Inactive",
    "On Leave": "On Leave",
    Terminated: "Terminated",
  };
  return labels[status];
}
