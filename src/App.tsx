import { RootErrorBoundary, NotFoundPage } from "@/components/ErrorBoundary";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./states/providers/ThemeProvider";
import { DashBoardPage } from "@/pages/dashboard/DashboardPage";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/utils";
import { Toaster } from "sonner";

function App() {
  const routers = createBrowserRouter([
    {
      path: "/",
      element: <DashBoardPage />,
      errorElement: <RootErrorBoundary />,
      children: [
        {
          index: true,
          path: "/admin",
          errorElement: <RootErrorBoundary />,
          lazy: () => import("@/pages/dashboard/admin/dashboard/AdminDashboard")
        },
        {
          path: "/admin/employees",
          lazy: () => import(
            "@/pages/dashboard/admin/employees/AdminEmployeesPageIndex"
          )
        },
        {
          path: "/admin/leave",
          lazy: () => import(
            "@/pages/dashboard/admin/leave/AdminLeavePageIndex"
          ),
        },
        {
          path: "/admin/attendance",
          lazy: () => import(
            "@/pages/dashboard/admin/attendance/AdminAttendancePage"
          )
        },
        {
          path: "/admin/reports",
          lazy: () => import(
            "@/pages/dashboard/admin/reports/AdminReportAnalyticPage"
          )
        },
        {
          path: "/admin/notifications",
          lazy: () => import(
            "@/pages/dashboard/admin/notifications/AdminNotificationsPage"
          )
        },
        {
          path: "/admin/settings",
          lazy: () => import(
            "@/pages/dashboard/admin/settings/AdminSettingsPage"
          )
        },
        // Employee Routes
        {
          path: "/employee",
          lazy: () => import(
            "@/pages/dashboard/employee/EmployeeDashboardPage"
          )
        },
        { path: '/employee/profile', lazy: () => import('@/pages/dashboard/employee/EmployeeProfilePage') },
        {
          path: "/employee/leave",
          lazy: () =>
            import(
              "@/pages/dashboard/employee/EmployeeLeavePage.tsx/EmployeeLeavePage"
            ),
        },
        {
          path: "/employee/attendance",
          lazy: () =>
            import(
              "@/pages/dashboard/employee/EmployeeAttendancePage"
            ),
        },
        {
          path: "/employee/documents",
          lazy: () =>
            import(
              "@/pages/dashboard/employee/EmployeeDocumentPage"
            ),
        },
        {
          path: "/employee/notifications",
          lazy: () =>
            import(
              "@/pages/dashboard/employee/EmployeeNotificationPage"
            ),
        },
        // 404 Catch-all Route (must be last)
        {
          path: "*",
          element: <NotFoundPage />,
        },
      ]
    }]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={routers} />
        <Toaster position="top-right" richColors closeButton />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
