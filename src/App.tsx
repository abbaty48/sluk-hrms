import {
  AdminRoute,
  PublicRoute,
  RootRedirect,
  EmployeeRoute,
} from "@/components/ProtectedRoute";
import { Toaster } from "sonner";
import { queryClient } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
import { QueryClientProvider } from "@tanstack/react-query";
import { DashBoardPage } from "@/pages/dashboard/DashboardPage";
import { ThemeProvider } from "@/states/providers/ThemeProvider";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootErrorBoundary, NotFoundPage } from "@/components/ErrorBoundary";

function App() {
  const routers = createBrowserRouter([
    // Root redirect - redirects to /admin or /employee based on user role
    {
      index: true,
      path: "/",
      element: <RootRedirect />,
    },

    // Admin Routes
    {
      path: "/admin",
      element: (
        <AdminRoute>
          <DashBoardPage />
        </AdminRoute>
      ),
      errorElement: <RootErrorBoundary />,
      children: [
        {
          index: true,
          lazy: async () => {
            const { default: Component } = await import(
              "@/pages/dashboard/admin/dashboard/AdminDashboard"
            );
            return { Component };
          },
          errorElement: <RootErrorBoundary />,
        },
        {
          path: "employees",
          lazy: async () => {
            const { default: Component } = await import(
              "@/pages/dashboard/admin/employees/AdminEmployeesPageIndex"
            );
            return { Component };
          },
          errorElement: <RootErrorBoundary />,
        },
        {
          path: "leave",
          lazy: async () => {
            const { default: Component } = await import(
              "@/pages/dashboard/admin/leave/AdminLeavePageIndex"
            );
            return { Component };
          },
          errorElement: <RootErrorBoundary />,
        },
        {
          path: "attendance",
          lazy: async () => {
            const { default: Component } = await import(
              "@/pages/dashboard/admin/attendance/AdminAttendancePage"
            );
            return { Component };
          },
          errorElement: <RootErrorBoundary />,
        },
        {
          path: "reports",
          lazy: async () => {
            const { default: Component } = await import(
              "@/pages/dashboard/admin/reports/AdminReportAnalyticPage"
            );
            return { Component };
          },
          errorElement: <RootErrorBoundary />,
        },
        {
          path: "notifications",
          lazy: async () => {
            const { default: Component } = await import(
              "@/pages/dashboard/admin/notifications/AdminNotificationsPage"
            );
            return { Component };
          },
          errorElement: <RootErrorBoundary />,
        },
        {
          path: "settings",
          lazy: async () => {
            const { default: Component } = await import(
              "@/pages/dashboard/admin/settings/AdminSettingsPage"
            );
            return { Component };
          },
          errorElement: <RootErrorBoundary />,
        },
      ],
    },

    // Employee Routes
    {
      path: "/employee",
      element: (
        <EmployeeRoute>
          <DashBoardPage />
        </EmployeeRoute>
      ),
      errorElement: <RootErrorBoundary />,
      children: [
        {
          index: true,
          lazy: async () => {
            const { default: Component } = await import(
              "@/pages/dashboard/employee/EmployeeDashboardPage"
            );
            return { Component };
          },
          errorElement: <RootErrorBoundary />,
        },
        {
          path: "profile",
          lazy: async () => {
            const { default: Component } = await import(
              "@/pages/dashboard/employee/EmployeeProfilePage"
            );
            return { Component };
          },
          errorElement: <RootErrorBoundary />,
        },
        {
          path: "leave",
          lazy: async () => {
            const { default: Component } = await import(
              "@/pages/dashboard/employee/EmployeeLeavePage/EmployeeLeavePage"
            );
            return { Component };
          },
          errorElement: <RootErrorBoundary />,
        },
        {
          path: "attendance",
          lazy: async () => {
            const { default: Component } = await import(
              "@/pages/dashboard/employee/EmployeeAttendancePage"
            );
            return { Component };
          },
          errorElement: <RootErrorBoundary />,
        },
        {
          path: "documents",
          lazy: async () => {
            const { default: Component } = await import(
              "@/pages/dashboard/employee/EmployeeDocumentPage"
            );
            return { Component };
          },
          errorElement: <RootErrorBoundary />,
        },
        {
          path: "notifications",
          lazy: async () => {
            const { default: Component } = await import(
              "@/pages/dashboard/employee/EmployeeNotificationPage"
            );
            return { Component };
          },
          errorElement: <RootErrorBoundary />,
        },
      ],
    },

    // Auth Routes (Public - redirect to dashboard if already logged in)
    {
      path: "/auth",
      element: <PublicRoute />,
      errorElement: <RootErrorBoundary />,
      children: [
        {
          path: "login",
          lazy: async () => {
            const { default: Component } = await import(
              "@/pages/auth/AuthLoginPage"
            );
            return { Component };
          },
          errorElement: <RootErrorBoundary />,
        },
        {
          path: "forgot-password",
          lazy: async () => {
            const { default: Component } = await import(
              "@/pages/auth/AuthForgotPasswordPage"
            );
            return { Component };
          },
          errorElement: <RootErrorBoundary />,
        },
        {
          path: "reset-password",
          lazy: async () => {
            const { default: Component } = await import(
              "@/pages/auth/AuthResetPasswordPage"
            );
            return { Component };
          },
          errorElement: <RootErrorBoundary />,
        },
      ],
    },

    // 404 Catch-all Route (must be last)
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AnimatePresence mode="wait">
          <RouterProvider router={routers} />
        </AnimatePresence>
        <Toaster position="top-right" richColors closeButton />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
