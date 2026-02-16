import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./states/providers/ThemeProvider";
import { DashBoardPage } from "@/pages/dashboard/DashboardPage";
import { DashBoardMain } from "@/pages/dashboard/Dashboard";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/utils";

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
                import("./pages/dashboard/admin/dashboard/AdminDashboard"),
            },
            {
              path: "/admin/employees",
              lazy: () =>
                import(
                  "@sluk/src/pages/dashboard/admin/employees/AdminEmployeesPage"
                ),
            },
          ],
        },
      ],
    },
    // { path: '/auth', lazy: () => import('@/pages/auth/AuthPage') },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={routers} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
