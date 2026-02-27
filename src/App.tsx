import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./states/providers/ThemeProvider";
import { DashBoardPage } from "@/pages/dashboard/DashboardPage";
import { DashBoardMain } from "@/pages/dashboard/Dashboard";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/utils";
import { lazy } from "react";
const EmployeeProfilePage = lazy(() => import('@/pages/dashboard/employee/EmployeeProfile'))



import { Toaster } from "sonner";

function App() {
  const routers = createBrowserRouter([
    {
      path: "/",
      element: <DashBoardPage />,
      children: [
        {
          path: "/",
          element: <DashBoardMain />,
          children: [
            {
              index: true,
              path: "/admin",
              lazy: () =>
                import("@/pages/dashboard/admin/dashboard/AdminDashboard"),
            },
            {
              path: "/admin/employees",
              lazy: () =>
                import(
                  "@/pages/dashboard/admin/employees/AdminEmployeesPageIndex"
                ),
            },
            {
              path: "/admin/leave",
              lazy: () =>
                import(
                  "@/pages/dashboard/admin/leave/AdminLeavePageIndex"
                ),
            },
            {
              path: "/admin/attendance",
              lazy: () =>
                import(
                  "@/pages/dashboard/admin/attendance/AdminAttendancePage"
                ),
            },
            { path: '/employee/profile', element: <EmployeeProfilePage /> },
            { path: "/employee/leave",
              lazy: () =>
                import(
                  "@/pages/dashboard/employee/EmployeeApplyLeave"
                ),},
            {path: "/employee/attendance",
              lazy: () =>
                import(
                  "@/pages/dashboard/employee/EmployeeAttendance"
                ),},
            {path: "/employee-dashboard",
              lazy: () =>
                import(
                  "@/pages/dashboard/employee/EmployeeDashboard"
                ),},
          ],
        },
      ],
    },
        // { path: '/auth', lazy: () => import('@/pages/auth/AuthPage') },
          {path :'*', element : <h1>404 Not Found</h1>}
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={routers} />
         
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
